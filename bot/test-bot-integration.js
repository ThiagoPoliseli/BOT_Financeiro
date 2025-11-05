import SupabaseClient from './supabase-client.js';

const supabase = new SupabaseClient();
const testUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

async function testBot() {
  console.log('🧪 Iniciando testes do bot com Supabase...\n');

  try {
    // 1. Obter perfil do usuário
    console.log('1️⃣  Obtendo perfil do usuário...');
    const profile = await supabase.getUserProfile(testUserId);
    console.log('✅ Perfil:', profile);
    console.log('');

    // 2. Criar nova despesa
    console.log('2️⃣  Criando nova despesa...');
    const expense = await supabase.addExpense(
      testUserId,
      'alimentação',
      85.50,
      'Almoço no restaurante italiano'
    );
    console.log('✅ Despesa criada:', expense);
    console.log('');

    // 3. Testar parser de mensagem
    console.log('3️⃣  Testando parser de mensagem...');
    const testMessages = [
      '45.50 almoço',
      '120 supermercado',
      '25 uber',
      '80 cinema'
    ];

    for (const msg of testMessages) {
      console.log(`   Mensagem: "${msg}"`);
      try {
        const result = await supabase.createExpenseFromMessage(testUserId, msg);
        if (result) {
          console.log(`   ✅ Registrado: R$ ${result.amount} - ${result.description}`);
        }
      } catch (err) {
        console.log(`   ❌ Erro: ${err.message}`);
      }
    }
    console.log('');

    // 4. Obter relatório mensal
    console.log('4️⃣  Gerando relatório mensal...');
    const { report, total } = await supabase.getMonthlyReport(testUserId);
    console.log('✅ Despesas por categoria:');
    console.log(JSON.stringify(report, null, 2));
    console.log(`💰 Total do mês: R$ ${total.toFixed(2)}`);
    console.log('');

    // 5. Obter todas as despesas
    console.log('5️⃣  Listando todas as despesas...');
    const expenses = await supabase.getExpensesByUser(testUserId);
    console.log(`✅ Total de despesas: ${expenses.length}`);
    expenses.slice(0, 5).forEach(exp => {
      console.log(`   • R$ ${exp.amount} - ${exp.description} (${exp.categories?.name || 'N/A'})`);
    });
    console.log('');

    // 6. Verificar orçamentos
    console.log('6️⃣  Consultando orçamentos...');
    const budgets = await supabase.getBudgets(testUserId);
    console.log(`✅ Orçamentos ativos: ${budgets.length}`);
    budgets.forEach(budget => {
      console.log(`   • ${budget.categories?.name || 'N/A'}: R$ ${budget.amount}`);
    });
    console.log('');

    console.log('✨ Todos os testes concluídos com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    process.exit(1);
  }
}

testBot();
