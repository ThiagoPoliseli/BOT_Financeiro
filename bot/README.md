# WhatsApp Expense Tracker Bot

🤖 Bot inteligente para controle de gastos pessoais via WhatsApp

## 🚀 COMANDOS RÁPIDOS PARA COMEÇAR

```bash
# 1. Clonar e entrar na pasta do bot
git clone <seu-repositorio>
cd bot

# 2. Instalar dependências
npm install

# 3. Executar o bot
npm start

# 4. Escanear QR Code no WhatsApp

# 5. Testar com:
# Envie mensagens para SEU próprio número:
# "50 almoço"
# "/relatorio"
# /ajuda
```

## 🚀 Funcionalidades

### 📝 Registro de Gastos
- **Formato simples**: "50 almoço"
- **Com categoria**: "50 almoço alimentação"
- **Valor primeiro**: "R$ 120,50 mercado"
- **Descrição primeiro**: "gasolina 85 transporte"

### 🏷️ Categorias Automáticas
- 🍽️ **Alimentação**: almoço, mercado, restaurante, café...
- 🚗 **Transporte**: gasolina, uber, ônibus, estacionamento...
- 🏠 **Casa**: luz, água, aluguel, internet, limpeza...
- ⚕️ **Saúde**: médico, farmácia, consulta, exame...
- 🎮 **Lazer**: cinema, bar, jogo, viagem, show...
- 📦 **Outros**: demais gastos não categorizados

### 📊 Relatórios Inteligentes
- `/relatorio` - Relatório completo com análises
- `/hoje` - Gastos do dia atual
- `/semana` - Gastos dos últimos 7 dias
- `/mes` - Gastos do mês atual
- `/categorias` - Análise detalhada por categoria

### 🔧 Gerenciamento Avançado
- `/recentes` - Ver últimos 10 gastos com IDs
- `/buscar [termo]` - Buscar gastos por descrição, valor ou categoria
- `/deletar [ID]` - Deletar gasto específico (com confirmação)
- `/editar [ID]` - Editar valor, descrição ou categoria
- `/limpar [período]` - Limpar gastos por período (com confirmação)

### 👤 Perfil e Usuário
- `/perfil` - Ver informações do seu perfil e estatísticas
- `/status` - Status detalhado do sistema e suas atividades

### ⚙️ Controles Avançados
- `/backup` - Exportar todos os dados
- `/meta [valor]` - Definir metas de gastos
- `/ajuda` - Guia completo de comandos

### 🔒 Sistema Multi-Usuário
- ✅ **Dados isolados por usuário** - Cada WhatsApp tem seus próprios dados
- ✅ **Perfis individuais** - Configurações e estatísticas pessoais
- ✅ **Backup individual** - Cada usuário exporta apenas seus dados
- ✅ **Sessões independentes** - Múltiplos usuários simultâneos
- ✅ **Limpeza automática** - Remove usuários inativos após 30 dias

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+ instalado
- WhatsApp instalado no celular
- Conexão estável com internet

### Passo a Passo

1. **Clone e instale**:
```bash
git clone <seu-repositorio>
cd whatsapp-expense-bot/bot
npm install
```

2. **Execute o bot**:
```bash
npm start
```

3. **Conecte ao WhatsApp**:
   - Escaneie o QR Code que aparece no terminal
   - Use a câmera do WhatsApp (Configurações > Dispositivos conectados)

4. **Teste o bot**:
   - Envie: "50 almoço"
   - Envie: "/relatorio"

## 📱 Como Usar

### Registrar Gastos
```
50 almoço
R$ 120,50 mercado alimentação
gasolina 85 transporte
conta de luz 150 casa
```

### Comandos Principais
```
/relatorio    - Relatório completo
/hoje         - Gastos de hoje
/mes          - Gastos do mês
/categorias   - Análise por categoria
/ajuda        - Lista todos os comandos
```

### Exemplos de Uso
```
Usuário: "45 almoço"
Bot: ✅ Gasto registrado!
     💰 R$ 45,00 - Almoço
     🏷️ Categoria: alimentação
     📅 08/01/2025
     🆔 ID: #123
     
     💡 Comandos úteis:
     • /recentes - Ver últimos gastos
     • /deletar 123 - Deletar este gasto
     • /relatorio - Ver resumo completo

Usuário: "/relatorio"
Bot: 📊 RELATÓRIO DE GASTOS
     💰 Total: R$ 1.250,00
     📊 15 gastos registrados
     🍽️ Alimentação: R$ 450,00 (36%)
     🚗 Transporte: R$ 320,00 (25.6%)
     ...

Usuário: "/deletar 123"
Bot: ✅ Gasto deletado com sucesso!
     🗑️ Gasto removido:
     • ID: #123
     • Valor: R$ 45,00
     • Descrição: Almoço
     
Usuário: "/buscar uber"
Bot: 🔍 RESULTADOS DA BUSCA
     Termo: "uber"
     Encontrados: 3 gastos
     
     🚗 #124 - R$ 25,00
     📝 Uber para trabalho
     📅 07/01/2025
```

## 🔧 Configuração Avançada

### Banco de Dados
O bot usa SQLite por padrão. Os dados ficam em `expenses.db`.

### Personalização
Edite `messageParser.js` para:
- Adicionar novas categorias
- Modificar palavras-chave
- Ajustar padrões de reconhecimento

### Backup Automático
Os dados são salvos automaticamente. Use `/backup` para exportar.

## 🚀 Deploy (24/7)

### Heroku
```bash
# Instalar Heroku CLI
heroku create meu-expense-bot
git push heroku main
```

### Railway
```bash
# Conectar ao Railway
railway login
railway deploy
```

### VPS/Servidor
```bash
# Usar PM2 para manter rodando
npm install -g pm2
pm2 start index.js --name expense-bot
pm2 startup
pm2 save
```

## 📊 Estrutura do Projeto

```
bot/
├── index.js           # Bot principal
├── database.js        # Gerenciamento do banco
├── messageParser.js   # Análise de mensagens
├── reportGenerator.js # Geração de relatórios
├── package.json       # Dependências
└── expenses.db        # Banco de dados (criado automaticamente)
```

## 🔒 Segurança

- ✅ Dados armazenados localmente
- ✅ Sem envio para servidores externos
- ✅ Backup criptografado disponível
- ✅ Controle por usuário do WhatsApp

## 🆘 Solução de Problemas

### Bot não conecta
1. Verifique se o WhatsApp Web está desconectado
2. Delete a pasta `auth_info_baileys` e tente novamente
3. Verifique sua conexão com internet

### Mensagens não são reconhecidas
1. Use o formato: "valor descrição"
2. Evite caracteres especiais
3. Teste com `/ajuda` para ver exemplos

### Erro no banco de dados
1. Delete o arquivo `expenses.db`
2. Reinicie o bot (será recriado automaticamente)

## 📈 Próximas Funcionalidades

- [ ] Gráficos em imagem
- [ ] Relatórios em PDF
- [ ] Metas por categoria
- [ ] Lembretes automáticos
- [ ] Integração com bancos
- [ ] Dashboard web
- [ ] Múltiplos usuários
- [ ] Análise de tendências

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 📞 Suporte

- 📧 Email: seu-email@exemplo.com
- 💬 WhatsApp: (11) 99999-9999
- 🐛 Issues: GitHub Issues

---

**Desenvolvido com ❤️ para facilitar seu controle financeiro!**