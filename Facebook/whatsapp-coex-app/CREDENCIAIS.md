# 📋 Onde Encontrar Suas Credenciais

Este guia mostra exatamente onde encontrar cada credencial necessária.

## 🔑 Credenciais Necessárias

### 1. FACEBOOK_APP_ID

**Onde encontrar:**
1. Acesse https://developers.facebook.com/apps
2. Selecione seu app (ou crie um novo)
3. No menu lateral esquerdo: **Configurações** > **Básico**
4. Procure por **"ID do App"** (App ID)
5. Copie o número (ex: `123456789012345`)

**No .env:**
```env
FACEBOOK_APP_ID=123456789012345
```

**No index.html:**
```javascript
const FACEBOOK_APP_ID = '123456789012345';
```

---

### 2. FACEBOOK_APP_SECRET

**Onde encontrar:**
1. Mesmo lugar do App ID
2. **Configurações** > **Básico**
3. Procure por **"Chave Secreta do App"** (App Secret)
4. Clique em **"Mostrar"**
5. Digite sua senha do Facebook
6. Copie a chave secreta

**No .env:**
```env
FACEBOOK_APP_SECRET=abc123def456ghi789
```

⚠️ **ATENÇÃO**: NUNCA compartilhe o App Secret publicamente!

---

### 3. FACEBOOK_CONFIG_ID

**Onde encontrar - Opção 1 (Embedded Signup Builder):**
1. No seu app, vá em **WhatsApp** > **Embedded Signup Builder**
2. Clique em **"Create Configuration"** ou use uma existente
3. Copie o **Configuration ID** que aparece
4. Formato: `987654321098765`

**Onde encontrar - Opção 2 (Configurações do WhatsApp):**
1. No seu app, vá em **WhatsApp** > **Configuração**
2. Role até a seção **"Embedded Signup"**
3. Você verá uma lista de configurações
4. Copie o ID da configuração desejada

**No .env:**
```env
FACEBOOK_CONFIG_ID=987654321098765
```

**No index.html:**
```javascript
const FACEBOOK_CONFIG_ID = '987654321098765';
```

---

### 4. WEBHOOK_VERIFY_TOKEN

**Este você CRIA - não busca em lugar nenhum!**

Crie um token secreto aleatório. Exemplos:
- `meu_token_super_secreto_123`
- `webhook_2025_xyz789`
- `qualquer_string_secreta`

**Dica**: Gere um token aleatório:
```bash
# No terminal (Linux/Mac)
openssl rand -hex 32

# Ou simplesmente invente um!
```

**No .env:**
```env
WEBHOOK_VERIFY_TOKEN=meu_token_super_secreto_123
```

**⚠️ IMPORTANTE**: Use o MESMO token quando configurar o webhook no Facebook!

---

## 📍 URIs e URLs para Configurar no Facebook

### OAuth Redirect URI

**Onde configurar:**
1. No app: **Produtos** > **Facebook Login** > **Configurações**
2. Em **"URIs de redirecionamento do OAuth válidos"**
3. Adicione: `https://casaecosustentavel-a.k3givk.easypanel.host/auth/callback`

### Webhook URL

**Onde configurar:**
1. No app: **WhatsApp** > **Configuração**
2. Em **"Webhooks"** > **"Configurar Webhooks"**
3. **URL de Callback**: `https://casaecosustentavel-a.k3givk.easypanel.host/webhook`
4. **Token de Verificação**: [o mesmo que você criou acima]

### Domínio do App

**Onde configurar:**
1. No app: **Configurações** > **Básico**
2. Role até **"Domínios do App"**
3. Adicione: `casaecosustentavel-a.k3givk.easypanel.host`

---

## 📱 Como Obter os Dados APÓS o Cadastro

Após completar o Embedded Signup, você receberá:

### WABA_ID (WhatsApp Business Account ID)
- Aparece na página de sucesso após o cadastro
- Também é retornado no callback
- Salvo automaticamente em `data/businesses.json`

### PHONE_NUMBER_ID
- Também aparece na página de sucesso
- Retornado no callback
- Salvo automaticamente em `data/businesses.json`

### ACCESS_TOKEN
- Gerado automaticamente pela aplicação
- Salvo em `data/businesses.json`
- Você NÃO precisa fazer nada manualmente

**Para ver seus dados salvos:**
```bash
# Acesse
https://casaecosustentavel-a.k3givk.easypanel.host/api/businesses
```

---

## ✅ Checklist Rápido

Antes de fazer o deploy, certifique-se de ter:

- [ ] `FACEBOOK_APP_ID` copiado
- [ ] `FACEBOOK_APP_SECRET` copiado
- [ ] `FACEBOOK_CONFIG_ID` copiado
- [ ] `WEBHOOK_VERIFY_TOKEN` criado
- [ ] Editado o arquivo `.env`
- [ ] Editado o arquivo `src/public/index.html`
- [ ] Configurado OAuth Redirect URI no Facebook
- [ ] Configurado Domínio do App no Facebook

Depois do deploy:

- [ ] Configurado Webhook URL no Facebook
- [ ] Webhook verificado com sucesso ✅
- [ ] Inscrito nos campos `messages` e `message_status`
- [ ] Testado o fluxo de Embedded Signup
- [ ] Recebido WABA_ID e PHONE_NUMBER_ID

---

## 🆘 Problemas Comuns

### "Não encontro o Configuration ID"

Se não encontrar, crie um novo:
1. WhatsApp > Embedded Signup Builder
2. Configure as permissões necessárias
3. Gere o código
4. Copie o Configuration ID

### "Meu App Secret não aparece"

Você precisa clicar em "Mostrar" e digitar sua senha do Facebook.

### "Webhook não verifica"

Certifique-se de que:
1. A aplicação está rodando (teste: /health)
2. HTTPS está funcionando
3. O token no Facebook é EXATAMENTE o mesmo do .env

---

## 📞 Suporte

Se tiver dúvidas:
1. Revise o `README.md` completo
2. Consulte o `CHECKLIST.md`
3. Veja exemplos no `EXEMPLOS_API.md`

**Boa sorte! 🚀**
