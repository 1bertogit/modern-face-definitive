#!/bin/bash

# Script de Verificação de Erros i18n
# Verifica problemas comuns de internacionalização no projeto

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔍 VERIFICAÇÃO DE ERROS i18n - Face Moderna Institute"
echo "=================================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Verificar links /en/ hardcoded
echo "1️⃣  Verificando links /en/ hardcoded..."
EN_COUNT=$(grep -r "['\"]/en/" src/pages src/components --include="*.astro" --include="*.tsx" 2>/dev/null | grep -v "test\|\.mdx" | wc -l | tr -d ' ')

if [ "$EN_COUNT" -eq 0 ]; then
  echo -e "   ${GREEN}✅ Nenhum link /en/ encontrado${NC}"
else
  echo -e "   ${RED}❌ Encontrados $EN_COUNT links /en/ hardcoded${NC}"
  echo "   Arquivos com problema:"
  grep -r "['\"]/en/" src/pages src/components --include="*.astro" --include="*.tsx" 2>/dev/null | grep -v "test\|\.mdx" | sed 's/^/     - /'
  ERRORS=$((ERRORS + EN_COUNT))
fi
echo ""

# 2. Verificar links /training/core-programs/ incorretos
echo "2️⃣  Verificando links /training/core-programs/ incorretos..."
TRAINING_COUNT=$(grep -r "/training/core-programs" src/ 2>/dev/null | wc -l | tr -d ' ')

if [ "$TRAINING_COUNT" -eq 0 ]; then
  echo -e "   ${GREEN}✅ Nenhum link incorreto encontrado${NC}"
else
  echo -e "   ${YELLOW}⚠️  Encontrados $TRAINING_COUNT links /training/core-programs/${NC}"
  echo "   (Deveriam apontar para /education/core-programs/)"
  echo "   Arquivos com problema:"
  grep -r "/training/core-programs" src/ 2>/dev/null | sed 's/^/     - /'
  WARNINGS=$((WARNINGS + TRAINING_COUNT))
fi
echo ""

# 3. Verificar se há links /pt/ ou /es/ hardcoded incorretamente (apenas em páginas EN)
echo "3️⃣  Verificando links /pt/ e /es/ hardcoded em páginas EN..."
# Apenas verificar em páginas que não são pt/ ou es/ (páginas EN)
LOCALE_COUNT=$(find src/pages -name "*.astro" -not -path "*/pt/*" -not -path "*/es/*" -exec grep -l "['\"]/\(pt\|es\)/" {} \; 2>/dev/null | grep -v "test\|\.mdx\|getLocalePrefix\|localizedPath\|translatePath" | wc -l | tr -d ' ')

if [ "$LOCALE_COUNT" -eq 0 ]; then
  echo -e "   ${GREEN}✅ Nenhum link hardcoded encontrado em páginas EN${NC}"
  echo "   (Links de locale em páginas PT/ES são esperados)"
else
  echo -e "   ${YELLOW}⚠️  Encontrados $LOCALE_COUNT arquivos EN com links /pt/ ou /es/ hardcoded${NC}"
  echo "   Considere usar funções i18n (translatePath, localizedPath) em vez de hardcode"
  WARNINGS=$((WARNINGS + LOCALE_COUNT))
fi
echo ""

# 4. Executar build e verificar erros
echo "4️⃣  Executando build de verificação..."
if npm run build > /tmp/build-check.log 2>&1; then
  echo -e "   ${GREEN}✅ Build concluído com sucesso${NC}"
  
  # Verificar erros 404 no build (excluir a página 404.html que é esperada)
  ERROR_404=$(grep -E "404|Cannot GET" /tmp/build-check.log | grep -v "404.astro\|404.html" | wc -l | tr -d ' ')
  if [ "$ERROR_404" -eq 0 ]; then
    echo -e "   ${GREEN}✅ Nenhum erro 404 encontrado${NC}"
  else
    echo -e "   ${RED}❌ Encontrados $ERROR_404 erros 404${NC}"
    echo "   Primeiros erros:"
    grep -E "404|Cannot GET" /tmp/build-check.log | grep -v "404.astro\|404.html" | head -5 | sed 's/^/     - /'
    ERRORS=$((ERRORS + ERROR_404))
  fi
  
  # Contar páginas geradas
  PAGE_COUNT=$(grep -c "└─" /tmp/build-check.log || echo "0")
  echo "   Páginas geradas: $PAGE_COUNT"
else
  echo -e "   ${RED}❌ Build falhou${NC}"
  echo "   Verifique o log: /tmp/build-check.log"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# 5. Verificar se há imports de funções i18n não utilizadas
echo "5️⃣  Verificando uso correto de funções i18n..."
I18N_FUNCTIONS=("translatePath" "localizedPath" "getLocalePrefix" "getLocaleFromUrl")
for func in "${I18N_FUNCTIONS[@]}"; do
  USAGE_COUNT=$(grep -r "$func" src/pages src/components --include="*.astro" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
  echo "   $func: $USAGE_COUNT usos"
done
echo ""

# Resumo final
echo "=================================================="
echo "📊 RESUMO:"
echo ""

if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo -e "${GREEN}✅ Tudo OK! Nenhum erro ou warning encontrado.${NC}"
  exit 0
elif [ "$ERRORS" -eq 0 ]; then
  echo -e "${YELLOW}⚠️  $WARNINGS warning(s) encontrado(s)${NC}"
  echo -e "${GREEN}✅ Nenhum erro crítico${NC}"
  exit 0
else
  echo -e "${RED}❌ $ERRORS erro(s) encontrado(s)${NC}"
  if [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) encontrado(s)${NC}"
  fi
  echo ""
  echo "Corrija os erros antes de fazer deploy."
  exit 1
fi

