// Webhook para receber notificações do Asaas
// Este endpoint será chamado automaticamente pelo Asaas quando um pagamento for confirmado

export default async function handler(req, res) {
    // Verificar se é POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const webhookData = req.body;
        
        console.log('📥 Webhook Asaas recebido:', JSON.stringify(webhookData, null, 2));

        // Verificar se o pagamento foi aprovado
        if (webhookData.event === 'PAYMENT_CONFIRMED' || webhookData.event === 'PAYMENT_RECEIVED') {
            console.log('✅ Pagamento confirmado:', webhookData.payment?.id);
            
            // Extrair dados do pagamento
            const payment = webhookData.payment;
            const customerEmail = payment?.customer?.email;
            const customerName = payment?.customer?.name;
            const amount = payment?.value; // Asaas envia em reais
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
                    transaction_id: payment.id
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

        // Responder ao Asaas que recebemos a notificação
        res.status(200).json({ 
            received: true, 
            status: 'success',
            message: 'Webhook processado com sucesso'
        });

    } catch (error) {
        console.error('❌ Erro no webhook Asaas:', error);
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
    // Identificar o plano baseado no valor (considerando orderbumps)
    if (amount >= 29 && amount < 50) {
        return 'Mensal';
    } else if (amount >= 79 && amount < 100) {
        return 'Trimestral';
    } else if (amount >= 299 && amount < 350) {
        return 'Anual';
    } else if (amount >= 50 && amount < 79) {
        return 'Mensal'; // Mensal + orderbump
    } else if (amount >= 100 && amount < 299) {
        return 'Trimestral'; // Trimestral + orderbump
    } else if (amount >= 350) {
        return 'Anual'; // Anual + orderbump
    } else {
        return 'Mensal'; // Fallback
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
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}

// Função para hash de strings
function hashString(str) {
    if (!str) return null;
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(str.toLowerCase().trim()).digest('hex');
}
