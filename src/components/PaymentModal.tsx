import React, { useState } from 'react';
import { X, Shield, Check, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PaymentModalProps {
  planId: string;
  onClose: () => void;
  period: 'monthly' | 'annual';
}

const PaymentModal: React.FC<PaymentModalProps> = ({ planId, onClose, period }) => {
  const [step, setStep] = useState<'form' | 'pix'>('form');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: ''
  });

  const monthlyPrice = 29.90;
  const annualPrice = 299.00;
  const price = period === 'monthly' ? monthlyPrice : annualPrice;
  const displayPeriod = period === 'monthly' ? 'mês' : 'ano';

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        alert('Erro: Usuário não autenticado');
        setIsProcessing(false);
        return;
      }

      const mockPixCode = 'abc.123def.456ghi.789jkl.0';
      setPixCode(mockPixCode);
      setStep('pix');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar código PIX');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    alert('Pagamento confirmado! Você será redirecionado para seu painel.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'form' ? 'Finalizar Assinatura' : 'Código PIX'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {step === 'form' ? (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">ExpenseBot Pro</h3>
                  <p className="text-gray-600">
                    {period === 'monthly' ? 'Assinatura Mensal' : 'Assinatura Anual'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    R$ {price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    /{displayPeriod}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seus Dados</h3>
                <div className="space-y-4">
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
                      placeholder="Seu nome"
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
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    PIX
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pagamento via PIX</h4>
                    <p className="text-sm text-gray-600">
                      Instantâneo e seguro. Sem taxas adicionais.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Segurança Garantida</h4>
                    <p className="text-sm text-gray-600">
                      Seus dados protegidos com SSL 256 bits
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-xl font-bold text-lg transition-all"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Gerando código PIX...</span>
                  </div>
                ) : (
                  'Prosseguir para PIX'
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Ao continuar, você concorda com nossos Termos de Uso
              </p>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-full bg-green-100 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Código PIX Gerado
              </h3>
              <p className="text-gray-600">
                Escaneie ou copie o código abaixo para fazer o pagamento
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
              <div className="bg-white rounded-lg p-4 mb-4 border-2 border-blue-200">
                <p className="text-sm text-gray-600 text-center mb-3">Código PIX</p>
                <code className="block text-center text-sm font-mono break-all text-gray-900 mb-4">
                  {pixCode}
                </code>
                <button
                  onClick={handleCopyPix}
                  className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Copy className="h-4 w-4" />
                  {copied ? 'Copiado!' : 'Copiar Código'}
                </button>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                  <span>Abra seu aplicativo de banco ou WhatsApp</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                  <span>Cole o código PIX no campo de pagamento</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                  <span>Confirme o valor: R$ {price.toFixed(2)}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                  <span>Seu acesso será liberado imediatamente</span>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-900">
                Você receberá um email com a confirmação do pagamento e instruções para ativar seu bot do WhatsApp.
              </p>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-bold text-lg transition-all"
            >
              Já Realizei o Pagamento
            </button>

            <button
              onClick={() => setStep('form')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold mt-3 transition-all"
            >
              Voltar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;