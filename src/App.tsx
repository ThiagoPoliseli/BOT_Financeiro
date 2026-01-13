import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Shield, Zap, Menu, X, LogIn, LogOut, Users } from 'lucide-react';
import PricingSection from './components/PricingSection';
import PaymentModal from './components/PaymentModal';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import { supabase } from './lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleSelectPlan = (planId: string, period: 'monthly' | 'annual') => {
    if (!user) {
      setShowAuthModal(true);
      setSelectedPlan(planId);
      setSelectedPeriod(period);
      return;
    }

    setSelectedPlan(planId);
    setSelectedPeriod(period);
    setShowPaymentModal(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleSignOut} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                ExpenseBot
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Funcionalidades
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Planos
              </a>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Olá, {user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Entrar</span>
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all"
                  >
                    Criar Conta
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-blue-600 transition-colors">
                Funcionalidades
              </a>
              <a href="#pricing" className="block text-gray-700 hover:text-blue-600 transition-colors">
                Planos
              </a>
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-red-600 hover:text-red-700 transition-colors"
                >
                  Sair
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="block w-full text-left text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    Criar Conta
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Controle Financeiro Inteligente
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Gerencie seus Gastos pelo{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  WhatsApp
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                O bot mais inteligente para controlar suas finanças pessoais. Registre gastos,
                receba relatórios detalhados e tome decisões financeiras mais inteligentes -
                tudo direto no WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#pricing"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all text-center"
                >
                  Começar Gratuitamente
                </a>
                <a
                  href="#features"
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-bold text-lg border-2 border-gray-200 transition-all text-center"
                >
                  Ver Funcionalidades
                </a>
              </div>
              <div className="mt-8 flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Configuração em 2 minutos</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-1 shadow-2xl">
                <div className="bg-white rounded-3xl p-8">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                      <div className="text-sm text-gray-600 mb-1">Você enviou:</div>
                      <div className="text-lg font-medium">"50 almoço"</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
                      <div className="text-sm text-gray-600 mb-2">Bot responde:</div>
                      <div className="space-y-2 text-sm">
                        <div>✅ Gasto registrado!</div>
                        <div>💰 R$ 50,00 - Almoço</div>
                        <div>🏷️ Categoria: alimentação</div>
                        <div>📅 {new Date().toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o ExpenseBot?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simplicidade e poder em uma única plataforma. Controle total das suas finanças
              sem sair do WhatsApp.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8" />,
                title: 'Registro Instantâneo',
                description: 'Registre gastos em segundos. Apenas envie "50 almoço" e pronto! O bot entende tudo automaticamente.',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: 'Relatórios Inteligentes',
                description: 'Receba análises detalhadas com gráficos, tendências e insights sobre seus gastos mensais.',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Totalmente Seguro',
                description: 'Seus dados são criptografados e protegidos. Privacidade e segurança são nossas prioridades.',
                color: 'from-blue-400 to-indigo-500'
              },
              {
                icon: <Wallet className="h-8 w-8" />,
                title: 'Categorização Automática',
                description: 'O bot identifica automaticamente a categoria dos seus gastos usando inteligência artificial.',
                color: 'from-purple-400 to-pink-500'
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: 'Multi-Usuário',
                description: 'Planos empresariais com suporte para múltiplos usuários e dashboards compartilhados.',
                color: 'from-red-400 to-rose-500'
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: 'Metas e Orçamentos',
                description: 'Defina metas mensais e receba alertas quando estiver próximo do limite.',
                color: 'from-cyan-400 to-blue-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <PricingSection onSelectPlan={handleSelectPlan} />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para transformar seu controle financeiro?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de usuários que já estão economizando e tomando decisões
            financeiras mais inteligentes.
          </p>
          <a
            href="#pricing"
            className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Começar Agora - É Grátis
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wallet className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white">ExpenseBot</span>
              </div>
              <p className="text-sm">
                Controle financeiro inteligente pelo WhatsApp.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 ExpenseBot. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          if (selectedPlan) {
            setShowPaymentModal(true);
          }
        }}
      />

      {showPaymentModal && selectedPlan && (
        <PaymentModal
          planId={selectedPlan}
          period={selectedPeriod}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
