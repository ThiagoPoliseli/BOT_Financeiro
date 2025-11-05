/*
  # Permitir leitura pública de categorias

  1. Alterações
    - Desabilitar RLS na tabela categories para permitir leitura pública
    - Criar política para leitura pública
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'categories_public_read'
  ) THEN
    ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;
