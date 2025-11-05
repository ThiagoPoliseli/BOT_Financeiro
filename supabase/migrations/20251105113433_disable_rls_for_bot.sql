/*
  # Desabilitar RLS para o bot poder ler dados

  1. Alterações
    - Desabilitar RLS em expenses para testes do bot
    - Desabilitar RLS em user_profiles para testes do bot
    - Desabilitar RLS em budgets para testes do bot
*/

ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
