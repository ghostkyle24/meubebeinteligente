const { ASAAS_API_KEY, ASAAS_BASE_URL } = require('./config.js');

async function testPixCodeOnly() {
    console.log('🧪 Testando se código PIX está sendo gerado...');
    
    try {
        // 1. Criar cliente
        console.log('👤 Criando cliente...');
        const customerData = {
            name: 'Teste Código PIX',
            email: 'teste.codigo@exemplo.com',
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
            description: 'Teste Código PIX'
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
        
        // 3. Verificar resposta completa
        console.log('\n📋 Resposta completa do pagamento:');
        console.log(JSON.stringify(payment, null, 2));
        
        // 4. Verificar se tem dados do PIX
        if (payment.pixTransaction) {
            console.log('\n✅ PIX Transaction encontrado!');
            console.log('📱 QR Code URL (código PIX):', payment.pixTransaction.payload);
            console.log('🖼️ QR Code Image:', payment.pixTransaction.encodedImage ? 'Disponível' : 'Não disponível');
        } else {
            console.log('\n❌ PIX Transaction não encontrado');
        }
        
        // 5. Verificar outros campos que podem conter código PIX
        console.log('\n🔍 Verificando outros campos...');
        console.log('📄 invoiceUrl:', payment.invoiceUrl);
        console.log('📄 invoiceNumber:', payment.invoiceNumber);
        console.log('📄 bankSlipUrl:', payment.bankSlipUrl);
        
        // 6. Aguardar e verificar novamente
        console.log('\n⏳ Aguardando 10 segundos...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const checkResponse = await fetch(`${ASAAS_BASE_URL}/payments/${payment.id}`, {
            method: 'GET',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Accept': 'application/json'
            }
        });
        
        if (checkResponse.ok) {
            const checkResult = await checkResponse.json();
            console.log('\n📋 Resposta após 10s:');
            console.log(JSON.stringify(checkResult, null, 2));
            
            if (checkResult.pixTransaction) {
                console.log('\n✅ PIX Transaction encontrado após 10s!');
                console.log('📱 QR Code URL (código PIX):', checkResult.pixTransaction.payload);
            }
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

testPixCodeOnly();
