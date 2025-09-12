const { ASAAS_API_KEY, ASAAS_BASE_URL } = require('./config.js');

async function testPaymentFlow() {
    console.log('🧪 Testando fluxo completo de pagamento...');
    
    try {
        // 1. Criar cliente
        console.log('👤 Criando cliente...');
        const customerData = {
            name: 'Teste Frontend',
            email: 'teste@frontend.com',
            cpfCnpj: '16412531696',
            phone: '3171391218',
            mobilePhone: '3171391218',
            address: 'Rua das Flores',
            addressNumber: '123',
            complement: 'Apto 101',
            province: 'Centro',
            postalCode: '01234567',
            city: 'São Paulo',
            state: 'SP',
            country: 'BRA'
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
            value: 29,
            dueDate: '2025-09-15',
            description: 'Teste Frontend - Meu Bebê Inteligente',
            externalReference: `TESTE_FRONTEND_${Date.now()}`
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
        console.log('📡 Status inicial:', payment.status);
        console.log('📡 PIX Transaction inicial:', payment.pixTransaction);
        
        // 3. Aguardar e buscar dados do PIX
        console.log('🔄 Aguardando processamento do PIX...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const pixResponse = await fetch(`${ASAAS_BASE_URL}/payments/${payment.id}`, {
            method: 'GET',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Accept': 'application/json'
            }
        });
        
        if (!pixResponse.ok) {
            const error = await pixResponse.json();
            console.error('❌ Erro ao buscar PIX:', error);
            return;
        }
        
        const pixPayment = await pixResponse.json();
        console.log('📡 Status após 3s:', pixPayment.status);
        console.log('📡 PIX Transaction após 3s:', pixPayment.pixTransaction);
        
        if (pixPayment.pixTransaction) {
            console.log('✅ QR Code encontrado!');
            console.log('📱 QR Code URL:', pixPayment.pixTransaction.payload);
            console.log('🖼️ QR Code Image:', pixPayment.pixTransaction.encodedImage ? 'Disponível' : 'Não disponível');
        } else {
            console.log('❌ QR Code ainda não disponível');
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

testPaymentFlow();
