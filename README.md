# Face Moderna® — Dr. Robério Brandão

Site institucional premium/editorial para a prática **Face Moderna®**.

## Stack

- Astro 5
- React 19 (ilhas)
- Tailwind CSS

## Como rodar localmente

Pré-requisitos: Node.js 18+

```bash
npm install
npm run dev

```

O servidor de desenvolvimento roda em `http://localhost:3000`.

## Build / Preview

```bash
npm run build
npm run preview

```

## Qualidade de Código

```bash
# Verificar tudo (typecheck, lint, format, tests)

npm run quality

# Comandos individuais

npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
npm run format:check # Prettier
npm run test:run     # Vitest

```

Ver **[CODE_QUALITY.md](./CODE_QUALITY.md)** para guia completo de padrões e boas práticas.

## Build com Validação de Links

Valida links internos automaticamente durante o build:

```bash
# Build + validação (apenas PT, ignora traduções)

npm run build:check

# Validar build existente (apenas PT)

npm run check-links:pt

# Validação estrita (inclui EN/ES)

npm run check-links:strict

```

Veja `LINK_VALIDATION_SUMMARY.md` para detalhes dos links quebrados atuais.

## Documentação

- **[CLAUDE.md](./CLAUDE.md)** - Guia completo de arquitetura, padrões e convenções
- **[CODE_QUALITY.md](./CODE_QUALITY.md)** - Padrões de qualidade, testes e documentação
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Otimizações de performance e bundle size
- **[SECURITY.md](./SECURITY.md)** - Best practices de segurança
- **[TRANSLATION_WORKFLOW.md](./TRANSLATION_WORKFLOW.md)** - Fluxo de trabalho i18n
- **[docs/I18N_VERIFICATION.md](./docs/I18N_VERIFICATION.md)** - Guia de verificação de erros i18n

## Segurança

Configure variáveis de ambiente:

```bash
cp .env.example .env
# Edite .env com suas chaves reais

```

Ver **[SECURITY.md](./SECURITY.md)** para diretrizes completas.

## Contribuindo

1. Execute `npm run quality` antes de commitar
2. Siga os padrões em [CODE_QUALITY.md](./CODE_QUALITY.md)
3. Mantenha cobertura de testes acima de 80%
4. Documente código com JSDoc quando apropriado
