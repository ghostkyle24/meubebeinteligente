const { ASAAS_API_KEY, ASAAS_BASE_URL } = require('./config.js');

async function testPixMinimum() {
    console.log('🧪 Testando PIX com valor mínimo (R$ 5,00)...');
    
    try {
        // 1. Criar cliente
        console.log('👤 Criando cliente...');
        const customerData = {
            name: 'Teste PIX Mínimo',
            email: 'teste.minimo@exemplo.com',
            cpfCnpj: '12345678909',
            phone: '4738010919',
            mobilePhone: '4738010919'
        };
        
        const customerResponse = await fetch(`${ASAAS_BASE_URL}/customers`, {
            method: 'POST',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(customerData)
        });
        
        if (!customerResponse.ok) {
            const error = await customerResponse.json();
            console.error('❌ Erro ao criar cliente:', error);
            return;
        }
        
        const customer = await customerResponse.json();
        console.log('✅ Cliente criado:', customer.id);
        
        // 2. Criar pagamento PIX com valor mínimo
        console.log('💰 Criando pagamento PIX (R$ 5,00)...');
        const paymentData = {
            customer: customer.id,
            billingType: 'PIX',
            value: 5.00, // Valor mínimo
            dueDate: '2025-09-15',
            description: 'Teste PIX Valor Mínimo'
        };
        
        const paymentResponse = await fetch(`${ASAAS_BASE_URL}/payments`, {
            method: 'POST',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });
        
        console.log('📡 Status da resposta:', paymentResponse.status);
        
        const result = await paymentResponse.json();
        console.log('📡 Resposta completa:', JSON.stringify(result, null, 2));
        
        if (paymentResponse.ok) {
            console.log('✅ Pagamento criado com sucesso!');
            console.log('🆔 ID:', result.id);
            console.log('📊 Status:', result.status);
            console.log('💰 Valor:', result.value);
            
            if (result.pixTransaction) {
                console.log('✅ PIX Transaction disponível imediatamente!');
                console.log('📱 QR Code URL:', result.pixTransaction.payload);
                console.log('🖼️ QR Code Image:', result.pixTransaction.encodedImage ? 'Disponível' : 'Não disponível');
            } else {
                console.log('⏳ PIX Transaction não disponível imediatamente, aguardando...');
                
                // Aguardar e tentar novamente
                for (let i = 1; i <= 3; i++) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    console.log(`🔄 Tentativa ${i} (${i * 2}s)...`);
                    
                    const checkResponse = await fetch(`${ASAAS_BASE_URL}/payments/${result.id}`, {
                        method: 'GET',
                        headers: {
                            'access_token': ASAAS_API_KEY,
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (checkResponse.ok) {
                        const checkResult = await checkResponse.json();
                        console.log(`📡 Status: ${checkResult.status}`);
                        
                        if (checkResult.pixTransaction) {
                            console.log('✅ PIX Transaction encontrado!');
                            console.log('📱 QR Code URL:', checkResult.pixTransaction.payload);
                            console.log('🖼️ QR Code Image:', checkResult.pixTransaction.encodedImage ? 'Disponível' : 'Não disponível');
                            break;
                        } else {
                            console.log('❌ PIX Transaction ainda não disponível');
                        }
                    }
                }
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

testPixMinimum();
