#!/usr/bin/env python3
"""
Script para traduzir artigos do blog de português para inglês e espanhol.

Usa DeepL API para tradução e preserva estrutura frontmatter, links internos e formato MDX.
"""

import os
import re
import sys
import yaml
import frontmatter
from pathlib import Path
from slugify import slugify
from dotenv import load_dotenv
import deepl
from typing import Dict, Any, Tuple, Optional
import time
import argparse

# Carregar variáveis de ambiente
load_dotenv()

# Configurações
SOURCE_DIR = Path("src/content/blog/pt")
TARGET_DIR_EN = Path("src/content/blog/en")
TARGET_DIR_ES = Path("src/content/blog/es")

# Mapeamento de links internos
LINK_MAPPINGS = {
    "pt": {
        "blog": "/pt/blog/",
        "tecnicas": "/pt/tecnicas/",
        "contato": "/pt/contato",
        "sobre": "/pt/sobre",
        "glossario": "/pt/glossario/",
    },
    "en": {
        "blog": "/blog/",
        "tecnicas": "/techniques/",
        "contato": "/contact",
        "sobre": "/about",
        "glossario": "/glossary/",
    },
    "es": {
        "blog": "/es/blog/",
        "tecnicas": "/es/tecnicas/",
        "contato": "/es/contacto",
        "sobre": "/es/sobre",
        "glossario": "/es/glossario/",
    },
}

# Locales DeepL
DEEPL_LOCALES = {
    "en": "EN-US",
    "es": "ES",
    "pt": "PT-BR",
}


def parse_mdx_file(file_path: Path) -> Tuple[Dict[str, Any], str]:
    """Lê arquivo MDX e separa frontmatter do conteúdo."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            post = frontmatter.load(f)
        return post.metadata, post.content
    except Exception as e:
        raise ValueError(f"Erro ao ler arquivo {file_path}: {e}")


def translate_text(
    text: str, target_lang: str, deepl_client: deepl.Translator
) -> str:
    """Traduz texto usando DeepL API."""
    if not text or not text.strip():
        return text

    try:
        # DeepL tem limite de 50k caracteres por requisição
        if len(text) > 50000:
            # Dividir em chunks e traduzir separadamente
            chunks = []
            current_chunk = ""
            sentences = text.split(". ")
            for sentence in sentences:
                if len(current_chunk) + len(sentence) < 45000:
                    current_chunk += sentence + ". "
                else:
                    chunks.append(current_chunk.strip())
                    current_chunk = sentence + ". "
            if current_chunk:
                chunks.append(current_chunk.strip())

            translated_chunks = []
            for chunk in chunks:
                result = deepl_client.translate_text(
                    chunk, target_lang=DEEPL_LOCALES[target_lang]
                )
                translated_chunks.append(result.text)
                time.sleep(0.1)  # Rate limiting

            return " ".join(translated_chunks)
        else:
            result = deepl_client.translate_text(
                text, target_lang=DEEPL_LOCALES[target_lang]
            )
            return result.text
    except deepl.exceptions.QuotaExceededException:
        raise Exception("Cota da API DeepL excedida. Verifique seu plano.")
    except deepl.exceptions.AuthorizationException:
        raise Exception("Erro de autenticação com DeepL API. Verifique sua chave API.")
    except Exception as e:
        raise Exception(f"Erro ao traduzir texto: {e}")


def adjust_image_path(image_path: Any, target_locale: str) -> Any:
    """Ajusta caminho de imagem para o locale de destino."""
    if not image_path:
        return image_path

    if isinstance(image_path, dict):
        # Se for objeto com src e alt, ajustar src e traduzir alt se existir
        adjusted = image_path.copy()
        if "src" in adjusted:
            src = adjusted["src"]
            if "/images/blog/pt/" in src:
                adjusted["src"] = src.replace("/images/blog/pt/", f"/images/blog/{target_locale}/")
            elif "/pt/" in src:
                adjusted["src"] = src.replace("/pt/", f"/{target_locale}/")
        return adjusted
    elif isinstance(image_path, str):
        # Se for string, ajustar diretamente
        if "/images/blog/pt/" in image_path:
            return image_path.replace("/images/blog/pt/", f"/images/blog/{target_locale}/")
        elif "/pt/" in image_path:
            return image_path.replace("/pt/", f"/{target_locale}/")

    return image_path


def translate_frontmatter(
    frontmatter: Dict[str, Any], target_lang: str, deepl_client: deepl.Translator
) -> Dict[str, Any]:
    """Traduz campos traduzíveis do frontmatter."""
    translated = frontmatter.copy()

    # Ajustar locale
    translated["locale"] = target_lang

    # Traduzir título
    if "title" in translated:
        translated["title"] = translate_text(
            translated["title"], target_lang, deepl_client
        )

    # Traduzir descrição
    if "description" in translated:
        translated["description"] = translate_text(
            translated["description"], target_lang, deepl_client
        )

    # Traduzir keywords
    if "keywords" in translated and isinstance(translated["keywords"], list):
        translated_keywords = []
        for keyword in translated["keywords"]:
            # Manter termos técnicos e nomes próprios se apropriado
            if keyword in ["Face Moderna", "Dr. Robério Brandão", "Endomidface"]:
                translated_keywords.append(keyword)
            else:
                translated_keywords.append(
                    translate_text(keyword, target_lang, deepl_client)
                )
        translated["keywords"] = translated_keywords

    # Traduzir FAQ
    if "faq" in translated and isinstance(translated["faq"], list):
        translated_faq = []
        for item in translated["faq"]:
            if isinstance(item, dict) and "question" in item and "answer" in item:
                translated_faq.append(
                    {
                        "question": translate_text(
                            item["question"], target_lang, deepl_client
                        ),
                        "answer": translate_text(
                            item["answer"], target_lang, deepl_client
                        ),
                    }
                )
            else:
                translated_faq.append(item)
        translated["faq"] = translated_faq

    # Ajustar caminho de imagem
    if "image" in translated:
        translated["image"] = adjust_image_path(
            translated["image"], target_lang
        )

    # Manter canonicalSlug do original (importante para conectar traduções)
    # Se não existir no original, manter None (será gerado baseado no título original)
    if "canonicalSlug" in frontmatter:
        translated["canonicalSlug"] = frontmatter["canonicalSlug"]
    # Se não existir no original, não criar aqui - manterá None

    # Campos que não devem ser traduzidos são mantidos como estão
    # date, author, readTime, featured, draft, articleType, etc.

    return translated


def adjust_internal_links(content: str, target_locale: str) -> str:
    """Ajusta links internos no conteúdo Markdown."""
    # Padrões de links Markdown: [texto](/caminho) ou [texto](url)
    def replace_link(match):
        link_text = match.group(1)
        link_url = match.group(2)

        # Se for link interno (começa com /)
        if link_url.startswith("/"):
            # Mapear links conhecidos
            if link_url.startswith("/pt/blog/"):
                if target_locale == "en":
                    return f"[{link_text}]({link_url.replace('/pt/blog/', '/blog/')})"
                elif target_locale == "es":
                    return f"[{link_text}]({link_url.replace('/pt/blog/', '/es/blog/')})"
            elif link_url.startswith("/pt/tecnicas/"):
                if target_locale == "en":
                    return f"[{link_text}]({link_url.replace('/pt/tecnicas/', '/techniques/')})"
                elif target_locale == "es":
                    return f"[{link_text}]({link_url.replace('/pt/tecnicas/', '/es/tecnicas/')})"
            elif link_url == "/pt/contato":
                if target_locale == "en":
                    return f"[{link_text}](/contact)"
                elif target_locale == "es":
                    return f"[{link_text}](/es/contacto)"
            elif link_url == "/pt/sobre":
                if target_locale == "en":
                    return f"[{link_text}](/about)"
                elif target_locale == "es":
                    return f"[{link_text}](/es/sobre)"
            elif link_url.startswith("/pt/glossario/"):
                if target_locale == "en":
                    return f"[{link_text}]({link_url.replace('/pt/glossario/', '/glossary/')})"
                elif target_locale == "es":
                    return f"[{link_text}]({link_url.replace('/pt/glossario/', '/es/glossario/')})"
            elif link_url.startswith("/pt/"):
                # Links genéricos que começam com /pt/
                if target_locale == "en":
                    return f"[{link_text}]({link_url.replace('/pt/', '/', 1)})"
                elif target_locale == "es":
                    return f"[{link_text}]({link_url.replace('/pt/', '/es/', 1)})"

        return match.group(0)  # Retornar original se não for link interno conhecido

    # Substituir links no padrão [texto](url)
    pattern = r"\[([^\]]+)\]\(([^)]+)\)"
    content = re.sub(pattern, replace_link, content)

    return content


def translate_content(
    content: str, target_lang: str, deepl_client: deepl.Translator, locale: str
) -> str:
    """Traduz conteúdo Markdown preservando formatação."""
    # Traduzir conteúdo
    translated_content = translate_text(content, target_lang, deepl_client)

    # Ajustar links internos
    translated_content = adjust_internal_links(translated_content, locale)

    # Preservar referências de imagem [Imagem: ...] e [Infográfico: ...]
    # A tradução já deve ter traduzido a descrição, então apenas garantir que o formato seja mantido

    return translated_content


def generate_slug_from_title(title: str, locale: str) -> str:
    """Gera slug URL-friendly a partir do título."""
    # Usar python-slugify com locale apropriado
    slug = slugify(title, lowercase=True)
    return slug


def save_translated_file(
    frontmatter: Dict[str, Any],
    content: str,
    output_dir: Path,
    filename: str,
    locale: str,
) -> None:
    """Salva arquivo MDX traduzido."""
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / filename

    # Gerar frontmatter YAML com formatação personalizada
    yaml_content = yaml.dump(
        frontmatter,
        allow_unicode=True,
        default_flow_style=False,
        sort_keys=False,
        width=1000,
        indent=2,
    )

    # Escrever arquivo
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("---\n")
        f.write(yaml_content.rstrip())  # Remove trailing newline
        f.write("\n---\n\n")
        f.write(content)

    print(f"  ✓ Salvo: {output_path}")


def translate_file(
    file_path: Path, deepl_client: Any, dry_run: bool = False
) -> None:
    """Traduz um arquivo para inglês e espanhol."""
    print(f"\nProcessando: {file_path.name}")

    try:
        # Parse do arquivo
        frontmatter_data, content = parse_mdx_file(file_path)

        if dry_run:
            print(f"  [DRY RUN] Arquivo seria traduzido")
            print(f"    Título PT: {frontmatter_data.get('title', 'N/A')}")
            return

        if deepl_client is None:
            raise ValueError("DeepL client não inicializado")

        # Traduzir para inglês
        print("  Traduzindo para inglês...")
        en_frontmatter = translate_frontmatter(frontmatter_data, "en", deepl_client)
        en_content = translate_content(content, "en", deepl_client, "en")
        en_filename = f"{generate_slug_from_title(en_frontmatter['title'], 'en')}.mdx"
        save_translated_file(en_frontmatter, en_content, TARGET_DIR_EN, en_filename, "en")

        # Pequeno delay para evitar rate limiting
        time.sleep(0.5)

        # Traduzir para espanhol
        print("  Traduzindo para espanhol...")
        es_frontmatter = translate_frontmatter(frontmatter_data, "es", deepl_client)
        es_content = translate_content(content, "es", deepl_client, "es")
        es_filename = f"{generate_slug_from_title(es_frontmatter['title'], 'es')}.mdx"
        save_translated_file(es_frontmatter, es_content, TARGET_DIR_ES, es_filename, "es")

        # Pequeno delay entre arquivos
        time.sleep(1)

    except Exception as e:
        print(f"  ✗ Erro ao processar {file_path.name}: {e}", file=sys.stderr)
        raise


def main():
    """Função principal."""
    parser = argparse.ArgumentParser(
        description="Traduz artigos do blog de português para inglês e espanhol usando DeepL API"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Modo dry-run: mostra o que seria traduzido sem fazer alterações",
    )
    args = parser.parse_args()

    # Verificar chave API (não necessário em dry-run)
    api_key = os.getenv("DEEPL_API_KEY")
    if not args.dry_run and not api_key:
        print("ERRO: DEEPL_API_KEY não encontrada nas variáveis de ambiente.", file=sys.stderr)
        print("Configure a variável de ambiente ou crie um arquivo .env com:", file=sys.stderr)
        print("DEEPL_API_KEY=your_api_key_here", file=sys.stderr)
        sys.exit(1)

    # Inicializar cliente DeepL (não necessário em dry-run)
    translator = None
    if not args.dry_run:
        try:
            translator = deepl.Translator(api_key)
            usage = translator.get_usage()
            print(f"DeepL API: {usage.character.count} de {usage.character.limit} caracteres usados")
        except Exception as e:
            print(f"ERRO ao inicializar DeepL API: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print("[DRY RUN] Modo de teste - nenhuma tradução será realizada")

    # Verificar se diretório fonte existe
    if not SOURCE_DIR.exists():
        print(f"ERRO: Diretório fonte não encontrado: {SOURCE_DIR}", file=sys.stderr)
        sys.exit(1)

    # Listar arquivos MDX
    mdx_files = list(SOURCE_DIR.glob("*.mdx"))
    if not mdx_files:
        print(f"Nenhum arquivo MDX encontrado em {SOURCE_DIR}")
        sys.exit(0)

    print(f"Encontrados {len(mdx_files)} arquivos para traduzir")

    # Processar cada arquivo
    success_count = 0
    error_count = 0

    for mdx_file in mdx_files:
        try:
            translate_file(mdx_file, translator, dry_run=args.dry_run)
            success_count += 1
        except Exception as e:
            error_count += 1
            print(f"Erro ao processar {mdx_file.name}: {e}", file=sys.stderr)
            continue

    # Resumo
    print(f"\n{'='*60}")
    print(f"Tradução concluída!")
    print(f"  ✓ Sucesso: {success_count}")
    if error_count > 0:
        print(f"  ✗ Erros: {error_count}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()

