import moment from 'moment';
import fs from 'fs';
import path from 'path';

class ReportGenerator {
  constructor(database) {
    this.db = database;
    moment.locale('pt-br');
  }

  async generateTextReport(userId, period = 'all') {
    try {
      const expenses = await this.db.getExpenses(userId, period);
      const categories = await this.db.getCategoriesReport(userId, period);
      
      if (expenses.length === 0) {
        return this.generateEmptyReport(period);
      }

      const total = expenses.reduce((sum, exp) => sum + exp.value, 0);
      const average = total / expenses.length;
      
      let report = `📊 *RELATÓRIO DE GASTOS*\n`;
      report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      
      // Cabeçalho com período
      report += `📅 *Período:* ${this.getPeriodLabel(period)}\n`;
      report += `📈 *Gerado em:* ${moment().format('DD/MM/YYYY HH:mm')}\n\n`;
      
      // Resumo financeiro
      report += `💰 *RESUMO FINANCEIRO*\n`;
      report += `• Total gasto: *R$ ${total.toFixed(2)}*\n`;
      report += `• Quantidade: *${expenses.length} gastos*\n`;
      report += `• Média por gasto: *R$ ${average.toFixed(2)}*\n`;
      report += `• Maior gasto: *R$ ${Math.max(...expenses.map(e => e.value)).toFixed(2)}*\n`;
      report += `• Menor gasto: *R$ ${Math.min(...expenses.map(e => e.value)).toFixed(2)}*\n\n`;
      
      // Análise por categorias
      if (categories.length > 0) {
        report += `📊 *GASTOS POR CATEGORIA*\n`;
        categories.forEach(cat => {
          const percentage = ((cat.total / total) * 100).toFixed(1);
          const icon = this.getCategoryIcon(cat.category);
          report += `${icon} *${cat.category.toUpperCase()}*\n`;
          report += `   💰 R$ ${cat.total.toFixed(2)} (${percentage}%)\n`;
          report += `   📊 ${cat.count} gastos • Média: R$ ${cat.average.toFixed(2)}\n\n`;
        });
      }
      
      // Detalhes dos gastos (últimos 10 se for muitos)
      const displayExpenses = expenses.slice(0, 10);
      report += `📝 *DETALHES DOS GASTOS*\n`;
      if (expenses.length > 10) {
        report += `_(Mostrando os 10 mais recentes de ${expenses.length})_\n\n`;
      }
      
      displayExpenses.forEach((expense, index) => {
        const date = moment(expense.date).format('DD/MM');
        const icon = this.getCategoryIcon(expense.category);
        report += `${index + 1}. ${icon} *R$ ${expense.value.toFixed(2)}* - ${expense.description}\n`;
        report += `   📅 ${date} • 🏷️ ${expense.category} • 🆔 #${expense.id}\n\n`;
      });
      
      // Rodapé
      report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      report += `🤖 *WhatsApp Expense Tracker Pro*\n`;
      report += `💡 Use /ajuda para ver todos os comandos`;
      
      return report;
      
    } catch (error) {
      console.error('❌ Erro ao gerar relatório:', error);
      return '❌ Erro ao gerar relatório. Tente novamente.';
    }
  }

  generateEmptyReport(period) {
    return `
📊 *RELATÓRIO DE GASTOS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 *Período:* ${this.getPeriodLabel(period)}
📈 *Gerado em:* ${moment().format('DD/MM/YYYY HH:mm')}

📝 *Nenhum gasto registrado para este período.*

💡 *Como registrar gastos:*
• "50 almoço"
• "R$ 120,50 mercado alimentação"
• "gasolina 85 transporte"

🏷️ *Categorias disponíveis:*
🍽️ alimentação | 🚗 transporte | 🏠 casa
⚕️ saúde | 🎮 lazer | 📦 outros

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use /ajuda para ver todos os comandos
    `.trim();
  }

  async generateChart(userId, period = 'all') {
    try {
      // Esta função geraria um gráfico usando Chart.js
      // Por simplicidade, retornamos null por enquanto
      // Em uma implementação completa, você usaria chartjs-node-canvas
      return null;
    } catch (error) {
      console.error('❌ Erro ao gerar gráfico:', error);
      return null;
    }
  }

  async generatePDFReport(userId, period = 'all') {
    try {
      // Esta função geraria um PDF usando PDFKit
      // Por simplicidade, retornamos null por enquanto
      return null;
    } catch (error) {
      console.error('❌ Erro ao gerar PDF:', error);
      return null;
    }
  }

  getPeriodLabel(period) {
    const labels = {
      'all': 'Todos os gastos',
      'today': 'Hoje',
      'week': 'Últimos 7 dias',
      'month': 'Este mês',
      'year': 'Este ano'
    };
    return labels[period] || 'Período personalizado';
  }

  getCategoryIcon(category) {
    const icons = {
      'alimentação': '🍽️',
      'transporte': '🚗',
      'casa': '🏠',
      'saúde': '⚕️',
      'lazer': '🎮',
      'outros': '📦'
    };
    return icons[category] || '📦';
  }

  // Método para gerar insights automáticos
  async generateInsights(userId, period = 'month') {
    try {
      const expenses = await this.db.getExpenses(userId, period);
      const categories = await this.db.getCategoriesReport(userId, period);
      
      if (expenses.length === 0) {
        return null;
      }

      const total = expenses.reduce((sum, exp) => sum + exp.value, 0);
      const insights = [];

      // Categoria que mais gasta
      if (categories.length > 0) {
        const topCategory = categories[0];
        insights.push(`💡 Você gasta mais com *${topCategory.category}* (${((topCategory.total / total) * 100).toFixed(1)}% do total)`);
      }

      // Análise de frequência
      const dailyAverage = total / 30; // Assumindo mês de 30 dias
      insights.push(`📊 Sua média diária é de *R$ ${dailyAverage.toFixed(2)}*`);

      // Comparação com período anterior
      const previousPeriod = await this.db.getExpenses(userId, this.getPreviousPeriod(period));
      if (previousPeriod.length > 0) {
        const previousTotal = previousPeriod.reduce((sum, exp) => sum + exp.value, 0);
        const difference = total - previousTotal;
        const percentChange = ((difference / previousTotal) * 100).toFixed(1);
        
        if (difference > 0) {
          insights.push(`📈 Você gastou *R$ ${difference.toFixed(2)}* a mais que o período anterior (+${percentChange}%)`);
        } else {
          insights.push(`📉 Você economizou *R$ ${Math.abs(difference).toFixed(2)}* comparado ao período anterior (-${Math.abs(parseFloat(percentChange))}%)`);
        }
      }

      return insights.join('\n');
      
    } catch (error) {
      console.error('❌ Erro ao gerar insights:', error);
      return null;
    }
  }

  getPreviousPeriod(period) {
    // Lógica para determinar o período anterior
    // Por simplicidade, retornamos o mesmo período
    return period;
  }
}

export default ReportGenerator;