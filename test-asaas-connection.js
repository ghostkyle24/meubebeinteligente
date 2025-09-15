// Teste básico de conexão com Asaas
const ASAAS_API_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6Ojg4ODJiMjZkLWI3ZDItNDA5Zi04ZDhhLTkwMzYwMDc4NjA5ODo6JGFhY2hfZmM0NTgyZDctZTVhMi00YTkwLTg0MTktYmZhYjIwZmEwYTE5';
const ASAAS_BASE_URL = 'https://www.asaas.com/api/v3';

async function testConnection() {
    console.log('🔍 Testando conexão básica com Asaas...');
    console.log('🔑 Chave API:', ASAAS_API_KEY.substring(0, 20) + '...');
    console.log('🌐 URL:', ASAAS_BASE_URL);
    
    try {
        // Teste simples: listar clientes (limit=1)
        const response = await fetch(`${ASAAS_BASE_URL}/customers?limit=1`, {
            method: 'GET',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('\n📡 Status:', response.status);
        console.log('📡 Status Text:', response.statusText);
        
        if (response.ok) {
            const result = await response.json();
            console.log('\n✅ Conexão funcionando!');
            console.log('📋 Resposta:', JSON.stringify(result, null, 2));
        } else {
            const errorResult = await response.json();
            console.log('\n❌ Erro na conexão:');
            console.log('📋 Erro:', JSON.stringify(errorResult, null, 2));
            
            if (response.status === 401) {
                console.log('\n🔍 ERRO 401 - Possíveis causas:');
                console.log('1. Chave API inválida ou expirada');
                console.log('2. Chave API no formato incorreto');
                console.log('3. Conta inativa ou suspensa');
                console.log('4. Problema com o header access_token');
            }
        }
        
    } catch (error) {
        console.error('\n❌ Erro na requisição:', error.message);
    }
}

// Executar o teste
testConnection();
