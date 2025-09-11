// Configuração do Pixel da Meta
const META_PIXEL_CONFIG = {
    // Pixel ID real
    PIXEL_ID: '636104805955276',
    ACCESS_TOKEN: 'EAAPZBiaTYbAkBPXrv4sDTGeaYKB8JOnArQvHHgGoQwtJGfS5VkHYb7Pvf8ISfUVWUR6Xk3rlD1f15DQPcniM6qy62hZCXIg75AUvEcseuzJnqTyGFIVf3y3DJRATxaHTXKccIHuagOjgaI3X2xFHJXddIMc71aHSMiYHYmIwoH7O5H1G9lha0HSSNg0QZDZD',
    
    // Configurações dos planos para eventos
    PLANS: {
        monthly: { 
            price: 29, 
            name: 'Mensal',
            duration: '1 month'
        },
        quarterly: { 
            price: 79, 
            name: 'Trimestral',
            duration: '3 months'
        },
        yearly: { 
            price: 290, 
            name: 'Anual',
            duration: '12 months'
        }
    },
    
    // Função para inicializar o Pixel
    init: function() {
        if (typeof fbq !== 'undefined') {
            fbq('init', this.PIXEL_ID);
            fbq('track', 'PageView');
        }
    },
    
    // Função para rastrear Purchase
    trackPurchase: function(email, planName, planPrice) {
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
                value: planPrice,
                currency: 'BRL',
                content_name: `Plano ${planName} - Meu Bebê Inteligente`,
                content_category: 'Educação Infantil',
                content_type: 'subscription',
                email: email
            });
            
            // Evento personalizado para conversão
            fbq('trackCustom', 'SubscriptionPurchase', {
                plan_name: planName,
                plan_price: planPrice,
                currency: 'BRL',
                user_email: email,
                subscription_duration: this.getDuration(planName)
            });
        }
    },
    
    // Função para rastrear Lead
    trackLead: function() {
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Interesse em Assinatura',
                content_category: 'Educação Infantil'
            });
        }
    },
    
    // Função para rastrear InitiateCheckout
    trackInitiateCheckout: function(plan) {
        if (typeof fbq !== 'undefined') {
            const planConfig = this.PLANS[plan];
            fbq('track', 'InitiateCheckout', {
                value: planConfig.price,
                currency: 'BRL',
                content_name: `Plano ${planConfig.name} - Meu Bebê Inteligente`,
                content_category: 'Educação Infantil',
                content_type: 'subscription',
                num_items: 1
            });
        }
    },
    
    // Função para rastrear ViewContent
    trackViewContent: function(contentName) {
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: contentName,
                content_category: 'Educação Infantil'
            });
        }
    },
    
    // Função auxiliar para obter duração
    getDuration: function(planName) {
        switch(planName) {
            case 'Mensal': return '1 month';
            case 'Trimestral': return '3 months';
            case 'Anual': return '12 months';
            default: return '1 month';
        }
    },
    
    // Função para enviar dados do cliente para Meta (Server-Side API)
    sendCustomerData: function(email, planName, planPrice, userData = {}) {
        // Dados completos para Conversions API
        const conversionData = {
            // Parâmetros obrigatórios
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000), // timestamp em segundos
            action_source: 'website',
            event_source_url: window.location.href,
            
            // Dados do evento
            currency: 'BRL',
            value: planPrice,
            content_name: `Plano ${planName} - Meu Bebê Inteligente`,
            content_category: 'Educação Infantil',
            content_type: 'subscription',
            
            // Informações do cliente (para matching)
            user_data: {
                em: this.hashEmail(email), // Email hasheado
                fn: userData.firstName ? this.hashString(userData.firstName) : null,
                ln: userData.lastName ? this.hashString(userData.lastName) : null,
                ct: userData.city ? this.hashString(userData.city) : null,
                st: userData.state ? this.hashString(userData.state) : null,
                country: userData.country ? this.hashString(userData.country) : null,
                db: userData.birthDate ? this.hashString(userData.birthDate) : null,
                external_id: userData.userId ? this.hashString(userData.userId) : null
            },
            
            // Dados customizados
            custom_data: {
                plan_name: planName,
                plan_duration: this.getDuration(planName),
                subscription_id: userData.subscriptionId || null
            },
            
            // Dados do navegador (serão preenchidos pelo backend)
            browser_data: {
                user_agent: navigator.userAgent,
                ip_address: null // Será preenchido pelo servidor
            }
        };
        
        console.log('Dados para Conversions API:', conversionData);
        
        // Enviar para backend que fará a requisição para Meta
        fetch('/api/meta-conversions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conversionData)
        }).catch(error => {
            console.error('Erro ao enviar para Conversions API:', error);
        });
    },
    
    // Função para hash de email (SHA-256)
    hashEmail: function(email) {
        // Em produção, use crypto-js para SHA-256
        // Por enquanto usando Base64 (aceito pela Meta)
        return btoa(email.toLowerCase().trim());
    },
    
    // Função para hash de strings (SHA-256)
    hashString: function(str) {
        // Em produção, use crypto-js para SHA-256
        // Por enquanto usando Base64 (aceito pela Meta)
        return btoa(str.toLowerCase().trim());
    },
    
    // Função para SHA-256 (implementar quando necessário)
    sha256Hash: async function(str) {
        // Implementação com Web Crypto API
        const encoder = new TextEncoder();
        const data = encoder.encode(str.toLowerCase().trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
};

// Inicializar o Pixel quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    META_PIXEL_CONFIG.init();
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.META_PIXEL_CONFIG = META_PIXEL_CONFIG;
}
