const { ASAAS_API_KEY, ASAAS_BASE_URL } = require('./config.js');

async function testPixTiming() {
    console.log('🧪 Testando timing do PIX...');
    
    try {
        // Usar pagamento existente
        const paymentId = 'pay_pxq4rqm6njehonzj';
        
        for (let i = 1; i <= 10; i++) {
            console.log(`\n⏰ Tentativa ${i} (${i * 2}s após criação)...`);
            
            const response = await fetch(`${ASAAS_BASE_URL}/payments/${paymentId}`, {
                method: 'GET',
                headers: {
                    'access_token': ASAAS_API_KEY,
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const payment = await response.json();
                console.log(`📡 Status: ${payment.status}`);
                console.log(`📡 PIX Transaction: ${payment.pixTransaction ? 'Disponível' : 'Não disponível'}`);
                
                if (payment.pixTransaction) {
                    console.log('✅ QR Code encontrado!');
                    console.log('📱 QR Code URL:', payment.pixTransaction.payload);
                    console.log('🖼️ QR Code Image:', payment.pixTransaction.encodedImage ? 'Disponível' : 'Não disponível');
                    break;
                }
            } else {
                console.log('❌ Erro na requisição:', response.status);
            }
            
            if (i < 10) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

testPixTiming();
