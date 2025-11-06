# 🚀 Deploy no Easypanel - WhatsApp CoEx

Guia completo para fazer deploy da aplicação WhatsApp CoEx no Easypanel.

## 📋 Pré-requisitos

- [ ] Conta no Easypanel
- [ ] Repositório Git com o código (GitHub, GitLab, etc)
- [ ] Credenciais do WhatsApp/Facebook configuradas
- [ ] Domínio configurado (recomendado)

## 🔧 Passo a Passo

### 1. Preparar o Repositório

```bash
# Commitar o código no Git
git init
git add .
git commit -m "Initial commit - WhatsApp CoEx App"

# Push para seu repositório (GitHub/GitLab)
git remote add origin https://github.com/seu-usuario/whatsapp-coex.git
git push -u origin main
```

### 2. Criar Projeto no Easypanel

1. Acesse seu painel Easypanel
2. Clique em **"Create Project"** ou **"New Project"**
3. Nome do projeto: `whatsapp-coex`
4. Selecione o tipo: **"Docker Compose"**

### 3. Conectar Repositório

1. Em **Source**, conecte seu repositório Git
2. Selecione a branch: `main` (ou `master`)
3. **Build Path**: deixe vazio (raiz do projeto)
4. **Docker Compose File**: `docker-compose.easypanel.yml`

### 4. Configurar Variáveis de Ambiente

No painel do Easypanel, adicione estas variáveis de ambiente:

#### ⚠️ Variáveis Obrigatórias

```env
# WhatsApp Configuration
WHATSAPP_APP_ID=1335317331469574
WHATSAPP_CONFIG_ID=2031952424274683
WHATSAPP_APP_SECRET=seu_app_secret_aqui
WHATSAPP_API_VERSION=v24.0

# Server Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://seu-dominio.com
REDIRECT_URI=https://seu-dominio.com/callback

# Webhook
WEBHOOK_URL=https://seu-dominio.com/webhook
WEBHOOK_VERIFY_TOKEN=seu_token_verificacao_aleatorio

# Sistema User Token
SYSTEM_USER_TOKEN=seu_system_user_token_aqui

# Business ID
BUSINESS_ID=1132877482331513

# Encryption Key (32 caracteres)
ENCRYPTION_KEY=sua_chave_aleatoria_32_caracteres

# Nginx Port (opcional)
NGINX_PORT=80
```

#### 📝 Como Obter Cada Variável

**WHATSAPP_APP_SECRET:**
- https://developers.facebook.com/apps/1335317331469574/settings/basic/
- Copie o "App Secret"

**SYSTEM_USER_TOKEN:**
- https://business.facebook.com/settings/system-users
- Gerar novo token com permissões `whatsapp_business_management` e `whatsapp_business_messaging`

**WEBHOOK_VERIFY_TOKEN:**
- Crie uma string aleatória segura (ex: `meu_token_super_secreto_12345`)

**ENCRYPTION_KEY:**
- Gere 32 caracteres aleatórios (ex: `abcdefghijklmnopqrstuvwxyz123456`)

**FRONTEND_URL e REDIRECT_URI:**
- Use o domínio do Easypanel (ex: `https://whatsapp-coex.easypanel.host`)
- Ou seu domínio customizado

### 5. Configurar Domínio (Recomendado)

#### Opção A: Usar domínio do Easypanel
```
https://whatsapp-coex.easypanel.host
```

#### Opção B: Usar domínio customizado

1. No Easypanel, vá em **Settings** > **Domains**
2. Adicione seu domínio: `whatsapp.seudominio.com`
3. Configure o DNS:
   ```
   Type: CNAME
   Name: whatsapp
   Value: seu-servidor.easypanel.host
   ```
4. Aguarde propagação do DNS (5-30 minutos)
5. Easypanel gerará certificado SSL automaticamente

### 6. Atualizar URLs no Facebook

Depois de ter o domínio definitivo, atualize:

#### Facebook Login OAuth
1. https://developers.facebook.com/apps/1335317331469574/settings/basic/
2. **Valid OAuth Redirect URIs:**
   ```
   https://seu-dominio.com/callback
   https://seu-dominio.com/
   ```
3. **App Domains:**
   ```
   seu-dominio.com
   ```
4. **Site URL:**
   ```
   https://seu-dominio.com
   ```

#### WhatsApp Webhook
1. https://developers.facebook.com/apps/1335317331469574/whatsapp-business/wa-settings/
2. **Callback URL:**
   ```
   https://seu-dominio.com/webhook
   ```
3. **Verify Token:** O mesmo de `WEBHOOK_VERIFY_TOKEN`
4. Subscribe aos eventos:
   - ✅ `messages`
   - ✅ `message_echoes` (importante para CoEx!)
   - ✅ `messaging_postbacks`

#### Embedded Signup Domains
1. Adicione aos domínios autorizados:
   ```
   seu-dominio.com
   https://seu-dominio.com
   ```

### 7. Deploy

1. No Easypanel, clique em **"Deploy"**
2. Aguarde o build (pode levar 3-5 minutos)
3. Verifique os logs:
   - Backend: deve mostrar "🚀 Servidor rodando..."
   - Frontend: deve estar servindo na porta 80
   - Nginx: deve estar roteando corretamente

### 8. Testar Aplicação

#### Health Check
```bash
curl https://seu-dominio.com/health
# Deve retornar: {"status":"ok",...}
```

#### Verificar Backend
```bash
curl https://seu-dominio.com/api/auth/status
# Deve retornar: {"connected":false,"message":"Nenhuma conta conectada"}
```

#### Testar Frontend
- Abra: `https://seu-dominio.com`
- Deve carregar a interface verde do WhatsApp
- Botão "Conectar WhatsApp com CoEx" deve aparecer

#### Testar Webhook (Facebook vai chamar isso)
```bash
curl "https://seu-dominio.com/webhook?hub.mode=subscribe&hub.verify_token=SEU_TOKEN&hub.challenge=12345"
# Deve retornar: 12345
```

### 9. Conectar WhatsApp

1. Acesse: `https://seu-dominio.com`
2. Clique em **"Conectar WhatsApp com CoEx"**
3. Login no Facebook
4. Autorize as permissões
5. Escolha: **"Connect your existing WhatsApp Business app"** (CoEx)
6. Escaneie o QR Code no WhatsApp Business App
7. Aguarde sincronização
8. Pronto! ✅

## 🔍 Troubleshooting

### Build falha

**Verificar logs:**
```bash
# No Easypanel, vá em Logs > Build Logs
```

**Causas comuns:**
- Dockerfile com erro
- Dependências faltando
- Memória insuficiente

**Solução:**
- Verifique os Dockerfiles
- Aumente recursos no Easypanel se necessário

### Container não inicia

**Verificar logs:**
```bash
# No Easypanel: Logs > Runtime Logs
# Selecione: backend, frontend ou nginx
```

**Causas comuns:**
- Variáveis de ambiente faltando
- Porta já em uso
- Healthcheck falhando

**Solução:**
- Confira todas as variáveis de ambiente
- Verifique se PORT está definido
- Ajuste configurações de healthcheck se necessário

### Webhook não recebe mensagens

**Verificar:**
1. URL do webhook está correta no Facebook?
2. HTTPS está funcionando?
3. Verify token está correto?
4. App está inscrito nos eventos corretos?

**Testar manualmente:**
```bash
curl -X POST https://seu-dominio.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"object":"whatsapp_business_account","entry":[{"changes":[{"field":"messages","value":{"messages":[{"from":"5511999999999","text":{"body":"Teste"}}]}}]}]}'
```

### SSL/HTTPS não funciona

**Easypanel gera SSL automaticamente se:**
- Domínio está apontando corretamente
- DNS propagou (aguarde 30min)
- Porta 80 e 443 estão abertas

**Forçar renovação:**
1. Easypanel > Settings > SSL
2. Clique em "Renew Certificate"

### Frontend não carrega

**Verificar:**
```bash
# Logs do frontend
# Logs do nginx
```

**Comum:**
- Nginx não está roteando corretamente
- Frontend build falhou
- Porta errada

**Solução:**
- Verifique `nginx.conf`
- Rebuild do frontend
- Confira se porta 80 está exposta

## 📊 Monitoramento

### Logs em Tempo Real

No Easypanel:
1. Vá em **Logs**
2. Selecione o serviço (backend/frontend/nginx)
3. Ative **"Live Logs"**

### Métricas

1. **CPU/Memória:** Easypanel > Metrics
2. **Requisições:** Verifique logs do nginx
3. **Erros:** Logs do backend

### Alertas (Opcional)

Configure webhooks no Easypanel para receber alertas:
- Container parou
- Build falhou
- Uso alto de recursos

## 🔄 Atualizações

### Deploy Automático

Easypanel pode fazer deploy automático quando você fizer push:

1. Easypanel > Settings > Auto Deploy
2. Ative: **"Deploy on Push"**
3. Toda vez que fizer `git push`, Easypanel rebuilda

### Deploy Manual

```bash
# Fazer alterações
git add .
git commit -m "Atualização XYZ"
git push origin main

# No Easypanel: clique em "Redeploy"
```

## 🗄️ Banco de Dados (Próximo Passo)

Para produção, implemente banco de dados:

### Adicionar MongoDB ao docker-compose.easypanel.yml

```yaml
  mongodb:
    image: mongo:7
    container_name: whatsapp-coex-db
    restart: unless-stopped
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${DB_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${DB_PASSWORD}
    volumes:
      - mongo_data:/data/db
    networks:
      - whatsapp-network

volumes:
  mongo_data:
```

### Adicionar variáveis de ambiente:
```env
DB_HOST=mongodb
DB_PORT=27017
DB_NAME=whatsapp_coex
DB_USER=admin
DB_PASSWORD=senha_super_secreta
```

## ✅ Checklist Final

Antes de marcar como "pronto":

- [ ] Aplicação rodando no Easypanel
- [ ] Domínio configurado e SSL ativo
- [ ] Todas as variáveis de ambiente configuradas
- [ ] URLs atualizadas no Facebook
- [ ] Webhook verificado e funcionando
- [ ] Embedded Signup testado e conectado
- [ ] Logs sem erros críticos
- [ ] Health checks passando
- [ ] CoEx funcionando (mensagens sincronizando)

## 🎯 URLs Importantes

Depois do deploy:

- **Frontend:** https://seu-dominio.com
- **Backend API:** https://seu-dominio.com/api/auth/status
- **Health Check:** https://seu-dominio.com/health
- **Webhook:** https://seu-dominio.com/webhook
- **Easypanel Dashboard:** https://seu-servidor.easypanel.host

## 📞 Suporte

- **Easypanel Docs:** https://easypanel.io/docs
- **WhatsApp API:** https://developers.facebook.com/docs/whatsapp
- **Issues do Projeto:** Criar issue no seu repositório Git

---

**Boa sorte com o deploy! 🚀**
