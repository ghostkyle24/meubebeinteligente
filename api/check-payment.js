// Configurações do Asaas (usando variáveis de ambiente)
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_BASE_URL = process.env.ASAAS_BASE_URL;

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { orderId } = req.query;
        
        if (!orderId) {
            return res.status(400).json({ error: 'Order ID é obrigatório' });
        }
        
        console.log('🔍 Verificando status do pagamento no Asaas:', orderId);
        
        // Fazer requisição para Asaas
        const response = await fetch(`${ASAAS_BASE_URL}/payments/${orderId}`, {
            method: 'GET',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Accept': 'application/json'
            }
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erro na API Asaas:', response.status, errorText);
            throw new Error(`Erro na API Asaas: ${response.status} - ${errorText}`);
        }
        
        const payment = await response.json();
        console.log('📡 Payment data:', JSON.stringify(payment, null, 2));
        
        // Se for PIX e ainda não tem pixTransaction, tentar buscar novamente
        if (payment.billingType === 'PIX' && !payment.pixTransaction && payment.status === 'PENDING') {
            console.log('🔄 PIX Transaction não disponível, status:', payment.status);
            
            // No sandbox, o PIX pode demorar para ser processado
            // Vamos retornar que está pendente para o frontend continuar fazendo polling
        }
        
        // Preparar resposta
        const responseData = {
            success: true,
            order_id: orderId,
            status: payment.status,
            amount: payment.value,
            currency: 'BRL',
            dueDate: payment.dueDate,
            description: payment.description
        };
        
        // Adicionar dados do PIX se disponível
        if (payment.billingType === 'PIX') {
            console.log('🔄 Buscando dados do PIX via endpoint específico...');
            
            // Usar endpoint específico para PIX conforme documentação oficial
            const pixResponse = await fetch(`${ASAAS_BASE_URL}/payments/${orderId}/pixQrCode`, {
                method: 'GET',
                headers: {
                    'access_token': ASAAS_API_KEY,
                    'Accept': 'application/json'
                }
            });
            
            if (pixResponse.ok) {
                const pixData = await pixResponse.json();
                console.log('📡 Dados do PIX obtidos:', JSON.stringify(pixData, null, 2));
                
                if (pixData.encodedImage && pixData.payload) {
                    responseData.pix = {
                        qr_code: pixData.encodedImage,
                        qr_code_url: pixData.payload,
                        pixCopiaECola: pixData.payload,
                        pix_copia_e_cola: pixData.payload,
                        expires_at: pixData.expirationDate
                    };
                    console.log('📱 Dados do PIX adicionados:', responseData.pix);
                } else {
                    console.log('⚠️ Dados do PIX incompletos:', pixData);
                }
            } else {
                const errorData = await pixResponse.json();
                console.log('❌ Erro ao buscar dados do PIX:', pixResponse.status, errorData);
            }
        }
        
        return res.status(200).json(responseData);
        
    } catch (error) {
        console.error('❌ Erro ao verificar pagamento:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro ao verificar status do pagamento',
            details: error.message
        });
    }
}
