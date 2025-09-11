// Configurações de Exemplo - Meu Bebê Inteligente
// Copie este arquivo para config.js e configure suas credenciais

const CONFIG = {
    // Supabase - Configure suas credenciais
    SUPABASE_URL: 'https://seu-projeto.supabase.co',
    SUPABASE_ANON_KEY: 'sua-chave-anonima-aqui',
    
    // Pagar.me - Configure sua chave de API
    PAGARME_API_KEY: 'sua-chave-pagarme-aqui',
    
    // Admin - Configure suas credenciais de administrador
    ADMIN_EMAIL: 'seu-email-admin@exemplo.com',
    ADMIN_EMAIL_ALT: 'seu-email-admin-alternativo@exemplo.com',
    ADMIN_PASSWORD: 'sua-senha-admin-aqui',
    
    // Configurações do Site
    SITE_NAME: 'Meu Bebê Inteligente',
    SITE_URL: 'https://seu-site.vercel.app',
    
    // Planos
    PLANS: {
        monthly: { price: 29, duration: 1, period: 'month', name: 'Mensal' },
        quarterly: { price: 79, duration: 3, period: 'months', name: 'Trimestral' },
        yearly: { price: 299, duration: 12, period: 'months', name: 'Anual' }
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Para Node.js (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
