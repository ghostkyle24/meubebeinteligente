-- =====================================================
-- SCRIPT PARA CORRIGIR POLÍTICAS RLS
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. DESABILITAR RLS TEMPORARIAMENTE PARA INSERÇÃO DE USUÁRIOS
-- =====================================================

-- Desabilitar RLS na tabela users temporariamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. CRIAR POLÍTICA PARA INSERÇÃO DE USUÁRIOS
-- =====================================================

-- Política para permitir inserção de novos usuários (sem autenticação)
DROP POLICY IF EXISTS "Allow user registration" ON users;
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

-- 3. REABILITAR RLS
-- =====================================================

-- Reabilitar RLS na tabela users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. VERIFICAR POLÍTICAS ATIVAS
-- =====================================================

-- Listar todas as políticas da tabela users
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- 5. TESTAR INSERÇÃO (OPCIONAL)
-- =====================================================

-- Teste de inserção (descomente para testar)
/*
INSERT INTO users (
    email, 
    password_hash, 
    cpf,
    plan, 
    plan_name, 
    plan_duration, 
    plan_price, 
    total_paid, 
    start_date, 
    end_date, 
    status, 
    payment_method, 
    payment_status
) VALUES (
    'teste@exemplo.com',
    'hash_teste',
    '12345678901',
    'monthly',
    'Mensal',
    1,
    29.00,
    29.00,
    NOW(),
    NOW() + INTERVAL '1 month',
    'active',
    'pix',
    'confirmed'
);
*/
