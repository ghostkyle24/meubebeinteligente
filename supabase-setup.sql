-- =====================================================
-- SCRIPT DE CONFIGURAÇÃO COMPLETA DO SUPABASE
-- Meu Bebê Inteligente - Sistema de Assinaturas
-- =====================================================
-- Execute este script completo no SQL Editor do Supabase

-- 1. CRIAR TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL, -- 'monthly', 'quarterly', 'yearly', 'admin'
    plan_name VARCHAR(100) NOT NULL,
    plan_duration INTEGER NOT NULL, -- duração em meses
    plan_price DECIMAL(10,2) NOT NULL,
    orderbump JSONB DEFAULT '[]'::jsonb, -- array de orderbumps selecionados
    orderbump_total DECIMAL(10,2) DEFAULT 0,
    total_paid DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    payment_method VARCHAR(50), -- 'pix', 'card', 'admin'
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
    is_admin BOOLEAN DEFAULT FALSE, -- indica se é administrador
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    orderbump_total DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    pix_code TEXT,
    pix_qr_code TEXT,
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atividades dos usuários
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL, -- 'music', 'video', 'game', 'drawing', etc.
    activity_name VARCHAR(255) NOT NULL,
    time_spent INTEGER DEFAULT 0, -- em minutos
    metadata JSONB DEFAULT '{}'::jsonb, -- dados adicionais da atividade
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões (para controle de login)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relatórios de progresso
CREATE TABLE IF NOT EXISTS progress_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    report_date DATE NOT NULL,
    total_time_spent INTEGER DEFAULT 0, -- em minutos
    music_time INTEGER DEFAULT 0,
    video_time INTEGER DEFAULT 0,
    game_time INTEGER DEFAULT 0,
    drawing_time INTEGER DEFAULT 0,
    activities_completed INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_end_date ON users(end_date);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan);

CREATE INDEX IF NOT EXISTS idx_payments_user_email ON payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);

CREATE INDEX IF NOT EXISTS idx_user_activities_user_email ON user_activities(user_email);
CREATE INDEX IF NOT EXISTS idx_user_activities_timestamp ON user_activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_email ON user_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_progress_reports_user_email ON progress_reports(user_email);
CREATE INDEX IF NOT EXISTS idx_progress_reports_date ON progress_reports(report_date);

-- 3. CRIAR FUNÇÕES AUXILIARES
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Função para verificar se usuário tem acesso válido
CREATE OR REPLACE FUNCTION check_user_access(user_email_param VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    user_record users%ROWTYPE;
BEGIN
    SELECT * INTO user_record 
    FROM users 
    WHERE email = user_email_param 
    AND status = 'active' 
    AND end_date > NOW();
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para registrar atividade
CREATE OR REPLACE FUNCTION record_user_activity(
    user_email_param VARCHAR,
    activity_type_param VARCHAR,
    activity_name_param VARCHAR,
    time_spent_param INTEGER DEFAULT 0,
    metadata_param JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
    user_id_val UUID;
BEGIN
    -- Buscar ID do usuário
    SELECT id INTO user_id_val FROM users WHERE email = user_email_param;
    
    -- Inserir atividade
    INSERT INTO user_activities (
        user_id, user_email, activity_type, activity_name, 
        time_spent, metadata
    ) VALUES (
        user_id_val, user_email_param, activity_type_param, 
        activity_name_param, time_spent_param, metadata_param
    ) RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar relatório de progresso diário
CREATE OR REPLACE FUNCTION generate_daily_progress_report(user_email_param VARCHAR, report_date_param DATE)
RETURNS UUID AS $$
DECLARE
    report_id UUID;
    user_id_val UUID;
    total_time INTEGER;
    music_time INTEGER;
    video_time INTEGER;
    game_time INTEGER;
    drawing_time INTEGER;
    activities_count INTEGER;
BEGIN
    -- Buscar ID do usuário
    SELECT id INTO user_id_val FROM users WHERE email = user_email_param;
    
    -- Calcular tempos por categoria
    SELECT 
        COALESCE(SUM(time_spent), 0),
        COALESCE(SUM(CASE WHEN activity_type = 'music' THEN time_spent ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN activity_type = 'video' THEN time_spent ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN activity_type = 'game' THEN time_spent ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN activity_type = 'drawing' THEN time_spent ELSE 0 END), 0),
        COUNT(*)
    INTO total_time, music_time, video_time, game_time, drawing_time, activities_count
    FROM user_activities 
    WHERE user_email = user_email_param 
    AND DATE(timestamp) = report_date_param;
    
    -- Inserir ou atualizar relatório
    INSERT INTO progress_reports (
        user_id, user_email, report_date, total_time_spent,
        music_time, video_time, game_time, drawing_time,
        activities_completed
    ) VALUES (
        user_id_val, user_email_param, report_date_param, total_time,
        music_time, video_time, game_time, drawing_time,
        activities_count
    ) 
    ON CONFLICT (user_email, report_date) 
    DO UPDATE SET
        total_time_spent = EXCLUDED.total_time_spent,
        music_time = EXCLUDED.music_time,
        video_time = EXCLUDED.video_time,
        game_time = EXCLUDED.game_time,
        drawing_time = EXCLUDED.drawing_time,
        activities_completed = EXCLUDED.activities_completed
    RETURNING id INTO report_id;
    
    RETURN report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. CRIAR TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at na tabela users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 5. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_reports ENABLE ROW LEVEL SECURITY;

-- 6. CRIAR POLÍTICAS DE SEGURANÇA
-- =====================================================

-- Políticas para tabela users
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas para tabela payments
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas para tabela user_activities
DROP POLICY IF EXISTS "Users can view own activities" ON user_activities;
CREATE POLICY "Users can view own activities" ON user_activities
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "Users can insert own activities" ON user_activities;
CREATE POLICY "Users can insert own activities" ON user_activities
    FOR INSERT WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas para tabela user_sessions
DROP POLICY IF EXISTS "Users can manage own sessions" ON user_sessions;
CREATE POLICY "Users can manage own sessions" ON user_sessions
    FOR ALL USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas para tabela progress_reports
DROP POLICY IF EXISTS "Users can view own reports" ON progress_reports;
CREATE POLICY "Users can view own reports" ON progress_reports
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- 7. INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================

-- Usuário administrador principal
INSERT INTO users (
    email, password_hash, plan, plan_name, plan_duration, plan_price,
    orderbump, orderbump_total, total_paid, start_date, end_date,
    status, payment_method, payment_status, is_admin
) VALUES (
    'ashercongintencia@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Hash da senha: DIVJroiDIVJ#18072002
    'admin',
    'Administrador',
    999,
    0.00,
    '[]'::jsonb,
    0.00,
    0.00,
    NOW(),
    NOW() + INTERVAL '100 years',
    'active',
    'admin',
    'confirmed',
    true
) ON CONFLICT (email) DO NOTHING;

-- Usuário administrador de exemplo (backup)
INSERT INTO users (
    email, password_hash, plan, plan_name, plan_duration, plan_price,
    orderbump, orderbump_total, total_paid, start_date, end_date,
    status, payment_method, payment_status, is_admin
) VALUES (
    'admin@meubebeinteligente.com',
    '$2a$10$example_hash_here', -- Substitua por um hash real de senha
    'yearly',
    'Anual',
    12,
    290.00,
    '[]'::jsonb,
    0.00,
    290.00,
    NOW(),
    NOW() + INTERVAL '12 months',
    'active',
    'pix',
    'confirmed',
    false
) ON CONFLICT (email) DO NOTHING;

-- 8. CRIAR VIEWS ÚTEIS
-- =====================================================

-- View para usuários ativos com informações de plano
CREATE OR REPLACE VIEW active_users AS
SELECT 
    u.id,
    u.email,
    u.plan,
    u.plan_name,
    u.plan_duration,
    u.plan_price,
    u.start_date,
    u.end_date,
    u.status,
    u.created_at,
    EXTRACT(DAYS FROM (u.end_date - NOW())) as days_remaining
FROM users u
WHERE u.status = 'active' 
AND u.end_date > NOW();

-- View para estatísticas de atividades
CREATE OR REPLACE VIEW activity_stats AS
SELECT 
    ua.user_email,
    ua.activity_type,
    COUNT(*) as total_activities,
    SUM(ua.time_spent) as total_time_spent,
    AVG(ua.time_spent) as avg_time_per_activity,
    MAX(ua.timestamp) as last_activity
FROM user_activities ua
GROUP BY ua.user_email, ua.activity_type;

-- 9. CONFIGURAR WEBHOOKS (OPCIONAL)
-- =====================================================

-- Função para notificar quando usuário está próximo do vencimento
CREATE OR REPLACE FUNCTION notify_expiring_users()
RETURNS void AS $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT email, plan_name, end_date
        FROM users 
        WHERE status = 'active' 
        AND end_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
    LOOP
        -- Aqui você pode adicionar lógica para enviar email ou notificação
        RAISE NOTICE 'Usuário % com plano % expira em %', 
            user_record.email, 
            user_record.plan_name, 
            user_record.end_date;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 10. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se todas as tabelas foram criadas
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('users', 'payments', 'user_activities', 'user_sessions', 'progress_reports');
    
    IF table_count = 5 THEN
        RAISE NOTICE '✅ Todas as 5 tabelas foram criadas com sucesso!';
    ELSE
        RAISE NOTICE '⚠️ Apenas % de 5 tabelas foram criadas.', table_count;
    END IF;
END $$;

-- Verificar se as funções foram criadas
DO $$
DECLARE
    function_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name IN ('check_user_access', 'record_user_activity', 'generate_daily_progress_report');
    
    IF function_count = 3 THEN
        RAISE NOTICE '✅ Todas as 3 funções foram criadas com sucesso!';
    ELSE
        RAISE NOTICE '⚠️ Apenas % de 3 funções foram criadas.', function_count;
    END IF;
END $$;

-- =====================================================
-- SCRIPT CONCLUÍDO!
-- =====================================================
-- 
-- Próximos passos:
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique se todas as tabelas foram criadas
-- 3. Configure as credenciais no seu projeto
-- 4. Teste a integração
-- 
-- Para testar, você pode executar:
-- SELECT * FROM active_users;
-- SELECT * FROM activity_stats;
-- =====================================================
