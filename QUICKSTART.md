# 🚀 Deploy Rápido no Easypanel

## 📋 Passo a Passo (5 minutos)

### 1️⃣ Criar Projeto no Easypanel

1. Acesse seu Easypanel
2. **New Project** → **Docker** (não Docker Compose)
3. Configure:
   ```
   Project Name: whatsapp-coex
   Repository: https://github.com/BrunoGroehs/whatsapp-CoEx.git
   Branch: main
   Dockerfile: Dockerfile
   Port: 80
   ```

### 2️⃣ Adicionar Variáveis de Ambiente

No Easypanel, adicione:

```env
WHATSAPP_APP_ID=1335317331469574
WHATSAPP_CONFIG_ID=2031952424274683
WHATSAPP_APP_SECRET=<copie do Facebook>
WHATSAPP_API_VERSION=v24.0
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://<seu-dominio>
REDIRECT_URI=https://<seu-dominio>/callback
WEBHOOK_URL=https://<seu-dominio>/webhook
WEBHOOK_VERIFY_TOKEN=<gere token aleatorio>
BUSINESS_ID=<seu business id>
ENCRYPTION_KEY=<gere 32 caracteres>
```

**Gerar tokens:**
```powershell
# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### 3️⃣ Deploy

1. Clique em **Deploy**
2. Aguarde 3-5 minutos
3. Acesse seu domínio

### 4️⃣ Configurar Facebook

1. **Webhook**: `https://seu-dominio/webhook`
2. **Verify Token**: O mesmo de `WEBHOOK_VERIFY_TOKEN`
3. **Redirect URI**: `https://seu-dominio/callback`

### 5️⃣ Testar

```bash
# Health check
curl https://seu-dominio/health

# Frontend
https://seu-dominio
```

---

## 📚 Documentação Completa

- **Deploy Detalhado**: `EASYPANEL_DEPLOY.md`
- **Deploy com Dockerfile**: `DEPLOY_DOCKERFILE.md`
- **Checklist**: `CHECKLIST_DEPLOY.md`
- **Comandos de Teste**: `COMANDOS_TESTE.md`

---

## 🎯 Estrutura

```
whatsapp-CoEx/
├── backend/          → API Node.js
├── frontend/         → Interface Web
├── nginx/            → Reverse Proxy
├── Dockerfile        → Deploy único ⭐
└── docker-compose... → Deploy multi-container
```

---

**Pronto! 🎉**
