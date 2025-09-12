// Configurações do Asaas
const ASAAS_API_KEY = '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmNmNjUzNjFiLTEyMjUtNGMzMy04ZDhjLWUwMzQ3ZjdjOTYxODo6JGFhY2hfNTI2ZWJjMDAtZTQ3YS00ZWM3LTg1MzktMTg2OGM3YTZlZTZm';
const ASAAS_BASE_URL = 'https://sandbox.asaas.com/api/v3';

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
            throw new Error(`Erro na API Asaas: ${response.status}`);
        }
        
        const payment = await response.json();
        console.log('📡 Payment status:', payment.status);
        
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
        if (payment.billingType === 'PIX' && payment.pixTransaction) {
            responseData.pix = {
                qr_code: payment.pixTransaction.encodedImage,
                qr_code_url: payment.pixTransaction.payload,
                expires_at: payment.pixTransaction.expirationDate
            };
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
