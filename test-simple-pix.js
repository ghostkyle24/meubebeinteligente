const { ASAAS_API_KEY, ASAAS_BASE_URL } = require('./config.js');

async function testSimplePix() {
    console.log('🧪 Testando PIX simples...');
    
    try {
        // Criar pagamento PIX mais simples
        const paymentData = {
            billingType: 'PIX',
            value: 1.00, // Valor mínimo
            dueDate: '2025-09-15',
            description: 'Teste PIX Simples'
        };
        
        console.log('📦 Dados do pagamento:', JSON.stringify(paymentData, null, 2));
        
        const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
            method: 'POST',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });
        
        console.log('📡 Status da resposta:', response.status);
        console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));
        
        const result = await response.json();
        console.log('📡 Resposta completa:', JSON.stringify(result, null, 2));
        
        if (response.ok) {
            console.log('✅ Pagamento criado com sucesso!');
            console.log('🆔 ID:', result.id);
            console.log('📊 Status:', result.status);
            console.log('💰 Valor:', result.value);
            console.log('📅 Vencimento:', result.dueDate);
            
            if (result.pixTransaction) {
                console.log('✅ PIX Transaction disponível!');
                console.log('📱 QR Code URL:', result.pixTransaction.payload);
            } else {
                console.log('❌ PIX Transaction não disponível');
            }
        } else {
            console.log('❌ Erro ao criar pagamento');
            if (result.errors) {
                result.errors.forEach((error, index) => {
                    console.log(`❌ Erro ${index + 1}: ${error.description}`);
                });
            }
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

testSimplePix();
