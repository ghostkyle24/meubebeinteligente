const { ASAAS_API_KEY, ASAAS_BASE_URL } = require('./config.js');

async function testCheckPayment() {
    console.log('🧪 Testando check-payment localmente...');
    
    try {
        const orderId = 'pay_fi4ti5azowqilf33';
        console.log('🔍 Verificando pagamento:', orderId);
        
        // Fazer requisição para Asaas
        const response = await fetch(`${ASAAS_BASE_URL}/payments/${orderId}`, {
            method: 'GET',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Accept': 'application/json'
            }
        });
        
        console.log('📡 Status da resposta:', response.status);
        
        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Erro na API Asaas:', error);
            return;
        }
        
        const payment = await response.json();
        console.log('📡 Payment status:', payment.status);
        console.log('📡 Payment billingType:', payment.billingType);
        console.log('📡 PIX Transaction:', payment.pixTransaction ? 'Disponível' : 'Não disponível');
        
        if (payment.pixTransaction) {
            console.log('✅ PIX Transaction encontrado!');
            console.log('📱 QR Code URL:', payment.pixTransaction.payload);
            console.log('🖼️ QR Code Image:', payment.pixTransaction.encodedImage ? 'Disponível' : 'Não disponível');
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

testCheckPayment();
