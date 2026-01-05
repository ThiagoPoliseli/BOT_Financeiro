import React, { useState } from 'react';
import { Check, Crown } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (planId: string, period: 'monthly' | 'annual') => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [period, setPeriod] = useState<'monthly' | 'annual'>('monthly');

  const monthlyPrice = 29.90;
  const annualPrice = 299.00; // 2 meses de desconto
  const displayPrice = period === 'monthly' ? monthlyPrice : annualPrice;
  const monthlyValue = period === 'monthly' ? monthlyPrice : (annualPrice / 12).toFixed(2);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50" id="pricing">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Plano Completo para Controlar seus Gastos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Um único plano poderoso com funcionalidades ilimitadas.
            Escolha pagar mensalmente ou aproveite o desconto anual.
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              period === 'monthly'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setPeriod('annual')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              period === 'annual'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            Anual (2 meses de desconto)
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-500 hover:shadow-2xl transition-all">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-4">
              <Crown className="h-6 w-6" />
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-2">ExpenseBot Pro</h3>

            <div className="mb-6">
              <span className="text-6xl font-bold text-gray-900">
                R$ {displayPrice.toFixed(2)}
              </span>
              <span className="text-gray-600 text-xl ml-2">
                {period === 'monthly' ? '/mês' : '/ano'}
              </span>
            </div>

            {period === 'annual' && (
              <div className="text-sm text-green-600 font-semibold">
                Economize R$ {((monthlyPrice * 12) - annualPrice).toFixed(2)} por ano
              </div>
            )}
          </div>

          <ul className="space-y-4 mb-8">
            {[
              'Gastos ilimitados por mês',
              'Categorias ilimitadas',
              'Relatórios detalhados',
              'Análise de gastos com IA',
              'Alertas e notificações',
              'Backup automático',
              'Suporte prioritário',
              'Acesso ao bot do WhatsApp',
              'Exportação em PDF/Excel'
            ].map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSelectPlan('pro', period)}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Começar Agora - Pagamento PIX
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Acesso instantâneo após pagamento • Sem contrato
          </p>
        </div>

        <div className="mt-16 text-center">
          <div className="flex items-center justify-center space-x-8 text-gray-500 flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">SSL Seguro</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">PIX Instantâneo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Sem Cartão</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;