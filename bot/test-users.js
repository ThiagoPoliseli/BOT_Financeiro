import UserManager from "./userManager.js";
import Database from "./database.js";

console.log("🧪 TESTE DO SISTEMA MULTI-USUÁRIO");
console.log("=================================");

const db = new Database();
const userManager = new UserManager(db);

// Simular usuários
const users = [
  "5544997209675@s.whatsapp.net",
  "5511888888888@s.whatsapp.net",
  "5511777777777@s.whatsapp.net",
];

console.log("\n📱 Simulando atividade de usuários...");

// Simular atividades
users.forEach((userId, index) => {
  // Registrar mensagens
  for (let i = 0; i < (index + 1) * 5; i++) {
    userManager.registerUserActivity(userId, "message");
  }

  // Registrar gastos
  for (let i = 0; i < (index + 1) * 3; i++) {
    userManager.registerUserActivity(userId, "expense");
  }

  console.log(
    `✅ Usuário ${index + 1}: ${userId.replace("@s.whatsapp.net", "")}`
  );
});

console.log("\n📊 Estatísticas gerais:");
const stats = userManager.getAllUsersStats();
console.log(stats);

console.log("\n👥 Usuários ativos (24h):");
const activeUsers = userManager.getRecentActiveUsers(24);
activeUsers.forEach((user) => {
  console.log(
    `📱 ${user.phoneNumber}: ${user.messageCount} msgs, ${user.expenseCount} gastos`
  );
});

console.log("\n📋 Relatório completo:");
console.log(userManager.generateUsersReport());

console.log("\n🎉 Teste concluído!");

// Fechar banco
setTimeout(() => {
  db.close();
  process.exit(0);
}, 1000);
