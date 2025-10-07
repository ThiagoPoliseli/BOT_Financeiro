import React, { useState } from 'react';
import { X, CreditCard, Shield, Check } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    price: number;
  } | null;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cpf: ''
  });

  if (!isOpen || !plan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular processamento de pagamento
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
    }, 2000);
  };

  const discountedPrice = plan.price * 0.7; // 30% de desconto

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Finalizar Assinatura</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Plan Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Plano {plan.name}</h3>
              <p className="text-gray-600">Cobrança mensal</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 line-through">
                R$ {plan.price.toFixed(2)}/mês
              </div>
              <div className="text-2xl font-bold text-green-600">
                R$ {discountedPrice.toFixed(2)}/mês
              </div>
              <div className="text-sm text-green-600 font-semibold">
                30% OFF por 3 meses
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Método de Pagamento</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border-2 transition-colors ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-sm font-medium">Cartão de Crédito</div>
            </button>
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`p-4 rounded-xl border-2 transition-colors ${
                paymentMethod === 'pix'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-6 h-6 mx-auto mb-2 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">
                PIX
              </div>
              <div className="text-sm font-medium">PIX</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === 'card' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Cartão</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validade
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'pix' && (
            <div className="mb-6 p-6 bg-green-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pagamento via PIX</h3>
              <p className="text-gray-600 mb-4">
                Após confirmar, você receberá o código PIX para pagamento instantâneo.
              </p>
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">Aprovação instantânea</span>
              </div>
            </div>
          )}

          {/* Security */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-gray-900">Pagamento Seguro</h4>
                <p className="text-sm text-gray-600">
                  Seus dados são protegidos com criptografia SSL de 256 bits
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-xl font-bold text-lg transition-all"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processando...</span>
              </div>
            ) : (
              `Confirmar Assinatura - R$ ${discountedPrice.toFixed(2)}/mês`
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Ao confirmar, você concorda com nossos Termos de Uso e Política de Privacidade.
            Cancele a qualquer momento.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;