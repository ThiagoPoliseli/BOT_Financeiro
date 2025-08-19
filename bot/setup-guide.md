# 🤖 GUIA COMPLETO - WhatsApp Expense Bot

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### ✅ 1. PRÉ-REQUISITOS
- [ ] Node.js 18+ instalado
- [ ] WhatsApp instalado no celular
- [ ] Conexão estável com internet
- [ ] Terminal/CMD disponível

### ✅ 2. INSTALAÇÃO E CONFIGURAÇÃO

#### Passo 1: Preparar o ambiente
```bash
# 1. Navegar para a pasta do bot
cd bot

# 2. Instalar dependências
npm install

# 3. Verificar se todas as dependências foram instaladas
npm list
```

#### Passo 2: Estrutura de arquivos (verificar se existem)
```
bot/
├── index.js           ✅ Bot principal
├── database.js        ✅ Gerenciamento do banco
├── messageParser.js   ✅ Análise de mensagens  
├── reportGenerator.js ✅ Geração de relatórios
├── package.json       ✅ Dependências
└── expenses.db        ⚠️ Será criado automaticamente
```

### ✅ 3. EXECUTAR O BOT

#### Comando para iniciar:
```bash
npm start
```

#### O que deve acontecer:
1. **Console mostra**: "🚀 Iniciando WhatsApp Expense Bot..."
2. **Aparece QR Code** no terminal
3. **Status**: "📱 Escaneie o QR Code com seu WhatsApp"

### ✅ 4. CONECTAR AO WHATSAPP

#### Passo a passo:
1. **Abrir WhatsApp** no celular
2. **Ir em**: Configurações → Dispositivos conectados
3. **Tocar em**: "Conectar um dispositivo"
4. **Escanear** o QR Code que aparece no terminal
5. **Aguardar**: Mensagem "✅ Bot conectado ao WhatsApp!"

### ✅ 5. TESTAR O BOT

#### Comandos básicos para testar:
```
/ajuda          - Ver todos os comandos
/status         - Verificar se está funcionando
50 almoço       - Registrar um gasto
/recentes       - Ver últimos gastos
/deletar [ID]   - Deletar um gasto
/relatorio      - Ver relatório completo
```

#### Exemplos de gastos:
```
50 almoço
R$ 120,50 mercado alimentação
conta de luz 150
gasolina 85 transporte
uber 35
netflix 30 lazer
```

### ✅ 6. COMANDOS DISPONÍVEIS

#### 📝 Registrar Gastos:
- `50 almoço`
- `R$ 120,50 mercado alimentação`
- `conta de água 85`
- `gasolina 90 transporte`

#### 📊 Relatórios:
- `/relatorio` - Relatório completo
- `/hoje` - Gastos de hoje
- `/semana` - Gastos da semana
- `/mes` - Gastos do mês
- `/categorias` - Análise por categoria

#### 🔧 Gerenciar Gastos:
- `/recentes` - Ver últimos gastos com IDs
- `/buscar [termo]` - Buscar gastos específicos
- `/deletar [ID]` - Deletar gasto (ex: /deletar 123)
- `/editar [ID]` - Editar gasto (ex: /editar 123 75 almoço)
- `/limpar [período]` - Limpar dados (ex: /limpar hoje CONFIRMAR)

#### 👤 Perfil:
- `/perfil` - Ver informações pessoais
- `/status` - Status detalhado do sistema

#### ⚙️ Controles:
- `/backup` - Exportar dados
- `/meta [valor]` - Definir meta mensal
- `/ajuda` - Lista de comandos

### ✅ 7. CATEGORIAS INTELIGENTES

#### 🍽️ Alimentação:
- **Refeições**: almoço, jantar, café, lanche
- **Restaurantes**: restaurante, delivery, ifood
- **Mercado**: mercado, supermercado, feira
- **Bebidas**: cerveja, refrigerante, água, café
- **Doces**: chocolate, sorvete, açaí

#### 🚗 Transporte:
- **Combustível**: gasolina, álcool, diesel, posto
- **Transporte público**: ônibus, metro, trem
- **Aplicativos**: uber, taxi, 99
- **Estacionamento**: estacionamento, zona azul
- **Manutenção**: mecânico, pneu, óleo

#### 🏠 Casa:
- **Contas básicas**: luz, água, gás, conta de luz
- **Comunicação**: internet, telefone, netflix
- **Moradia**: aluguel, condomínio, iptu
- **Limpeza**: detergente, sabão, papel
- **Móveis**: móvel, eletrodoméstico

#### ⚕️ Saúde:
- **Consultas**: médico, dentista, psicólogo
- **Medicamentos**: farmácia, remédio, vitamina
- **Exames**: exame, laboratório, raio x
- **Planos**: plano de saúde, convênio
- **Bem-estar**: academia, massagem

#### 🎮 Lazer:
- **Entretenimento**: cinema, teatro, show
- **Vida noturna**: bar, balada, festa
- **Jogos**: jogo, playstation, steam
- **Streaming**: netflix, spotify, youtube
- **Viagens**: hotel, turismo, passeio

#### 📚 Educação:
- **Cursos**: curso, faculdade, pós-graduação
- **Materiais**: livro, apostila, caderno
- **Online**: udemy, coursera, alura
- **Idiomas**: inglês, espanhol, francês

#### 💼 Trabalho:
- **Equipamentos**: notebook, mouse, teclado
- **Software**: software, licença, adobe
- **Transporte trabalho**: combustível trabalho
- **Alimentação trabalho**: almoço trabalho

#### 👕 Vestuário:
- **Roupas**: roupa, camisa, calça, vestido
- **Calçados**: sapato, tênis, sandália
- **Acessórios**: bolsa, óculos, relógio
- **Cuidados**: lavanderia, costureira

### ✅ 8. SOLUÇÃO DE PROBLEMAS

#### ❌ Bot não conecta:
```bash
# 1. Parar o bot (Ctrl+C)
# 2. Deletar pasta de autenticação
rm -rf auth_info_baileys
# 3. Reiniciar
npm start
```

#### ❌ Erro de dependências:
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Mensagens não reconhecidas:
- Usar formato: "valor descrição" ou "descrição valor"
- Evitar caracteres especiais
- Testar com `/ajuda`

#### ❌ Erro no banco de dados:
```bash
# Deletar banco (dados serão perdidos)
rm expenses.db
# Reiniciar bot (será recriado)
npm start
```

### ✅ 9. DEPLOY PARA PRODUÇÃO (24/7)

#### Opção 1: Railway (Recomendado)
```bash
# 1. Criar conta no Railway
# 2. Conectar repositório GitHub
# 3. Deploy automático
```

#### Opção 2: Heroku
```bash
# 1. Instalar Heroku CLI
# 2. Fazer login
heroku login
# 3. Criar app
heroku create meu-expense-bot
# 4. Deploy
git push heroku main
```

#### Opção 3: VPS/Servidor
```bash
# 1. Instalar PM2
npm install -g pm2
# 2. Iniciar bot
pm2 start index.js --name expense-bot
# 3. Configurar auto-start
pm2 startup
pm2 save
```

### ✅ 10. MANUTENÇÃO E BACKUP

#### Backup manual:
```bash
# Copiar banco de dados
cp expenses.db backup-$(date +%Y%m%d).db
```

#### Logs do bot:
```bash
# Ver logs em tempo real
pm2 logs expense-bot
```

#### Atualizar bot:
```bash
# Parar bot
pm2 stop expense-bot
# Atualizar código
git pull
# Reinstalar dependências
npm install
# Reiniciar
pm2 restart expense-bot
```

### ✅ 11. RECURSOS AVANÇADOS

#### Sistema Multi-Usuário:
- ✅ **Dados isolados** - Cada WhatsApp tem dados separados
- ✅ **Perfis individuais** - Configurações pessoais
- ✅ **Sessões independentes** - Múltiplos usuários simultâneos
- ✅ **Limpeza automática** - Remove inativos após 30 dias
- ✅ **Backup individual** - Cada um exporta seus dados

#### Gerenciamento Avançado:
- ✅ **Deletar gastos** - Por ID com confirmação
- ✅ **Editar gastos** - Alterar valor, descrição, categoria
- ✅ **Buscar gastos** - Por descrição, valor ou categoria
- ✅ **Limpar dados** - Por período com confirmação
- ✅ **Gastos recentes** - Lista com IDs para ações

#### Múltiplos usuários:

#### Análise inteligente:
- ✅ Auto-categorização
- ✅ Detecção de padrões
- ✅ Subcategorias automáticas
- ✅ Relatórios hierárquicos

#### Exportação:
- ✅ Backup em JSON
- ✅ Relatórios em texto
- ✅ Dados estruturados

### ✅ 12. PRÓXIMOS PASSOS

#### Funcionalidades futuras:
- [ ] Gráficos em imagem
- [ ] Relatórios em PDF
- [ ] Metas por categoria
- [ ] Lembretes automáticos
- [ ] Dashboard web
- [ ] Integração bancária

---

## 🚀 COMANDOS RÁPIDOS PARA COMEÇAR

```bash
# 1. Entrar na pasta do bot
cd bot

# 2. Instalar dependências
npm install

# 3. Iniciar o bot
npm start

# 4. Escanear QR Code no WhatsApp

# 5. Testar com:
# /ajuda
# 50 almoço
# /relatorio
```

## 📞 SUPORTE

Se encontrar problemas:
1. Verificar se todas as dependências estão instaladas
2. Conferir se o Node.js está atualizado
3. Testar conexão com internet
4. Verificar se o WhatsApp Web está desconectado

**Bot pronto para uso! 🎉**