// API endpoint para enviar dados para Meta Conversions API
// Este arquivo será usado no Vercel como serverless function

export default async function handler(req, res) {
    // Verificar se é POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            event_name,
            event_time,
            action_source,
            event_source_url,
            currency,
            value,
            content_name,
            content_category,
            content_type,
            user_data,
            custom_data,
            browser_data
        } = req.body;

        // Token de acesso da Meta
        const ACCESS_TOKEN = 'EAAPZBiaTYbAkBPXrv4sDTGeaYKB8JOnArQvHHgGoQwtJGfS5VkHYb7Pvf8ISfUVWUR6Xk3rlD1f15DQPcniM6qy62hZCXIg75AUvEcseuzJnqTyGFIVf3y3DJRATxaHTXKccIHuagOjgaI3X2xFHJXddIMc71aHSMiYHYmIwoH7O5H1G9lha0HSSNg0QZDZD';
        
        // Pixel ID real
        const PIXEL_ID = '636104805955276';

        // Obter IP real do cliente
        const clientIP = req.headers['x-forwarded-for'] || 
                        req.headers['x-real-ip'] || 
                        req.connection.remoteAddress || 
                        req.socket.remoteAddress ||
                        (req.connection.socket ? req.connection.socket.remoteAddress : null);

        // Preparar dados para Meta (seguindo estrutura oficial)
        const metaData = {
            data: [{
                event_name,
                event_time,
                action_source,
                event_source_url,
                user_data: {
                    ...user_data,
                    client_ip_address: clientIP,
                    client_user_agent: req.headers['user-agent']
                },
                custom_data: {
                    currency,
                    value: parseFloat(value),
                    content_name,
                    content_category,
                    content_type,
                    ...custom_data
                },
                // Dados de atribuição (opcional)
                attribution_data: {
                    attribution_share: "1.0"
                },
                // Dados do evento original (para desduplicação)
                original_event_data: {
                    event_name,
                    event_time
                }
            }],
            access_token: ACCESS_TOKEN
        };

        // Enviar para Meta Conversions API
        const response = await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(metaData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ Evento enviado para Meta com sucesso:', result);
            return res.status(200).json({ 
                success: true, 
                message: 'Evento enviado para Meta com sucesso',
                meta_response: result
            });
        } else {
            console.error('❌ Erro ao enviar para Meta:', result);
            return res.status(400).json({ 
                success: false, 
                error: 'Erro ao enviar para Meta',
                meta_response: result
            });
        }

    } catch (error) {
        console.error('❌ Erro no endpoint:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
}
