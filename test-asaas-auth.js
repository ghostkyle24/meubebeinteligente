// Teste específico para diagnóstico do erro 401 do Asaas
const ASAAS_API_KEY = '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmNmNjUzNjFiLTEyMjUtNGMzMy04ZDhjLWUwMzQ3ZjdjOTYxODo6JGFhY2hfNTI2ZWJjMDAtZTQ3YS00ZWM3LTg1MzktMTg2OGM3YTZlZTZm';
const ASAAS_BASE_URL = 'https://www.asaas.com/api/v3';

async function testAuth() {
    console.log('🔍 Testando autenticação com Asaas...');
    console.log('🔑 Chave API:', ASAAS_API_KEY.substring(0, 20) + '...');
    
    try {
        // Teste 1: Verificar se a API está respondendo
        console.log('\n📡 Teste 1: Conexão básica');
        const response = await fetch(`${ASAAS_BASE_URL}/customers?limit=1`, {
            method: 'GET',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('Status:', response.status);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        
        const result = await response.json();
        console.log('Resposta:', JSON.stringify(result, null, 2));
        
        if (response.status === 401) {
            console.log('\n❌ ERRO 401 DETECTADO!');
            console.log('Possíveis causas:');
            console.log('1. Chave API inválida ou expirada');
            console.log('2. Chave API no formato incorreto');
            console.log('3. Problema com o header access_token');
            
            // Teste alternativo com Authorization header
            console.log('\n🔄 Teste alternativo com Authorization header...');
            const response2 = await fetch(`${ASAAS_BASE_URL}/customers?limit=1`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${ASAAS_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('Status com Authorization:', response2.status);
            const result2 = await response2.json();
            console.log('Resposta com Authorization:', JSON.stringify(result2, null, 2));
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

testAuth();
