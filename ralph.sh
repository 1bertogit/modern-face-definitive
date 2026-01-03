#!/bin/bash

# Este script executa os testes e verificações do projeto em loop
# até que tudo passe, simulando a persistência do Ralph Wiggum.

echo "🚀 Iniciando ciclo de qualidade Ralph..."

while true; do
  npm run quality
  if [ $? -eq 0 ]; then
    echo "✅ Qualidade garantida! Passando para verificação de links..."
    npm run check-links:pt
    if [ $? -eq 0 ]; then
      echo "🏆 PROJETO ESTÁVEL (Ralph está feliz)."
      exit 0
    fi
  fi
  
  echo "❌ Erros encontrados. Corrija-os e pressione [ENTER] para Ralph tentar novamente..."
  read
done