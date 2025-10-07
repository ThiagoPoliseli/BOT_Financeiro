import React, { useState, useEffect } from 'react';
import { MessageCircle, BarChart3, DollarSign, TrendingUp, Users, Shield, Check, Star, Crown, Zap, X, CreditCard, User, Calendar, AlertCircle, Download, Filter, Search, MoreVertical, Edit, Trash2, Mail, Phone, Target } from 'lucide-react';
import { MessageCircle, BarChart3, DollarSign, TrendingUp, Users, Shield, Check, Star, Crown, Zap, X, CreditCard, User, Calendar, AlertCircle, Download, Filter, Search, MoreVertical, CreditCard as Edit, Trash2, Mail, Phone, Target } from 'lucide-react';

// Initialize Supabase client
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

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastActivity: string;
  totalExpenses: number;
  monthlySpent: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: {
    expenses: number;
    categories: number;
    reports: number;
    users?: number;
  };
  popular?: boolean;
}

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'admin'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showPricing, setShowPricing] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      features: [
        '50 gastos por mês',
        '3 categorias básicas',
        'Relatórios simples',
        'Suporte por email'
      ],
      limits: {
        expenses: 50,
        categories: 3,
        reports: 5
      }
    },
    {
      id: 'basic',
      name: 'Básico',
      price: 9.90,
      features: [
        '500 gastos por mês',
        'Todas as categorias',
        'Relatórios detalhados',
        'Backup automático',
        'Suporte prioritário'
      ],
      limits: {
        expenses: 500,
        categories: 999,
        reports: 50
      },
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.90,
      features: [
        'Gastos ilimitados',
        'Categorias personalizadas',
        'Relatórios avançados',
        'Metas e orçamentos',
        'Exportação PDF/Excel',
        'Suporte 24/7'
      ],
      limits: {
        expenses: 999999,
        categories: 999,
        reports: 999
      }
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: 49.90,
      features: [
        'Tudo do Premium',
        'Múltiplos usuários (até 10)',
        'Dashboard administrativo',
        'API personalizada',
        'Integração com sistemas',
        'Suporte dedicado'
      ],
      limits: {
        expenses: 999999,
        categories: 999,
        reports: 999,
        users: 10
      }
    }
  ];

  // Sistema de categorias
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

  // Simular dados iniciais
  useEffect(() => {
    // Simular usuários para admin
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        plan: 'premium',
        status: 'active',
        createdAt: '2024-01-15',
        lastActivity: '2024-01-20',
        totalExpenses: 156,
        monthlySpent: 2450.80
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '(11) 88888-8888',
        plan: 'basic',
        status: 'active',
        createdAt: '2024-01-10',
        lastActivity: '2024-01-19',
        totalExpenses: 89,
        monthlySpent: 1230.50
      },
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        phone: '(11) 77777-7777',
        plan: 'free',
        status: 'active',
        createdAt: '2024-01-18',
        lastActivity: '2024-01-20',
        totalExpenses: 23,
        monthlySpent: 456.30
      }
    ];

    setUsers(mockUsers);
    setStats({
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => u.status === 'active').length,
      totalRevenue: 1247.60,
      monthlyRevenue: 89.70
    });
  }, []);

  // Calcular categorias
  useEffect(() => {
    const categoryMap = new Map();
    const subcategoryMap = new Map();
    const filteredExpenses = getFilteredExpenses();
    
    filteredExpenses.forEach(expense => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.value);
      
      const subKey = `${expense.category}-${expense.subcategory}`;
      const subCurrent = subcategoryMap.get(subKey) || 0;
      subcategoryMap.set(subKey, subCurrent + expense.value);
    });

    const cats: Category[] = Array.from(categoryMap.entries()).map(([name, total]) => {
      const categoryInfo = categorySystem[name as keyof typeof categorySystem];
      
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
        
        if (i === 0) {
          value = parseFloat(match[1].replace(',', '.'));
          description = match[2].trim();
          category = match[3].toLowerCase();
        } else if (i === 1) {
          value = parseFloat(match[1].replace(',', '.'));
          description = match[2].trim();
          const result = autoCategorizе(description);
          category = result.category;
        } else if (i === 2) {
          description = match[1].trim();
          value = parseFloat(match[2].replace(',', '.'));
          category = match[3].toLowerCase();
        } else {
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
      const newExpense = {
        user_id: user!.id,
        value: parsed.value,
        description: parsed.description,
        category: parsed.category,
        subcategory: parsed.subcategory,
        date: new Date().toISOString().split('T')[0]
      };
      
      addExpense(newExpense).then(({ data, error }) => {
        if (error) {
          console.error('Error adding expense:', error);
        } else if (data) {
          setExpenses(prev => [data, ...prev]);
          setMessageInput('');
        }
      });
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleLogin = async (email: string, password: string) => {
    try {
     const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        alert('Erro ao fazer login: ' + error.message);
        return;
      }
      
      // Check for admin user after successful login
      if (email === 'admin@admin.com') {
        setIsAdmin(true);
        setCurrentView('admin');
      }
      
      setShowLogin(false);
    } catch (error) {
      console.error('Login error:', error);
      alert('Erro ao fazer login');
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        alert('Erro ao criar conta: ' + error.message);
        return;
      }
      
      alert('Conta criada com sucesso! Verifique seu email para confirmar.');
      setShowSignUp(false);
      setShowLogin(true);
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Erro ao criar conta');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePlanUpgrade = async (planId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await updateUserPlan(user.id, planId);
      
      if (error) {
        alert('Erro ao atualizar plano: ' + error.message);
        return;
      }
      
      if (data) {
        setUser(data);
        alert('Plano atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Plan upgrade error:', error);
      alert('Erro ao atualizar plano');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const { error } = await deleteExpense(expenseId);
      
      if (error) {
        alert('Erro ao deletar gasto: ' + error.message);
        return;
      }
      
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    } catch (error) {
      console.error('Delete expense error:', error);
      alert('Erro ao deletar gasto');
    }
  };

  const handleBotSetup = async (phoneNumber: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await createBotConnection(user.id, phoneNumber);
      
      if (error) {
        alert('Erro ao configurar bot: ' + error.message);
        return;
      }
      
      if (data) {
        setBotConnection(data);
        setShowBotSetup(false);
        alert('Bot configurado com sucesso! Aguarde a conexão.');
      }
    } catch (error) {
      console.error('Bot setup error:', error);
      alert('Erro ao configurar bot');
    }
  };

  const getPlanColor = (plan: string) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-gold-100 text-gold-800'
    };
    return colors[plan as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Landing Page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">ExpenseBot Pro</h1>
                  <p className="text-sm text-gray-600">Controle de gastos via WhatsApp</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowPricing(true)}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Preços
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setShowSignUp(true)}
                  className="border border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Criar Conta
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-8">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                🚀 Novo: Sistema Multi-usuário
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Controle seus gastos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                direto no WhatsApp
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              O bot mais inteligente para controle financeiro pessoal. Registre gastos, 
              receba relatórios detalhados e mantenha suas finanças organizadas com 
              comandos simples no WhatsApp.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
              >
                Entrar
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
              >
                Criar Conta Grátis
              </button>
              <button
                onClick={() => setShowPricing(true)}
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                Ver Preços
              </button>
            </div>

            {/* Demo */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center mb-6">
                <Phone className="h-6 w-6 text-green-500 mr-3" />
                <span className="font-semibold text-gray-800">Demonstração do Bot</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
                    50 almoço
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg max-w-md">
                    ✅ <strong>Gasto registrado!</strong><br/>
                    💰 R$ 50,00 - Almoço<br/>
                    🏷️ Categoria: alimentação<br/>
                    📅 {new Date().toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
                    /relatorio
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg max-w-md">
                    📊 <strong>Relatório de Gastos</strong><br/>
                    💰 Total: R$ 1.250,00<br/>
                    🍽️ Alimentação: R$ 450,00 (36%)<br/>
                    🚗 Transporte: R$ 320,00 (25.6%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Funcionalidades Poderosas
              </h2>
              <p className="text-xl text-gray-600">
                Tudo que você precisa para controlar suas finanças
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <MessageCircle className="h-8 w-8" />,
                  title: 'WhatsApp Nativo',
                  description: 'Use o WhatsApp que você já conhece. Sem apps extras.'
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: 'Categorização Automática',
                  description: 'IA detecta automaticamente a categoria dos seus gastos.'
                },
                {
                  icon: <BarChart3 className="h-8 w-8" />,
                  title: 'Relatórios Detalhados',
                  description: 'Análises completas com gráficos e insights.'
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: 'Dados Seguros',
                  description: 'Seus dados ficam protegidos e privados.'
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: 'Multi-usuário',
                  description: 'Cada pessoa tem seus dados separados.'
                },
                {
                  icon: <Target className="h-8 w-8" />,
                  title: 'Metas e Orçamentos',
                  description: 'Defina limites e acompanhe seu progresso.'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="text-blue-500 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Modal */}
        {showPricing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Escolha seu Plano</h2>
                <button
                  onClick={() => setShowPricing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl p-6 ${
                      plan.popular 
                        ? 'bg-gradient-to-b from-blue-50 to-purple-50 border-2 border-blue-500' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Mais Popular
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">
                          R$ {plan.price.toFixed(2)}
                        </span>
                        <span className="text-gray-600">/mês</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        setShowPricing(false);
                        setShowLogin(true);
                      }}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        plan.popular
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      Começar Agora
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Login Modal */}
        {showLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Entrar</h2>
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleLogin(
                  formData.get('email') as string,
                  formData.get('password') as string
                );
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 transition-colors"
                >
                  Entrar
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Não tem conta?{' '}
                  <button className="text-blue-500 hover:text-blue-600 font-medium">
                    <span onClick={() => {
                      setShowLogin(false);
                      setShowSignUp(true);
                    }}>
                      Criar conta gratuita
                    </span>
                  </button>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Use suas credenciais reais ou crie uma conta nova
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sign Up Modal */}
        {showSignUp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Criar Conta</h2>
                <button
                  onClick={() => setShowSignUp(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleSignUp(
                  formData.get('email') as string,
                  formData.get('password') as string,
                  formData.get('fullName') as string
                );
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold mt-6 transition-colors"
                >
                  Criar Conta Grátis
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Já tem conta?{' '}
                  <button 
                    onClick={() => {
                      setShowSignUp(false);
                      setShowLogin(true);
                    }}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Fazer login
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Admin Dashboard
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">ExpenseBot Pro</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="h-10 w-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-3xl font-bold text-purple-600">R$ {stats.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-10 w-10 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                  <p className="text-3xl font-bold text-orange-600">R$ {stats.monthlyRevenue.toFixed(2)}</p>
                </div>
                <Calendar className="h-10 w-10 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Usuários Cadastrados</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gastos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Mensal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Atividade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(user.plan)}`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.totalExpenses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {user.monthlySpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.lastActivity).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-xl border-b-4 border-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl shadow-lg">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ExpenseBot Pro
                </h1>
                <p className="text-gray-600">Olá, {user?.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Plano Atual</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPlanColor(user?.plan_id || 'free')}`}>
                  {plans.find(p => p.id === user?.plan_id)?.name || 'Gratuito'}
                </span>
              </div>
              {!botConnection?.connection_status || botConnection.connection_status !== 'connected' ? (
                <button
                  onClick={() => setShowBotSetup(true)}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Bot className="h-5 w-5" />
                  <span>Conectar Bot</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-green-600">
                  <Bot className="h-5 w-5" />
                  <span className="text-sm font-medium">Bot Conectado</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gasto</p>
                <p className="text-3xl font-bold text-green-600">R$ {totalValue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gastos Registrados</p>
                <p className="text-3xl font-bold text-blue-600">{filteredExpenses.length}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média por Gasto</p>
                <p className="text-3xl font-bold text-purple-600">
                  R$ {filteredExpenses.length > 0 ? (totalValue / filteredExpenses.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <Target className="h-10 w-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categorias Ativas</p>
                <p className="text-3xl font-bold text-orange-600">{categories.length}</p>
              </div>
              <PieChart className="h-10 w-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Simulador de Chat */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Phone className="h-6 w-6 mr-3 text-green-500" />
            Simulador WhatsApp - Teste o Sistema
          </h2>
          
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
        </div>

        {/* Análise por Categorias */}
        {categories.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <PieChart className="h-6 w-6 mr-3 text-purple-500" />
              {botConnection?.connection_status === 'connected' ? 'Bot WhatsApp Conectado' : 'Simulador WhatsApp - Teste o Sistema'}
            </h2>
            
            {botConnection?.connection_status === 'connected' && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <Bot className="h-5 w-5" />
                  <span className="font-medium">Bot conectado ao WhatsApp!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Envie mensagens para o número {botConnection.phone_number} para registrar gastos.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{category.icon}</span>
                      <span className="font-bold text-gray-800 capitalize text-lg">{category.name}</span>
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
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        backgroundColor: category.color,
                        width: `${(category.total / totalValue) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Gastos */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <BarChart3 className="h-6 w-6 mr-3 text-blue-500" />
              Seus Gastos
            </h2>
            
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
          </div>

          {filteredExpenses.length > 0 ? (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
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
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        📅 {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Deletar gasto"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Comece a registrar seus gastos!</h3>
              <p className="text-gray-500">Use o simulador acima para testar o sistema.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bot Setup Modal */}
      {showBotSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Conectar Bot WhatsApp</h2>
              <button
                onClick={() => setShowBotSetup(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-xl inline-block mb-4">
                <Bot className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Configure seu Bot Pessoal
              </h3>
              <p className="text-gray-600">
                Conecte o bot ao seu WhatsApp para receber e processar gastos automaticamente.
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleBotSetup(formData.get('phoneNumber') as string);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este será o número que receberá as mensagens de gastos
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold mt-6 transition-colors"
              >
                Conectar Bot
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Como funciona:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• O bot será conectado ao seu WhatsApp</li>
                <li>• Você receberá um QR Code para escanear</li>
                <li>• Após conectar, poderá enviar gastos via mensagem</li>
                <li>• Exemplo: "50 almoço" ou "conta de luz 150"</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;