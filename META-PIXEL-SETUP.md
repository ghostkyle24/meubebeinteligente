# 📊 Configuração do Pixel da Meta - Meu Bebê Inteligente

## 🎯 Objetivo
Configurar o Pixel da Meta para rastrear conversões, otimizar campanhas e enviar dados de clientes para melhorar o targeting.

## 📋 Eventos Implementados

### 1. **PageView** 
- **Quando**: Carregamento da página
- **Dados**: Visualização da página inicial

### 2. **Lead**
- **Quando**: Usuário clica em "Quero meu acesso agora"
- **Dados**: Interesse em assinatura

### 3. **InitiateCheckout**
- **Quando**: Usuário abre modal de pagamento
- **Dados**: Plano selecionado, valor, categoria

### 4. **Purchase**
- **Quando**: Pagamento confirmado com sucesso
- **Dados**: Email, plano, valor, moeda (BRL)

### 5. **SubscriptionPurchase** (Custom)
- **Quando**: Assinatura confirmada
- **Dados**: Detalhes específicos da assinatura

## 🔧 Como Configurar

### Passo 1: Obter Pixel ID
1. Acesse [Facebook Business Manager](https://business.facebook.com)
2. Vá em **Eventos** > **Pixels**
3. Crie um novo pixel ou use um existente
4. Copie o **Pixel ID** (ex: 123456789012345)

### Passo 2: Atualizar Configurações
1. Abra `config.js`
2. Substitua `'SEU_PIXEL_ID'` pelo seu Pixel ID real:
```javascript
META_PIXEL_ID: '123456789012345',
META_ACCESS_TOKEN: 'EAAPZBiaTYbAkBPXrv4sDTGeaYKB8JOnArQvHHgGoQwtJGfS5VkHYb7Pvf8ISfUVWUR6Xk3rlD1f15DQPcniM6qy62hZCXIg75AUvEcseuzJnqTyGFIVf3y3DJRATxaHTXKccIHuagOjgaI3X2xFHJXddIMc71aHSMiYHYmIwoH7O5H1G9lha0HSSNg0QZDZD',
```

3. Abra `meta-pixel-config.js`
4. Substitua `'SEU_PIXEL_ID'` pelo mesmo ID:
```javascript
PIXEL_ID: '123456789012345',
ACCESS_TOKEN: 'EAAPZBiaTYbAkBPXrv4sDTGeaYKB8JOnArQvHHgGoQwtJGfS5VkHYb7Pvf8ISfUVWUR6Xk3rlD1f15DQPcniM6qy62hZCXIg75AUvEcseuzJnqTyGFIVf3y3DJRATxaHTXKccIHuagOjgaI3X2xFHJXddIMc71aHSMiYHYmIwoH7O5H1G9lha0HSSNg0QZDZD',
```

5. Abra `api/meta-conversions.js`
6. Substitua `'SEU_PIXEL_ID'` pelo mesmo ID:
```javascript
const PIXEL_ID = '123456789012345';
```

### Passo 3: Testar Eventos
1. Use o [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Navegue pelo site e verifique se os eventos estão sendo disparados
3. Teste o fluxo completo de compra

## 📊 Dados Rastreados

### Informações do Cliente
- **Email**: Para matching e remarketing
- **Plano**: Mensal, Trimestral ou Anual
- **Valor**: R$ 29, R$ 79 ou R$ 290
- **Moeda**: BRL (Real Brasileiro)

### Eventos Personalizados
- **SubscriptionPurchase**: Evento customizado para assinaturas
- **Duração**: 1 mês, 3 meses ou 12 meses
- **Categoria**: Educação Infantil

## 🎯 Otimizações de Campanha

### 1. **Conversions API** (Recomendado)
- Implementar Server-Side API para melhor precisão
- Enviar dados diretamente do servidor para Meta
- Reduzir dependência de cookies

### 2. **Custom Audiences**
- Criar audiências baseadas em:
  - Compras por plano
  - Emails de clientes
  - Comportamento no site

### 3. **Lookalike Audiences**
- Criar audiências similares aos compradores
- Expandir alcance com usuários similares
- Melhorar qualidade dos leads

## 📈 Métricas Importantes

### Conversões por Plano
- **Mensal**: R$ 29 - Frequência alta
- **Trimestral**: R$ 79 - Valor médio
- **Anual**: R$ 290 - Maior ticket

### Eventos de Funnel
1. **PageView** → **Lead** → **InitiateCheckout** → **Purchase**
2. Taxa de conversão em cada etapa
3. Tempo médio entre eventos

## 🔒 Privacidade e LGPD

### Dados Coletados
- Email (com consentimento)
- Comportamento no site
- Dados de compra

### Consentimento
- Implementar banner de cookies
- Permitir opt-out
- Documentar uso dos dados

## 🚀 Próximos Passos

### 1. **Server-Side API**
```javascript
// Exemplo de implementação no backend
app.post('/api/meta-customer-data', async (req, res) => {
    const { email, plan_name, plan_price } = req.body;
    
    // Enviar para Meta Conversions API
    await sendToMetaAPI({
        event_name: 'Purchase',
        user_data: { em: hashEmail(email) },
        custom_data: { plan_name, plan_price }
    });
});
```

### 2. **Enhanced Matching**
- Hash de emails para matching
- Dados offline para melhor precisão
- Sincronização com CRM

### 3. **Attribution**
- Configurar janelas de atribuição
- Rastrear jornada completa
- Otimizar para valor de vida do cliente

## 📊 **Métricas de Monitoramento**

### **1. Qualidade da Correspondência de Eventos**
- **Meta**: Avalia eficácia das informações do cliente
- **Objetivo**: Maximizar matching com contas do Facebook
- **Boa prática**: Enviar email, nome, localização

### **2. Taxa de Desduplicação**
- **Meta**: Mostra % de eventos desduplicados
- **Objetivo**: Evitar contagem dupla
- **Boa prática**: Usar mesmo event_id no Pixel e API

### **3. Atualidade dos Dados**
- **Meta**: Diferença entre evento e recebimento
- **Objetivo**: Enviar eventos em tempo real
- **Boa prática**: Enviar imediatamente após conversão

### **4. Cobertura de Eventos**
- **Meta**: % de eventos enviados via API vs Pixel
- **Objetivo**: 100% de cobertura
- **Boa prática**: Enviar ambos (Pixel + API)

## 🔧 **Estrutura da Carga (Implementada)**

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1757548963,
      "action_source": "website",
      "event_source_url": "https://meubebeinteligente.vercel.app",
      "user_data": {
        "em": ["email_hasheado"],
        "fn": ["nome_hasheado"],
        "ln": ["sobrenome_hasheado"],
        "ct": ["cidade_hasheada"],
        "st": ["estado_hasheado"],
        "country": ["pais_hasheado"],
        "client_ip_address": "IP_REAL",
        "client_user_agent": "USER_AGENT"
      },
      "custom_data": {
        "currency": "BRL",
        "value": 29.00,
        "content_name": "Plano Mensal - Meu Bebê Inteligente",
        "content_category": "Educação Infantil",
        "content_type": "subscription",
        "plan_name": "Mensal",
        "plan_duration": "1 month"
      },
      "attribution_data": {
        "attribution_share": "1.0"
      },
      "original_event_data": {
        "event_name": "Purchase",
        "event_time": 1757548963
      }
    }
  ]
}
```

## 📞 Suporte

Para dúvidas sobre implementação:
- [Documentação Meta Pixel](https://developers.facebook.com/docs/facebook-pixel)
- [Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Meta Business Help](https://www.facebook.com/business/help)

---

**✅ Pixel configurado e pronto para otimizar suas campanhas!**
