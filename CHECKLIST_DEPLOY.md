# ✅ Checklist de Deploy - WhatsApp CoEx no Easypanel

Use este checklist para garantir que tudo está configurado corretamente antes e depois do deploy.

---

## 📋 Antes do Deploy

### 1. Repositório Git
- [ ] Código commitado no Git
- [ ] Push feito para GitHub/GitLab
- [ ] Branch `main` ou `master` está atualizada
- [ ] Arquivo `.env` **NÃO** foi commitado (apenas `.env.example`)

### 2. Facebook App
- [ ] App criado em [developers.facebook.com](https://developers.facebook.com)
- [ ] App ID anotado: `1335317331469574`
- [ ] App Secret copiado de **Settings > Basic**
- [ ] WhatsApp Product adicionado ao app
- [ ] Business ID obtido do Facebook Business Manager

### 3. Arquivos Verificados
- [ ] `docker-compose.easypanel.yml` existe
- [ ] `backend/Dockerfile` existe
- [ ] `frontend/Dockerfile` existe
- [ ] `nginx/Dockerfile` existe
- [ ] `nginx/nginx.conf` configurado corretamente
- [ ] `frontend/public/config.js` criado
- [ ] `EASYPANEL_DEPLOY.md` revisado

---

## 🚀 Durante o Deploy no Easypanel

### 1. Criar Projeto
- [ ] Projeto criado no Easypanel
- [ ] Nome: `whatsapp-coex` (ou similar)
- [ ] Tipo: **Docker Compose**
- [ ] Repositório Git conectado
- [ ] Branch selecionada: `main`
- [ ] Docker Compose File: `docker-compose.easypanel.yml`

### 2. Configurar Variáveis de Ambiente

**Obrigatórias:**
- [ ] `WHATSAPP_APP_ID=1335317331469574`
- [ ] `WHATSAPP_CONFIG_ID=2031952424274683`
- [ ] `WHATSAPP_APP_SECRET=<seu_app_secret>`
- [ ] `WHATSAPP_API_VERSION=v24.0`
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`
- [ ] `FRONTEND_URL=https://seu-dominio.easypanel.host`
- [ ] `REDIRECT_URI=https://seu-dominio.easypanel.host/callback`
- [ ] `WEBHOOK_URL=https://seu-dominio.easypanel.host/webhook`
- [ ] `WEBHOOK_VERIFY_TOKEN=<token_aleatório_32_chars>`
- [ ] `BUSINESS_ID=<seu_business_id>`
- [ ] `ENCRYPTION_KEY=<chave_aleatória_32_chars>`
- [ ] `NGINX_PORT=80`

**Opcional:**
- [ ] `SYSTEM_USER_TOKEN=<seu_system_user_token>` (para recursos avançados)

### 3. Configurar Domínio
- [ ] Domínio configurado no Easypanel
- [ ] SSL/HTTPS ativado (obrigatório!)
- [ ] DNS propagado (aguardar 5-30 minutos)
- [ ] Certificado SSL emitido

### 4. Fazer Deploy
- [ ] Clicado em **Deploy**
- [ ] Aguardado build (3-5 minutos)
- [ ] Build concluído sem erros

---

## ✅ Após o Deploy

### 1. Verificar Containers
- [ ] Container `backend` está rodando
- [ ] Container `frontend` está rodando
- [ ] Container `nginx` está rodando
- [ ] Healthchecks todos ✅ verdes

### 2. Testar Endpoints

**Health Check:**
```bash
curl https://seu-dominio.easypanel.host/health
```
- [ ] Retorna `{"status":"ok",...}`

**Webhook Verification:**
```bash
curl "https://seu-dominio.easypanel.host/webhook?hub.mode=subscribe&hub.verify_token=SEU_TOKEN&hub.challenge=12345"
```
- [ ] Retorna `12345`

**Callback:**
```bash
curl https://seu-dominio.easypanel.host/callback
```
- [ ] Redireciona para `/` (código 302)

**Frontend:**
- [ ] Abre `https://seu-dominio.easypanel.host` no navegador
- [ ] Página carrega corretamente
- [ ] Botão "Conectar WhatsApp" aparece

### 3. Verificar Logs

**Backend:**
- [ ] Logs mostram: `🚀 Servidor rodando na porta 3000`
- [ ] Sem erros críticos

**Frontend:**
- [ ] Nginx servindo arquivos corretamente

**Nginx:**
- [ ] Logs de acesso funcionando
- [ ] Proxy reverso funcionando

---

## 🔧 Configurar Facebook App (DEPOIS do Deploy)

### 1. Webhook Configuration
- [ ] Acessar **WhatsApp > Configuration > Webhooks**
- [ ] **Callback URL**: `https://seu-dominio.easypanel.host/webhook`
- [ ] **Verify Token**: Mesmo valor de `WEBHOOK_VERIFY_TOKEN`
- [ ] Clicar em **Verify and Save**
- [ ] Webhook verificado com ✅

**Inscrições:**
- [ ] `messages` ✅
- [ ] `message_template_status_update` ✅
- [ ] `message_echoes` ✅ (importante para CoEx!)

### 2. OAuth Redirect URI
- [ ] Acessar **Settings > Basic**
- [ ] **App Domains**: `seu-dominio.easypanel.host`
- [ ] **Valid OAuth Redirect URIs**: `https://seu-dominio.easypanel.host/callback`
- [ ] Salvar alterações

### 3. Embedded Signup
- [ ] Acessar **WhatsApp > Configuration > Embedded Signup**
- [ ] **Redirect URL**: `https://seu-dominio.easypanel.host/callback`
- [ ] Salvar

---

## 🧪 Testar Embedded Signup

### 1. Acessar Aplicação
- [ ] Abrir `https://seu-dominio.easypanel.host`
- [ ] Página carrega sem erros
- [ ] Console do navegador sem erros JavaScript

### 2. Iniciar Conexão
- [ ] Clicar em **"Conectar WhatsApp"**
- [ ] Popup do Facebook abre
- [ ] Login realizado

### 3. Autorizar App
- [ ] Permissões mostradas
- [ ] Clicar em **Continuar**
- [ ] Escolher **"Connect your existing WhatsApp Business app"** (CoEx)

### 4. Escanear QR Code
- [ ] Abrir WhatsApp Business App no celular
- [ ] Ir em **Configurações > Dispositivos Conectados**
- [ ] Escanear QR Code

### 5. Verificar Sucesso
- [ ] Mensagem "✅ WhatsApp conectado com sucesso!"
- [ ] Informações da conta mostradas
- [ ] WABA ID e Phone Number ID corretos

---

## 📊 Monitoramento

### 1. Logs do Backend (Easypanel)

Deve mostrar:
```
Callback OAuth recebido
🔑 Código de autorização recebido
Iniciando troca de código por token...
Token obtido com sucesso!
Inscrevendo app nos webhooks para WABA: 123456789
App inscrito nos webhooks com sucesso!
Registrando número de telefone: 987654321
✅ WhatsApp conectado com sucesso!
```

- [ ] Logs mostram fluxo completo
- [ ] Sem erros

### 2. Testar Webhook

**Enviar mensagem de teste:**
- [ ] Enviar mensagem para o número conectado
- [ ] Logs do backend mostram webhook recebido
- [ ] Mensagem aparece nos logs

**Teste manual:**
```bash
curl -X POST https://seu-dominio.easypanel.host/webhook \
  -H "Content-Type: application/json" \
  -d '{"object":"whatsapp_business_account","entry":[{"changes":[{"field":"messages"}]}]}'
```
- [ ] Retorna status 200
- [ ] Logs mostram webhook recebido

---

## 🐛 Troubleshooting

### Se o webhook não verificar:
- [ ] Verificar se `WEBHOOK_VERIFY_TOKEN` está correto
- [ ] Testar manualmente:
```bash
curl "https://seu-dominio.easypanel.host/webhook?hub.mode=subscribe&hub.verify_token=SEU_TOKEN&hub.challenge=12345"
```
- [ ] Deve retornar exatamente `12345`

### Se o callback falhar:
- [ ] Verificar se URL está em **Valid OAuth Redirect URIs** no Facebook
- [ ] Verificar se HTTPS está funcionando
- [ ] Testar: `curl https://seu-dominio.easypanel.host/callback`

### Se o frontend não carregar:
- [ ] Verificar logs do nginx
- [ ] Verificar se todos os containers estão rodando
- [ ] Verificar se `config.js` está sendo servido

### Se SSL não funcionar:
- [ ] Aguardar propagação DNS (30 minutos)
- [ ] Easypanel > Settings > SSL > Renew Certificate
- [ ] Verificar se domínio está apontando corretamente

---

## 🎉 Tudo Pronto!

Se todos os itens acima estão marcados:

✅ **Sua aplicação está 100% funcional!**

### Próximos Passos:
1. Conectar mais números
2. Configurar templates de mensagens
3. Implementar lógica de resposta automática
4. Adicionar banco de dados (MongoDB)
5. Configurar backup automático

---

## 📞 Suporte

**Logs:**
- Easypanel > Logs > backend
- Easypanel > Logs > nginx

**Documentação:**
- `EASYPANEL_DEPLOY.md` - Guia completo
- `MUDANCAS_IMPLEMENTADAS.md` - O que foi alterado
- [WhatsApp Docs](https://developers.facebook.com/docs/whatsapp)

**Endpoints para Teste:**
- Health: `https://seu-dominio/health`
- Webhook: `https://seu-dominio/webhook`
- Callback: `https://seu-dominio/callback`
- Frontend: `https://seu-dominio/`

---

**Boa sorte com o deploy! 🚀**
