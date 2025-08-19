import MessageParser from './messageParser.js';

console.log('🧪 TESTE COMPLETO DO SISTEMA DE CATEGORIAS');
console.log('==========================================');

const parser = new MessageParser();

// Testar o parser
parser.test();

console.log('\n🎯 TESTE DE CATEGORIAS ESPECÍFICAS:');
console.log('===================================');

const specificTests = [
  "conta de luz 150",
  "conta de água 85", 
  "conta de gás 45",
  "netflix 30",
  "spotify 20",
  "uber 25",
  "gasolina 90",
  "mercado 120",
  "farmácia 35",
  "academia 80",
  "almoço 45",
  "cinema 28"
];

specificTests.forEach(test => {
  const result = parser.parseExpenseMessage(test);
  if (result) {
    console.log(`✅ "${test}"`);
    console.log(`   → ${result.category} → ${result.subcategory}`);
    console.log(`   → R$ ${result.value} - ${result.description}\n`);
  } else {
    console.log(`❌ "${test}" - Não reconhecido\n`);
  }
});

console.log('🎉 Teste concluído!');