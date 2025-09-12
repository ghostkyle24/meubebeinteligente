# 🚀 Configuração para Produção - Meu Bebê Inteligente

## 📋 Checklist de Produção

### ✅ 1. Configurações do Asaas
- [ ] **Chave de API de Produção**: Substituir `$aact_hmlg_...` por chave de produção
- [ ] **URL de Produção**: Alterar `https://sandbox.asaas.com/api/v3` para `https://www.asaas.com/api/v3`
- [ ] **Wallet ID**: Verificar se o Wallet ID está correto para produção

### ✅ 2. Configurações do Supabase
- [ ] **URL de Produção**: Verificar se está usando o projeto correto
- [ ] **Chave Anônima**: Verificar se está usando a chave de produção
- [ ] **Políticas RLS**: Verificar se estão configuradas corretamente

### ✅ 3. Configurações do Meta Pixel
- [ ] **Pixel ID**: Verificar se está usando o ID correto
- [ ] **Access Token**: Verificar se está usando o token de produção
- [ ] **Eventos**: Testar se os eventos estão sendo enviados

### ✅ 4. Configurações do Site
- [ ] **URL do Site**: Verificar se está usando a URL de produção
- [ ] **Email Admin**: Verificar se está usando o email correto
- [ ] **Senha Admin**: Verificar se está usando uma senha segura

## 🔧 Arquivos para Atualizar

### 1. `config.js`
```javascript
const CONFIG = {
    // Asaas - PRODUÇÃO
    ASAAS_API_KEY: 'sua-chave-de-producao-aqui',
    ASAAS_WALLET_ID: 'seu-wallet-id-aqui',
    ASAAS_BASE_URL: 'https://www.asaas.com/api/v3',
    
    // Supabase - PRODUÇÃO
    SUPABASE_URL: 'https://seu-projeto-producao.supabase.co',
    SUPABASE_ANON_KEY: 'sua-chave-anonima-producao',
    
    // Meta Pixel - PRODUÇÃO
    META_PIXEL_ID: 'seu-pixel-id-producao',
    META_ACCESS_TOKEN: 'seu-access-token-producao',
    
    // Site - PRODUÇÃO
    SITE_URL: 'https://meubebeinteligente.vercel.app',
    ADMIN_EMAIL: 'seu-email-admin@exemplo.com',
    ADMIN_PASSWORD: 'sua-senha-segura-aqui'
};
```

### 2. `api/create-payment.js`
```javascript
// Configurações do Asaas - PRODUÇÃO
const ASAAS_API_KEY = 'sua-chave-de-producao-aqui';
const ASAAS_WALLET_ID = 'seu-wallet-id-aqui';
const ASAAS_BASE_URL = 'https://www.asaas.com/api/v3';
```

### 3. `api/check-payment.js`
```javascript
// Configurações do Asaas - PRODUÇÃO
const ASAAS_API_KEY = 'sua-chave-de-producao-aqui';
const ASAAS_BASE_URL = 'https://www.asaas.com/api/v3';
```

### 4. `api/webhook-asaas.js`
```javascript
// Configurações do Asaas - PRODUÇÃO
const ASAAS_API_KEY = 'sua-chave-de-producao-aqui';
const ASAAS_BASE_URL = 'https://www.asaas.com/api/v3';
```

## 🎯 Planos Configurados

### Planos de Assinatura
- **Mensal**: R$ 29,00 (1 mês)
- **Trimestral**: R$ 79,00 (3 meses)
- **Anual**: R$ 299,00 (12 meses)

### Orderbumps
- **Controle Parental**: R$ 19,90 (50% de desconto)
- **Plano Alimentar**: R$ 27,40 (50% de desconto)

## 🔄 Webhook do Asaas

### URL do Webhook
```
https://meubebeinteligente.vercel.app/api/webhook-asaas
```

### Eventos Configurados
- `PAYMENT_RECEIVED` - Pagamento recebido
- `PAYMENT_CONFIRMED` - Pagamento confirmado
- `PAYMENT_OVERDUE` - Pagamento vencido

## 🧪 Testes em Produção

### 1. Teste de Pagamento PIX
- [ ] Criar pagamento PIX
- [ ] Verificar se QR Code é gerado
- [ ] Verificar se código PIX é exibido
- [ ] Simular pagamento
- [ ] Verificar se webhook é disparado

### 2. Teste de Webhook
- [ ] Verificar se webhook recebe notificações
- [ ] Verificar se Meta Pixel recebe eventos
- [ ] Verificar se usuário é criado no Supabase

### 3. Teste de Login
- [ ] Verificar se login funciona
- [ ] Verificar se dashboard carrega
- [ ] Verificar se conteúdo é exibido

## 🚨 Importante

1. **Nunca commite chaves de produção** no repositório
2. **Use variáveis de ambiente** no Vercel
3. **Teste tudo** antes de ir ao ar
4. **Monitore logs** após o deploy
5. **Tenha um plano de rollback** pronto

## 📞 Suporte

Em caso de problemas:
1. Verificar logs do Vercel
2. Verificar logs do Asaas
3. Verificar logs do Supabase
4. Verificar console do navegador
5. Testar APIs individualmente

---

**Status**: ✅ Pronto para Produção
**Última Atualização**: 12/09/2025
