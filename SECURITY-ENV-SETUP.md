# 🔐 Configuração de Segurança - Variáveis de Ambiente

## ⚠️ IMPORTANTE: Proteção de Chaves API

As chaves API sensíveis **NÃO DEVEM** ser commitadas no GitHub! Este projeto agora usa variáveis de ambiente para proteger informações confidenciais.

## 📋 Configuração Necessária

### 1. Arquivo `.env` (Local)

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# ASAAS API - PRODUÇÃO
ASAAS_API_KEY=sua_chave_api_asaas_real_aqui
ASAAS_WALLET_ID=seu_wallet_id_aqui
ASAAS_BASE_URL=https://api.asaas.com/v3

# SUPABASE
SUPABASE_URL=sua_url_supabase_aqui
SUPABASE_ANON_KEY=sua_chave_anonima_supabase_aqui

# META PIXEL
META_PIXEL_ID=seu_pixel_id_aqui
META_ACCESS_TOKEN=seu_access_token_meta_aqui

# ADMIN
ADMIN_EMAIL=seu_email_admin_aqui
ADMIN_EMAIL_ALT=seu_email_alternativo_aqui
ADMIN_PASSWORD=sua_senha_admin_aqui

# SITE
SITE_NAME=Nome do Seu Site
SITE_URL=https://seusite.vercel.app
```

### 2. Vercel (Produção)

No dashboard do Vercel, configure as variáveis de ambiente:

1. Acesse o projeto no [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em **Settings** → **Environment Variables**
3. Adicione cada variável do arquivo `.env`

### 3. Outras Plataformas

Para outras plataformas de deploy (Netlify, Railway, etc.), configure as mesmas variáveis nas configurações de ambiente.

## 🔒 Arquivos Protegidos

Estes arquivos estão no `.gitignore` e **NÃO** vão para o GitHub:

- `.env`
- `.env.local`
- `.env.production`
- `config.js` (versão antiga com chaves hardcoded)

## ✅ Arquivos Seguros para Commit

Estes arquivos podem ir para o GitHub:

- `config-public.js` - Apenas configurações públicas
- `SECURITY-ENV-SETUP.md` - Este guia de configuração
- `.env.example` - Template sem dados reais

## 🚀 APIs Atualizadas

As seguintes APIs agora usam `process.env`:

- `api/create-payment.js`
- `api/check-payment.js`
- `api/meta-conversions.js`
- `api/webhook-asaas.js`

## ⚡ Verificação de Segurança

Antes de fazer commit, verifique:

1. ✅ Arquivo `.env` não está sendo commitado
2. ✅ Chaves API removidas dos códigos
3. ✅ `process.env.VARIAVEL` sendo usado nas APIs
4. ✅ Variáveis configuradas no Vercel

## 🆘 Em Caso de Vazamento

Se uma chave API for acidentalmente commitada:

1. **Revogue imediatamente** a chave no painel do provedor
2. **Gere uma nova chave**
3. **Atualize** as variáveis de ambiente
4. **Force push** para limpar o histórico (se necessário)

## 📞 Suporte

Em caso de dúvidas sobre configuração de segurança, consulte a documentação dos provedores:

- [Asaas API Documentation](https://docs.asaas.com/)
- [Supabase Environment Variables](https://supabase.com/docs/guides/cli/env)
- [Meta Developer Docs](https://developers.facebook.com/docs/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
