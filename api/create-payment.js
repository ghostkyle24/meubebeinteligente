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

        // Configurações do Asaas (PRODUÇÃO - OBRIGATÓRIO usar variáveis de ambiente)
        let ASAAS_API_KEY = process.env.ASAAS_API_KEY ? process.env.ASAAS_API_KEY.trim() : null;
        
        // Fix: Se a chave não começar com $, adicionar (Vercel às vezes corta o $)
        if (ASAAS_API_KEY && !ASAAS_API_KEY.startsWith('$')) {
            ASAAS_API_KEY = '$' + ASAAS_API_KEY;
            console.log('🔧 Fix: Adicionado $ no início da chave API');
        }
        const ASAAS_BASE_URL = process.env.ASAAS_BASE_URL || 'https://api.asaas.com/v3';
        
        // Debug: Verificar variáveis de ambiente
        console.log('🔍 Debug - ASAAS_API_KEY existe:', !!process.env.ASAAS_API_KEY);
        console.log('🔍 Debug - ASAAS_API_KEY length:', process.env.ASAAS_API_KEY ? process.env.ASAAS_API_KEY.length : 0);
        console.log('🔍 Debug - ASAAS_API_KEY trimmed length:', ASAAS_API_KEY ? ASAAS_API_KEY.length : 0);
        console.log('🔍 Debug - Primeiros 30 chars:', ASAAS_API_KEY ? ASAAS_API_KEY.substring(0, 30) : 'UNDEFINED');
        console.log('🔍 Debug - Últimos 10 chars:', ASAAS_API_KEY ? ASAAS_API_KEY.substring(ASAAS_API_KEY.length - 10) : 'UNDEFINED');
        console.log('🔍 Debug - Starts with $aact_:', ASAAS_API_KEY ? ASAAS_API_KEY.startsWith('$aact_') : false);
        console.log('🔍 Debug - Contains prod:', ASAAS_API_KEY ? ASAAS_API_KEY.includes('prod') : false);
        
        // Verificar se a chave API é válida
        if (!ASAAS_API_KEY) {
            console.log('❌ ERRO CRÍTICO: Variável de ambiente ASAAS_API_KEY não configurada!');
            return res.status(500).json({
                success: false,
                error: 'Variável de ambiente ASAAS_API_KEY não configurada no Vercel',
                instructions: 'Configure a variável ASAAS_API_KEY no dashboard do Vercel',
                debug: {
                    hasApiKey: false,
                    environment: process.env.NODE_ENV || 'unknown'
                }
            });
        }
        
        if (!ASAAS_API_KEY.startsWith('$aact_')) {
            console.log('❌ Erro: Chave API com formato inválido');
            console.log('❌ ASAAS_API_KEY:', ASAAS_API_KEY);
            return res.status(500).json({
                success: false,
                error: 'Chave API do Asaas com formato inválido',
                debug: {
                    hasApiKey: !!ASAAS_API_KEY,
                    apiKeyLength: ASAAS_API_KEY ? ASAAS_API_KEY.length : 0,
                    apiKeyPrefix: ASAAS_API_KEY ? ASAAS_API_KEY.substring(0, 10) : 'N/A'
                }
            });
        }
        
        console.log('🔑 Ambiente detectado:', ASAAS_API_KEY.startsWith('$aact_prod_') ? 'PRODUÇÃO' : 'SANDBOX');
        console.log('🔑 Chave API completa:', ASAAS_API_KEY);

        // Parse do telefone para extrair código de área e número
        let phone = customer.phone || '4738010919';
        
        // Limpar telefone (remover caracteres não numéricos)
        phone = phone.replace(/\D/g, '');
        
        // Validar se o telefone tem pelo menos 10 dígitos
        if (phone.length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Telefone inválido - deve ter pelo menos 10 dígitos'
            });
        }
        
        // Se o telefone tem 11 dígitos e começa com 0, remover o 0
        if (phone.length === 11 && phone.startsWith('0')) {
            phone = phone.substring(1);
        }
        
        console.log('📞 Telefone processado:', phone);

        // Calcular valor total (plano + orderbumps)
        let totalAmount = plan.price;
        if (orderbumpItems.length > 0) {
            totalAmount += orderbumpItems.reduce((sum, item) => sum + item.price, 0);
        }

        // Preparar dados do cliente para o Asaas (conforme documentação oficial)
        const customerData = {
            name: customer.name && customer.name.length > 2 ? customer.name : 'Cliente',
            email: customer.email,
            cpfCnpj: customer.document,
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
        
        // Log dos dados que serão enviados
        console.log('📤 Dados que serão enviados para o Asaas:');
        console.log('📤 customerData:', JSON.stringify(customerData, null, 2));

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
        
        // Validar se o telefone não é igual ao CPF (erro comum)
        if (phone === customer.document.replace(/\D/g, '')) {
            return res.status(400).json({
                success: false,
                error: 'Telefone não pode ser igual ao CPF. Verifique os dados informados.'
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
            return res.status(400).json({
                success: false,
                error: 'CPF deve ter 11 dígitos'
            });
        } else {
            // Validar CPF usando algoritmo de validação
            if (isValidCPF(cpfDigits)) {
                customerData.cpfCnpj = cpfDigits;
                console.log('✅ CPF válido');
            } else {
                return res.status(400).json({
                    success: false,
                    error: 'CPF inválido'
                });
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
            console.error('❌ ERRO DETALHADO ao criar cliente:');
            console.error('❌ Status HTTP:', customerResponse.status);
            console.error('❌ Response Body:', JSON.stringify(customerResult, null, 2));
            console.error('❌ Headers da resposta:', Object.fromEntries(customerResponse.headers.entries()));
            console.error('❌ Dados enviados:', JSON.stringify(customerData, null, 2));
            
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
                            status: customerResponse.status,
                            asaas_errors: customerResult.errors || customerResult.error || 'Erro desconhecido'
                        });
                    }
                } else {
                    return res.status(400).json({
                        success: false,
                        error: 'Erro ao criar cliente no Asaas',
                        details: customerResult,
                        status: customerResponse.status,
                        asaas_errors: customerResult.errors || customerResult.error || 'Erro desconhecido'
                    });
                }
            } else {
                return res.status(400).json({
                    success: false,
                    error: 'Erro ao criar cliente no Asaas',
                    details: customerResult,
                    status: customerResponse.status,
                    asaas_errors: customerResult.errors || customerResult.error || 'Erro desconhecido'
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

            // Se for PIX, buscar dados do PIX usando endpoint específico
            if (normalizedPaymentMethod === 'PIX') {
                console.log('🔄 Buscando dados do PIX via endpoint específico...');
                
                // Usar endpoint específico para PIX conforme documentação oficial
                const pixResponse = await fetch(`${ASAAS_BASE_URL}/payments/${result.id}/pixQrCode`, {
                    method: 'GET',
                    headers: {
                        'access_token': ASAAS_API_KEY,
                        'Accept': 'application/json'
                    }
                });
                
                console.log('📡 Status da resposta PIX:', pixResponse.status);
                
                if (pixResponse.ok) {
                    const pixData = await pixResponse.json();
                    console.log('📡 Dados do PIX obtidos:', JSON.stringify(pixData, null, 2));
                    
                    if (pixData.encodedImage && pixData.payload) {
                        paymentResponse.pix = {
                            qr_code: pixData.encodedImage,
                            qr_code_url: pixData.payload,
                            pixCopiaECola: pixData.payload,
                            pix_copia_e_cola: pixData.payload,
                            expires_at: pixData.expirationDate
                        };
                        console.log('✅ QR Code obtido com sucesso!');
                    } else {
                        console.log('⚠️ Dados do PIX incompletos:', pixData);
                        paymentResponse.pix_pending = true;
                        paymentResponse.payment_id = result.id;
                    }
                } else {
                    const errorData = await pixResponse.json();
                    console.log('❌ Erro ao buscar dados do PIX:', pixResponse.status, errorData);
                    paymentResponse.pix_pending = true;
                    paymentResponse.payment_id = result.id;
                }
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
