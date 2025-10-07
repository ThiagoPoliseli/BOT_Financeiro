import {
  default as makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import Database from "./database.js";
import ReportGenerator from "./reportGenerator.js";
import MessageParser from "./messageParser.js";
import UserManager from "./userManager.js";

class WhatsAppExpenseBot {
  constructor() {
    this.db = new Database();
    this.reportGenerator = new ReportGenerator(this.db);
    this.messageParser = new MessageParser();
    this.userManager = new UserManager(this.db);
    this.sock = null;
    this.isConnected = false;

    // Limpeza automática de usuários inativos (a cada 6 horas)
    setInterval(() => {
      this.userManager.cleanupInactiveUsers();
    }, 6 * 60 * 60 * 1000);
  }

  async start() {
    console.log("🚀 Iniciando WhatsApp Expense Bot...");

    try {
      const { state, saveCreds } = await useMultiFileAuthState(
        "./auth_info_baileys"
      );

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: {
          level: "silent",
          child: () => ({ level: "silent" }),
        },
      });

      this.sock.ev.on("creds.update", saveCreds);
      this.sock.ev.on(
        "connection.update",
        this.handleConnectionUpdate.bind(this)
      );
      this.sock.ev.on("messages.new", this.handleNewMessages.bind(this));

      console.log("✅ Bot configurado! Aguardando conexão...");
    } catch (error) {
      console.error("❌ Erro ao iniciar bot:", error);
    }
  }

  handleConnectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 Escaneie o QR Code com seu WhatsApp:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error instanceof Boom
          ? lastDisconnect.error.output.statusCode !==
            DisconnectReason.loggedOut
          : true;

      console.log("🔌 Conexão fechada devido a:", lastDisconnect?.error);

      if (shouldReconnect) {
        console.log("🔄 Reconectando...");
        this.start();
      }

      this.isConnected = false;
    } else if (connection === "open") {
      console.log("✅ Bot conectado ao WhatsApp!");
      this.isConnected = true;
      this.sendWelcomeMessage();
    }
  }

  async sendWelcomeMessage() {
    // Enviar mensagem de boas-vindas para o próprio número
    const welcomeText = `
🤖 *WhatsApp Expense Tracker Pro* ativado!

✅ Bot conectado e funcionando
📊 Sistema de relatórios ativo
💰 Pronto para registrar seus gastos

*Como usar:*
• Envie: "50 almoço" para registrar gastos
• Use /ajuda para ver todos os comandos
• Use /relatorio para ver resumo completo

🚀 Comece agora mesmo registrando um gasto!
    `.trim();

    try {
      // Aqui você pode enviar para seu próprio número ou grupo específico
      // await this.sock.sendMessage('SEU_NUMERO@s.whatsapp.net', { text: welcomeText });
      console.log("📢 Mensagem de boas-vindas preparada");
    } catch (error) {
      console.error("❌ Erro ao enviar mensagem de boas-vindas:", error);
    }
  }

  async handleNewMessages(messages) {
    for (const message of messages) {
      if (!message.message || message.key.fromMe) continue;

      const text = this.extractMessageText(message);
      const sender = message.key.remoteJid;
      const senderName = message.pushName || "Usuário";

      // Registrar atividade do usuário
      this.userManager.registerUserActivity(sender, "message");

      // Verificar se é usuário novo
      if (this.userManager.isNewUser(sender)) {
        await this.sendMessage(
          sender,
          this.userManager.getWelcomeMessage(sender)
        );
      }

      console.log(`📨 Nova mensagem de ${senderName}: ${text}`);

      try {
        if (text.startsWith("/")) {
          await this.handleCommand(sender, text, senderName);
        } else {
          await this.handleExpenseMessage(sender, text, senderName);
        }
      } catch (error) {
        console.error("❌ Erro ao processar mensagem:", error);
        await this.sendMessage(
          sender,
          "❌ Ocorreu um erro ao processar sua mensagem. Tente novamente."
        );
      }
    }
  }

  extractMessageText(message) {
    return (
      message.message.conversation ||
      message.message.extendedTextMessage?.text ||
      message.message.imageMessage?.caption ||
      ""
    );
  }

  async handleExpenseMessage(sender, text, senderName) {
    const parsed = this.messageParser.parseExpenseMessage(text);

    if (parsed) {
      const expenseId = await this.db.addExpense(
        sender,
        parsed.value,
        parsed.description,
        parsed.category
      );

      // Registrar atividade de gasto
      this.userManager.registerUserActivity(sender, "expense");

      const confirmationText = `
✅ *Gasto registrado com sucesso!*

💰 Valor: R$ ${parsed.value.toFixed(2)}
📝 Descrição: ${parsed.description}
🏷️ Categoria: ${parsed.category}
📅 Data: ${new Date().toLocaleDateString("pt-BR")}
🆔 ID: #${expenseId}

💡 *Comandos úteis:*
• /recentes - Ver últimos gastos
• /deletar ${expenseId} - Deletar este gasto
• /relatorio - Ver resumo completo

_Use /relatorio para ver o resumo completo_
      `.trim();

      await this.sendMessage(sender, confirmationText);

      // Log para controle
      console.log(
        `💰 Gasto registrado: ${senderName} - R$ ${parsed.value} - ${parsed.description}`
      );
    } else {
      const helpText = `
❌ *Formato de mensagem inválido*

*Exemplos corretos:*
• "50 almoço"
• "R$ 120,50 mercado alimentação"
• "gasolina 85 transporte"
• "25.90 café"

*Categorias disponíveis:*
alimentação, transporte, casa, saúde, lazer, outros

_Use /ajuda para ver todos os comandos_
      `.trim();

      await this.sendMessage(sender, helpText);
    }
  }

  async handleCommand(sender, command, senderName) {
    const cmd = command.toLowerCase().split(" ")[0];
    const args = command.split(" ").slice(1);

    console.log(`⚡ Comando executado: ${cmd} por ${senderName}`);

    switch (cmd) {
      case "/relatorio":
        await this.sendReport(sender, "all");
        break;

      case "/hoje":
        await this.sendReport(sender, "today");
        break;

      case "/semana":
        await this.sendReport(sender, "week");
        break;

      case "/mes":
        await this.sendReport(sender, "month");
        break;

      case "/categorias":
        await this.sendCategoriesReport(sender);
        break;

      case "/backup":
        await this.sendBackup(sender);
        break;

      case "/meta":
        await this.handleBudgetCommand(sender, command);
        break;

      case "/deletar":
        await this.handleDeleteCommand(sender, command);
        break;

      case "/editar":
        await this.handleEditCommand(sender, args);
        break;

      case "/buscar":
        await this.handleSearchCommand(sender, args);
        break;

      case "/recentes":
        await this.sendRecentExpenses(sender);
        break;

      case "/perfil":
        await this.sendUserProfile(sender);
        break;

      case "/limpar":
        await this.handleClearCommand(sender, args);
        break;

      case "/ajuda":
        await this.sendHelp(sender);
        break;

      case "/status":
        await this.sendStatus(sender);
        break;

      case "/admin":
        await this.handleAdminCommand(sender, args);
        break;

      default:
        await this.sendMessage(
          sender,
          "❌ Comando não reconhecido. Use /ajuda para ver os comandos disponíveis."
        );
    }
  }

  async handleDeleteCommand(sender, command) {
    const args = command.split(" ").slice(1);

    if (args.length === 0) {
      // Mostrar gastos recentes para deletar
      const recentExpenses = await this.db.getRecentExpenses(sender, 10);

      if (recentExpenses.length === 0) {
        await this.sendMessage(
          sender,
          "📝 Nenhum gasto encontrado para deletar."
        );
        return;
      }

      let message = `🗑️ *DELETAR GASTOS*\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `*Seus últimos gastos:*\n\n`;

      recentExpenses.forEach((expense) => {
        const date = new Date(expense.date).toLocaleDateString("pt-BR");
        const icon = this.getCategoryIcon(expense.category);
        message += `${icon} *#${expense.id}* - R$ ${expense.value.toFixed(
          2
        )}\n`;
        message += `   📝 ${expense.description}\n`;
        message += `   📅 ${date} • 🏷️ ${expense.category}\n\n`;
      });

      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `*Para deletar:* /deletar [ID]\n`;
      message += `*Exemplo:* /deletar ${recentExpenses[0].id}`;

      await this.sendMessage(sender, message);
      return;
    }

    const expenseId = args[0];

    try {
      // Verificar se o gasto existe
      const expense = await this.db.getExpenseById(sender, expenseId);

      if (!expense) {
        await this.sendMessage(
          sender,
          `❌ Gasto #${expenseId} não encontrado.\n\nUse /deletar para ver seus gastos recentes.`
        );
        return;
      }

      // Deletar o gasto
      const deleted = await this.db.deleteExpense(sender, expenseId);

      if (deleted) {
        const confirmMessage = `
✅ *Gasto deletado com sucesso!*

🗑️ *Gasto removido:*
   • ID: #${expense.id}
   • Valor: R$ ${expense.value.toFixed(2)}
   • Descrição: ${expense.description}
   • Categoria: ${expense.category}
   • Data: ${new Date(expense.date).toLocaleDateString("pt-BR")}

_Use /relatorio para ver o resumo atualizado_
        `.trim();

        await this.sendMessage(sender, confirmMessage);
      } else {
        await this.sendMessage(
          sender,
          "❌ Erro ao deletar o gasto. Tente novamente."
        );
      }
    } catch (error) {
      console.error("❌ Erro ao deletar gasto:", error);
      await this.sendMessage(
        sender,
        "❌ Erro interno ao deletar gasto. Tente novamente."
      );
    }
  }

  async handleEditCommand(sender, args) {
    if (args.length < 2) {
      await this.sendMessage(
        sender,
        `
✏️ *EDITAR GASTO*
━━━━━━━━━━━━━━━━━━━━━━

*Formato:* /editar [ID] [novo_valor] [nova_descrição] [categoria]

*Exemplos:*
• /editar 123 75 almoço alimentação
• /editar 456 R$ 120,50 mercado

_Use /recentes para ver os IDs dos seus gastos_
      `.trim()
      );
      return;
    }

    const expenseId = args[0];
    const restArgs = args.slice(1).join(" ");

    try {
      // Verificar se o gasto existe
      const expense = await this.db.getExpenseById(sender, expenseId);

      if (!expense) {
        await this.sendMessage(
          sender,
          `❌ Gasto #${expenseId} não encontrado.\n\nUse /recentes para ver seus gastos.`
        );
        return;
      }

      // Parsear nova informação
      const parsed = this.messageParser.parseExpenseMessage(restArgs);

      if (!parsed) {
        await this.sendMessage(
          sender,
          `❌ Formato inválido.\n\n*Use:* /editar ${expenseId} [valor] [descrição] [categoria]`
        );
        return;
      }

      // Atualizar o gasto
      const updated = await this.db.updateExpense(
        sender,
        expenseId,
        parsed.value,
        parsed.description,
        parsed.category
      );

      if (updated) {
        const confirmMessage = `
✅ *Gasto editado com sucesso!*

📝 *Antes:*
   • R$ ${expense.value.toFixed(2)} - ${expense.description}
   • Categoria: ${expense.category}

✨ *Depois:*
   • R$ ${parsed.value.toFixed(2)} - ${parsed.description}
   • Categoria: ${parsed.category}

_Use /relatorio para ver o resumo atualizado_
        `.trim();

        await this.sendMessage(sender, confirmMessage);
      } else {
        await this.sendMessage(
          sender,
          "❌ Erro ao editar o gasto. Tente novamente."
        );
      }
    } catch (error) {
      console.error("❌ Erro ao editar gasto:", error);
      await this.sendMessage(
        sender,
        "❌ Erro interno ao editar gasto. Tente novamente."
      );
    }
  }

  async handleSearchCommand(sender, args) {
    if (args.length === 0) {
      await this.sendMessage(
        sender,
        `
🔍 *BUSCAR GASTOS*
━━━━━━━━━━━━━━━━━━━━━━

*Formato:* /buscar [termo]

*Exemplos:*
• /buscar almoço
• /buscar 50
• /buscar alimentação
• /buscar mercado

_Busca por descrição, valor ou categoria_
      `.trim()
      );
      return;
    }

    const searchTerm = args.join(" ");

    try {
      const results = await this.db.searchExpenses(sender, searchTerm);

      if (results.length === 0) {
        await this.sendMessage(
          sender,
          `🔍 Nenhum resultado encontrado para: "${searchTerm}"\n\n_Tente outros termos de busca_`
        );
        return;
      }

      let message = `🔍 *RESULTADOS DA BUSCA*\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `*Termo:* "${searchTerm}"\n`;
      message += `*Encontrados:* ${results.length} gastos\n\n`;

      results.forEach((expense) => {
        const date = new Date(expense.date).toLocaleDateString("pt-BR");
        const icon = this.getCategoryIcon(expense.category);
        message += `${icon} *#${expense.id}* - R$ ${expense.value.toFixed(
          2
        )}\n`;
        message += `   📝 ${expense.description}\n`;
        message += `   📅 ${date} • 🏷️ ${expense.category}\n\n`;
      });

      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `*Comandos úteis:*\n`;
      message += `• /deletar [ID] - Deletar gasto\n`;
      message += `• /editar [ID] - Editar gasto`;

      await this.sendMessage(sender, message);
    } catch (error) {
      console.error("❌ Erro ao buscar gastos:", error);
      await this.sendMessage(
        sender,
        "❌ Erro ao realizar busca. Tente novamente."
      );
    }
  }

  async sendRecentExpenses(sender) {
    try {
      const recentExpenses = await this.db.getRecentExpenses(sender, 10);

      if (recentExpenses.length === 0) {
        await this.sendMessage(
          sender,
          "📝 Nenhum gasto registrado ainda.\n\n_Comece registrando um gasto!_"
        );
        return;
      }

      let message = `📋 *GASTOS RECENTES*\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      recentExpenses.forEach((expense, index) => {
        const date = new Date(expense.date).toLocaleDateString("pt-BR");
        const icon = this.getCategoryIcon(expense.category);
        message += `${index + 1}. ${icon} *#${
          expense.id
        }* - R$ ${expense.value.toFixed(2)}\n`;
        message += `   📝 ${expense.description}\n`;
        message += `   📅 ${date} • 🏷️ ${expense.category}\n\n`;
      });

      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `*Comandos úteis:*\n`;
      message += `• /deletar [ID] - Deletar gasto\n`;
      message += `• /editar [ID] - Editar gasto\n`;
      message += `• /buscar [termo] - Buscar gastos`;

      await this.sendMessage(sender, message);
    } catch (error) {
      console.error("❌ Erro ao buscar gastos recentes:", error);
      await this.sendMessage(sender, "❌ Erro ao buscar gastos recentes.");
    }
  }

  async sendUserProfile(sender) {
    try {
      const profile = await this.db.getUserProfile(sender);
      const stats = await this.db.getUserStats(sender);

      // Extrair número do WhatsApp para exibição
      const phoneNumber = sender.replace("@s.whatsapp.net", "");
      const formattedPhone = phoneNumber.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3"
      );

      const profileMessage = `
👤 *SEU PERFIL*
━━━━━━━━━━━━━━━━━━━━━━

📱 *Usuário:* ${formattedPhone}
🌍 *Timezone:* ${profile.timezone}
💰 *Moeda:* ${profile.currency}
🔔 *Notificações:* ${profile.notifications ? "Ativadas" : "Desativadas"}

📊 *SUAS ESTATÍSTICAS:*
• Total de gastos: ${stats.totalExpenses}
• Valor total: R$ ${stats.totalValue.toFixed(2)}
• Média por gasto: R$ ${stats.averageValue.toFixed(2)}
• Primeiro gasto: ${stats.firstExpense || "N/A"}
• Último gasto: ${stats.lastExpense || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━
📅 Membro desde: ${new Date(
        profile.created_at || Date.now()
      ).toLocaleDateString("pt-BR")}
      `.trim();

      await this.sendMessage(sender, profileMessage);
    } catch (error) {
      console.error("❌ Erro ao buscar perfil:", error);
      await this.sendMessage(sender, "❌ Erro ao carregar perfil do usuário.");
    }
  }

  async handleClearCommand(sender, args) {
    if (args.length === 0) {
      await this.sendMessage(
        sender,
        `
🗑️ *LIMPAR DADOS*
━━━━━━━━━━━━━━━━━━━━━━

⚠️ *ATENÇÃO: Esta ação é irreversível!*

*Opções disponíveis:*
• /limpar hoje - Limpar gastos de hoje
• /limpar semana - Limpar gastos da semana
• /limpar mes - Limpar gastos do mês
• /limpar tudo - Limpar TODOS os gastos

*Para confirmar, digite exatamente:*
/limpar [período] CONFIRMAR

*Exemplo:* /limpar hoje CONFIRMAR
      `.trim()
      );
      return;
    }

    const period = args[0];
    const confirmation = args[1];

    if (confirmation !== "CONFIRMAR") {
      await this.sendMessage(
        sender,
        "❌ Para confirmar a limpeza, adicione CONFIRMAR ao final do comando.\n\n*Exemplo:* /limpar hoje CONFIRMAR"
      );
      return;
    }

    try {
      let deletedCount = 0;
      const expenses = await this.db.getExpenses(sender, period);

      for (const expense of expenses) {
        const deleted = await this.db.deleteExpense(sender, expense.id);
        if (deleted) deletedCount++;
      }

      const periodLabel =
        {
          hoje: "de hoje",
          semana: "da semana",
          mes: "do mês",
          tudo: "todos",
        }[period] || period;

      await this.sendMessage(
        sender,
        `
✅ *Limpeza concluída!*

🗑️ *Gastos removidos:* ${deletedCount}
📅 *Período:* ${periodLabel}

_Use /relatorio para ver o resumo atualizado_
      `.trim()
      );
    } catch (error) {
      console.error("❌ Erro ao limpar dados:", error);
      await this.sendMessage(
        sender,
        "❌ Erro ao limpar dados. Tente novamente."
      );
    }
  }

  async sendReport(sender, period) {
    try {
      const report = await this.reportGenerator.generateTextReport(
        sender,
        period
      );
      await this.sendMessage(sender, report);

      // Opcionalmente, enviar gráfico
      const chartPath = await this.reportGenerator.generateChart(
        sender,
        period
      );
      if (chartPath) {
        await this.sendImage(sender, chartPath, "Gráfico de gastos");
      }
    } catch (error) {
      console.error("❌ Erro ao gerar relatório:", error);
      await this.sendMessage(
        sender,
        "❌ Erro ao gerar relatório. Tente novamente."
      );
    }
  }

  async sendCategoriesReport(sender) {
    try {
      const categories = await this.db.getCategoriesReport(sender);

      let report = `📊 *RELATÓRIO POR CATEGORIAS*\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      if (categories.length === 0) {
        report += "📝 Nenhum gasto registrado ainda.\n\n";
        report += "_Comece registrando um gasto!_";
      } else {
        const total = categories.reduce((sum, cat) => sum + cat.total, 0);

        categories.forEach((cat) => {
          const percentage = ((cat.total / total) * 100).toFixed(1);
          const icon = this.getCategoryIcon(cat.category);
          report += `${icon} *${cat.category.toUpperCase()}*\n`;
          report += `   💰 R$ ${cat.total.toFixed(2)} (${percentage}%)\n`;
          report += `   📊 ${cat.count} gastos\n\n`;
        });

        report += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        report += `💰 *TOTAL GERAL: R$ ${total.toFixed(2)}*`;
      }

      await this.sendMessage(sender, report);
    } catch (error) {
      console.error("❌ Erro ao gerar relatório de categorias:", error);
      await this.sendMessage(
        sender,
        "❌ Erro ao gerar relatório de categorias."
      );
    }
  }

  async sendBackup(sender) {
    try {
      const backup = await this.db.exportUserData(sender);
      const backupText = `
📦 *BACKUP DOS SEUS DADOS*
━━━━━━━━━━━━━━━━━━━━━━

${JSON.stringify(backup, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━
📅 Gerado em: ${new Date().toLocaleString("pt-BR")}
💾 Total de gastos: ${backup.expenses.length}
      `.trim();

      await this.sendMessage(sender, backupText);
    } catch (error) {
      console.error("❌ Erro ao gerar backup:", error);
      await this.sendMessage(sender, "❌ Erro ao gerar backup dos dados.");
    }
  }

  async sendHelp(sender) {
    const helpText = `
🤖 *WHATSAPP EXPENSE TRACKER PRO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 *REGISTRAR GASTOS:*
• "50 almoço" 
• "R$ 120,50 mercado alimentação"
• "gasolina 85 transporte"
• "conta de luz 150 casa"

🏷️ *CATEGORIAS:*
🍽️ alimentação | 🚗 transporte | 🏠 casa
⚕️ saúde | 🎮 lazer | 📦 outros

📊 *RELATÓRIOS:*
• /relatorio - Relatório completo
• /hoje - Gastos de hoje
• /semana - Gastos da semana
• /mes - Gastos do mês
• /categorias - Análise por categoria

🔧 *GERENCIAR GASTOS:*
• /recentes - Ver últimos gastos
• /buscar [termo] - Buscar gastos
• /deletar [ID] - Deletar gasto
• /editar [ID] - Editar gasto
• /limpar [período] - Limpar dados

👤 *PERFIL:*
• /perfil - Ver seu perfil
• /status - Status do sistema

⚙️ *CONTROLE:*
• /backup - Backup dos dados
• /meta [valor] - Definir meta mensal

❓ *AJUDA:*
• /ajuda - Esta mensagem

💡 *DICAS RÁPIDAS:*
• Use /recentes para ver IDs dos gastos
• Use /buscar para encontrar gastos específicos
• Cada usuário tem seus dados separados
• Backup automático de segurança ativo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 *Desenvolvido para facilitar seu controle financeiro!*
    `.trim();

    await this.sendMessage(sender, helpText);
  }

  async sendStatus(sender) {
    try {
      const stats = await this.db.getUserStats(sender);
      const userInfo = this.userManager.getUserInfo(sender);
      const uptime = process.uptime();
      const uptimeHours = Math.floor(uptime / 3600);
      const uptimeMinutes = Math.floor((uptime % 3600) / 60);

      const statusText = `
🤖 *STATUS DO SISTEMA*
━━━━━━━━━━━━━━━━━━━━━━

✅ *Bot Status:* Online
⏱️ *Uptime:* ${uptimeHours}h ${uptimeMinutes}m

👤 *Seu perfil:*
   • Mensagens enviadas: ${userInfo?.messageCount || 0}
   • Gastos registrados: ${userInfo?.expenseCount || 0}
   • Membro desde: ${
     userInfo
       ? new Date(userInfo.firstSeen).toLocaleDateString("pt-BR")
       : "Hoje"
   }

📊 *Seus dados:*
   • Total de gastos: ${stats.totalExpenses}
   • Valor total: R$ ${stats.totalValue.toFixed(2)}
   • Primeira transação: ${stats.firstExpense || "N/A"}
   • Última transação: ${stats.lastExpense || "N/A"}

💾 *Sistema:*
   • Banco de dados: ✅ Conectado
   • Backup automático: ✅ Ativo
   • Relatórios: ✅ Funcionando
   • Multi-usuário: ✅ Ativo

━━━━━━━━━━━━━━━━━━━━━━
🔄 Última atualização: ${new Date().toLocaleString("pt-BR")}
      `.trim();

      await this.sendMessage(sender, statusText);
    } catch (error) {
      console.error("❌ Erro ao obter status:", error);
      await this.sendMessage(sender, "❌ Erro ao obter status do sistema.");
    }
  }

  async handleAdminCommand(sender, args) {
    // Verificar se é admin (você pode definir números específicos)
    const adminNumbers = ["5511999999999@s.whatsapp.net"]; // Substitua pelo seu número

    if (!adminNumbers.includes(sender)) {
      await this.sendMessage(
        sender,
        "❌ Comando disponível apenas para administradores."
      );
      return;
    }

    if (args.length === 0 || args[0] === "users") {
      const usersReport = this.userManager.generateUsersReport();
      await this.sendMessage(sender, usersReport);
    } else if (args[0] === "cleanup") {
      const cleanedCount = this.userManager.cleanupInactiveUsers();
      await this.sendMessage(
        sender,
        `🧹 Limpeza concluída: ${cleanedCount} usuários inativos removidos.`
      );
    } else {
      await this.sendMessage(
        sender,
        `
🔧 *COMANDOS ADMIN*
━━━━━━━━━━━━━━━━━━━━━━

• /admin users - Relatório de usuários
• /admin cleanup - Limpar usuários inativos
      `.trim()
      );
    }
  }

  getCategoryIcon(category) {
    const icons = {
      alimentação: "🍽️",
      transporte: "🚗",
      casa: "🏠",
      saúde: "⚕️",
      lazer: "🎮",
      outros: "📦",
    };
    return icons[category] || "📦";
  }

  async sendMessage(to, text) {
    try {
      await this.sock.sendMessage(to, { text });
    } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error);
    }
  }

  async sendImage(to, imagePath, caption) {
    try {
      await this.sock.sendMessage(to, {
        image: { url: imagePath },
        caption,
      });
    } catch (error) {
      console.error("❌ Erro ao enviar imagem:", error);
    }
  }
}

// Inicializar o bot
const bot = new WhatsAppExpenseBot();
bot.start().catch(console.error);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Encerrando bot...");
  process.exit(0);
});

export default WhatsAppExpenseBot;
