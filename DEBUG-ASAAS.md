# 🔍 Debug da Integração Asaas

## ❌ Problema Atual
Erro ao criar cliente no Asaas: `{success: false, error: 'Erro ao criar cliente no Asaas', details: {…}}`

## 🔧 Passos para Debug

### 1. Verificar Credenciais
Execute este comando para testar a conexão:

```bash
node test-asaas-integration.js
```

### 2. Verificar Logs do Vercel
1. Acesse o painel do Vercel
2. Vá em "Functions" → "create-payment"
3. Verifique os logs para ver o erro específico

### 3. Possíveis Causas do Erro

#### A. Chave API Inválida
- Verifique se a chave API está correta
- Confirme se não expirou
- Teste se está no ambiente correto (produção vs sandbox)

#### B. Dados do Cliente Inválidos
- Nome muito curto
- Email inválido
- CPF inválido
- Campos obrigatórios faltando

#### C. Problema de Ambiente
- API de produção vs sandbox
- Rate limiting
- Problemas de conectividade

### 4. Teste Manual da API

Execute este comando para testar a API diretamente:

```bash
curl -X GET "https://www.asaas.com/api/v3/customers?limit=1" \
  -H "access_token: $aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmNmNjUzNjFiLTEyMjUtNGMzMy04ZDhjLWUwMzQ3ZjdjOTYxODo6JGFhY2hfNTI2ZWJjMDAtZTQ3YS00ZWM3LTg1MzktMTg2OGM3YTZlZTZm" \
  -H "Content-Type: application/json"
```

### 5. Verificar Estrutura dos Dados

O frontend está enviando:
```javascript
{
  amount: 29,
  customer: {
    name: "parte_do_email", // Pode ser muito curto
    email: "email@exemplo.com",
    document: "cpf_sem_formatacao",
    phone: "11999999999"
  },
  plan: { price: 29, name: "Mensal" },
  orderbumpItems: [],
  paymentMethod: "pix"
}
```

### 6. Soluções Implementadas

✅ **Normalização do paymentMethod**: `pix` → `PIX`
✅ **Validação de CPF**: Verifica se tem 11 dígitos
✅ **Fallback para cliente existente**: Busca por CPF se já existir
✅ **Logs detalhados**: Para facilitar o debug
✅ **Validação de email**: Regex para verificar formato
✅ **Dados mínimos**: Apenas campos obrigatórios

### 7. Próximos Passos

1. **Execute o teste**: `node test-asaas-integration.js`
2. **Verifique os logs** do Vercel
3. **Teste com dados diferentes**:
   - Nome mais longo
   - CPF válido
   - Email válido
4. **Verifique se a chave API** está funcionando

### 8. Contato com Suporte

Se o problema persistir:
- **Asaas**: integracoes@asaas.com.br
- **Documentação**: https://docs.asaas.com/
- **Status**: https://status.asaas.com/

---

**Status**: 🔍 Em investigação
**Última atualização**: 12/09/2025
