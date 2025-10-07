import React from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';

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
  icon: React.ReactNode;
  color: string;
}

interface PricingSectionProps {
  onSelectPlan: (planId: string) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      icon: <Zap className="h-6 w-6" />,
      color: 'from-gray-400 to-gray-600',
      features: [
        '50 gastos por mês',
        '3 categorias básicas',
        'Relatórios simples',
        'Suporte por email',
        'Backup básico'
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
      icon: <Star className="h-6 w-6" />,
      color: 'from-blue-400 to-blue-600',
      features: [
        '500 gastos por mês',
        'Todas as 9 categorias',
        'Relatórios detalhados',
        'Backup automático',
        'Suporte prioritário',
        'Exportação em PDF'
      ],
      limits: {
        expenses: 500,
        categories: 9,
        reports: 50
      },
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.90,
      icon: <Crown className="h-6 w-6" />,
      color: 'from-purple-400 to-purple-600',
      features: [
        'Gastos ilimitados',
        'Categorias personalizadas',
        'Relatórios avançados com IA',
        'Metas e orçamentos inteligentes',
        'Exportação Excel/CSV',
        'Suporte 24/7',
        'Análise de tendências',
        'Alertas personalizados'
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
      icon: <Crown className="h-6 w-6" />,
      color: 'from-gold-400 to-gold-600',
      features: [
        'Tudo do Premium',
        'Múltiplos usuários (até 10)',
        'Dashboard administrativo',
        'API personalizada',
        'Integração com sistemas',
        'Suporte dedicado',
        'Relatórios corporativos',
        'Controle de permissões',
        'Backup empresarial'
      ],
      limits: {
        expenses: 999999,
        categories: 999,
        reports: 999,
        users: 10
      }
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Planos que se Adaptam ao seu Perfil
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o plano ideal para suas necessidades. Comece gratuitamente e 
            evolua conforme seu uso cresce.
          </p>
          
          <div className="mt-8 inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            🎉 Promoção de Lançamento: 30% OFF nos primeiros 3 meses!
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'bg-white border-2 border-blue-500 shadow-2xl' 
                  : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    🔥 Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} text-white mb-4`}>
                  {plan.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    R$ {plan.price.toFixed(2)}
                  </span>
                  <span className="text-gray-600 text-lg">/mês</span>
                </div>

                {plan.price > 0 && (
                  <div className="text-sm text-gray-500">
                    <span className="line-through">R$ {(plan.price / 0.7).toFixed(2)}</span>
                    <span className="ml-2 text-green-600 font-semibold">30% OFF</span>
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Limites:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• {plan.limits.expenses === 999999 ? 'Gastos ilimitados' : `${plan.limits.expenses} gastos/mês`}</div>
                  <div>• {plan.limits.categories === 999 ? 'Categorias ilimitadas' : `${plan.limits.categories} categorias`}</div>
                  <div>• {plan.limits.reports === 999 ? 'Relatórios ilimitados' : `${plan.limits.reports} relatórios/mês`}</div>
                  {plan.limits.users && <div>• Até {plan.limits.users} usuários</div>}
                </div>
              </div>

              <button
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
                    : plan.price === 0
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white'
                }`}
              >
                {plan.price === 0 ? 'Começar Grátis' : 'Assinar Agora'}
              </button>

              {plan.price > 0 && (
                <p className="text-center text-xs text-gray-500 mt-3">
                  Cancele a qualquer momento • Sem taxa de cancelamento
                </p>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Perguntas Frequentes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Como funciona o período gratuito?",
                answer: "Você pode usar o plano gratuito indefinidamente com até 50 gastos por mês. Sem cartão de crédito necessário."
              },
              {
                question: "Posso cancelar a qualquer momento?",
                answer: "Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento."
              },
              {
                question: "Os dados ficam seguros?",
                answer: "Absolutamente! Usamos criptografia de ponta e seus dados ficam completamente privados e seguros."
              },
              {
                question: "Como funciona o suporte?",
                answer: "Oferecemos suporte por email para todos os planos, com prioridade para assinantes pagos e suporte 24/7 no Premium."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">SSL Seguro</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">LGPD Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;