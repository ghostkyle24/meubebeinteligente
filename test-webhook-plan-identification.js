// Teste para verificar identificação de planos no webhook
function getPlanName(amount) {
    // Identificar o plano baseado no valor (considerando orderbumps)
    if (amount >= 29 && amount < 50) {
        return 'Mensal';
    } else if (amount >= 79 && amount < 100) {
        return 'Trimestral';
    } else if (amount >= 299 && amount < 350) {
        return 'Anual';
    } else if (amount >= 50 && amount < 79) {
        return 'Mensal'; // Mensal + orderbump
    } else if (amount >= 100 && amount < 299) {
        return 'Trimestral'; // Trimestral + orderbump
    } else if (amount >= 350) {
        return 'Anual'; // Anual + orderbump
    } else {
        return 'Mensal'; // Fallback
    }
}

function testWebhookPlanIdentification() {
    console.log('🧪 Testando identificação de planos no webhook...');
    
    const testCases = [
        { amount: 29, expected: 'Mensal', description: 'Plano Mensal' },
        { amount: 48.90, expected: 'Mensal', description: 'Mensal + Controle Parental (R$ 19,90)' },
        { amount: 56.30, expected: 'Mensal', description: 'Mensal + Plano Alimentar (R$ 27,40)' },
        { amount: 76.30, expected: 'Mensal', description: 'Mensal + Ambos orderbumps (R$ 47,30)' },
        { amount: 79, expected: 'Trimestral', description: 'Plano Trimestral' },
        { amount: 98.90, expected: 'Trimestral', description: 'Trimestral + Controle Parental (R$ 19,90)' },
        { amount: 106.30, expected: 'Trimestral', description: 'Trimestral + Plano Alimentar (R$ 27,40)' },
        { amount: 126.30, expected: 'Trimestral', description: 'Trimestral + Ambos orderbumps (R$ 47,30)' },
        { amount: 299, expected: 'Anual', description: 'Plano Anual' },
        { amount: 318.90, expected: 'Anual', description: 'Anual + Controle Parental (R$ 19,90)' },
        { amount: 326.30, expected: 'Anual', description: 'Anual + Plano Alimentar (R$ 27,40)' },
        { amount: 346.30, expected: 'Anual', description: 'Anual + Ambos orderbumps (R$ 47,30)' }
    ];
    
    let correct = 0;
    let total = testCases.length;
    
    testCases.forEach(testCase => {
        const result = getPlanName(testCase.amount);
        const isCorrect = result === testCase.expected;
        
        if (isCorrect) correct++;
        
        console.log(`${isCorrect ? '✅' : '❌'} R$ ${testCase.amount.toFixed(2)} → ${result} (esperado: ${testCase.expected}) - ${testCase.description}`);
    });
    
    console.log(`\n📊 Resultado: ${correct}/${total} (${((correct/total)*100).toFixed(1)}%)`);
    
    if (correct === total) {
        console.log('🎉 Todos os testes passaram! A identificação de planos está funcionando corretamente.');
    } else {
        console.log('⚠️ Alguns testes falharam. Verifique a lógica de identificação.');
    }
}

// Executar teste
testWebhookPlanIdentification();
