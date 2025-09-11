-- Schema do banco de dados Supabase para Meu Bebê Inteligente
-- Execute este SQL no editor SQL do Supabase

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL, -- 'monthly', 'quarterly', 'yearly'
    plan_name VARCHAR(100) NOT NULL,
    plan_duration INTEGER NOT NULL, -- duração em meses
    plan_price DECIMAL(10,2) NOT NULL,
    orderbump JSONB DEFAULT '[]'::jsonb, -- array de orderbumps selecionados
    orderbump_total DECIMAL(10,2) DEFAULT 0,
    total_paid DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    payment_method VARCHAR(50), -- 'pix', 'card'
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
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

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_end_date ON users(end_date);
CREATE INDEX IF NOT EXISTS idx_payments_user_email ON payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_email ON user_activities(user_email);
CREATE INDEX IF NOT EXISTS idx_user_activities_timestamp ON user_activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_email ON user_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_progress_reports_user_email ON progress_reports(user_email);
CREATE INDEX IF NOT EXISTS idx_progress_reports_date ON progress_reports(report_date);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela users
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS - Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_reports ENABLE ROW LEVEL SECURITY;

-- Política para usuários (podem ver apenas seus próprios dados)
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para pagamentos
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para atividades
CREATE POLICY "Users can view own activities" ON user_activities
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can insert own activities" ON user_activities
    FOR INSERT WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para sessões
CREATE POLICY "Users can manage own sessions" ON user_sessions
    FOR ALL USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Política para relatórios
CREATE POLICY "Users can view own reports" ON progress_reports
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

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

-- Inserir dados de exemplo (opcional - remover em produção)
INSERT INTO users (
    email, password_hash, plan, plan_name, plan_duration, plan_price,
    orderbump, orderbump_total, total_paid, start_date, end_date,
    status, payment_method, payment_status
) VALUES (
    'admin@meubebeinteligente.com',
    '$2a$10$example_hash_here', -- Hash da senha (use bcrypt em produção)
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
    'confirmed'
) ON CONFLICT (email) DO NOTHING;
