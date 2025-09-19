// Teste da integração com Asaas
// Execute este arquivo para testar a conexão com a API do Asaas

const ASAAS_API_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojc0ZGY5MDE5LTgzNmMtNDk4NS1hMWFiLTU5YjA2NmIxNzM0ZDo6JGFhY2hfNGRlZmM2NzUtMGQ1Ny00ZjI2LWIxYjYtMDBiNDA3ODMzZTQw';
const ASAAS_BASE_URL = 'https://api.asaas.com/v3';

// Dados de teste (conforme documentação oficial do Asaas)
const testCustomer = {
    name: 'Cliente Teste',
    email: 'teste@exemplo.com',
    cpfCnpj: '12345678909',
    phone: '4738010919',
    mobilePhone: '4738010919',
    address: 'Rua das Flores',
    addressNumber: '123',
    complement: 'Apto 101',
    province: 'Centro',
    postalCode: '01234567',
    city: 'São Paulo',
    state: 'SP',
    country: 'BRA'
};

const testPayment = {
    customer: '', // Será preenchido após criar o cliente
    billingType: 'PIX',
    value: 29,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: 'Teste de integração - Meu Bebê Inteligente',
    externalReference: `TESTE_${Date.now()}`,
    notificationDisabled: false
};

async function testAsaasConnection() {
    console.log('🧪 Iniciando teste de conexão com Asaas...');
    
    try {
        // Teste 1: Verificar se a API está respondendo
        console.log('📡 Testando conexão básica...');
        const response = await fetch(`${ASAAS_BASE_URL}/customers?limit=1`, {
            method: 'GET',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 Status da resposta:', response.status);
        console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            console.log('✅ Conexão com Asaas funcionando!');
            
            // Teste 2: Criar um cliente
            console.log('👤 Testando criação de cliente...');
            const customerResponse = await fetch(`${ASAAS_BASE_URL}/customers`, {
                method: 'POST',
                headers: {
                    'access_token': ASAAS_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testCustomer)
            });
            
            const customerResult = await customerResponse.json();
            console.log('👤 Status da criação do cliente:', customerResponse.status);
            console.log('👤 Resultado:', JSON.stringify(customerResult, null, 2));
            
            if (customerResponse.ok) {
                console.log('✅ Cliente criado com sucesso!');
                
                // Teste 3: Criar uma cobrança PIX
                console.log('💰 Testando criação de cobrança PIX...');
                testPayment.customer = customerResult.id;
                
                const paymentResponse = await fetch(`${ASAAS_BASE_URL}/payments`, {
                    method: 'POST',
                    headers: {
                        'access_token': ASAAS_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(testPayment)
                });
                
                const paymentResult = await paymentResponse.json();
                console.log('💰 Status da criação da cobrança:', paymentResponse.status);
                console.log('💰 Resultado:', JSON.stringify(paymentResult, null, 2));
                
                if (paymentResponse.ok) {
                    console.log('✅ Cobrança PIX criada com sucesso!');
                    console.log('🎉 Todos os testes passaram!');
                } else {
                    console.error('❌ Erro ao criar cobrança:', paymentResult);
                }
            } else {
                console.error('❌ Erro ao criar cliente:', customerResult);
            }
        } else {
            const errorResult = await response.json();
            console.error('❌ Erro na conexão:', errorResult);
        }
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

// Executar o teste
testAsaasConnection();
