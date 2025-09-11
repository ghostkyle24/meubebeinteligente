// Webhook para receber notificações do Pagar.me
// Este endpoint será chamado automaticamente pelo Pagar.me quando um pagamento for confirmado

export default async function handler(req, res) {
    // Verificar se é POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { status, transaction } = req.body;
        
        console.log('📥 Webhook Pagar.me recebido:', { status, transaction });

        // Verificar se o pagamento foi aprovado
        if (status === 'paid' || status === 'processing') {
            console.log('✅ Pagamento confirmado:', transaction.id);
            
            // Extrair dados do cliente
            const customerEmail = transaction.customer?.email;
            const customerName = transaction.customer?.name;
            const amount = transaction.amount / 100; // Pagar.me envia em centavos
            const planName = getPlanName(amount);
            
            // Enviar evento para Meta Conversions API
            await sendToMetaAPI({
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                event_source_url: 'https://meubebeinteligente.vercel.app',
                user_data: {
                    em: hashEmail(customerEmail),
                    fn: customerName ? hashString(customerName.split(' ')[0]) : null,
                    ln: customerName ? hashString(customerName.split(' ').slice(1).join(' ')) : null,
                    client_ip_address: req.headers['x-forwarded-for'] || req.headers['x-real-ip'],
                    client_user_agent: req.headers['user-agent']
                },
                custom_data: {
                    currency: 'BRL',
                    value: amount,
                    content_name: `Plano ${planName} - Meu Bebê Inteligente`,
                    content_category: 'Educação Infantil',
                    content_type: 'subscription',
                    plan_name: planName,
                    plan_duration: getPlanDuration(planName),
                    transaction_id: transaction.id
                },
                attribution_data: {
                    attribution_share: "1.0"
                },
                original_event_data: {
                    event_name: 'Purchase',
                    event_time: Math.floor(Date.now() / 1000)
                }
            });

            console.log('📊 Evento enviado para Meta com sucesso');
        }

        // Responder ao Pagar.me que recebemos a notificação
        res.status(200).json({ 
            received: true, 
            status: 'success',
            message: 'Webhook processado com sucesso'
        });

    } catch (error) {
        console.error('❌ Erro no webhook Pagar.me:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
}

// Função para enviar dados para Meta Conversions API
async function sendToMetaAPI(eventData) {
    const ACCESS_TOKEN = 'EAAPZBiaTYbAkBPXrv4sDTGeaYKB8JOnArQvHHgGoQwtJGfS5VkHYb7Pvf8ISfUVWUR6Xk3rlD1f15DQPcniM6qy62hZCXIg75AUvEcseuzJnqTyGFIVf3y3DJRATxaHTXKccIHuagOjgaI3X2xFHJXddIMc71aHSMiYHYmIwoH7O5H1G9lha0HSSNg0QZDZD';
    const PIXEL_ID = '636104805955276';

    const metaData = {
        data: [eventData],
        access_token: ACCESS_TOKEN
    };

    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(metaData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ Meta API Response:', result);
            return result;
        } else {
            console.error('❌ Erro Meta API:', result);
            throw new Error(`Meta API Error: ${result.error?.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('❌ Erro ao enviar para Meta:', error);
        throw error;
    }
}

// Função para identificar o plano baseado no valor
function getPlanName(amount) {
    switch (amount) {
        case 29: return 'Mensal';
        case 79: return 'Trimestral';
        case 290: return 'Anual';
        default: return 'Mensal';
    }
}

// Função para obter duração do plano
function getPlanDuration(planName) {
    switch (planName) {
        case 'Mensal': return '1 month';
        case 'Trimestral': return '3 months';
        case 'Anual': return '12 months';
        default: return '1 month';
    }
}

// Função para hash de email
function hashEmail(email) {
    if (!email) return null;
    return btoa(email.toLowerCase().trim());
}

// Função para hash de strings
function hashString(str) {
    if (!str) return null;
    return btoa(str.toLowerCase().trim());
}
