// API endpoint para criar pagamentos via Asaas
// Este endpoint será usado no Vercel como serverless function

export default async function handler(req, res) {
    // Verificar se é POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('🚀 API ATUALIZADA - Versão com Asaas');
        console.log('📥 Request body recebido:', JSON.stringify(req.body, null, 2));
        
        const { 
            amount, 
            customer, 
            plan, 
            orderbumpItems = [],
            paymentMethod = 'PIX',
            card
        } = req.body;
        
        console.log('🔍 Payment method:', paymentMethod);

        // Configurações do Asaas
        const ASAAS_API_KEY = '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmNmNjUzNjFiLTEyMjUtNGMzMy04ZDhjLWUwMzQ3ZjdjOTYxODo6JGFhY2hfNTI2ZWJjMDAtZTQ3YS00ZWM3LTg1MzktMTg2OGM3YTZlZTZm';
        const ASAAS_BASE_URL = 'https://www.asaas.com/api/v3';

        // Parse do telefone para extrair código de área e número
        const phone = customer.phone || '11999999999';
        const areaCode = phone.substring(0, 2);
        const phoneNumber = phone.substring(2);

        // Calcular valor total (plano + orderbumps)
        let totalAmount = plan.price;
        if (orderbumpItems.length > 0) {
            totalAmount += orderbumpItems.reduce((sum, item) => sum + item.price, 0);
        }

        // Preparar dados do cliente para o Asaas
        const customerData = {
            name: customer.name,
            email: customer.email,
            cpfCnpj: customer.document || '00000000000',
            phone: phone,
            mobilePhone: phone,
            postalCode: '01234567',
            address: 'Rua das Flores, 123',
            addressNumber: '101',
            complement: 'Apto 101',
            province: 'Centro',
            city: 'São Paulo',
            state: 'SP'
        };

        // Preparar dados da cobrança para o Asaas
        const paymentData = {
            customer: '', // Será preenchido após criar o cliente
            billingType: paymentMethod === 'PIX' ? 'PIX' : 'CREDIT_CARD',
            value: totalAmount,
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias
            description: `Plano ${plan.name} - Meu Bebê Inteligente`,
            externalReference: `PLANO_${plan.name.toUpperCase()}_${Date.now()}`,
            notificationDisabled: false
        };

        // Se for PIX, adicionar configurações específicas
        if (paymentMethod === 'PIX') {
            paymentData.pixTransaction = {
                expiresAfter: 3600 // 1 hora
            };
        }

        // Se for cartão de crédito, adicionar configurações específicas
        if (paymentMethod === 'CREDIT_CARD' && card) {
            paymentData.creditCard = {
                holderName: card.holder_name,
                number: card.number,
                expiryMonth: card.exp_month,
                expiryYear: card.exp_year,
                ccv: card.cvv
            };
            paymentData.creditCardHolderInfo = {
                name: card.holder_name,
                email: customer.email,
                cpfCnpj: customer.document || '00000000000',
                postalCode: '01234567',
                addressNumber: '101',
                phone: phone
            };
        }

        // Validações antes de enviar
        if (!customer.email || !customer.document) {
            return res.status(400).json({
                success: false,
                error: 'Email e CPF são obrigatórios'
            });
        }
        
        if (totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Valor do pedido deve ser maior que zero'
            });
        }

        console.log('📦 Criando cliente no Asaas:', JSON.stringify(customerData, null, 2));
        console.log('💳 Dados do cartão:', JSON.stringify(card, null, 2));
        console.log('💰 Valor total:', totalAmount);

        // Primeiro, criar o cliente no Asaas
        const customerResponse = await fetch(`${ASAAS_BASE_URL}/customers`, {
            method: 'POST',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });

        const customerResult = await customerResponse.json();
        console.log('👤 Cliente criado:', JSON.stringify(customerResult, null, 2));

        if (!customerResponse.ok) {
            console.error('❌ Erro ao criar cliente:', customerResult);
            return res.status(400).json({
                success: false,
                error: 'Erro ao criar cliente no Asaas',
                details: customerResult
            });
        }

        // Agora criar a cobrança
        paymentData.customer = customerResult.id;
        console.log('📦 Criando cobrança no Asaas:', JSON.stringify(paymentData, null, 2));

        const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
            method: 'POST',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
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
            console.log('✅ Cobrança criada com sucesso:', result);
            
            // Verificar se o pagamento foi aprovado
            let paymentApproved = false;
            if (result.status === 'CONFIRMED' || result.status === 'RECEIVED') {
                paymentApproved = true;
            }
            
            // Preparar resposta para o frontend
            const paymentResponse = {
                success: true,
                order_id: result.id,
                status: result.status,
                amount: result.value,
                currency: 'BRL',
                customer: result.customer,
                payment_approved: paymentApproved,
                dueDate: result.dueDate,
                description: result.description
            };

            // Se for PIX, adicionar dados do PIX
            if (paymentMethod === 'PIX' && result.pixTransaction) {
                paymentResponse.pix = {
                    qr_code: result.pixTransaction.encodedImage,
                    qr_code_url: result.pixTransaction.payload,
                    expires_at: result.pixTransaction.expirationDate
                };
            }

            // Se for cartão de crédito, adicionar informações da transação
            if (paymentMethod === 'CREDIT_CARD' && result.transactions) {
                const transaction = result.transactions[0];
                paymentResponse.transaction = {
                    id: transaction.id,
                    status: transaction.status,
                    authorizationCode: transaction.authorizationCode
                };
            }

            return res.status(200).json(paymentResponse);
        } else {
            console.error('❌ Erro ao criar cobrança:', result);
            return res.status(400).json({
                success: false,
                error: 'Erro ao criar cobrança no Asaas',
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
