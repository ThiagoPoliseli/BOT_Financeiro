import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Database {
  constructor() {
    this.dbPath = join(__dirname, 'expenses.db');
    this.db = new sqlite3.Database(this.dbPath);
    this.initTables();
    console.log('💾 Banco de dados inicializado:', this.dbPath);
  }

  initTables() {
    // Tabela de gastos
    this.db.run(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        value REAL NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'outros',
        date TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de metas
    this.db.run(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        category TEXT NOT NULL,
        limit_value REAL NOT NULL,
        period TEXT NOT NULL DEFAULT 'month',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, category, period)
      )
    `);

    // Tabela de configurações do usuário
    this.db.run(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL UNIQUE,
        timezone TEXT DEFAULT 'America/Sao_Paulo',
        currency TEXT DEFAULT 'BRL',
        notifications BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabelas do banco de dados criadas/verificadas');
  }

  async addExpense(userId, value, description, category = 'outros') {
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO expenses (user_id, value, description, category, date, timestamp) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, value, description, category, date, timestamp],
        function(err) {
          if (err) {
            console.error('❌ Erro ao adicionar gasto:', err);
            reject(err);
          } else {
            console.log(`✅ Gasto adicionado: ID ${this.lastID} - R$ ${value} - ${description}`);
            resolve(this.lastID);
          }
        }
      );
    });
  }

  async getExpenses(userId, period = 'all', limit = null) {
    let dateFilter = '';
    const today = new Date();
    
    switch (period) {
      case 'today':
        const todayStr = today.toISOString().split('T')[0];
        dateFilter = `AND date = '${todayStr}'`;
        break;
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = `AND date >= '${weekAgo.toISOString().split('T')[0]}'`;
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        dateFilter = `AND date >= '${monthStart.toISOString().split('T')[0]}'`;
        break;
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        dateFilter = `AND date >= '${yearStart.toISOString().split('T')[0]}'`;
        break;
    }

    const limitClause = limit ? `LIMIT ${limit}` : '';

    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM expenses 
         WHERE user_id = ? ${dateFilter} 
         ORDER BY timestamp DESC ${limitClause}`,
        [userId],
        (err, rows) => {
          if (err) {
            console.error('❌ Erro ao buscar gastos:', err);
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  async getCategoriesReport(userId, period = 'all') {
    let dateFilter = '';
    const today = new Date();
    
    switch (period) {
      case 'today':
        const todayStr = today.toISOString().split('T')[0];
        dateFilter = `AND date = '${todayStr}'`;
        break;
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = `AND date >= '${weekAgo.toISOString().split('T')[0]}'`;
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        dateFilter = `AND date >= '${monthStart.toISOString().split('T')[0]}'`;
        break;
    }

    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT category, 
                SUM(value) as total, 
                COUNT(*) as count,
                AVG(value) as average
         FROM expenses 
         WHERE user_id = ? ${dateFilter}
         GROUP BY category 
         ORDER BY total DESC`,
        [userId],
        (err, rows) => {
          if (err) {
            console.error('❌ Erro ao buscar relatório de categorias:', err);
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  async deleteExpense(userId, expenseId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM expenses WHERE id = ? AND user_id = ?',
        [expenseId, userId],
        function(err) {
          if (err) {
            console.error('❌ Erro ao deletar gasto:', err);
            reject(err);
          } else {
            console.log(`🗑️ Gasto deletado: ID ${expenseId}`);
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  async getExpenseById(userId, expenseId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM expenses WHERE id = ? AND user_id = ?',
        [expenseId, userId],
        (err, row) => {
          if (err) {
            console.error('❌ Erro ao buscar gasto:', err);
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  async updateExpense(userId, expenseId, value, description, category) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE expenses 
         SET value = ?, description = ?, category = ? 
         WHERE id = ? AND user_id = ?`,
        [value, description, category, expenseId, userId],
        function(err) {
          if (err) {
            console.error('❌ Erro ao atualizar gasto:', err);
            reject(err);
          } else {
            console.log(`✏️ Gasto atualizado: ID ${expenseId}`);
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  async getUserProfile(userId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM user_settings WHERE user_id = ?',
        [userId],
        (err, row) => {
          if (err) {
            console.error('❌ Erro ao buscar perfil:', err);
            reject(err);
          } else {
            if (!row) {
              // Criar perfil padrão se não existir
              this.db.run(
                'INSERT INTO user_settings (user_id) VALUES (?)',
                [userId],
                function(insertErr) {
                  if (insertErr) {
                    reject(insertErr);
                  } else {
                    resolve({
                      user_id: userId,
                      timezone: 'America/Sao_Paulo',
                      currency: 'BRL',
                      notifications: 1
                    });
                  }
                }
              );
            } else {
              resolve(row);
            }
          }
        }
      );
    });
  }

  async getRecentExpenses(userId, limit = 5) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM expenses 
         WHERE user_id = ? 
         ORDER BY timestamp DESC 
         LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          if (err) {
            console.error('❌ Erro ao buscar gastos recentes:', err);
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  async searchExpenses(userId, searchTerm) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM expenses 
         WHERE user_id = ? AND (
           description LIKE ? OR 
           category LIKE ? OR 
           CAST(value AS TEXT) LIKE ?
         )
         ORDER BY timestamp DESC 
         LIMIT 20`,
        [userId, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
        (err, rows) => {
          if (err) {
            console.error('❌ Erro ao buscar gastos:', err);
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  async getUserStats(userId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT 
           COUNT(*) as totalExpenses,
           SUM(value) as totalValue,
           AVG(value) as averageValue,
           MIN(date) as firstExpense,
           MAX(date) as lastExpense
         FROM expenses 
         WHERE user_id = ?`,
        [userId],
        (err, row) => {
          if (err) {
            console.error('❌ Erro ao buscar estatísticas:', err);
            reject(err);
          } else {
            resolve({
              totalExpenses: row?.totalExpenses || 0,
              totalValue: row?.totalValue || 0,
              averageValue: row?.averageValue || 0,
              firstExpense: row?.firstExpense,
              lastExpense: row?.lastExpense
            });
          }
        }
      );
    });
  }

  async exportUserData(userId) {
    try {
      const expenses = await this.getExpenses(userId);
      const categories = await this.getCategoriesReport(userId);
      const stats = await this.getUserStats(userId);

      return {
        exportDate: new Date().toISOString(),
        userId: userId.replace('@s.whatsapp.net', ''),
        stats,
        categories,
        expenses: expenses.map(exp => ({
          id: exp.id,
          value: exp.value,
          description: exp.description,
          category: exp.category,
          date: exp.date
        }))
      };
    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
      throw error;
    }
  }

  async setBudget(userId, category, limitValue, period = 'month') {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO budgets (user_id, category, limit_value, period) 
         VALUES (?, ?, ?, ?)`,
        [userId, category, limitValue, period],
        function(err) {
          if (err) {
            console.error('❌ Erro ao definir meta:', err);
            reject(err);
          } else {
            console.log(`🎯 Meta definida: ${category} - R$ ${limitValue}/${period}`);
            resolve(this.lastID);
          }
        }
      );
    });
  }

  async getBudgets(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM budgets WHERE user_id = ? ORDER BY category',
        [userId],
        (err, rows) => {
          if (err) {
            console.error('❌ Erro ao buscar metas:', err);
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  async handleBudgetCommand(sender, command) {
    const args = command.split(' ').slice(1);
    
    if (args.length === 0) {
      // Mostrar metas atuais
      const budgets = await this.getBudgets(sender);
      
      if (budgets.length === 0) {
        await this.sendMessage(sender, `
🎯 *DEFINIR METAS DE GASTOS*
━━━━━━━━━━━━━━━━━━━━━━

*Formato:* /meta [categoria] [valor]

*Exemplos:*
• /meta alimentação 500
• /meta transporte 300
• /meta casa 800

_Defina limites mensais para suas categorias_
        `.trim());
        return;
      }
      
      let message = `🎯 *SUAS METAS ATUAIS*\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      
      for (const budget of budgets) {
        const spent = await this.getCategorySpent(sender, budget.category, 'month');
        const percentage = (spent / budget.limit_value) * 100;
        const status = percentage > 100 ? '🔴' : percentage > 80 ? '🟡' : '🟢';
        
        message += `${status} *${budget.category.toUpperCase()}*\n`;
        message += `   🎯 Meta: R$ ${budget.limit_value.toFixed(2)}\n`;
        message += `   💰 Gasto: R$ ${spent.toFixed(2)} (${percentage.toFixed(1)}%)\n`;
        message += `   📊 Restante: R$ ${(budget.limit_value - spent).toFixed(2)}\n\n`;
      }
      
      await this.sendMessage(sender, message);
      return;
    }
    
    if (args.length < 2) {
      await this.sendMessage(sender, '❌ Formato: /meta [categoria] [valor]\n\nExemplo: /meta alimentação 500');
      return;
    }
    
    const category = args[0].toLowerCase();
    const limitValue = parseFloat(args[1]);
    
    if (isNaN(limitValue) || limitValue <= 0) {
      await this.sendMessage(sender, '❌ Valor da meta deve ser um número positivo.');
      return;
    }
    
    try {
      await this.setBudget(sender, category, limitValue);
      
      await this.sendMessage(sender, `
✅ *Meta definida com sucesso!*

🎯 *Categoria:* ${category}
💰 *Limite mensal:* R$ ${limitValue.toFixed(2)}

_Use /meta para ver todas as suas metas_
      `.trim());
      
    } catch (error) {
      console.error('❌ Erro ao definir meta:', error);
      await this.sendMessage(sender, '❌ Erro ao definir meta. Tente novamente.');
    }
  }

  async getCategorySpent(userId, category, period = 'month') {
    return new Promise((resolve, reject) => {
      let dateFilter = '';
      const today = new Date();
      
      if (period === 'month') {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        dateFilter = `AND date >= '${monthStart.toISOString().split('T')[0]}'`;
      }
      
      this.db.get(
        `SELECT COALESCE(SUM(value), 0) as total
         FROM expenses 
         WHERE user_id = ? AND category = ? ${dateFilter}`,
        [userId, category],
        (err, row) => {
          if (err) {
            console.error('❌ Erro ao calcular gastos da categoria:', err);
            reject(err);
          } else {
            resolve(row?.total || 0);
          }
        }
      );
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('❌ Erro ao fechar banco de dados:', err);
      } else {
        console.log('💾 Banco de dados fechado');
      }
    });
  }
}

export default Database;