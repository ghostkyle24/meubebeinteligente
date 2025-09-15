// Teste específico para criar cliente no Asaas
const ASAAS_API_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojg4ODJiMjZkLWI3ZDItNDA5Zi04ZDhhLTkwMzYwMDc4NjA5ODo6JGFhY2hfZmM0NTgyZDctZTVhMi00YTkwLTg0MTktYmZhYjIwZmEwYTE5';
const ASAAS_BASE_URL = 'https://www.asaas.com/api/v3';

// Dados do cliente para teste
const customerData = {
    name: 'João da Silva',
    email: 'joao.silva@exemplo.com',
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

async function createCustomer() {
    console.log('👤 Criando cliente no Asaas...');
    console.log('📋 Dados do cliente:', JSON.stringify(customerData, null, 2));
    
    try {
        const response = await fetch(`${ASAAS_BASE_URL}/customers`, {
            method: 'POST',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(customerData)
        });
        
        console.log('\n📡 Status da resposta:', response.status);
        console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));
        
        const result = await response.json();
        console.log('\n📋 Resposta completa:', JSON.stringify(result, null, 2));
        
        if (response.ok) {
            console.log('\n✅ Cliente criado com sucesso!');
            console.log('🆔 ID do cliente:', result.id);
            console.log('📧 Email:', result.email);
            console.log('📱 Telefone:', result.phone);
            return result;
        } else {
            console.log('\n❌ Erro ao criar cliente:');
            console.log('Status:', response.status);
            console.log('Erro:', result);
            
            if (result.errors) {
                console.log('\n🔍 Detalhes dos erros:');
                result.errors.forEach((error, index) => {
                    console.log(`${index + 1}. ${error.description || error.message}`);
                });
            }
        }
        
    } catch (error) {
        console.error('\n❌ Erro na requisição:', error);
    }
}

// Executar o teste
createCustomer();
