class UserManager {
  constructor(database) {
    this.db = database;
    this.activeUsers = new Map(); // Cache de usuários ativos
    this.userSessions = new Map(); // Sessões de usuário
  }

  // Registrar atividade do usuário
  registerUserActivity(userId, activity = 'message') {
    const now = Date.now();
    const userInfo = this.activeUsers.get(userId) || {
      firstSeen: now,
      lastActivity: now,
      messageCount: 0,
      expenseCount: 0
    };

    userInfo.lastActivity = now;
    userInfo.messageCount++;
    
    if (activity === 'expense') {
      userInfo.expenseCount++;
    }

    this.activeUsers.set(userId, userInfo);
    
    // Log da atividade
    const phoneNumber = userId.replace('@s.whatsapp.net', '');
    console.log(`👤 Usuário ativo: ${phoneNumber} - ${activity}`);
  }

  // Obter informações do usuário
  getUserInfo(userId) {
    return this.activeUsers.get(userId) || null;
  }

  // Obter estatísticas de todos os usuários
  getAllUsersStats() {
    const stats = {
      totalUsers: this.activeUsers.size,
      activeToday: 0,
      totalMessages: 0,
      totalExpenses: 0
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    this.activeUsers.forEach(userInfo => {
      stats.totalMessages += userInfo.messageCount;
      stats.totalExpenses += userInfo.expenseCount;
      
      if (userInfo.lastActivity >= todayTimestamp) {
        stats.activeToday++;
      }
    });

    return stats;
  }

  // Limpar usuários inativos (mais de 30 dias)
  cleanupInactiveUsers() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    let cleanedCount = 0;

    this.activeUsers.forEach((userInfo, userId) => {
      if (userInfo.lastActivity < thirtyDaysAgo) {
        this.activeUsers.delete(userId);
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      console.log(`🧹 Limpeza automática: ${cleanedCount} usuários inativos removidos`);
    }

    return cleanedCount;
  }

  // Obter usuários ativos recentemente
  getRecentActiveUsers(hours = 24) {
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    const activeUsers = [];

    this.activeUsers.forEach((userInfo, userId) => {
      if (userInfo.lastActivity >= cutoffTime) {
        activeUsers.push({
          userId,
          phoneNumber: userId.replace('@s.whatsapp.net', ''),
          ...userInfo
        });
      }
    });

    return activeUsers.sort((a, b) => b.lastActivity - a.lastActivity);
  }

  // Verificar se usuário é novo (primeiro uso)
  isNewUser(userId) {
    const userInfo = this.activeUsers.get(userId);
    return !userInfo || userInfo.messageCount <= 1;
  }

  // Obter relatório de usuários para admin
  generateUsersReport() {
    const stats = this.getAllUsersStats();
    const recentUsers = this.getRecentActiveUsers(24);

    let report = `👥 *RELATÓRIO DE USUÁRIOS*\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    report += `📊 *ESTATÍSTICAS GERAIS:*\n`;
    report += `• Total de usuários: ${stats.totalUsers}\n`;
    report += `• Ativos hoje: ${stats.activeToday}\n`;
    report += `• Total de mensagens: ${stats.totalMessages}\n`;
    report += `• Total de gastos: ${stats.totalExpenses}\n\n`;
    
    report += `🕐 *USUÁRIOS ATIVOS (24h):*\n`;
    if (recentUsers.length === 0) {
      report += `_Nenhum usuário ativo nas últimas 24h_\n\n`;
    } else {
      recentUsers.slice(0, 10).forEach((user, index) => {
        const lastActivity = new Date(user.lastActivity).toLocaleString('pt-BR');
        report += `${index + 1}. ${user.phoneNumber}\n`;
        report += `   📱 ${user.messageCount} msgs • 💰 ${user.expenseCount} gastos\n`;
        report += `   🕐 Última atividade: ${lastActivity}\n\n`;
      });
    }
    
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `📅 Gerado em: ${new Date().toLocaleString('pt-BR')}`;

    return report;
  }

  // Enviar mensagem de boas-vindas para novos usuários
  getWelcomeMessage(userId) {
    const phoneNumber = userId.replace('@s.whatsapp.net', '');
    
    return `
🎉 *BEM-VINDO AO EXPENSE TRACKER PRO!*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Olá! 👋 Seu controle financeiro pessoal está pronto!

📱 *Seu número:* ${phoneNumber}
🔒 *Dados privados:* Apenas você tem acesso
💾 *Backup automático:* Seus dados estão seguros

🚀 *PRIMEIROS PASSOS:*

1️⃣ *Registre um gasto:*
   • Digite: "50 almoço"
   • Ou: "conta de luz 150"

2️⃣ *Veja seus relatórios:*
   • Digite: /relatorio

3️⃣ *Explore os comandos:*
   • Digite: /ajuda

💡 *DICA:* O sistema detecta categorias automaticamente!
   • "uber" → transporte
   • "mercado" → alimentação  
   • "netflix" → lazer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 *Comece agora mesmo registrando seu primeiro gasto!*
    `.trim();
  }
}

export default UserManager;