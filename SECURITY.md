# Security Best Practices

Este documento contém as diretrizes de segurança para o projeto Face Moderna®.

## 🔒 Princípios Fundamentais

1. **Never trust user input** - Sempre validar e sanitizar
2. **Principle of least privilege** - Mínimas permissões necessárias
3. **Defense in depth** - Múltiplas camadas de segurança
4. **Secure by default** - Configurações seguras desde o início

## 🛡️ Proteção XSS (Cross-Site Scripting)

### DOMPurify (Implementado)

```typescript
// ✅ Já implementado no projeto
import DOMPurify from 'isomorphic-dompurify';

// Sanitizar HTML user-generated
const cleanHtml = DOMPurify.sanitize(userInput);

```

### Evitar dangerouslySetInnerHTML

```typescript
// ❌ NUNCA fazer sem sanitização
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Sempre sanitizar primeiro
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />

// ✅ Melhor: Usar componentes React
<div>{userInput}</div> // React escapa automaticamente

```

## 🔑 Variáveis de Ambiente

### Estrutura Atual

```text
.env (não commitado)
.env.example (template público)

```

### Regras de Segurança

```bash
# ✅ Bom: Prefixo PUBLIC_ para variáveis client-side

PUBLIC_SITE_URL=https://drroberiobrandao.com
PUBLIC_GA_ID=G-XXXXXXXXXX

# ✅ Bom: Sem prefixo para server-only

GEMINI_API_KEY=secret_key_here
DATABASE_URL=postgresql://...

# ❌ NUNCA commitar secrets
.env
.env.local
.env.production

```

### Uso no Código

```typescript
// ✅ Client-side (Astro component)
const siteUrl = import.meta.env.PUBLIC_SITE_URL;

// ✅ Server-side only
const apiKey = import.meta.env.GEMINI_API_KEY;

// ❌ NUNCA expor server vars no client
<script>
  const key = "{import.meta.env.SECRET_KEY}"; // VAZAMENTO!
</script>

```

## 🔐 Dependências e Vulnerabilidades

### Verificação Regular

```bash
# Verificar vulnerabilidades conhecidas

npm audit

# Ver detalhes

npm audit --json

# Correção automática (cuidado com breaking changes)

npm audit fix

# Correção forçada (pode quebrar funcionalidade)

npm audit fix --force

```

### Vulnerabilidades Atuais

**Status (2024-12)**: 5 moderate severity

- esbuild <=0.24.2 (desenvolvimento apenas)
- vite 0.11.0 - 6.1.6 (desenvolvimento apenas)

**Ação**: Monitorar e atualizar quando patches estiverem disponíveis sem breaking changes.

### Política de Atualizações

1. **Críticas**: Atualizar imediatamente
2. **Altas**: Atualizar em 7 dias
3. **Moderadas**: Atualizar em próximo sprint
4. **Baixas**: Atualizar quando conveniente

## 🌐 Segurança de API

### Proteção de Rate Limiting

```typescript
// Futuro: Implementar rate limiting em API routes
// Exemplo com Astro API routes:

// src/pages/api/contact.ts
let requestCounts = new Map<string, number>();

export async function POST({ request, clientAddress }) {
  const count = requestCounts.get(clientAddress) || 0;

  if (count > 5) {
    return new Response('Too many requests', { status: 429 });
  }

  requestCounts.set(clientAddress, count + 1);

  // Processar request...
}

```

### Validação de Input

```typescript
// ✅ Sempre validar tipos e formatos
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover tags básicas
    .substring(0, 500); // Limitar tamanho
}

```

## 🔒 Content Security Policy (CSP)

### Headers Recomendados

```astro
---
// src/layouts/BaseLayout.astro
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://www.google-analytics.com",
].join('; ');
---

<meta http-equiv="Content-Security-Policy" content={cspDirectives}>

```

### Futuro: Server Headers

```text
# Em configuração do servidor (Vercel, Netlify, etc.)

Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()

```

## 🍪 Cookies e GDPR

### Implementação de Consentimento

```typescript
// Exemplo de gestão de cookies
interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
}

function setConsent(consent: CookieConsent) {
  setCookie('cookie_consent', JSON.stringify(consent), 365);

  // Carregar analytics apenas se consentido
  if (consent.analytics) {
    loadGoogleAnalytics();
  }
}

```

## 🔍 Segurança de Schema/SEO

### Validação de Schema.org

```typescript
// ✅ Validar estrutura de Schema antes de renderizar
function validatePersonSchema(schema: any): boolean {
  return (
    schema['@context'] === 'https://schema.org' &&
    schema['@type'] === 'Person' &&
    typeof schema.name === 'string' &&
    typeof schema.url === 'string'
  );
}

```

### Prevenção de Schema Injection

```typescript
// ❌ NUNCA fazer
const schema = {
  name: userInput, // Pode injetar JSON malicioso
};

// ✅ Sempre usar valores controlados
const schema = {
  name: 'Dr. Robério Brandão', // Hard-coded ou validado
  description: sanitizedDescription,
};

```

## 🚫 Proteção CSRF

### Para Formulários (Futuro)

```astro
---
// Gerar token CSRF único por sessão
import { generateCSRFToken } from '@lib/security';
const csrfToken = generateCSRFToken();
---

<form method="POST" action="/api/contact">
  <input type="hidden" name="csrf_token" value={csrfToken} />
  <!-- outros campos -->
</form>

```

## 📝 Logs e Monitoramento

### Informações Sensíveis

```typescript
// ❌ NUNCA logar dados sensíveis
console.log('User password:', password);
console.log('API Key:', process.env.SECRET_KEY);

// ✅ Logar apenas informações não-sensíveis
console.log('User logged in:', { userId, timestamp });
console.warn('Failed login attempt:', { username, ip });

```

### Estrutura de Logs

```typescript
// Futuro: Sistema estruturado de logs
interface LogEvent {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

function logEvent(event: LogEvent) {
  // Enviar para serviço de logs (não console em produção)
  if (process.env.NODE_ENV === 'production') {
    // sendToLogService(event);
  } else {
    console.log(event);
  }
}

```

## 🔐 Autenticação (Se Implementar no Futuro)

### Boas Práticas

1. **Usar OAuth2/OIDC** (Google, GitHub)
2. **Nunca armazenar senhas em plain text**
3. **Usar bcrypt/argon2** para hashing
4. **Implementar 2FA** para admins
5. **Tokens JWT** com expiração curta
6. **Refresh tokens** em httpOnly cookies

## ✅ Checklist de Segurança

### Antes de cada Deploy

- [ ] Nenhum secret commitado no código
- [ ] `npm audit` sem vulnerabilidades críticas/altas
- [ ] Variáveis de ambiente configuradas corretamente
- [ ] CSP headers configurados
- [ ] HTTPS habilitado (produção)
- [ ] Cookies com flags Secure e SameSite
- [ ] User inputs sanitizados
- [ ] Rate limiting em API endpoints

### Revisão Mensal

- [ ] Atualizar dependências (npm update)
- [ ] Verificar CVEs em dependências principais
- [ ] Revisar logs de acesso suspeito
- [ ] Testar formulários contra XSS/CSRF
- [ ] Verificar permissões de deploy

## 🛠️ Ferramentas de Segurança

### Análise Estática

```bash
# npm audit (já configurado)

npm audit

# ESLint security plugin (futuro)

npm install --save-dev eslint-plugin-security

```

### Testes de Penetração

```bash
# OWASP ZAP (teste local)

docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:4321

# Snyk (CLI)

npx snyk test

```

## 📚 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Astro Security](https://docs.astro.build/en/guides/security/)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

## 🚨 Reportar Vulnerabilidade

Se encontrar uma vulnerabilidade de segurança:

1. **NÃO** abrir issue público
2. Enviar email para: <security@drroberiobrandao.com>
3. Incluir descrição detalhada e passos para reproduzir
4. Aguardar confirmação antes de divulgar publicamente
