// API endpoint para criar pagamentos via Pagar.me
// Este endpoint será usado no Vercel como serverless function

export default async function handler(req, res) {
    // Verificar se é POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { 
            amount, 
            customer, 
            plan, 
            orderbumpItems = [],
            paymentMethod = 'pix' 
        } = req.body;

        // Token de acesso do Pagar.me
        const PAGARME_API_KEY = 'sk_85c717614bea451eb81fa2b9e4b09109';

        // Preparar dados do pedido (estrutura correta do Pagar.me)
        const orderData = {
            items: [
                {
                    name: `Plano ${plan.name} - Meu Bebê Inteligente`,
                    quantity: 1,
                    unit_amount: Math.round(amount * 100) // em centavos
                }
            ],
            customer: {
                name: customer.name,
                email: customer.email,
                document: customer.document || '00000000000',
                type: 'individual',
                phones: {
                    mobile_phone: {
                        country_code: '55',
                        number: customer.phone || '11999999999'
                    }
                }
            },
            payments: [
                {
                    payment_method: paymentMethod,
                    pix: paymentMethod === 'pix' ? {
                        expires_in: 3600 // 1 hora
                    } : undefined
                }
            ],
            closed: true
        };

        // Adicionar orderbumps se houver
        if (orderbumpItems.length > 0) {
            orderbumpItems.forEach((item, index) => {
                orderData.items.push({
                    name: item.name,
                    quantity: 1,
                    unit_amount: Math.round(item.price * 100) // em centavos
                });
            });
        }

        console.log('📦 Criando pedido no Pagar.me:', JSON.stringify(orderData, null, 2));

        // Fazer requisição para Pagar.me
        const response = await fetch('https://api.pagar.me/core/v5/orders', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(PAGARME_API_KEY + ':').toString('base64')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        const result = await response.json();
        console.log('📡 Response body:', JSON.stringify(result, null, 2));

        if (response.ok) {
            console.log('✅ Pedido criado com sucesso:', result);
            
            // Preparar resposta para o frontend
            const paymentResponse = {
                success: true,
                order_id: result.id,
                status: result.status,
                amount: result.amount,
                currency: result.currency,
                customer: result.customer,
                charges: result.charges
            };

            // Se for PIX, adicionar dados do PIX
            if (paymentMethod === 'pix' && result.charges && result.charges[0]) {
                const charge = result.charges[0];
                const pixTransaction = charge.last_transaction;
                
                if (pixTransaction && pixTransaction.pix) {
                    paymentResponse.pix = {
                        qr_code: pixTransaction.pix.qr_code,
                        qr_code_url: pixTransaction.pix.qr_code_url,
                        expires_at: pixTransaction.pix.expires_at
                    };
                }
            }

            return res.status(200).json(paymentResponse);
        } else {
            console.error('❌ Erro ao criar pedido:', result);
            return res.status(400).json({
                success: false,
                error: 'Erro ao criar pedido no Pagar.me',
                details: result
            });
        }

    } catch (error) {
        console.error('❌ Erro no endpoint:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
}
