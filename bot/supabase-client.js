import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ou chave não configuradas!');
}

// Usar a chave anônima mas fazer bypass de RLS para o bot do servidor
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

class SupabaseClient {
  constructor() {
    this.supabase = supabase;
    this.apiUrl = `${supabaseUrl}/functions/v1/bot-api`;
  }

  async callBotApi(action, data) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ action, ...data }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getExpensesByUser(userId) {
    const { data, error } = await this.supabase
      .from('expenses')
      .select('*, categories(name, icon, color)')
      .eq('user_id', userId)
      .order('expense_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  async addExpense(userId, categoryName, amount, description) {
    try {
      const result = await this.callBotApi('add_expense', {
        userId,
        categoryName,
        amount,
        description,
      });
      return result[0];
    } catch (err) {
      console.log('Erro na API, tentando fallback...');
      const { data: category, error: catError } = await this.supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .maybeSingle();

      if (catError) throw catError;

      const categoryId = category?.id;

      const { data, error } = await this.supabase
        .from('expenses')
        .insert({
          user_id: userId,
          category_id: categoryId,
          amount: parseFloat(amount),
          description,
          expense_date: new Date().toISOString().split('T')[0],
        })
        .select();

      if (error) throw error;
      return data[0];
    }
  }

  async getMonthlyReport(userId) {
    const { data, error } = await this.supabase
      .from('expenses')
      .select('*, categories(name, icon)')
      .eq('user_id', userId)
      .gte('expense_date', new Date(new Date().setDate(1)).toISOString().split('T')[0]);

    if (error) throw error;

    const report = {};
    let total = 0;

    data.forEach(expense => {
      const category = expense.categories.name;
      if (!report[category]) {
        report[category] = {
          total: 0,
          count: 0,
          icon: expense.categories.icon,
          items: []
        };
      }
      report[category].total += parseFloat(expense.amount);
      report[category].count += 1;
      report[category].items.push({
        description: expense.description,
        amount: expense.amount,
        date: expense.expense_date
      });
      total += parseFloat(expense.amount);
    });

    return { report, total };
  }

  async getBudgets(userId) {
    const { data, error } = await this.supabase
      .from('budgets')
      .select('*, categories(name, icon)')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;
    return data;
  }

  async checkBudgetStatus(userId, categoryName) {
    const { data: budget, error: budgetError } = await this.supabase
      .from('budgets')
      .select('amount')
      .eq('user_id', userId)
      .eq('is_active', true)
      .in('category_id', (
        await this.supabase
          .from('categories')
          .select('id')
          .eq('name', categoryName)
      ).data?.map(c => c.id) || [])
      .maybeSingle();

    if (budgetError) throw budgetError;

    if (!budget) return null;

    const { data: expenses, error: expError } = await this.supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', userId)
      .gte('expense_date', new Date(new Date().setDate(1)).toISOString().split('T')[0]);

    if (expError) throw expError;

    const spent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const remaining = budget.amount - spent;

    return {
      budgetAmount: budget.amount,
      spent,
      remaining,
      percentage: (spent / budget.amount) * 100
    };
  }

  async getUserProfile(userId) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getUserByPhone(phoneNumber) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('id, email, full_name, plan')
      .eq('phone', phoneNumber)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createExpenseFromMessage(userId, message) {
    const patterns = [
      /^(\d+(?:[.,]\d+)?)\s+(.+)$/,
      /^([a-záàâãéèêíïóôõöúçñ\s]+)\s+(\d+(?:[.,]\d+)?)$/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        let amount, description;
        if (!isNaN(match[1])) {
          amount = match[1].replace(',', '.');
          description = match[2];
        } else {
          description = match[1];
          amount = match[2].replace(',', '.');
        }

        const categoryKeywords = {
          'alimentação': ['almoço', 'café', 'refeição', 'comida', 'restaurante', 'mercado', 'padaria', 'açai'],
          'transporte': ['uber', 'táxi', 'ônibus', 'carro', 'gasolina', 'combustível', 'passagem'],
          'lazer': ['cinema', 'jogo', 'diversão', 'show', 'festa', 'bar', 'cerveja'],
          'saúde': ['médico', 'farmácia', 'remédio', 'consulta', 'saúde', 'hospital'],
          'educação': ['curso', 'livro', 'aula', 'escola', 'udemy', 'faculdade'],
          'casa': ['aluguel', 'conta', 'energia', 'água', 'internet', 'telefone', 'luz'],
          'vestuário': ['roupa', 'sapato', 'calça', 'camiseta', 'tênis', 'moda'],
          'trabalho': ['notebook', 'software', 'ferramentas', 'material']
        };

        let category = 'outros';
        const descLower = description.toLowerCase();

        for (const [cat, keywords] of Object.entries(categoryKeywords)) {
          if (keywords.some(keyword => descLower.includes(keyword))) {
            category = cat;
            break;
          }
        }

        return await this.addExpense(userId, category, amount, description);
      }
    }

    return null;
  }
}

export default SupabaseClient;
