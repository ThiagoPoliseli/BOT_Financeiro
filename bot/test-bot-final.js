import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

async function runTests() {
  console.log('\n🤖 WhatsApp Expense Bot - Testes Completos\n');
  console.log('=' .repeat(50));

  try {
    // 1. Obter todas as despesas
    console.log('\n📊 1. LISTANDO TODAS AS DESPESAS\n');
    const { data: expenses, error: expError } = await supabase
      .from('expenses')
      .select('*, categories(name, icon)')
      .eq('user_id', testUserId)
      .order('expense_date', { ascending: false });

    if (expError) throw expError;

    console.log(`Total de despesas: ${expenses.length}\n`);
    expenses.slice(0, 5).forEach(exp => {
      const icon = exp.categories?.icon || '📦';
      console.log(`${icon} ${exp.description}`);
      console.log(`   Valor: ${formatCurrency(exp.amount)} | Data: ${exp.expense_date}`);
    });

    // 2. Gerar relatório por categoria
    console.log('\n💰 2. RELATÓRIO POR CATEGORIA\n');

    const report = {};
    let totalMonth = 0;

    expenses.forEach(exp => {
      const category = exp.categories?.name || 'outros';
      const icon = exp.categories?.icon || '📦';

      if (!report[category]) {
        report[category] = {
          total: 0,
          count: 0,
          icon: icon
        };
      }
      report[category].total += parseFloat(exp.amount);
      report[category].count += 1;
      totalMonth += parseFloat(exp.amount);
    });

    Object.entries(report).forEach(([category, data]) => {
      console.log(`${data.icon} ${category.toUpperCase()}`);
      console.log(`   Total: ${formatCurrency(data.total)} | Transações: ${data.count}`);
    });

    console.log(`\n📈 TOTAL DO MÊS: ${formatCurrency(totalMonth)}`);

    // 3. Obter orçamentos
    console.log('\n🎯 3. ORÇAMENTOS CONFIGURADOS\n');
    const { data: budgets, error: budError } = await supabase
      .from('budgets')
      .select('*, categories(name, icon)')
      .eq('user_id', testUserId)
      .eq('is_active', true);

    if (budError) throw budError;

    if (budgets.length > 0) {
      budgets.forEach(budget => {
        const categoryName = budget.categories?.name || 'N/A';
        const icon = budget.categories?.icon || '📦';
        const spent = report[categoryName]?.total || 0;
        const remaining = budget.amount - spent;
        const percentage = (spent / budget.amount * 100).toFixed(1);

        console.log(`${icon} ${categoryName.toUpperCase()}`);
        console.log(`   Orçamento: ${formatCurrency(budget.amount)}`);
        console.log(`   Gasto: ${formatCurrency(spent)} (${percentage}%)`);
        console.log(`   Restante: ${formatCurrency(remaining)}`);

        if (percentage > 80) {
          console.log(`   ATENÇÃO: Limite próximo!`);
        }
      });
    }

    // 4. Simular novos registros
    console.log('\n4. SIMULANDO NOVOS REGISTROS\n');

    const testMessages = [
      { msg: '85.50 almoço no restaurante', cat: 'alimentação' },
      { msg: '32.00 combustível', cat: 'transporte' },
      { msg: '150.00 consulta dentária', cat: 'saúde' }
    ];

    for (const test of testMessages) {
      console.log(`Mensagem recebida: "${test.msg}"`);

      const match = test.msg.match(/(\d+(?:[.,]\d+)?)\s+(.+)/);
      if (match) {
        const amount = match[1].replace(',', '.');
        const description = match[2];
        console.log(`Será registrado:`);
        console.log(`   Valor: ${formatCurrency(amount)}`);
        console.log(`   Descrição: ${description}`);
        console.log(`   Categoria: ${test.cat}`);
      }
      console.log();
    }

    // 5. Perfil do usuário
    console.log('5. PERFIL DO USUÁRIO\n');
    const { data: profile, error: profError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', testUserId)
      .maybeSingle();

    if (profError) throw profError;

    if (profile) {
      console.log(`Nome: ${profile.full_name}`);
      console.log(`Email: ${profile.email}`);
      console.log(`Plano: ${profile.plan.toUpperCase()}`);
      console.log(`Moeda: ${profile.currency}`);
      console.log(`Fuso Horário: ${profile.timezone}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n✨ TESTES CONCLUÍDOS COM SUCESSO!\n');
    console.log('Próximas ações:');
    console.log('1. Escanear QR Code do WhatsApp');
    console.log('2. Enviar mensagens como "50 almoço"');
    console.log('3. Receber confirmações automáticas');
    console.log('4. Solicitar relatórios com /relatorio\n');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
}

runTests();
