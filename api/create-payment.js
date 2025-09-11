// API endpoint para criar pagamentos via Pagar.me
// Este endpoint será usado no Vercel como serverless function

export default async function handler(req, res) {
    // Verificar se é POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('🚀 API ATUALIZADA - Versão com endereço de cobrança');
        console.log('📥 Request body recebido:', JSON.stringify(req.body, null, 2));
        
        const { 
            amount, 
            customer, 
            plan, 
            orderbumpItems = [],
            paymentMethod = 'pix',
            card
        } = req.body;
        
        console.log('🔍 Payment method:', paymentMethod);

        // Token de acesso do Pagar.me (SANDBOX/TESTE)
        const PAGARME_API_KEY = 'ak_test_grX96QdGicOa2BLGZrDRTR5qNQxJW0';

        // Parse do telefone para extrair código de área e número
        const phone = customer.phone || '11999999999';
        const areaCode = phone.substring(0, 2);
        const phoneNumber = phone.substring(2);

        // Preparar dados do pedido (estrutura correta do Pagar.me v1)
        const orderData = {
            api_key: PAGARME_API_KEY,
            amount: Math.round(plan.price * 100), // em centavos
            payment_method: paymentMethod,
            customer: {
                external_id: `customer_${Date.now()}`,
                name: customer.name,
                type: 'individual',
                country: 'br',
                email: customer.email,
                documents: [
                    {
                        type: 'cpf',
                        number: customer.document || '00000000000'
                    }
                ],
                phone_numbers: [`+55${phone}`],
                birthday: '1985-01-01'
            },
            ...(paymentMethod === 'credit_card' && card ? {
                card_number: card.number,
                card_cvv: card.cvv,
                card_expiration_date: `${card.exp_month}${card.exp_year}`,
                card_holder_name: card.holder_name
            } : {}),
            billing: {
                name: customer.name,
                address: {
                    street: 'Rua das Flores',
                    street_number: '123',
                    neighborhood: 'Jardins',
                    zipcode: '01234567',
                    city: 'São Paulo',
                    state: 'SP',
                    country: 'BR'
                }
            },
            items: [
                {
                    id: `PLANO_${plan.name.toUpperCase()}`,
                    title: `Plano ${plan.name} - Meu Bebê Inteligente`,
                    unit_price: Math.round(plan.price * 100), // em centavos
                    quantity: 1,
                    tangible: false
                }
            ]
        };

        // Adicionar orderbumps se houver
        if (orderbumpItems.length > 0) {
            orderbumpItems.forEach((item, index) => {
                orderData.items.push({
                    id: `ORDERBUMP_${index + 1}`,
                    title: item.name,
                    unit_price: Math.round(item.price * 100), // em centavos
                    quantity: 1,
                    tangible: false
                });
            });
        }
        
        // Calcular total dos itens
        const totalItems = orderData.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
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

        console.log('📦 Criando transação no Pagar.me:', JSON.stringify(orderData, null, 2));
        console.log('💳 Dados do cartão:', JSON.stringify(card, null, 2));
        console.log('🏠 Endereço do cliente:', orderData.customer);
        console.log('🏠 Endereço de cobrança:', orderData.billing);

        // Fazer requisição para Pagar.me
        const response = await fetch('https://api.pagar.me/core/v1/transactions', {
            method: 'POST',
            headers: {
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
        
        // Log específico para pagamentos com cartão
        if (paymentMethod === 'credit_card' && result.charges) {
            console.log('💳 Status das charges:', result.charges.map(charge => ({
                id: charge.id,
                status: charge.status,
                payment_method: charge.payment_method,
                last_transaction: charge.last_transaction ? {
                    status: charge.last_transaction.status,
                    gateway_response: charge.last_transaction.gateway_response
                } : null
            })));
        }

        if (response.ok) {
            console.log('✅ Transação criada com sucesso:', result);
            
            // Verificar se o pagamento foi aprovado
            let paymentApproved = false;
            if (result.status === 'paid' || result.status === 'authorized') {
                paymentApproved = true;
            }
            
            // Preparar resposta para o frontend
            const paymentResponse = {
                success: true,
                order_id: result.id,
                status: result.status,
                amount: result.amount,
                currency: result.currency,
                customer: result.customer,
                charges: result.charges || [],
                payment_approved: paymentApproved
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
