# Guia de Contribuição

Obrigado por considerar contribuir para o Face Moderna®! Este documento fornece diretrizes para manter a qualidade e consistência do projeto.

## 📋 Antes de Começar

1. Leia a documentação:
   - [CLAUDE.md](./CLAUDE.md) - Arquitetura e padrões do projeto
   - [CODE_QUALITY.md](./CODE_QUALITY.md) - Padrões de qualidade
   - [PERFORMANCE.md](./PERFORMANCE.md) - Guidelines de performance
   - [SECURITY.md](./SECURITY.md) - Best practices de segurança

2. Configure seu ambiente:

```bash
# Clone o repositório

git clone https://github.com/1bertogit/modernfaceinstitute-cursor-cc-backup.git
cd modernfaceinstitute-cursor-cc-backup

# Instale dependências

npm install

# Configure variáveis de ambiente

cp .env.example .env
# Edite .env com suas configurações locais

# Inicie servidor de desenvolvimento

npm run dev

```

## 🔄 Workflow de Contribuição

### 1. Crie uma Branch

```bash
# Feature nova

git checkout -b feat/nome-da-feature

# Correção de bug

git checkout -b fix/descricao-do-bug

# Documentação

git checkout -b docs/tema-da-doc

# Refatoração

git checkout -b refactor/componente-ou-area

```

### 2. Desenvolva com Qualidade

```bash
# Durante o desenvolvimento, execute frequentemente:

npm run typecheck  # Verificar tipos TypeScript
npm run lint       # Verificar código
npm run test       # Rodar testes

# Antes de commitar:

npm run quality    # Executa TODOS os checks

```

### 3. Commits Semânticos

Formato: `type: subject`

**Types:**

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (sem mudança de lógica)
- `refactor`: Refatoração de código
- `test`: Adição/modificação de testes
- `chore`: Tarefas de manutenção
- `perf`: Melhoria de performance

**Exemplos:**

```bash
git commit -m "feat: add glossary search filter"
git commit -m "fix: correct mobile menu z-index"
git commit -m "docs: update README with testing guide"
git commit -m "refactor: extract translation helper functions"
git commit -m "test: add tests for i18n utilities"

```

### 4. Push e Pull Request

```bash
# Push da branch

git push origin feat/nome-da-feature

# Crie Pull Request no GitHub
# Título: Mesmo formato do commit
# Descrição: Explique o que foi feito e por quê

```

## ✅ Checklist de PR

Antes de criar um Pull Request:

- [ ] `npm run quality` passa sem erros
- [ ] Todos os testes passam (100%)
- [ ] Código está formatado (Prettier)
- [ ] Sem warnings ESLint
- [ ] TypeScript sem erros
- [ ] Adicionados testes para nova funcionalidade
- [ ] Documentação atualizada (se aplicável)
- [ ] README atualizado (se necessário)
- [ ] Sem console.logs esquecidos
- [ ] Sem secrets/credenciais no código

## 📝 Padrões de Código

### TypeScript

```typescript
// ✅ Bom
interface UserProfile {
  id: string;
  name: string;
  locale: Locale;
}

function getUser(id: string): Promise<UserProfile> {
  // implementation
}

// ❌ Evitar
function getUser(id: any): any {
  // implementation
}

```

### React Components

```typescript
// ✅ Bom: Props interface + JSDoc
interface ButtonProps {
  /** Button text content */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary';
}

/**

 * Reusable button component
 */
export default function Button({
  children,
  onClick,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {children}
    </button>
  );
}

```

### Testes

```typescript
// ✅ Estrutura clara: Arrange, Act, Assert
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = processInput(input);

    // Assert
    expect(result).toBe('expected');
  });
});

```

## 🎨 Estilo e Design

### Tailwind CSS

```astro
<!-- ✅ Use tokens de design -->
<div class="bg-primary-900 text-accent-600 p-4">

<!-- ❌ Evite valores hardcoded -->
<div class="bg-[#1e293b] text-[#b8956c]">

```

### Fontes e Tipografia

- **Headings**: Playfair Display (serif) com `font-normal` (não bold)
- **Body**: Inter (sans-serif)
- **Classes**: `.font-serif`, `.font-sans`

## 🧪 Testes

### Cobertura Mínima

- **Islands React**: 80% de cobertura
- **Funções utilities**: 80% de cobertura
- **Componentes Astro**: Não requer testes (estáticos)

### Executar Testes

```bash
# Modo watch (desenvolvimento)

npm test

# Rodar uma vez

npm run test:run

# Com cobertura

npm run test:coverage

```

## 🚀 Performance

### React Islands

```astro
<!-- ✅ Carregar quando necessário -->
<MobileMenu client:load />        <!-- Acima da fold -->
<GlossarySearch client:visible /> <!-- Abaixo da fold -->
<Analytics client:idle />         <!-- Não urgente -->

<!-- ❌ Evitar -->
<Component client:only="react" /> <!-- Perde SSR -->

```

### Imports

```typescript
// ✅ Import específico
import { useState, useEffect } from 'react';

// ❌ Import namespace
import * as React from 'react';

```

## 🔐 Segurança

### Nunca Commitar

- ❌ Secrets ou API keys
- ❌ Arquivos `.env` (exceto `.env.example`)
- ❌ Credenciais de banco de dados
- ❌ Tokens de acesso

### Sempre Sanitizar

```typescript
// ✅ Sanitizar user input
import DOMPurify from 'isomorphic-dompurify';
const clean = DOMPurify.sanitize(userInput);

// ❌ Nunca confiar em input direto
<div dangerouslySetInnerHTML={{ __html: userInput }} />

```

## 🌐 Internacionalização (i18n)

### Adicionar Novo Conteúdo Traduzível

1. Adicione em `src/lib/content/[page].ts`:

```typescript
export const content: Record<Locale, Content> = {
  'pt': { /* conteúdo PT */ },
  'en': { /* conteúdo EN */ },
  'es': { /* conteúdo ES */ }
};

```

1. Use no componente:

```astro
---
import { content } from '@lib/content/page';
const locale = 'pt'; // Internally uses 'pt', but HTML/SEO uses 'pt-BR'
const t = content[locale];
---
<h1>{t.title}</h1>

```

## 📦 Dependências

### Adicionar Nova Dependência

```bash
# Instalar

npm install package-name

# Verificar segurança

npm audit

# Verificar tamanho do bundle

npm run build
ls -lh dist/_astro/*.js

```

### Atualizar Dependências

```bash
# Ver outdated

npm outdated

# Atualizar (minor/patch)

npm update

# Atualizar (major - cuidado!)

npm install package@latest

```

## 🐛 Reportar Bugs

Ao reportar um bug, inclua:

1. **Descrição clara** do problema
2. **Passos para reproduzir**
3. **Comportamento esperado** vs **comportamento atual**
4. **Screenshots** (se aplicável)
5. **Ambiente**: Browser, versão, OS
6. **Console errors** (se houver)

## 💡 Sugerir Features

Para sugerir uma nova feature:

1. Verifique se já não existe issue similar
2. Descreva claramente o problema que resolve
3. Explique a solução proposta
4. Considere alternativas
5. Discuta antes de implementar (em issue)

## 🎓 Recursos de Aprendizado

- [Astro Docs](https://docs.astro.build)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev)

## 📞 Contato

- **Issues**: [GitHub Issues](https://github.com/1bertogit/modernfaceinstitute-cursor-cc-backup/issues)
- **Discussões**: [GitHub Discussions](https://github.com/1bertogit/modernfaceinstitute-cursor-cc-backup/discussions)

## 📜 Código de Conduta

- Seja respeitoso e profissional
- Aceite feedback construtivo
- Foque no que é melhor para o projeto
- Mostre empatia com outros contribuidores

---

Obrigado por contribuir! 🎉
