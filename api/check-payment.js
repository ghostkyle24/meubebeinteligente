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
        
        // Token de acesso do Pagar.me
        const PAGARME_API_KEY = 'sk_85c717614bea451eb81fa2b9e4b09109';
        
        console.log('🔍 Verificando status do pedido:', orderId);
        
        // Fazer requisição para Pagar.me
        const response = await fetch(`https://api.pagar.me/core/v5/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${Buffer.from(PAGARME_API_KEY + ':').toString('base64')}`,
                'Accept': 'application/json'
            }
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erro na API Pagar.me: ${response.status}`);
        }
        
        const order = await response.json();
        console.log('📡 Order status:', order.status);
        
        // Retornar status do pedido
        return res.status(200).json({
            success: true,
            order_id: orderId,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            charges: order.charges
        });
        
    } catch (error) {
        console.error('❌ Erro ao verificar pagamento:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro ao verificar status do pagamento',
            details: error.message
        });
    }
}
