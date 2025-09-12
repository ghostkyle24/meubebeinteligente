// Teste para confirmar pagamento no sandbox do Asaas
const ASAAS_API_KEY = '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmNmNjUzNjFiLTEyMjUtNGMzMy04ZDhjLWUwMzQ3ZjdjOTYxODo6JGFhY2hfNTI2ZWJjMDAtZTQ3YS00ZWM3LTg1MzktMTg2OGM3YTZlZTZm';
const ASAAS_BASE_URL = 'https://sandbox.asaas.com/api/v3';

async function confirmPayment() {
    console.log('💰 Confirmando pagamento no sandbox...');
    
    try {
        // Primeiro, vamos listar as cobranças pendentes
        console.log('📋 Buscando cobranças pendentes...');
        const listResponse = await fetch(`${ASAAS_BASE_URL}/payments?status=PENDING&limit=5`, {
            method: 'GET',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!listResponse.ok) {
            throw new Error(`Erro ao buscar cobranças: ${listResponse.status}`);
        }
        
        const listResult = await listResponse.json();
        console.log('📋 Cobranças encontradas:', listResult.data.length);
        
        if (listResult.data.length === 0) {
            console.log('❌ Nenhuma cobrança pendente encontrada');
            console.log('💡 Crie uma cobrança primeiro usando: node test-asaas-integration.js');
            return;
        }
        
        // Pegar a primeira cobrança pendente
        const payment = listResult.data[0];
        console.log('🎯 Cobrança selecionada:', payment.id);
        console.log('💰 Valor:', payment.value);
        console.log('📅 Vencimento:', payment.dueDate);
        
        // Simular confirmação de pagamento usando o método correto
        console.log('✅ Simulando confirmação de pagamento...');
        const confirmResponse = await fetch(`${ASAAS_BASE_URL}/payments/${payment.id}/receiveInCash`, {
            method: 'POST',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                paymentDate: new Date().toISOString().split('T')[0],
                value: payment.value,
                notifyCustomer: false
            })
        });
        
        console.log('📡 Status da confirmação:', confirmResponse.status);
        
        if (confirmResponse.ok) {
            const confirmResult = await confirmResponse.json();
            console.log('✅ Pagamento confirmado com sucesso!');
            console.log('📋 Resultado:', JSON.stringify(confirmResult, null, 2));
            console.log('🎉 Webhook deve ser disparado agora!');
        } else {
            const errorResult = await confirmResponse.json();
            console.log('❌ Erro ao confirmar pagamento:', errorResult);
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

// Executar o teste
confirmPayment();
