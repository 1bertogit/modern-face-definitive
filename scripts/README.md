# Build Scripts

## pagespeed-insights.mjs

Script para testar performance usando a API do Google PageSpeed Insights.

### Features

- ✅ Análise de performance via API oficial do Google
- ✅ Suporte para desktop e mobile
- ✅ Múltiplas categorias (performance, accessibility, SEO, etc.)
- ✅ Métricas de lab e campo (RUM)
- ✅ Core Web Vitals detalhados
- ✅ Identificação de oportunidades de otimização
- ✅ Output formatado e colorido

### Pré-requisitos

1. **Obter API Key do Google:**
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um projeto ou selecione existente
   - Vá em **APIs & Services** → **Library**
   - Busque por **"PageSpeed Insights API"**
   - Clique em **Enable**
   - Vá em **APIs & Services** → **Credentials**
   - Clique em **Create Credentials** → **API Key**
   - Copie a chave gerada

2. **Configurar variável de ambiente:**

   ```bash
   # Criar/editar arquivo .env na raiz do projeto
   # IMPORTANTE: Sem aspas no arquivo .env
   echo "PAGESPEED_API_KEY=sua-chave-aqui" >> .env
   ```

   **Formato correto no arquivo `.env`:**

   ```env
   PAGESPEED_API_KEY=AIzaSyC-exemplo-de-chave-api-123456
   ```

   ⚠️ **Não use aspas** no arquivo `.env` (o `dotenv` lê o valor diretamente)

   **Para exportar no terminal (com aspas):**

   ```bash
   export PAGESPEED_API_KEY="sua-chave-aqui"
   ```

### Usage

#### Via npm scripts (recomendado)

```bash
# Análise desktop (padrão)

npm run pagespeed https://drroberiobrandao.com

# Análise mobile

npm run pagespeed https://drroberiobrandao.com --mobile

# Categorias específicas

npm run pagespeed https://drroberiobrandao.com --categories=performance,seo

```

#### Execução direta

```bash
# Desktop

node scripts/pagespeed-insights.mjs https://drroberiobrandao.com

# Mobile

node scripts/pagespeed-insights.mjs https://drroberiobrandao.com --mobile

# Categorias customizadas

node scripts/pagespeed-insights.mjs https://drroberiobrandao.com --categories=performance,accessibility

```

### Output Example

```text
🔍 Analisando performance...

URL: https://drroberiobrandao.com
Estratégia: Desktop
Categorias: performance, accessibility, best-practices, seo

📊 RESULTADOS DO PAGESPEED INSIGHTS

════════════════════════════════════════════════════════════

📈 SCORES:
  ✅ Performance: 95/100
  ✅ Accessibility: 98/100
  ✅ Best Practices: 95/100
  ✅ SEO: 98/100

⚡ CORE WEB VITALS:
  ✅ 1.2s (1.2 s) - LCP (Largest Contentful Paint)
  ✅ 45ms (45 ms) - FID (First Input Delay)
  ✅ 0.05 (0.05) - CLS (Cumulative Layout Shift)
  ✅ 890ms (890 ms) - FCP (First Contentful Paint)
  ✅ 2.1s (2.1 s) - TTI (Time to Interactive)

🌐 MÉTRICAS DE CAMPO (RUM):
  LCP: ✅ 1200ms (FAST)
  FID: ✅ 50ms (FAST)
  CLS: ✅ 0.05 (FAST)
  FCP: ✅ 900ms (FAST)

💡 PRINCIPAIS OPORTUNIDADES:
  ⚠️  Reduzir JavaScript não utilizado: Economia potencial de 58.7KiB
  ⚠️  Otimizar imagens: Economia potencial de 24KiB

════════════════════════════════════════════════════════════

📄 Relatório completo disponível em:
   https://pagespeed.web.dev/analysis?url=https://drroberiobrandao.com

```

### Parâmetros

| Parâmetro | Descrição | Padrão |
|-----------|-----------|--------|
| `url` | URL a analisar (obrigatório) | - |
| `--mobile` | Analisar versão mobile | `desktop` |
| `--categories` | Categorias (separadas por vírgula) | `performance,accessibility,best-practices,seo` |

### Categorias Disponíveis

- `performance` - Performance geral
- `accessibility` - Acessibilidade
- `best-practices` - Boas práticas
- `seo` - SEO
- `pwa` - Progressive Web App

### Integração com CI/CD

```yaml
# GitHub Actions example

- name: Test PageSpeed
  env:
    PAGESPEED_API_KEY: ${{ secrets.PAGESPEED_API_KEY }}
  run: |
    npm run pagespeed https://drroberiobrandao.com

```

### Troubleshooting

#### Erro: PAGESPEED_API_KEY não encontrada

- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que a variável está exportada no terminal
- Verifique se não há espaços extras na chave

#### Erro: INVALID_ARGUMENT

- Verifique se a URL está acessível publicamente
- URLs locais (localhost) não funcionam
- Use URLs de produção ou staging público

#### Limite de requisições

- API gratuita: 25,000 requisições/dia
- Para uso intensivo, considere upgrade no Google Cloud

### Referências

- [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Web Vitals](https://web.dev/vitals/)

---

## check-internal-links.mjs

Validates all internal links in the Astro static build to prevent broken links in production.

### Link Validation Features

- ✅ Scans all HTML files in `./dist`
- ✅ Extracts and validates internal links (href attributes)
- ✅ Ignores external links (http/https/mailto/tel)
- ✅ Ignores anchor-only links (#section)
- ✅ Smart path resolution (handles `/page/`, `/page`, `/page.html`)
- ✅ Detailed error reporting with source file references
- ✅ Optional translation link filtering
- ✅ Colored terminal output
- ✅ Proper exit codes for CI/CD integration

### Link Validation Usage

#### Via npm scripts (recommended)

```bash
# Build and check only Portuguese links (ignores /en/, /es/)

npm run build:check

# Check links in existing build (all links)

npm run check-links

# Check strictly (include translation links)

npm run check-links:strict

# Check only Portuguese links (ignore translations)

npm run check-links:pt

```

#### Direct execution

```bash
# Check all links

node scripts/check-internal-links.mjs

# Ignore translation links (/en/, /es/)

node scripts/check-internal-links.mjs --ignore-translations
node scripts/check-internal-links.mjs -i

```

### Exit Codes

- `0` - All internal links valid
- `1` - Broken links found OR script error

### Output Format

#### Success

```text
⚡ Checking internal links in ./dist

✓ Found 338 HTML files
✓ Extracted 11234 internal links (291 unique)

✓ All internal links are valid!

```

#### Failure

```text
⚡ Checking internal links in ./dist

✓ Found 338 HTML files
✓ Extracted 11234 internal links (291 unique)

✗ Found 3 broken links:

  ✗ /blog/missing-article/
    Referenced in:

      - index.html
      - blog/index.html

  ✗ /about/team/
    Referenced in:

      - about/index.html
      - en/about/index.html
      - es/about/index.html

Build failed: 3 broken internal links found

```

### Link Validation Logic

The script considers a link **internal** if:

- Starts with `/` (absolute internal path)
- Does NOT start with `http://`, `https://`, `mailto:`, `tel:`, `ftp:`
- Is NOT an anchor-only link (`#section`)

The script considers a link **valid** if any of these files exist:

- `/dist{link}` (exact path)
- `/dist{link}/index.html` (directory with index)
- `/dist{link}.html` (HTML file)

### CLI Flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--ignore-translations` | `-i` | Skip validation of `/en/*` and `/es/*` links |

### Integration with CI/CD

The script returns proper exit codes and can be integrated into CI/CD pipelines:

```yaml
# GitHub Actions example

- name: Build and validate links
  run: npm run build:check

# Or separate steps

- name: Build site
  run: npm run build


- name: Validate internal links
  run: npm run check-links:pt

```

### Common Issues

#### Missing RSS feed

```text
✗ /rss.xml

```

**Solution**: Configure `@astrojs/sitemap` or create RSS feed route

#### Wrong 404 link

```text
✗ /404/

```

**Solution**: Use `/404.html` or `/` for 404 links

#### Missing translated pages

```text
✗ /en/about/team/

```

**Solution**: Create translated page or use `--ignore-translations` flag during development

#### Template variable in link

```text
✗ {siteUrl}/rss.xml

```

**Solution**: Ensure Astro config has proper `site` value and templates resolve correctly

### Performance

- Typical scan: 300+ HTML files in ~2-3 seconds
- Memory efficient: streams file reads
- No external dependencies

### Debugging

Enable verbose output by modifying script or checking individual broken links:

```bash
# Check if file exists

ls -la dist/blog/missing-article/index.html

# Check what's linking to it

grep -r "missing-article" dist/*.html

```

### Development Tips

1. **During development**: Use `--ignore-translations` to focus on PT content
2. **Before translation**: Run strict check to find all missing translations
3. **In CI/CD**: Use `build:check` for automated validation
4. **Quick iteration**: Use `check-links` on existing build (no rebuild)

### Known Limitations

- Does not validate external links (by design)
- Does not check anchor targets within pages
- Does not validate query parameters or fragments
- Requires build to exist in `./dist` directory

### Extending the Script

The script is modular and can be extended:

- Add external link validation
- Add anchor target validation
- Add custom ignore patterns
- Add JSON output format
- Add link statistics

See source code comments for implementation details.
