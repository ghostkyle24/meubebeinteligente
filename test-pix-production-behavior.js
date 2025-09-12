const { ASAAS_API_KEY, ASAAS_BASE_URL } = require('./config.js');

async function testPixProductionBehavior() {
    console.log('🧪 Testando comportamento do PIX no sandbox...');
    
    try {
        // 1. Criar cliente
        console.log('👤 Criando cliente...');
        const customerData = {
            name: 'Teste Produção',
            email: 'teste.producao@exemplo.com',
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
        
        // 2. Criar pagamento PIX
        console.log('💰 Criando pagamento PIX...');
        const paymentData = {
            customer: customer.id,
            billingType: 'PIX',
            value: 29.00,
            dueDate: '2025-09-15',
            description: 'Teste PIX Produção'
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
        
        if (!paymentResponse.ok) {
            const error = await paymentResponse.json();
            console.error('❌ Erro ao criar pagamento:', error);
            return;
        }
        
        const payment = await paymentResponse.json();
        console.log('✅ Pagamento criado:', payment.id);
        console.log('📊 Status inicial:', payment.status);
        console.log('📊 PIX Transaction inicial:', payment.pixTransaction);
        
        // 3. Aguardar e verificar múltiplas vezes
        console.log('\n🔄 Monitorando PIX por 2 minutos...');
        
        for (let i = 1; i <= 24; i++) { // 24 tentativas = 2 minutos
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5 segundos
            
            console.log(`\n⏰ Tentativa ${i} (${i * 5}s após criação)...`);
            
            const checkResponse = await fetch(`${ASAAS_BASE_URL}/payments/${payment.id}`, {
                method: 'GET',
                headers: {
                    'access_token': ASAAS_API_KEY,
                    'Accept': 'application/json'
                }
            });
            
            if (checkResponse.ok) {
                const checkResult = await checkResponse.json();
                console.log(`📡 Status: ${checkResult.status}`);
                console.log(`📡 PIX Transaction: ${checkResult.pixTransaction ? 'Disponível' : 'Não disponível'}`);
                
                if (checkResult.pixTransaction) {
                    console.log('✅ PIX Transaction encontrado!');
                    console.log('📱 QR Code URL:', checkResult.pixTransaction.payload);
                    console.log('🖼️ QR Code Image:', checkResult.pixTransaction.encodedImage ? 'Disponível' : 'Não disponível');
                    console.log('⏰ Tempo para gerar:', `${i * 5} segundos`);
                    break;
                }
            } else {
                console.log('❌ Erro na requisição:', checkResponse.status);
            }
        }
        
        console.log('\n📋 Resumo do teste:');
        console.log('- Sandbox pode demorar para gerar PIX');
        console.log('- Em produção, geralmente é mais rápido');
        console.log('- Recomendação: implementar fallback para código PIX');
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

testPixProductionBehavior();
