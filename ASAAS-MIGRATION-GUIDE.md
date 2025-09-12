# Guia de Migração: Pagar.me → Asaas

## ✅ Migração Concluída

A migração da API de pagamentos do Pagar.me para o Asaas foi concluída com sucesso!

## 📋 Alterações Realizadas

### 1. Configurações Atualizadas (`config.js`)
- ✅ Substituída chave API do Pagar.me pela chave do Asaas
- ✅ Adicionado Wallet ID do Asaas
- ✅ Configurada URL base da API do Asaas

### 2. API de Criação de Pagamentos (`api/create-payment.js`)
- ✅ Migrada de Pagar.me API v5 para Asaas API v3
- ✅ Implementada criação de clientes no Asaas
- ✅ Implementada criação de cobranças PIX e cartão de crédito
- ✅ Atualizada estrutura de resposta para compatibilidade com frontend

### 3. Webhook (`api/webhook-asaas.js`)
- ✅ Renomeado de `webhook-pagarme.js` para `webhook-asaas.js`
- ✅ Atualizado para processar notificações do Asaas
- ✅ Mantida integração com Meta Conversions API
- ✅ Corrigido valor do plano anual (299 ao invés de 290)

## 🔧 Configurações do Asaas

### Credenciais Configuradas:
- **API Key**: `$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmNmNjUzNjFiLTEyMjUtNGMzMy04ZDhjLWUwMzQ3ZjdjOTYxODo6JGFhY2hfNTI2ZWJjMDAtZTQ3YS00ZWM3LTg1MzktMTg2OGM3YTZlZTZm`
- **Wallet ID**: `4624c044-f32b-48ff-94fb-70c93c566f6b`
- **Base URL**: `https://www.asaas.com/api/v3`

## 🚀 Próximos Passos

### 1. Configurar Webhook no Asaas
1. Acesse o painel do Asaas
2. Vá em "Integração" → "Webhooks"
3. Configure a URL: `https://seu-dominio.vercel.app/api/webhook-asaas`
4. Selecione os eventos: `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`

### 2. Testar a Integração
1. Faça um teste com PIX
2. Faça um teste com cartão de crédito
3. Verifique se os webhooks estão sendo recebidos
4. Confirme se os eventos estão sendo enviados para o Meta

### 3. Atualizar Frontend (se necessário)
- Verificar se o frontend está enviando `paymentMethod` como `'PIX'` ou `'CREDIT_CARD'`
- Confirmar se a estrutura de resposta está sendo processada corretamente

## 📊 Estrutura de Resposta da API

### PIX:
```json
{
  "success": true,
  "order_id": "pay_123456789",
  "status": "PENDING",
  "amount": 29,
  "currency": "BRL",
  "pix": {
    "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "qr_code_url": "00020126580014br.gov.bcb.pix...",
    "expires_at": "2025-09-12T23:59:59Z"
  }
}
```

### Cartão de Crédito:
```json
{
  "success": true,
  "order_id": "pay_123456789",
  "status": "CONFIRMED",
  "amount": 29,
  "currency": "BRL",
  "transaction": {
    "id": "trans_123456789",
    "status": "CONFIRMED",
    "authorizationCode": "123456"
  }
}
```

## 🔍 Monitoramento

- Verifique os logs do Vercel para acompanhar as requisições
- Monitore o painel do Asaas para verificar cobranças criadas
- Confirme se os webhooks estão sendo processados corretamente

## ⚠️ Observações Importantes

1. **Ambiente de Teste**: Considere usar o sandbox do Asaas para testes antes de ir para produção
2. **Rate Limits**: O Asaas tem limites de requisições por minuto
3. **Webhooks**: Certifique-se de que a URL do webhook está acessível publicamente
4. **Logs**: Mantenha os logs habilitados para facilitar o debug

## 🆘 Suporte

- **Asaas**: integracoes@asaas.com.br
- **Documentação**: https://docs.asaas.com/
- **Status**: https://status.asaas.com/

---

**Migração concluída em**: 12/09/2025
**Versão da API**: Asaas v3
