import React, { useState, useEffect } from 'react';
import { LogOut, Smartphone, Copy, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface DashboardProps {
  user: SupabaseUser;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [copied, setCopied] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const botNumber = process.env.VITE_BOT_WHATSAPP_NUMBER || '+55 11 99999-9999';
  const botLink = `https://wa.me/${botNumber.replace(/\D/g, '')}?text=Conectar`;

  const handleCopy = () => {
    navigator.clipboard.writeText(botNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    window.open(botLink, '_blank');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ExpenseBot</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Smartphone className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Conectar ao Bot</h2>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Escaneie o código QR ou clique no botão abaixo para conectar seu WhatsApp ao bot de gastos inteligente.
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Como funciona:</p>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Clique em "Conectar ao WhatsApp"</li>
                    <li>Você será redirecionado para o WhatsApp</li>
                    <li>Inicie uma conversa com o bot</li>
                    <li>Comece a registrar seus gastos!</li>
                  </ol>
                </div>
              </div>
            </div>

            <button
              onClick={handleConnect}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <span className="flex items-center justify-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Conectar ao WhatsApp</span>
              </span>
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3 font-medium">Número do bot:</p>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                <code className="text-sm font-mono text-gray-900 flex-1">{botNumber}</code>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Primeiros Passos</h2>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Registrar Gastos</h3>
                <p className="text-sm text-gray-600">Envie mensagens simples como "50 almoço" ou "R$ 120,50 mercado"</p>
              </div>

              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Ver Relatórios</h3>
                <p className="text-sm text-gray-600">Use /relatorio para ver um resumo completo de seus gastos</p>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Categorias Automáticas</h3>
                <p className="text-sm text-gray-600">O bot identifica automaticamente a categoria dos seus gastos</p>
              </div>

              <div className="border-l-4 border-yellow-600 pl-4">
                <h3 className="font-bold text-gray-900 mb-1">Comandos Úteis</h3>
                <p className="text-sm text-gray-600">Digite /ajuda para ver todos os comandos disponíveis</p>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-bold">Dica:</span> Após conectar ao bot, salve o número na sua agenda com o nome "ExpenseBot" para acesso rápido.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exemplos de Uso</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-mono text-blue-600 mb-2">Você: "50 almoço"</p>
              <p className="text-xs text-gray-600">Bot: ✅ Gasto registrado! R$ 50,00 - Almoço 📍 alimentação</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-mono text-blue-600 mb-2">Você: "120 gasolina"</p>
              <p className="text-xs text-gray-600">Bot: ✅ Gasto registrado! R$ 120,00 - Gasolina 📍 transporte</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-mono text-blue-600 mb-2">Você: "/relatorio"</p>
              <p className="text-xs text-gray-600">Bot: 📊 Seu relatório completo com todos os gastos do mês</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
