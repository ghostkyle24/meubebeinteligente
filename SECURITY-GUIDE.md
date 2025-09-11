# 🔒 Guia de Segurança - Meu Bebê Inteligente

## ⚠️ **IMPORTANTE: Dados Sensíveis Removidos**

Todos os arquivos que continham dados sensíveis foram removidos do projeto para proteger as credenciais.

## 🗑️ **Arquivos Removidos:**

### **Arquivos de Debug/Teste:**
- `check-admin.html` - Página de verificação de admin
- `create-admin.html` - Página de criação de admin
- `generate-password-hash.html` - Gerador de hash de senha
- `test-login.html` - Página de teste de login
- `test-supabase-connection.html` - Teste de conexão
- `simple-admin.html` - Admin simplificado
- `admin-login.html` - Login administrativo

### **Arquivos SQL com Dados:**
- `add-admin-column.sql` - SQL com credenciais
- `update-admin-password.sql` - SQL com senhas

### **Documentação Sensível:**
- `ADMIN-ACESSO.md` - Credenciais de acesso
- `GUIA-SUPABASE.md` - Guia com dados sensíveis
- `DEPLOY-VERCEL.md` - Instruções de deploy
- `PAYMENT-PRODUCTION.md` - Configurações de pagamento
- `PRODUCTION-STATUS.md` - Status de produção
- `ADMIN-PANEL-README.md` - Documentação do painel

### **Arquivos de Configuração:**
- `supabase-config.js` - Configuração com credenciais
- `supabase-credentials.js` - Credenciais do Supabase

## 🔐 **Configuração Segura:**

### **1. Arquivo `config.js`:**
- ✅ **Atualizado** para usar variáveis de ambiente
- ✅ **Fallback** para desenvolvimento local
- ✅ **Preparado** para produção

### **2. Arquivo `config-example.js`:**
- ✅ **Criado** como modelo
- ✅ **Sem dados sensíveis**
- ✅ **Instruções claras**

### **3. Arquivo `.gitignore`:**
- ✅ **Criado** para proteger dados sensíveis
- ✅ **Lista completa** de arquivos a ignorar
- ✅ **Prevenção** de vazamentos futuros

## 🚀 **Para Produção:**

### **1. Configurar Variáveis de Ambiente:**
```bash
# Vercel
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add PAGARME_API_KEY
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
```

### **2. Usar Arquivo de Configuração:**
- Copie `config-example.js` para `config.js`
- Configure suas credenciais
- **NUNCA** commite o `config.js` com dados reais

### **3. Verificar Segurança:**
- ✅ Nenhum arquivo com credenciais no repositório
- ✅ Variáveis de ambiente configuradas
- ✅ `.gitignore` ativo
- ✅ Dados sensíveis removidos

## 🛡️ **Boas Práticas:**

### **1. Nunca Commitar:**
- Senhas em texto plano
- Chaves de API
- URLs de banco de dados
- Credenciais de admin

### **2. Sempre Usar:**
- Variáveis de ambiente
- Arquivos de exemplo
- `.gitignore` atualizado
- Documentação sem dados sensíveis

### **3. Verificar Antes de Commitar:**
- `git status` - Ver arquivos modificados
- `git diff` - Ver mudanças
- Verificar se há credenciais expostas

## 📋 **Checklist de Segurança:**

- [ ] ✅ Arquivos sensíveis removidos
- [ ] ✅ `.gitignore` configurado
- [ ] ✅ `config-example.js` criado
- [ ] ✅ `config.js` atualizado
- [ ] ✅ Variáveis de ambiente preparadas
- [ ] ✅ Documentação limpa
- [ ] ✅ Repositório seguro

## 🆘 **Em Caso de Vazamento:**

### **1. Imediatamente:**
- Rotacionar todas as chaves de API
- Alterar senhas de admin
- Verificar logs de acesso
- Notificar equipe

### **2. Investigar:**
- Verificar histórico do Git
- Identificar arquivos comprometidos
- Analisar impacto
- Documentar incidente

### **3. Prevenir:**
- Revisar processos de segurança
- Atualizar `.gitignore`
- Treinar equipe
- Implementar verificações

---

**🔒 Segurança é prioridade! Mantenha suas credenciais protegidas.**
