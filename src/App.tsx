import React, { useState, useEffect } from 'react';
import { Send, DollarSign, Calendar, TrendingUp, FileText, Phone, MessageCircle, BarChart3, PieChart, Download, Settings, Users, Target } from 'lucide-react';

interface Expense {
  id: string;
  value: number;
  description: string;
  category: string;
  subcategory: string;
  date: string;
  timestamp: number;
}

interface Category {
  name: string;
  color: string;
  icon: string;
  total: number;
  subcategories?: { [key: string]: number };
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [botStatus, setBotStatus] = useState('disconnected');
  const [categories, setCategories] = useState<Category[]>([]);

  // Sistema de categorias e subcategorias mais específico
  const categorySystem = {
    'alimentação': {
      icon: '🍽️',
      color: '#10B981',
      subcategories: {
        'refeições': ['almoço', 'jantar', 'café da manhã', 'lanche', 'ceia'],
        'restaurantes': ['restaurante', 'lanchonete', 'pizzaria', 'hamburgueria', 'delivery', 'ifood', 'uber eats'],
        'mercado': ['mercado', 'supermercado', 'hipermercado', 'feira', 'açougue', 'padaria', 'compras'],
        'bebidas': ['bebida', 'cerveja', 'refrigerante', 'água', 'suco', 'café', 'chá'],
        'doces': ['doce', 'chocolate', 'sorvete', 'bolo', 'torta', 'açaí', 'sobremesa']
      }
    },
    'transporte': {
      icon: '🚗',
      color: '#3B82F6',
      subcategories: {
        'combustível': ['gasolina', 'álcool', 'diesel', 'combustível', 'posto', 'etanol'],
        'transporte público': ['ônibus', 'metro', 'trem', 'brt', 'passagem', 'bilhete único'],
        'aplicativos': ['uber', 'taxi', '99', 'cabify', 'pop'],
        'estacionamento': ['estacionamento', 'zona azul', 'valet', 'parking'],
        'manutenção': ['mecânico', 'oficina', 'pneu', 'óleo', 'revisão', 'lavagem'],
        'outros transportes': ['pedágio', 'viagem', 'avião', 'rodoviária', 'aeroporto']
      }
    },
    'casa': {
      icon: '🏠',
      color: '#8B5CF6',
      subcategories: {
        'contas básicas': ['luz', 'energia elétrica', 'água', 'esgoto', 'gás', 'conta de luz', 'conta de água', 'conta de gás'],
        'comunicação': ['internet', 'telefone', 'celular', 'tv a cabo', 'streaming', 'netflix', 'spotify'],
        'moradia': ['aluguel', 'condomínio', 'iptu', 'seguro residencial', 'financiamento'],
        'limpeza': ['limpeza', 'detergente', 'sabão', 'papel higiênico', 'produtos de limpeza'],
        'móveis e decoração': ['móvel', 'decoração', 'eletrodoméstico', 'utensílios', 'cama', 'mesa'],
        'manutenção': ['reforma', 'pintura', 'encanador', 'eletricista', 'conserto', 'ferramenta']
      }
    },
    'saúde': {
      icon: '⚕️',
      color: '#EF4444',
      subcategories: {
        'consultas': ['médico', 'consulta', 'dentista', 'psicólogo', 'fisioterapeuta', 'nutricionista'],
        'medicamentos': ['farmácia', 'remédio', 'medicamento', 'vitamina', 'suplemento'],
        'exames': ['exame', 'laboratório', 'raio x', 'ultrassom', 'ressonância'],
        'planos': ['plano de saúde', 'seguro saúde', 'convênio médico'],
        'emergência': ['hospital', 'pronto socorro', 'ambulância', 'emergência'],
        'bem-estar': ['academia', 'personal trainer', 'massagem', 'spa']
      }
    },
    'lazer': {
      icon: '🎮',
      color: '#F59E0B',
      subcategories: {
        'entretenimento': ['cinema', 'teatro', 'show', 'concerto', 'espetáculo'],
        'vida noturna': ['bar', 'balada', 'festa', 'pub', 'choperia'],
        'jogos': ['jogo', 'game', 'playstation', 'xbox', 'nintendo', 'steam'],
        'streaming': ['netflix', 'amazon prime', 'disney+', 'spotify', 'youtube premium'],
        'viagens': ['viagem', 'hotel', 'pousada', 'turismo', 'passeio'],
        'hobbies': ['hobby', 'livro', 'revista', 'curso', 'workshop']
      }
    },
    'educação': {
      icon: '📚',
      color: '#6366F1',
      subcategories: {
        'cursos': ['curso', 'faculdade', 'universidade', 'pós-graduação', 'mestrado'],
        'materiais': ['livro', 'apostila', 'material escolar', 'caderno', 'caneta'],
        'online': ['udemy', 'coursera', 'alura', 'curso online', 'ead'],
        'idiomas': ['inglês', 'espanhol', 'francês', 'alemão', 'idioma']
      }
    },
    'trabalho': {
      icon: '💼',
      color: '#059669',
      subcategories: {
        'equipamentos': ['notebook', 'computador', 'mouse', 'teclado', 'monitor'],
        'software': ['software', 'licença', 'adobe', 'microsoft office', 'antivírus'],
        'transporte trabalho': ['combustível trabalho', 'estacionamento trabalho', 'uber trabalho'],
        'alimentação trabalho': ['almoço trabalho', 'lanche trabalho', 'café trabalho']
      }
    },
    'vestuário': {
      icon: '👕',
      color: '#EC4899',
      subcategories: {
        'roupas': ['roupa', 'camisa', 'calça', 'vestido', 'saia', 'blusa'],
        'calçados': ['sapato', 'tênis', 'sandália', 'bota', 'chinelo'],
        'acessórios': ['bolsa', 'carteira', 'cinto', 'óculos', 'relógio', 'joia'],
        'cuidados': ['lavanderia', 'costureira', 'sapateiro']
      }
    },
    'outros': {
      icon: '📦',
      color: '#6B7280',
      subcategories: {
        'diversos': ['presente', 'doação', 'multa', 'taxa', 'imposto'],
        'emergência': ['emergência', 'imprevisto', 'urgência'],
        'investimentos': ['investimento', 'poupança', 'ação', 'fundo']
      }
    }
  };

  // Inicializar com array vazio - sem gastos de exemplo
  useEffect(() => {
    // Simular status do bot conectado
    setBotStatus('connected');
    
    // Não carregar gastos de exemplo - começar com lista vazia
    console.log('🤖 Bot iniciado com gastos zerados');
  }, []);

  // Calcular categorias
  useEffect(() => {
    const categoryMap = new Map();
    const subcategoryMap = new Map();
    const filteredExpenses = getFilteredExpenses();
    
    filteredExpenses.forEach(expense => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.value);
      
      // Rastrear subcategorias
      const subKey = `${expense.category}-${expense.subcategory}`;
      const subCurrent = subcategoryMap.get(subKey) || 0;
      subcategoryMap.set(subKey, subCurrent + expense.value);
    });

    const cats: Category[] = Array.from(categoryMap.entries()).map(([name, total]) => {
      const categoryInfo = categorySystem[name as keyof typeof categorySystem];
      
      // Calcular subcategorias para esta categoria
      const subcategories: { [key: string]: number } = {};
      subcategoryMap.forEach((value, key) => {
        if (key.startsWith(name + '-')) {
          const subName = key.replace(name + '-', '');
          subcategories[subName] = value;
        }
      });
      
      return {
        name,
        total,
        color: categoryInfo?.color || '#6B7280',
        icon: categoryInfo?.icon || '📦',
        subcategories
      };
    }).sort((a, b) => b.total - a.total);

    setCategories(cats);
  }, [expenses, selectedPeriod]);

  const parseMessage = (message: string): { value: number; description: string; category: string; subcategory: string } | null => {
    // Regex melhorado para extrair valor, descrição e categoria
    const patterns = [
      /(?:R\$\s*)?(\d+(?:[\.,]\d{2})?)\s+(.+?)\s+(alimentação|transporte|casa|saúde|lazer|educação|trabalho|vestuário|outros)/i,
      /(?:R\$\s*)?(\d+(?:[\.,]\d{2})?)\s+(.+)/i,
      /(.+?)\s+(?:R\$\s*)?(\d+(?:[\.,]\d{2})?)\s+(alimentação|transporte|casa|saúde|lazer|educação|trabalho|vestuário|outros)/i,
      /(.+?)\s+(?:R\$\s*)?(\d+(?:[\.,]\d{2})?)/i,
    ];

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      const match = message.match(pattern);
      if (match) {
        let value: number;
        let description: string;
        let category: string = 'outros';
        
        if (i === 0) { // "50 almoço alimentação"
          value = parseFloat(match[1].replace(',', '.'));
          description = match[2].trim();
          category = match[3].toLowerCase();
        } else if (i === 1) { // "50 almoço"
          value = parseFloat(match[1].replace(',', '.'));
          description = match[2].trim();
          // Auto-categorizar baseado na descrição
          const result = autoCategorizе(description);
          category = result.category;
        } else if (i === 2) { // "almoço 50 alimentação"
          description = match[1].trim();
          value = parseFloat(match[2].replace(',', '.'));
          category = match[3].toLowerCase();
        } else { // "almoço 50"
          description = match[1].trim();
          value = parseFloat(match[2].replace(',', '.'));
          const result = autoCategorizе(description);
          category = result.category;
        }
        
        if (!isNaN(value) && description) {
          const result = autoCategorizе(description);
          return { 
            value, 
            description, 
            category: category === 'outros' ? result.category : category,
            subcategory: result.subcategory
          };
        }
      }
    }
    return null;
  };

  const autoCategorizе = (description: string): { category: string; subcategory: string } => {
    const desc = description.toLowerCase();
    
    // Verificar cada categoria e subcategoria
    for (const [categoryName, categoryInfo] of Object.entries(categorySystem)) {
      for (const [subcategoryName, keywords] of Object.entries(categoryInfo.subcategories)) {
        for (const keyword of keywords) {
          if (desc.includes(keyword)) {
            return {
              category: categoryName,
              subcategory: subcategoryName
            };
          }
        }
      }
    }
    
    return {
      category: 'outros',
      subcategory: 'diversos'
    };
  };

  const addExpense = () => {
    const parsed = parseMessage(messageInput);
    if (parsed) {
      const newExpense: Expense = {
        id: Date.now().toString(),
        value: parsed.value,
        description: parsed.description,
        category: parsed.category,
        subcategory: parsed.subcategory,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now()
      };
      setExpenses(prev => [newExpense, ...prev]);
      setMessageInput('');
    }
  };

  const getFilteredExpenses = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (selectedPeriod) {
      case 'today':
        return expenses.filter(expense => 
          new Date(expense.date) >= today
        );
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return expenses.filter(expense => 
          new Date(expense.date) >= weekAgo
        );
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return expenses.filter(expense => 
          new Date(expense.date) >= monthStart
        );
      default:
        return expenses;
    }
  };

  const filteredExpenses = getFilteredExpenses();
  const totalValue = filteredExpenses.reduce((sum, expense) => sum + expense.value, 0);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Hoje';
      case 'week': return 'Última semana';
      case 'month': return 'Este mês';
      default: return 'Todos os gastos';
    }
  };

  const generateReportText = () => {
    const now = new Date();
    const reportDate = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let report = `
═══════════════════════════════════════════════════════════════
                    RELATÓRIO DETALHADO DE GASTOS
                     WhatsApp Expense Tracker Pro
═══════════════════════════════════════════════════════════════

📅 Período: ${getPeriodLabel()}
📈 Gerado em: ${reportDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 RESUMO FINANCEIRO:
   • Total gasto: R$ ${totalValue.toFixed(2)}
   • Quantidade de gastos: ${filteredExpenses.length}
   • Média por gasto: R$ ${filteredExpenses.length > 0 ? (totalValue / filteredExpenses.length).toFixed(2) : '0.00'}
   • Maior gasto: R$ ${filteredExpenses.length > 0 ? Math.max(...filteredExpenses.map(e => e.value)).toFixed(2) : '0.00'}
   • Menor gasto: R$ ${filteredExpenses.length > 0 ? Math.min(...filteredExpenses.map(e => e.value)).toFixed(2) : '0.00'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 GASTOS POR CATEGORIA E SUBCATEGORIA:
${categories.length > 0 ? categories.map(cat => {
  let categoryText = `   ${cat.icon} ${cat.name.toUpperCase()}: R$ ${cat.total.toFixed(2)} (${((cat.total / totalValue) * 100).toFixed(1)}%)`;
  
  if (cat.subcategories && Object.keys(cat.subcategories).length > 0) {
    const subText = Object.entries(cat.subcategories)
      .sort(([,a], [,b]) => b - a)
      .map(([subName, subTotal]) => 
        `      └─ ${subName}: R$ ${subTotal.toFixed(2)}`
      ).join('\n');
    categoryText += '\n' + subText;
  }
  
  return categoryText;
}).join('\n\n') : '   Nenhuma categoria registrada ainda.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 DETALHES DOS GASTOS:
${filteredExpenses.length > 0 ? filteredExpenses.map((expense, index) => 
  `${(index + 1).toString().padStart(3, ' ')}. ${formatDate(expense.date)} - R$ ${expense.value.toFixed(2).padStart(8, ' ')} - ${expense.description}\n     [${expense.category} → ${expense.subcategory}]`
).join('\n\n') : '   Nenhum gasto registrado para este período.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ANÁLISE ESTATÍSTICA:
${filteredExpenses.length > 0 ? `
   • Categoria mais cara: ${categories[0]?.name || 'N/A'} (R$ ${categories[0]?.total.toFixed(2) || '0.00'})
   • Gasto médio diário: R$ ${(totalValue / 30).toFixed(2)} (baseado em 30 dias)
   • Frequência de gastos: ${(filteredExpenses.length / 30).toFixed(1)} gastos por dia
   • Categorias ativas: ${categories.length}
` : '   Dados insuficientes para análise estatística.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Relatório gerado automaticamente pelo WhatsApp Expense Tracker Pro
💡 Para mais informações, use /ajuda no WhatsApp

═══════════════════════════════════════════════════════════════
    `.trim();

    return report;
  };

  const downloadReport = () => {
    if (filteredExpenses.length === 0) {
      alert('📊 Nenhum gasto registrado ainda!\n\nComece adicionando alguns gastos usando o simulador acima.');
      return;
    }

    const reportContent = generateReportText();
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const periodStr = selectedPeriod === 'all' ? 'completo' : selectedPeriod;
    
    link.download = `relatorio-gastos-${periodStr}-${dateStr}-${timeStr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Mostrar confirmação
    alert(`📥 Relatório baixado com sucesso!\n\n📊 Período: ${getPeriodLabel()}\n💰 Total: R$ ${totalValue.toFixed(2)}\n📝 ${filteredExpenses.length} gastos registrados`);
  };

  const generateReport = () => {
    if (filteredExpenses.length === 0) {
      alert('📊 Nenhum gasto registrado ainda!\n\nComece adicionando alguns gastos usando o simulador acima.');
      return;
    }

    const report = `
📊 RELATÓRIO DETALHADO DE GASTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Período: ${getPeriodLabel()}

💰 RESUMO FINANCEIRO:
• Total gasto: R$ ${totalValue.toFixed(2)}
• Quantidade: ${filteredExpenses.length} gastos
• Média por gasto: R$ ${filteredExpenses.length > 0 ? (totalValue / filteredExpenses.length).toFixed(2) : '0.00'}

📊 GASTOS POR CATEGORIA:
${categories.map(cat => 
  `${cat.icon} ${cat.name.toUpperCase()}: R$ ${cat.total.toFixed(2)} (${((cat.total / totalValue) * 100).toFixed(1)}%)`
).join('\n')}

📝 DETALHES DOS GASTOS:
${filteredExpenses.map(expense => 
  `• ${formatDate(expense.date)} - R$ ${expense.value.toFixed(2)} - ${expense.description} [${expense.category} → ${expense.subcategory}]`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 Gerado automaticamente em: ${new Date().toLocaleString('pt-BR')}
💡 Use /ajuda para ver todos os comandos disponíveis
    `.trim();
    
    navigator.clipboard.writeText(report);
    alert('📋 Relatório copiado para a área de transferência!');
  };

  // Função para formatar data corretamente em português
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00'); // Adiciona horário para evitar problemas de timezone
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getBotStatusColor = () => {
    switch (botStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBotStatusText = () => {
    switch (botStatus) {
      case 'connected': return 'Bot Conectado';
      case 'connecting': return 'Conectando...';
      case 'disconnected': return 'Bot Desconectado';
      default: return 'Status Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header Melhorado */}
      <div className="bg-white shadow-xl border-b-4 border-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl shadow-lg">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  WhatsApp Expense Tracker Pro
                </h1>
                <p className="text-gray-600 text-lg">Sistema Inteligente de Controle de Gastos</p>
              </div>
            </div>
            
            {/* Status do Bot */}
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getBotStatusColor()} animate-pulse`}></div>
              <span className="text-sm font-medium text-gray-700">{getBotStatusText()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Cards de Resumo Melhorados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gasto</p>
                <p className="text-3xl font-bold text-green-600">R$ {totalValue.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedPeriod === 'today' ? 'Hoje' : 
                   selectedPeriod === 'week' ? 'Esta semana' :
                   selectedPeriod === 'month' ? 'Este mês' : 'Total'}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gastos Registrados</p>
                <p className="text-3xl font-bold text-blue-600">{filteredExpenses.length}</p>
                <p className="text-xs text-gray-500 mt-1">Transações</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média por Gasto</p>
                <p className="text-3xl font-bold text-purple-600">
                  R$ {filteredExpenses.length > 0 ? (totalValue / filteredExpenses.length).toFixed(2) : '0.00'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Por transação</p>
              </div>
              <Target className="h-10 w-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categorias Ativas</p>
                <p className="text-3xl font-bold text-orange-600">{categories.length}</p>
                <p className="text-xs text-gray-500 mt-1">Diferentes tipos</p>
              </div>
              <PieChart className="h-10 w-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Simulador de Chat Melhorado */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Phone className="h-6 w-6 mr-3 text-green-500" />
            Simulador WhatsApp - Teste o Sistema
          </h2>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-700 mb-4 font-medium">💡 Exemplos de mensagens que o bot entende:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm">• "50 almoço"</p>
                <p className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm">• "R$ 120,50 mercado alimentação"</p>
                <p className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm">• "conta de luz 150"</p>
              </div>
              <div className="space-y-2">
                <p className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm">• "25.90 café"</p>
                <p className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm">• "gasolina 85 transporte"</p>
                <p className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm">• "uber 35"</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>🏷️ Categorias disponíveis:</strong> alimentação, transporte, casa, saúde, lazer, educação, trabalho, vestuário, outros
              </p>
              <p className="text-xs text-blue-600 mt-2">
                <strong>✨ Novo:</strong> Sistema inteligente detecta subcategorias automaticamente (ex: "conta de luz" → casa → contas básicas)
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Digite seu gasto... ex: conta de água 85"
              className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              onKeyPress={(e) => e.key === 'Enter' && addExpense()}
            />
            <button
              onClick={addExpense}
              disabled={!parseMessage(messageInput)}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-4 rounded-xl flex items-center space-x-2 transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5" />
              <span className="font-medium">Enviar</span>
            </button>
          </div>
          
          {messageInput && !parseMessage(messageInput) && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">
                ❌ Formato inválido. Use: "valor descrição [categoria]" ou "descrição valor [categoria]"
              </p>
            </div>
          )}
          
          {messageInput && parseMessage(messageInput) && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">
                ✅ Mensagem válida! Será registrado: R$ {parseMessage(messageInput)!.value.toFixed(2)} - {parseMessage(messageInput)!.description}
              </p>
              <p className="text-green-500 text-xs mt-1">
                📂 Categoria: {parseMessage(messageInput)!.category} → {parseMessage(messageInput)!.subcategory}
              </p>
            </div>
          )}
        </div>

        {/* Análise por Categorias com Subcategorias */}
        {categories.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <PieChart className="h-6 w-6 mr-3 text-purple-500" />
              Análise Detalhada por Categorias
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <span className="font-bold text-gray-800 capitalize text-lg">{category.name}</span>
                        <p className="text-sm text-gray-500">
                          {Object.keys(category.subcategories || {}).length} subcategorias
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold" style={{ color: category.color }}>
                        R$ {category.total.toFixed(2)}
                      </span>
                      <p className="text-sm text-gray-600">
                        {((category.total / totalValue) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: category.color,
                        width: `${(category.total / totalValue) * 100}%`
                      }}
                    ></div>
                  </div>
                  
                  {/* Subcategorias */}
                  {category.subcategories && Object.keys(category.subcategories).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">Detalhamento:</p>
                      {Object.entries(category.subcategories)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3) // Mostrar apenas as 3 principais
                        .map(([subName, subTotal]) => (
                          <div key={subName} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 capitalize">• {subName}</span>
                            <span className="font-medium text-gray-800">R$ {subTotal.toFixed(2)}</span>
                          </div>
                        ))}
                      {Object.keys(category.subcategories).length > 3 && (
                        <p className="text-xs text-gray-500 italic">
                          +{Object.keys(category.subcategories).length - 3} outras subcategorias
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relatório Detalhado */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 lg:mb-0 flex items-center">
              <BarChart3 className="h-6 w-6 mr-3 text-blue-500" />
              Relatório Detalhado de Gastos
            </h2>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os gastos</option>
                <option value="today">Hoje</option>
                <option value="week">Última semana</option>
                <option value="month">Este mês</option>
              </select>
              
              <button
                onClick={downloadReport}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span>Baixar Relatório</span>
              </button>
              
              <button
                onClick={generateReport}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105"
              >
                <FileText className="h-4 w-4" />
                <span>Copiar Relatório</span>
              </button>
            </div>
          </div>

          {filteredExpenses.length > 0 ? (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">
                        {categories.find(c => c.name === expense.category)?.icon || '📦'}
                      </span>
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xl font-bold text-green-600">
                            R$ {expense.value.toFixed(2)}
                          </span>
                          <span className="text-gray-800 font-medium">{expense.description}</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                            {expense.category}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                            {expense.subcategory}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          📅 {formatDate(expense.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Pronto para começar!</h3>
              <p className="text-gray-500 text-lg mb-4">Nenhum gasto registrado ainda.</p>
              <p className="text-gray-400 text-sm">Comece registrando seus gastos usando o simulador acima!</p>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">💡 Dica para começar:</h4>
                <p className="text-gray-600 text-sm">
                  Digite algo como <strong>"conta de luz 150"</strong> ou <strong>"R$ 25,90 café"</strong> no campo acima e clique em Enviar!
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  ✨ O sistema detectará automaticamente que "conta de luz" pertence à categoria "casa" → "contas básicas"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Guia de Categorias Expandido */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl text-white p-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            🎯 Sistema de Categorias Inteligente
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(categorySystem).map(([categoryName, categoryInfo]) => (
              <div key={categoryName} className="bg-white bg-opacity-10 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{categoryInfo.icon}</span>
                  <h3 className="text-xl font-bold capitalize">{categoryName}</h3>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(categoryInfo.subcategories).slice(0, 3).map(([subName, keywords]) => (
                    <div key={subName} className="bg-white bg-opacity-10 rounded-lg p-3">
                      <p className="font-semibold text-sm capitalize mb-1">{subName}</p>
                      <p className="text-xs opacity-80">
                        {keywords.slice(0, 4).join(', ')}
                        {keywords.length > 4 && '...'}
                      </p>
                    </div>
                  ))}
                  {Object.keys(categoryInfo.subcategories).length > 3 && (
                    <p className="text-xs opacity-70 italic">
                      +{Object.keys(categoryInfo.subcategories).length - 3} outras subcategorias
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-white bg-opacity-10 rounded-xl">
            <h3 className="text-xl font-bold mb-4">✨ Funcionalidades Avançadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold mb-2">🧠 Detecção Inteligente:</p>
                <ul className="space-y-1 opacity-90">
                  <li>• "conta de luz" → casa → contas básicas</li>
                  <li>• "uber" → transporte → aplicativos</li>
                  <li>• "mercado" → alimentação → mercado</li>
                  <li>• "netflix" → lazer → streaming</li>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-2">📊 Análise Detalhada:</p>
                <ul className="space-y-1 opacity-90">
                  <li>• Subcategorias automáticas</li>
                  <li>• Relatórios hierárquicos</li>
                  <li>• Análise de padrões</li>
                  <li>• Exportação completa</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;