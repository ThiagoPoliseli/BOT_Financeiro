#!/bin/bash

echo "🤖 WhatsApp Expense Bot - Quick Start"
echo "====================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    echo "   Download: https://nodejs.org/"
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão $NODE_VERSION encontrada. Necessário versão 18+."
    echo "   Download: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""
echo "🚀 PRONTO PARA USAR!"
echo ""
echo "📱 Próximos passos:"
echo "1. Execute: cd bot && npm start"
echo "2. Escaneie o QR Code com seu WhatsApp"
echo "3. Teste enviando para SEU número: /ajuda"
echo "4. Registre um gasto: 50 almoço"
echo "5. Veja relatório: /relatorio"
echo ""
echo "💡 Comandos úteis:"
echo "   cd bot && npm start     - Iniciar o bot"
echo "   cd bot && npm run dev   - Modo desenvolvimento"
echo "   cd bot && npm test      - Testar parser"
echo "   cd bot && npm run test-users - Testar multi-usuário"
echo ""
echo "🔒 IMPORTANTE: Cada usuário que enviar mensagem para SEU número"
echo "   terá seus dados completamente separados e privados!"
echo ""
echo "📚 Documentação completa em: setup-guide.md"
echo ""