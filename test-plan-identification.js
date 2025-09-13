// Teste para verificar identificação de planos
const PLANS = {
    monthly: { price: 29, duration: 1, period: 'month', name: 'Mensal' },
    quarterly: { price: 79, duration: 3, period: 'months', name: 'Trimestral' },
    yearly: { price: 299, duration: 12, period: 'months', name: 'Anual' }
};

function testPlanIdentification() {
    console.log('🧪 Testando identificação de planos...');
    
    // Simular diferentes cenários de pagamento
    const testCases = [
        { amount: 29, expected: 'Mensal' },
        { amount: 79, expected: 'Trimestral' },
        { amount: 299, expected: 'Anual' },
        { amount: 48.90, expected: 'Mensal + Orderbump' }, // 29 + 19.90
        { amount: 98.90, expected: 'Trimestral + Orderbump' }, // 79 + 19.90
        { amount: 318.90, expected: 'Anual + Orderbump' }, // 299 + 19.90
        { amount: 56.30, expected: 'Mensal + Orderbump' }, // 29 + 27.40
        { amount: 106.30, expected: 'Trimestral + Orderbump' }, // 79 + 27.40
        { amount: 326.30, expected: 'Anual + Orderbump' }, // 299 + 27.40
        { amount: 76.30, expected: 'Mensal + 2 Orderbumps' }, // 29 + 19.90 + 27.40
        { amount: 126.30, expected: 'Trimestral + 2 Orderbumps' }, // 79 + 19.90 + 27.40
        { amount: 346.30, expected: 'Anual + 2 Orderbumps' } // 299 + 19.90 + 27.40
    ];
    
    testCases.forEach(testCase => {
        const identifiedPlan = identifyPlan(testCase.amount);
        console.log(`💰 R$ ${testCase.amount.toFixed(2)} → ${identifiedPlan} (esperado: ${testCase.expected})`);
    });
}

function identifyPlan(amount) {
    // Identificar o plano baseado no valor
    if (amount >= 29 && amount < 50) {
        return 'Mensal';
    } else if (amount >= 79 && amount < 100) {
        return 'Trimestral';
    } else if (amount >= 299 && amount < 350) {
        return 'Anual';
    } else if (amount >= 50 && amount < 79) {
        return 'Mensal + Orderbump';
    } else if (amount >= 100 && amount < 299) {
        return 'Trimestral + Orderbump';
    } else if (amount >= 350) {
        return 'Anual + Orderbump';
    } else {
        return 'Plano não identificado';
    }
}

// Função para identificar orderbumps
function identifyOrderbumps(amount, planPrice) {
    const orderbumpAmount = amount - planPrice;
    const orderbumps = [];
    
    if (orderbumpAmount >= 19.90) {
        orderbumps.push('Controle Parental (R$ 19,90)');
    }
    if (orderbumpAmount >= 27.40) {
        orderbumps.push('Plano Alimentar (R$ 27,40)');
    }
    if (orderbumpAmount >= 47.30) {
        orderbumps.push('Ambos os orderbumps');
    }
    
    return orderbumps;
}

function testOrderbumpIdentification() {
    console.log('\n🧪 Testando identificação de orderbumps...');
    
    const testCases = [
        { amount: 48.90, planPrice: 29, expected: ['Controle Parental'] },
        { amount: 56.30, planPrice: 29, expected: ['Plano Alimentar'] },
        { amount: 76.30, planPrice: 29, expected: ['Ambos os orderbumps'] },
        { amount: 98.90, planPrice: 79, expected: ['Controle Parental'] },
        { amount: 106.30, planPrice: 79, expected: ['Plano Alimentar'] },
        { amount: 126.30, planPrice: 79, expected: ['Ambos os orderbumps'] }
    ];
    
    testCases.forEach(testCase => {
        const orderbumps = identifyOrderbumps(testCase.amount, testCase.planPrice);
        console.log(`💰 R$ ${testCase.amount.toFixed(2)} (plano: R$ ${testCase.planPrice}) → ${orderbumps.join(', ')}`);
    });
}

// Executar testes
testPlanIdentification();
testOrderbumpIdentification();
