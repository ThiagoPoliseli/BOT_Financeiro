# WhatsApp Expense Bot - Guia de Setup e Testes

## 📋 Dados de Teste Disponíveis

### Usuário de Teste
- **Email:** teste@expensebot.com
- **Senha:** senha123456
- **Nome:** João Silva
- **Plano:** Premium
- **ID:** f47ac10b-58cc-4372-a567-0e02b2c3d479

### Dados Pré-carregados
✅ **10 despesas registradas** em diferentes categorias
✅ **5 orçamentos mensais** configurados
✅ **9 categorias** com ícones e cores

## 🚀 Como Iniciar o Bot

### 1. Instalar Dependências
```bash
cd bot
npm install --legacy-peer-deps
```

### 2. Executar Testes
```bash
node test-bot-final.js
```

Este comando mostrará:
- Todas as despesas registradas
- Relatório por categoria
- Status dos orçamentos
- Simulação de novos registros

### 3. Iniciar o Bot do WhatsApp
```bash
npm start
```

Ou em modo desenvolvimento:
```bash
npm run dev
```

## 📊 Dados Disponíveis no Banco

### Despesas Registradas
| Descrição | Valor | Categoria | Data |
|-----------|-------|-----------|------|
| Almoço no restaurante | R$ 45,50 | Alimentação | 2025-11-05 |
| Supermercado semanal | R$ 120,00 | Alimentação | 2025-11-04 |
| Combustível | R$ 25,00 | Transporte | 2025-11-03 |
| Consulta médica | R$ 150,00 | Saúde | 2025-11-02 |
| Cinema com amigos | R$ 80,00 | Lazer | 2025-11-01 |
| Conta de internet | R$ 350,00 | Casa | 2025-10-31 |
| Compra de roupas | R$ 200,00 | Vestuário | 2025-10-30 |
| Curso online | R$ 250,00 | Educação | 2025-10-29 |
| Software para edição | R$ 100,00 | Trabalho | 2025-10-28 |

**Total:** R$ 1.355,50

### Orçamentos Mensais
| Categoria | Limite | Gasto | Disponível |
|-----------|--------|-------|-----------|
| Alimentação | R$ 500,00 | R$ 200,50 | R$ 299,50 |
| Transporte | R$ 300,00 | R$ 25,00 | R$ 275,00 |
| Lazer | R$ 200,00 | R$ 80,00 | R$ 120,00 |
| Saúde | R$ 500,00 | R$ 150,00 | R$ 350,00 |
| Casa | R$ 800,00 | R$ 350,00 | R$ 450,00 |

## 🧪 Funcionalidades para Testar

### 1. Registrar Despesa
**Mensagens válidas:**
```
50 almoço
120 supermercado
25 uber
80 cinema
150 médico
```

### 2. Ver Relatório Mensal
**Comando:**
```
/relatorio
```

**Retorna:**
- Despesas por categoria
- Total do mês
- Comparação com orçamentos

### 3. Ver Ajuda
**Comando:**
```
/ajuda
```

**Mostra:**
- Lista de comandos disponíveis
- Exemplos de uso
- Categorias automáticas

### 4. Ver Orçamentos
**Comando:**
```
/orcamento
```

**Mostra:**
- Orçamentos ativos
- Porcentagem gasta
- Alertas de limite

## 🔄 Fluxo de Funcionamento

```
Usuário envia mensagem no WhatsApp
        ↓
Bot recebe mensagem
        ↓
Parser extrai valor e descrição
        ↓
IA categoriza automaticamente
        ↓
Salva no Supabase
        ↓
Envia confirmação ao usuário
        ↓
Bot atualiza relatório
```

## 📱 Exemplo de Conversa

```
👤 Usuário: "85.50 almoço no restaurante"

🤖 Bot:
✅ Gasto registrado!
💰 R$ 85,50 - Almoço no restaurante
🏷️ Categoria: Alimentação
📅 05/11/2025

---

👤 Usuário: "/relatorio"

🤖 Bot:
📊 RELATÓRIO DO MÊS

🍽️ ALIMENTAÇÃO: R$ 286,00 (57%)
   - Almoço: R$ 85,50
   - Supermercado: R$ 120,00
   - Café: R$ 80,50

💰 TOTAL: R$ 1.440,50

⚠️ ALERTAS:
   - Alimentação: 57% do orçamento
```

## 🛠️ Integração com Supabase

O bot usa as seguintes funcionalidades:

### Edge Function
- **Endpoint:** `/functions/v1/bot-api`
- **Ações:** `add_expense`, `get_report`, `get_user`

### Tabelas
- `expenses` - Registros de gastos
- `categories` - Categorias disponíveis
- `budgets` - Metas mensais
- `user_profiles` - Dados do usuário

## ⚙️ Variáveis de Ambiente

Já configuradas em `.env`:
```
VITE_SUPABASE_URL=https://zupgeftgujmytjjvrweh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

## 📝 Próximos Passos

1. ✅ Dados reais inseridos
2. ✅ Testes funcionando
3. ⏳ Iniciar bot e escanear QR code
4. ⏳ Enviar mensagens de teste
5. ⏳ Verificar relatórios automáticos
6. ⏳ Testar integração com pagamento (Stripe)

## 🚨 Troubleshooting

### Bot não inicia
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Erro de conexão Supabase
```bash
# Verificar variáveis .env
cat .env
```

### Dados não aparecem
```bash
# Rodar teste novamente
node test-bot-final.js
```

## 📞 Suporte

Para mais informações, consulte:
- `index.js` - Bot principal
- `supabase-client.js` - Cliente Supabase
- `messageParser.js` - Parser de mensagens
- `reportGenerator.js` - Gerador de relatórios
