// Configurações públicas do Meu Bebê Inteligente
// Este arquivo contém apenas configurações que podem ser expostas no frontend

const CONFIG_PUBLIC = {
    // Configurações do Site (públicas)
    SITE_NAME: 'Meu Bebê Inteligente',
    SITE_URL: 'https://meubebeinteligente.vercel.app',
    
    // Supabase URL (pode ser pública)
    SUPABASE_URL: 'https://htmofgizynztknpekfbu.supabase.co',
    
    // Meta Pixel ID (pode ser público)
    META_PIXEL_ID: '636104805955276',
    
    // Planos (informações públicas)
    PLANS: {
        monthly: { price: 29, duration: 1, period: 'month', name: 'Mensal' },
        quarterly: { price: 79, duration: 3, period: 'months', name: 'Trimestral' },
        yearly: { price: 299, duration: 12, period: 'months', name: 'Anual' }
    },
    
    // Orderbumps (informações públicas)
    ORDERBUMPS: {
        parental_control: {
            id: 'parental_control',
            name: 'Controle Parental Avançado',
            description: 'Proteção total para todos os dispositivos da casa contra conteúdo inadequado',
            price: 19.90,
            original_price: 39.90,
            discount: 50
        },
        meal_plan: {
            id: 'meal_plan',
            name: 'Plano Alimentar Personalizado',
            description: 'Plano nutricional completo e personalizado para o desenvolvimento do seu filho',
            price: 27.40,
            original_price: 54.80,
            discount: 50
        }
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG_PUBLIC;
}

// Para Node.js (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG_PUBLIC;
}
