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

        // Parse do telefone para extrair código de área e número
        const phone = customer.phone || '11999999999';
        const areaCode = phone.substring(0, 2);
        const phoneNumber = phone.substring(2);

        // Preparar dados do pedido (estrutura correta do Pagar.me v5)
        const orderData = {
            items: [
                {
                    name: `Plano ${plan.name} - Meu Bebê Inteligente`,
                    description: `Assinatura do plano ${plan.name} - Meu Bebê Inteligente`,
                    quantity: 1,
                    unit_amount: Math.round(plan.price * 100), // em centavos
                    amount: Math.round(plan.price * 100) // em centavos
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
                        area_code: areaCode, // Código de área extraído
                        number: phoneNumber // Número sem código de área
                    }
                }
            },
            payments: [
                {
                    payment_method: paymentMethod,
                    pix: paymentMethod === 'pix' ? {
                        expires_in: 3600 // 1 hora
                    } : undefined,
                    credit_card: paymentMethod === 'credit_card' ? {
                        installments: 1,
                        statement_descriptor: 'MEU BEBE INTELIGENTE',
                        card: req.body.card || {}
                    } : undefined
                }
            ]
        };

        // Adicionar orderbumps se houver
        if (orderbumpItems.length > 0) {
            orderbumpItems.forEach((item, index) => {
                orderData.items.push({
                    name: item.name,
                    description: item.name,
                    quantity: 1,
                    unit_amount: Math.round(item.price * 100), // em centavos
                    amount: Math.round(item.price * 100) // em centavos
                });
            });
        }
        
        // Calcular total dos itens
        const totalItems = orderData.items.reduce((sum, item) => sum + (item.unit_amount * item.quantity), 0);
        orderData.amount = totalItems;

        // Validações antes de enviar
        if (!customer.email || !customer.document) {
            return res.status(400).json({
                success: false,
                error: 'Email e CPF são obrigatórios'
            });
        }
        
        if (orderData.items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum item no pedido'
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
        
        // Log detalhado dos erros se houver
        if (result.errors) {
            console.log('❌ Erros detalhados:', JSON.stringify(result.errors, null, 2));
        }

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
