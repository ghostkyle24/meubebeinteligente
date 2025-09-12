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
            paymentMethod = 'pix',
            card
        } = req.body;
        
        // Normalizar payment method para maiúsculo
        const normalizedPaymentMethod = paymentMethod.toUpperCase();
        console.log('🔍 Payment method original:', paymentMethod);
        console.log('🔍 Payment method normalizado:', normalizedPaymentMethod);

        // Configurações do Asaas
        const ASAAS_API_KEY = '$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmNmNjUzNjFiLTEyMjUtNGMzMy04ZDhjLWUwMzQ3ZjdjOTYxODo6JGFhY2hfNTI2ZWJjMDAtZTQ3YS00ZWM3LTg1MzktMTg2OGM3YTZlZTZm';
        const ASAAS_BASE_URL = 'https://sandbox.asaas.com/api/v3';
        
        // Verificar se a chave API é válida
        if (!ASAAS_API_KEY || !ASAAS_API_KEY.startsWith('$aact_')) {
            return res.status(500).json({
                success: false,
                error: 'Chave API do Asaas inválida'
            });
        }
        
        console.log('🔑 Ambiente detectado:', ASAAS_API_KEY.startsWith('$aact_hmlg_') ? 'SANDBOX' : 'PRODUÇÃO');
        console.log('🔑 Chave API completa:', ASAAS_API_KEY);

        // Parse do telefone para extrair código de área e número
        const phone = customer.phone || '4738010919';
        const areaCode = phone.substring(0, 2);
        const phoneNumber = phone.substring(2);

        // Calcular valor total (plano + orderbumps)
        let totalAmount = plan.price;
        if (orderbumpItems.length > 0) {
            totalAmount += orderbumpItems.reduce((sum, item) => sum + item.price, 0);
        }

        // Preparar dados do cliente para o Asaas (conforme documentação oficial)
        const customerData = {
            name: customer.name && customer.name.length > 2 ? customer.name : 'Cliente Teste',
            email: customer.email,
            cpfCnpj: customer.document || '12345678909',
            phone: phone,
            mobilePhone: phone,
            address: 'Rua das Flores',
            addressNumber: '123',
            complement: 'Apto 101',
            province: 'Centro',
            postalCode: '01234567',
            city: 'São Paulo',
            state: 'SP',
            country: 'BRA'
        };

        console.log('👤 Dados do cliente preparados:', JSON.stringify(customerData, null, 2));

        // Preparar dados da cobrança para o Asaas
        const paymentData = {
            customer: '', // Será preenchido após criar o cliente
            billingType: normalizedPaymentMethod === 'PIX' ? 'PIX' : 'CREDIT_CARD',
            value: totalAmount,
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias
            description: `Plano ${plan.name} - Meu Bebê Inteligente`,
            externalReference: `PLANO_${plan.name.toUpperCase()}_${Date.now()}`,
            notificationDisabled: false
        };

        // Se for PIX, adicionar configurações específicas
        if (normalizedPaymentMethod === 'PIX') {
            paymentData.pixTransaction = {
                expiresAfter: 3600 // 1 hora
            };
        }

        // Se for cartão de crédito, adicionar configurações específicas
        if (normalizedPaymentMethod === 'CREDIT_CARD' && card) {
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
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customer.email)) {
            return res.status(400).json({
                success: false,
                error: 'Email inválido'
            });
        }
        
        if (totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Valor do pedido deve ser maior que zero'
            });
        }

        // Validar e processar CPF
        const cpfDigits = customer.document.replace(/\D/g, '');
        if (cpfDigits.length !== 11) {
            console.log('⚠️ CPF inválido, usando CPF padrão');
            customerData.cpfCnpj = '12345678909';
        } else {
            // Validar CPF usando algoritmo de validação
            if (isValidCPF(cpfDigits)) {
                customerData.cpfCnpj = cpfDigits;
                console.log('✅ CPF válido');
            } else {
                console.log('⚠️ CPF inválido (algoritmo), usando CPF padrão');
                customerData.cpfCnpj = '12345678909';
            }
        }
        
        console.log('👤 CPF processado:', customerData.cpfCnpj);

        console.log('📦 Criando cliente no Asaas:', JSON.stringify(customerData, null, 2));
        console.log('💳 Dados do cartão:', JSON.stringify(card, null, 2));
        console.log('💰 Valor total:', totalAmount);

        // Primeiro, criar o cliente no Asaas
        console.log('🔑 Usando API Key:', ASAAS_API_KEY.substring(0, 20) + '...');
        console.log('🌐 URL da API:', `${ASAAS_BASE_URL}/customers`);
        
        const customerResponse = await fetch(`${ASAAS_BASE_URL}/customers`, {
            method: 'POST',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(customerData)
        });

        const customerResult = await customerResponse.json();
        console.log('👤 Status da resposta do cliente:', customerResponse.status);
        console.log('👤 Cliente criado:', JSON.stringify(customerResult, null, 2));

        if (!customerResponse.ok) {
            console.error('❌ Erro ao criar cliente:', customerResult);
            console.error('❌ Status HTTP:', customerResponse.status);
            console.error('❌ Headers da resposta:', Object.fromEntries(customerResponse.headers.entries()));
            
            // Se o cliente já existe, tentar buscar pelo CPF
            if (customerResponse.status === 400 && customerResult.errors) {
                console.log('🔄 Tentando buscar cliente existente pelo CPF...');
                
                const searchResponse = await fetch(`${ASAAS_BASE_URL}/customers?cpfCnpj=${customerData.cpfCnpj}`, {
                    method: 'GET',
                    headers: {
                        'access_token': ASAAS_API_KEY,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                if (searchResponse.ok) {
                    const searchResult = await searchResponse.json();
                    console.log('🔍 Resultado da busca:', JSON.stringify(searchResult, null, 2));
                    
                    if (searchResult.data && searchResult.data.length > 0) {
                        console.log('✅ Cliente encontrado, usando ID existente');
                        customerResult.id = searchResult.data[0].id;
                    } else {
                        return res.status(400).json({
                            success: false,
                            error: 'Erro ao criar cliente no Asaas',
                            details: customerResult,
                            status: customerResponse.status
                        });
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        error: 'Erro ao criar cliente no Asaas',
                        details: customerResult,
                        status: customerResponse.status
                    });
                }
            } else {
                return res.status(400).json({
                    success: false,
                    error: 'Erro ao criar cliente no Asaas',
                    details: customerResult,
                    status: customerResponse.status
                });
            }
        }

        // Agora criar a cobrança
        paymentData.customer = customerResult.id;
        console.log('📦 Criando cobrança no Asaas:', JSON.stringify(paymentData, null, 2));

        const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
            method: 'POST',
            headers: {
                'access_token': ASAAS_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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
            if (normalizedPaymentMethod === 'PIX' && result.pixTransaction) {
                paymentResponse.pix = {
                    qr_code: result.pixTransaction.encodedImage,
                    qr_code_url: result.pixTransaction.payload,
                    expires_at: result.pixTransaction.expirationDate
                };
            }

            // Se for cartão de crédito, adicionar informações da transação
            if (normalizedPaymentMethod === 'CREDIT_CARD' && result.transactions) {
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

// Função para validar CPF
function isValidCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}
