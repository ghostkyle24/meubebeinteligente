-- =====================================================
-- SCRIPT PARA ADICIONAR COLUNAS FALTANTES
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Adicionar coluna CPF se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'cpf') THEN
        ALTER TABLE users ADD COLUMN cpf VARCHAR(14);
        RAISE NOTICE 'Coluna cpf adicionada à tabela users';
    ELSE
        RAISE NOTICE 'Coluna cpf já existe na tabela users';
    END IF;
END $$;

-- Adicionar coluna payment_session_id se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'payment_session_id') THEN
        ALTER TABLE users ADD COLUMN payment_session_id VARCHAR(255);
        RAISE NOTICE 'Coluna payment_session_id adicionada à tabela users';
    ELSE
        RAISE NOTICE 'Coluna payment_session_id já existe na tabela users';
    END IF;
END $$;

-- Verificar estrutura da tabela users
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
