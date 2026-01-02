# Script de Tradução de Artigos do Blog

Script Python para traduzir automaticamente artigos do blog de português (PT) para inglês (EN-US) e espanhol (ES) usando DeepL API.

## Instalação

### 1. Criar Ambiente Virtual (Recomendado)

Para evitar conflitos com o sistema Python, é recomendado usar um ambiente virtual:

```bash
# Criar ambiente virtual
python3 -m venv venv

# Ativar ambiente virtual (macOS/Linux)
source venv/bin/activate

# Ativar ambiente virtual (Windows)
# venv\Scripts\activate
```

### 2. Instalar Dependências

Com o ambiente virtual ativado, instale as dependências:

```bash
pip install -r scripts/requirements.txt
```

### 3. Configurar Chave da API DeepL

Crie um arquivo `.env` na raiz do projeto ou exporte a variável de ambiente:

**Opção 1: Arquivo .env (Recomendado)**
Crie um arquivo `.env` na raiz do projeto:
```
DEEPL_API_KEY=your_deepl_api_key_here
```

**Opção 2: Variável de Ambiente**
```bash
export DEEPL_API_KEY="your_deepl_api_key_here"
```

> **Nota**: Se usar arquivo `.env`, certifique-se de que ele está no `.gitignore` para não expor sua chave API no repositório.

## Uso

> **Importante**: Certifique-se de ter o ambiente virtual ativado antes de executar o script:
> ```bash
> source venv/bin/activate  # macOS/Linux
> # ou
> venv\Scripts\activate  # Windows
> ```

### Tradução Normal

```bash
python scripts/translate-blog-posts.py
```

Ou:

```bash
python3 scripts/translate-blog-posts.py
```

O script irá:
- Ler todos os arquivos `.mdx` de `src/content/blog/pt/`
- Traduzir cada artigo para inglês e espanhol
- Salvar os arquivos traduzidos em `src/content/blog/en/` e `src/content/blog/es/`
- Gerar slugs traduzidos para os nomes dos arquivos
- Ajustar links internos e caminhos de imagens

### Modo Dry-Run (Teste)

Para ver o que seria traduzido sem fazer alterações:

```bash
python scripts/translate-blog-posts.py --dry-run
```

## Características

- **Preserva estrutura**: Mantém frontmatter YAML e formatação Markdown
- **Traduz campos relevantes**: title, description, keywords, FAQ, conteúdo
- **Ajusta links internos**: `/pt/blog/...` → `/blog/...` (EN) ou `/es/blog/...` (ES)
- **Ajusta caminhos de imagem**: `/images/blog/pt/...` → `/images/blog/en/...` ou `/images/blog/es/...`
- **Mantém canonicalSlug**: Preserva o slug original para conectar traduções
- **Gera slugs traduzidos**: Nomes de arquivos baseados nos títulos traduzidos
- **Rate limiting**: Inclui delays para respeitar limites da API DeepL

## Campos Traduzidos

- `title` - Título do artigo
- `description` - Meta description
- `keywords` - Palavras-chave (exceto termos técnicos como "Face Moderna", "Dr. Robério Brandão")
- `faq` - Perguntas e respostas do FAQ
- `content` - Conteúdo Markdown completo
- `locale` - Ajustado para "en" ou "es"
- `image` - Caminho da imagem ajustado

## Campos Preservados (Não Traduzidos)

- `date` - Data de publicação
- `author` - Autor
- `readTime` - Tempo de leitura
- `featured` - Destaque
- `draft` - Rascunho
- `articleType` - Tipo do artigo
- `canonicalSlug` - Slug canônico (conecta traduções)

## Mapeamento de Links

| Original (PT) | Inglês (EN) | Espanhol (ES) |
|--------------|-------------|---------------|
| `/pt/blog/...` | `/blog/...` | `/es/blog/...` |
| `/pt/tecnicas/...` | `/techniques/...` | `/es/tecnicas/...` |
| `/pt/contato` | `/contact` | `/es/contacto` |
| `/pt/sobre` | `/about` | `/es/sobre` |
| `/pt/glossario/...` | `/glossary/...` | `/es/glossario/...` |

## Observações Importantes

1. **Custo**: DeepL API é paga por caracteres. ~75 artigos podem gerar custo significativo.
2. **Qualidade**: Revisão manual será necessária após tradução automática, especialmente termos técnicos médicos.
3. **Imagens**: Os caminhos são ajustados, mas as imagens físicas precisam ser copiadas/movidas manualmente se necessário.
4. **Backup**: Recomenda-se fazer backup antes de executar em produção.

## Solução de Problemas

### Erro: "externally-managed-environment"
Este erro ocorre quando o Python está gerenciado pelo sistema (ex: Homebrew no macOS). **Solução**: Use um ambiente virtual conforme instruções de instalação acima.

### Erro: "DEEPL_API_KEY não encontrada"
- Certifique-se de ter configurado a variável de ambiente ou arquivo `.env`
- Verifique se o arquivo `.env` está na raiz do projeto
- Certifique-se de que a chave está correta

### Erro: "Cota da API DeepL excedida"
- Verifique seu plano DeepL e limites de caracteres
- Aguarde o reset da cota ou atualize seu plano
- Considere usar o modo `--dry-run` primeiro para estimar o uso

### Erro: "Erro ao ler arquivo"
- Verifique se os arquivos MDX têm formato válido
- Certifique-se de que o frontmatter YAML está correto
- Verifique se o arquivo tem encoding UTF-8

### Desativar Ambiente Virtual

Após terminar de usar o script:

```bash
deactivate
```

