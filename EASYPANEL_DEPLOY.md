# 🚀 Deploy no Easypanel - WhatsApp CoEx# 🚀 Deploy no Easypanel - WhatsApp CoEx



Guia completo e atualizado para fazer deploy da aplicação WhatsApp CoEx no Easypanel com suporte total a **callbacks do Facebook** para Cadastro Incorporado (Embedded Signup).Guia completo para fazer deploy da aplicação WhatsApp CoEx no Easypanel.



---## 📋 Pré-requisitos



## 📋 Pré-requisitos- [ ] Conta no Easypanel

- [ ] Repositório Git com o código (GitHub, GitLab, etc)

Antes de começar, certifique-se de ter:- [ ] Credenciais do WhatsApp/Facebook configuradas

- [ ] Domínio configurado (recomendado)

- ✅ Conta ativa no [Easypanel](https://easypanel.io)

- ✅ Repositório Git (GitHub, GitLab ou Bitbucket)## 🔧 Passo a Passo

- ✅ App do Facebook criado em [developers.facebook.com](https://developers.facebook.com)

- ✅ WhatsApp Business App instalado com número ativo há 7+ dias### 1. Preparar o Repositório

- ✅ Domínio configurado (ou usar subdomínio do Easypanel)

```bash

---# Commitar o código no Git

git init

## 🔧 Parte 1: Configurar o App do Facebookgit add .

git commit -m "Initial commit - WhatsApp CoEx App"

### 1.1 Obter Credenciais do App

# Push para seu repositório (GitHub/GitLab)

1. Acesse [Facebook Developers](https://developers.facebook.com/apps/)git remote add origin https://github.com/seu-usuario/whatsapp-coex.git

2. Selecione seu app (ou crie um novo com WhatsApp Business)git push -u origin main

3. Vá em **Settings > Basic** e anote:```

   - **App ID**: `1335317331469574` (já configurado)

   - **App Secret**: Clique em "Show" e copie o secret### 2. Criar Projeto no Easypanel



### 1.2 Configurar Webhook do WhatsApp1. Acesse seu painel Easypanel

2. Clique em **"Create Project"** ou **"New Project"**

**⚠️ IMPORTANTE: Faça isso DEPOIS do deploy no Easypanel**3. Nome do projeto: `whatsapp-coex`

4. Selecione o tipo: **"Docker Compose"**

1. No app do Facebook, vá em **WhatsApp > Configuration**

2. Em **Webhook**, clique em **Configure Webhooks**### 3. Conectar Repositório

3. Configure:

   - **Callback URL**: `https://SEU-DOMINIO.easypanel.host/webhook`1. Em **Source**, conecte seu repositório Git

   - **Verify Token**: Crie uma string aleatória (ex: `meu_webhook_token_123`)2. Selecione a branch: `main` (ou `master`)

   - Clique em **Verify and Save**3. **Build Path**: deixe vazio (raiz do projeto)

4. Inscreva-se nos seguintes campos:4. **Docker Compose File**: `docker-compose.easypanel.yml`

   - ✅ `messages`

   - ✅ `message_template_status_update`### 4. Configurar Variáveis de Ambiente

   - ✅ `message_echoes` (importante para CoEx!)

No painel do Easypanel, adicione estas variáveis de ambiente:

### 1.3 Configurar OAuth Redirect URI

#### ⚠️ Variáveis Obrigatórias

1. No app do Facebook, vá em **Settings > Basic**

2. Em **App Domains**, adicione seu domínio Easypanel:```env

   ```# WhatsApp Configuration

   seu-app.easypanel.hostWHATSAPP_APP_ID=1335317331469574

   ```WHATSAPP_CONFIG_ID=2031952424274683

3. Vá em **WhatsApp > Configuration > Embedded Signup**WHATSAPP_APP_SECRET=seu_app_secret_aqui

4. Em **Redirect URL**, adicione:WHATSAPP_API_VERSION=v24.0

   ```

   https://seu-app.easypanel.host/callback# Server Configuration

   ```NODE_ENV=production

5. Salve as alteraçõesPORT=3000

FRONTEND_URL=https://seu-dominio.com

### 1.4 Obter Business IDREDIRECT_URI=https://seu-dominio.com/callback



1. Acesse [Facebook Business Manager](https://business.facebook.com)# Webhook

2. Vá em **Business Settings**WEBHOOK_URL=https://seu-dominio.com/webhook

3. Em **Business Info**, copie o **Business ID**WEBHOOK_VERIFY_TOKEN=seu_token_verificacao_aleatorio



---# Sistema User Token

SYSTEM_USER_TOKEN=seu_system_user_token_aqui

## 📦 Parte 2: Deploy no Easypanel

# Business ID

### 2.1 Preparar o Repositório GitBUSINESS_ID=1132877482331513



```bash# Encryption Key (32 caracteres)

# Commitar o códigoENCRYPTION_KEY=sua_chave_aleatoria_32_caracteres

git add .

git commit -m "Deploy WhatsApp CoEx to Easypanel"# Nginx Port (opcional)

NGINX_PORT=80

# Push para seu repositório```

git push origin main

```#### 📝 Como Obter Cada Variável



### 2.2 Criar Projeto no Easypanel**WHATSAPP_APP_SECRET:**

- https://developers.facebook.com/apps/1335317331469574/settings/basic/

1. Acesse seu painel Easypanel- Copie o "App Secret"

2. Clique em **"+ New Project"**

3. Selecione **"Docker Compose"****SYSTEM_USER_TOKEN:**

4. Preencha:- https://business.facebook.com/settings/system-users

   - **Project Name**: `whatsapp-coex`- Gerar novo token com permissões `whatsapp_business_management` e `whatsapp_business_messaging`

   - **Repository**: Conecte seu repositório Git

   - **Branch**: `main` (ou `master`)**WEBHOOK_VERIFY_TOKEN:**

   - **Docker Compose File**: `docker-compose.easypanel.yml`- Crie uma string aleatória segura (ex: `meu_token_super_secreto_12345`)



### 2.3 Configurar Variáveis de Ambiente**ENCRYPTION_KEY:**

- Gere 32 caracteres aleatórios (ex: `abcdefghijklmnopqrstuvwxyz123456`)

No painel do Easypanel, adicione as seguintes variáveis:

**FRONTEND_URL e REDIRECT_URI:**

#### ⚠️ Variáveis Obrigatórias- Use o domínio do Easypanel (ex: `https://whatsapp-coex.easypanel.host`)

- Ou seu domínio customizado

```env

# WhatsApp App Configuration### 5. Configurar Domínio (Recomendado)

WHATSAPP_APP_ID=1335317331469574

WHATSAPP_CONFIG_ID=2031952424274683#### Opção A: Usar domínio do Easypanel

WHATSAPP_APP_SECRET=<COPIE_DO_FACEBOOK_DEVELOPERS>```

WHATSAPP_API_VERSION=v24.0https://whatsapp-coex.easypanel.host

```

# Server Configuration

NODE_ENV=production#### Opção B: Usar domínio customizado

PORT=3000

1. No Easypanel, vá em **Settings** > **Domains**

# URLs - SUBSTITUA "SEU-DOMINIO" pelo domínio real do Easypanel2. Adicione seu domínio: `whatsapp.seudominio.com`

FRONTEND_URL=https://<SEU-DOMINIO.easypanel.host>3. Configure o DNS:

REDIRECT_URI=https://<SEU-DOMINIO.easypanel.host>/callback   ```

WEBHOOK_URL=https://<SEU-DOMINIO.easypanel.host>/webhook   Type: CNAME

   Name: whatsapp

# Webhook Verify Token - CRIE UMA STRING ALEATÓRIA   Value: seu-servidor.easypanel.host

# Gere com: pwsh -c "-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})"   ```

WEBHOOK_VERIFY_TOKEN=<CRIE_UMA_STRING_SEGURA>4. Aguarde propagação do DNS (5-30 minutos)

5. Easypanel gerará certificado SSL automaticamente

# Business ID - COPIE DO FACEBOOK BUSINESS MANAGER

BUSINESS_ID=<SEU_BUSINESS_ID>### 6. Atualizar URLs no Facebook



# System User Token (Opcional - para recursos avançados)Depois de ter o domínio definitivo, atualize:

SYSTEM_USER_TOKEN=<OPCIONAL>

#### Facebook Login OAuth

# Encryption Key - GERE UMA CHAVE DE 32 CARACTERES1. https://developers.facebook.com/apps/1335317331469574/settings/basic/

# Gere com: pwsh -c "-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})"2. **Valid OAuth Redirect URIs:**

ENCRYPTION_KEY=<GERE_UMA_CHAVE_ALEATORIA_32_CHARS>   ```

   https://seu-dominio.com/callback

# Nginx Port (não altere)   https://seu-dominio.com/

NGINX_PORT=80   ```

```3. **App Domains:**

   ```

#### 🔑 Como Gerar Tokens Aleatórios (PowerShell)   seu-dominio.com

   ```

```powershell4. **Site URL:**

# Gerar Webhook Verify Token   ```

-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})   https://seu-dominio.com

   ```

# Gerar Encryption Key

-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})#### WhatsApp Webhook

```1. https://developers.facebook.com/apps/1335317331469574/whatsapp-business/wa-settings/

2. **Callback URL:**

### 2.4 Configurar Domínio   ```

   https://seu-dominio.com/webhook

1. No Easypanel, vá em **Settings > Domains**   ```

2. Configure seu domínio personalizado ou use o subdomínio fornecido3. **Verify Token:** O mesmo de `WEBHOOK_VERIFY_TOKEN`

3. Ative **SSL/HTTPS** (obrigatório para WhatsApp)4. Subscribe aos eventos:

4. Aguarde a propagação DNS (pode levar alguns minutos)   - ✅ `messages`

   - ✅ `message_echoes` (importante para CoEx!)

### 2.5 Fazer o Deploy   - ✅ `messaging_postbacks`



1. Clique em **"Deploy"**#### Embedded Signup Domains

2. Aguarde o build dos containers (pode levar 3-5 minutos)1. Adicione aos domínios autorizados:

3. Verifique os logs para confirmar que tudo iniciou corretamente   ```

   seu-dominio.com

---   https://seu-dominio.com

   ```

## ✅ Parte 3: Verificar o Deploy

### 7. Deploy

### 3.1 Testar Endpoints

1. No Easypanel, clique em **"Deploy"**

Após o deploy, teste os seguintes endpoints:2. Aguarde o build (pode levar 3-5 minutos)

3. Verifique os logs:

#### Health Check   - Backend: deve mostrar "🚀 Servidor rodando..."

```bash   - Frontend: deve estar servindo na porta 80

curl https://SEU-DOMINIO.easypanel.host/health   - Nginx: deve estar roteando corretamente

```

**Resposta esperada:**### 8. Testar Aplicação

```json

{#### Health Check

  "status": "ok",```bash

  "timestamp": "2025-11-05T...",curl https://seu-dominio.com/health

  "uptime": 123.45# Deve retornar: {"status":"ok",...}

}```

```

#### Verificar Backend

#### Webhook (GET - Verificação do Facebook)```bash

```bashcurl https://seu-dominio.com/api/auth/status

curl "https://SEU-DOMINIO.easypanel.host/webhook?hub.mode=subscribe&hub.verify_token=SEU_WEBHOOK_TOKEN&hub.challenge=12345"# Deve retornar: {"connected":false,"message":"Nenhuma conta conectada"}

``````

**Resposta esperada:** `12345`

#### Testar Frontend

#### Callback OAuth- Abra: `https://seu-dominio.com`

```bash- Deve carregar a interface verde do WhatsApp

curl https://SEU-DOMINIO.easypanel.host/callback- Botão "Conectar WhatsApp com CoEx" deve aparecer

```

**Resposta esperada:** Redirecionamento para página principal#### Testar Webhook (Facebook vai chamar isso)

```bash

#### API Infocurl "https://seu-dominio.com/webhook?hub.mode=subscribe&hub.verify_token=SEU_TOKEN&hub.challenge=12345"

```bash# Deve retornar: 12345

curl https://SEU-DOMINIO.easypanel.host/```

```

### 9. Conectar WhatsApp

### 3.2 Verificar Webhook no Facebook

1. Acesse: `https://seu-dominio.com`

1. Vá em **WhatsApp > Configuration > Webhooks**2. Clique em **"Conectar WhatsApp com CoEx"**

2. Clique em **Test** ao lado de `messages`3. Login no Facebook

3. Se aparecer ✅, o webhook está funcionando!4. Autorize as permissões

5. Escolha: **"Connect your existing WhatsApp Business app"** (CoEx)

### 3.3 Testar Embedded Signup6. Escaneie o QR Code no WhatsApp Business App

7. Aguarde sincronização

1. Acesse `https://SEU-DOMINIO.easypanel.host`8. Pronto! ✅

2. Clique em **"Conectar WhatsApp"**

3. Faça login no Facebook## 🔍 Troubleshooting

4. Complete o fluxo de cadastro

5. Verifique os logs no Easypanel### Build falha



---**Verificar logs:**

```bash

## 🔍 Parte 4: Monitoramento e Logs# No Easypanel, vá em Logs > Build Logs

```

### 4.1 Ver Logs dos Containers

**Causas comuns:**

No Easypanel:- Dockerfile com erro

- Dependências faltando

1. Vá em **Logs**- Memória insuficiente

2. Selecione o container:

   - **backend**: Para ver logs da API**Solução:**

   - **frontend**: Para ver logs do Nginx- Verifique os Dockerfiles

   - **nginx**: Para ver logs de requisições- Aumente recursos no Easypanel se necessário



### 4.2 Logs Importantes### Container não inicia



Quando conectar um número, você deve ver:**Verificar logs:**

```bash

```# No Easypanel: Logs > Runtime Logs

Callback OAuth recebido# Selecione: backend, frontend ou nginx

🔑 Código de autorização recebido```

Iniciando troca de código por token...

Token obtido com sucesso!**Causas comuns:**

Inscrevendo app nos webhooks para WABA: 123456789- Variáveis de ambiente faltando

App inscrito nos webhooks com sucesso!- Porta já em uso

Registrando número de telefone: 987654321- Healthcheck falhando

✅ WhatsApp conectado com sucesso!

```**Solução:**

- Confira todas as variáveis de ambiente

---- Verifique se PORT está definido

- Ajuste configurações de healthcheck se necessário

## 🐛 Troubleshooting

### Webhook não recebe mensagens

### Erro: "Webhook verification failed"

**Verificar:**

**Causa**: Token de verificação incorreto1. URL do webhook está correta no Facebook?

2. HTTPS está funcionando?

**Solução**:3. Verify token está correto?

1. Verifique se `WEBHOOK_VERIFY_TOKEN` no Easypanel é o mesmo configurado no Facebook4. App está inscrito nos eventos corretos?

2. Redeploy a aplicação

3. Tente verificar novamente no Facebook**Testar manualmente:**

```bash

### Erro: "Redirect URI mismatch"curl -X POST https://seu-dominio.com/webhook \

  -H "Content-Type: application/json" \

**Causa**: URL de redirecionamento não configurada no Facebook  -d '{"object":"whatsapp_business_account","entry":[{"changes":[{"field":"messages","value":{"messages":[{"from":"5511999999999","text":{"body":"Teste"}}]}}]}]}'

```

**Solução**:

1. Vá em **Facebook App > Settings > Basic**### SSL/HTTPS não funciona

2. Adicione `https://SEU-DOMINIO.easypanel.host/callback` em **Valid OAuth Redirect URIs**

3. Salve e tente novamente**Easypanel gera SSL automaticamente se:**

- Domínio está apontando corretamente

### Erro: "SSL certificate problem"- DNS propagou (aguarde 30min)

- Porta 80 e 443 estão abertas

**Causa**: HTTPS não configurado corretamente

**Forçar renovação:**

**Solução**:1. Easypanel > Settings > SSL

1. No Easypanel, verifique se SSL está ativado2. Clique em "Renew Certificate"

2. Aguarde alguns minutos para propagação

3. WhatsApp **EXIGE** HTTPS para webhooks### Frontend não carrega



### Container reiniciando constantemente**Verificar:**

```bash

**Causa**: Erro de configuração ou porta em uso# Logs do frontend

# Logs do nginx

**Solução**:```

1. Verifique os logs do container

2. Certifique-se de que todas as variáveis de ambiente estão corretas**Comum:**

3. Verifique se a porta 80 não está sendo usada por outro serviço- Nginx não está roteando corretamente

- Frontend build falhou

### Frontend não carrega- Porta errada



**Causa**: CORS ou NGINX mal configurado**Solução:**

- Verifique `nginx.conf`

**Solução**:- Rebuild do frontend

1. Verifique se `FRONTEND_URL` está correto- Confira se porta 80 está exposta

2. Verifique os logs do container `nginx`

3. Certifique-se de que todos os containers estão rodando## 📊 Monitoramento



### Mensagens não chegam no webhook### Logs em Tempo Real



**Causa**: Webhook não inscrito ou URL incorretaNo Easypanel:

1. Vá em **Logs**

**Solução**:2. Selecione o serviço (backend/frontend/nginx)

1. Verifique se o webhook foi verificado no Facebook3. Ative **"Live Logs"**

2. Confirme se a URL está correta (com HTTPS)

3. Teste manualmente:### Métricas

```bash

curl -X POST https://SEU-DOMINIO.easypanel.host/webhook \1. **CPU/Memória:** Easypanel > Metrics

  -H "Content-Type: application/json" \2. **Requisições:** Verifique logs do nginx

  -d '{"object":"whatsapp_business_account"}'3. **Erros:** Logs do backend

```

### Alertas (Opcional)

---

Configure webhooks no Easypanel para receber alertas:

## 🔐 Segurança- Container parou

- Build falhou

### Boas Práticas- Uso alto de recursos



1. **Nunca comite** arquivos `.env` com credenciais reais## 🔄 Atualizações

2. **Use tokens fortes** (mínimo 32 caracteres)

3. **Ative HTTPS** obrigatoriamente### Deploy Automático

4. **Monitore os logs** regularmente

5. **Atualize** as dependências periodicamenteEasypanel pode fazer deploy automático quando você fizer push:



### Variáveis Sensíveis1. Easypanel > Settings > Auto Deploy

2. Ative: **"Deploy on Push"**

As seguintes variáveis são **CRÍTICAS** e devem ser mantidas em segredo:3. Toda vez que fizer `git push`, Easypanel rebuilda



- `WHATSAPP_APP_SECRET`### Deploy Manual

- `WEBHOOK_VERIFY_TOKEN`

- `SYSTEM_USER_TOKEN````bash

- `ENCRYPTION_KEY`# Fazer alterações

git add .

---git commit -m "Atualização XYZ"

git push origin main

## 📊 Estrutura de Endpoints

# No Easypanel: clique em "Redeploy"

Após o deploy, sua aplicação terá os seguintes endpoints:```



| Endpoint | Método | Descrição | Usado por |## 🗄️ Banco de Dados (Próximo Passo)

|----------|--------|-----------|-----------|

| `/` | GET | Página principal | Usuários |Para produção, implemente banco de dados:

| `/health` | GET | Health check | Easypanel/Monitoramento |

| `/callback` | GET | OAuth redirect | Facebook OAuth |### Adicionar MongoDB ao docker-compose.easypanel.yml

| `/webhook` | GET | Verificação webhook | Facebook |

| `/webhook` | POST | Receber mensagens | WhatsApp Cloud API |```yaml

| `/api/auth/exchange-code` | POST | Trocar código por token | Frontend |  mongodb:

| `/api/auth/status` | GET | Status da conexão | Frontend |    image: mongo:7

| `/api/auth/disconnect` | POST | Desconectar conta | Frontend |    container_name: whatsapp-coex-db

| `/api/auth/sync-status/:wabaId` | GET | Status CoEx | Frontend |    restart: unless-stopped

    environment:

---      - MONGO_INITDB_ROOT_USERNAME=${DB_USER}

      - MONGO_INITDB_ROOT_PASSWORD=${DB_PASSWORD}

## 🎯 Fluxo Completo de Autenticação    volumes:

      - mongo_data:/data/db

```    networks:

1. Usuário clica "Conectar WhatsApp"      - whatsapp-network

   ↓

2. Frontend abre popup do Facebook (Embedded Signup)volumes:

   ↓  mongo_data:

3. Usuário faz login e autoriza```

   ↓

4. Facebook envia: code + phone_number_id + waba_id### Adicionar variáveis de ambiente:

   ↓```env

5. Frontend envia para: POST /api/auth/exchange-codeDB_HOST=mongodb

   ↓DB_PORT=27017

6. Backend troca code por access_token (Facebook OAuth)DB_NAME=whatsapp_coex

   ↓DB_USER=admin

7. Backend armazena token criptografadoDB_PASSWORD=senha_super_secreta

   ↓```

8. Backend inscreve app nos webhooks da WABA

   ↓## ✅ Checklist Final

9. Backend retorna sucesso para frontend

   ↓Antes de marcar como "pronto":

10. Frontend mostra "✅ Conectado!"

```- [ ] Aplicação rodando no Easypanel

- [ ] Domínio configurado e SSL ativo

---- [ ] Todas as variáveis de ambiente configuradas

- [ ] URLs atualizadas no Facebook

## 📞 Suporte- [ ] Webhook verificado e funcionando

- [ ] Embedded Signup testado e conectado

Se encontrar problemas:- [ ] Logs sem erros críticos

- [ ] Health checks passando

1. Verifique os logs no Easypanel- [ ] CoEx funcionando (mensagens sincronizando)

2. Teste os endpoints manualmente

3. Consulte a [documentação oficial do WhatsApp](https://developers.facebook.com/docs/whatsapp/embedded-signup)## 🎯 URLs Importantes

4. Verifique se todas as configurações do Facebook estão corretas

Depois do deploy:

---

- **Frontend:** https://seu-dominio.com

## 🎉 Conclusão- **Backend API:** https://seu-dominio.com/api/auth/status

- **Health Check:** https://seu-dominio.com/health

Sua aplicação WhatsApp CoEx agora está **100% configurada** para receber callbacks do Facebook quando você conectar novos números através do Cadastro Incorporado!- **Webhook:** https://seu-dominio.com/webhook

- **Easypanel Dashboard:** https://seu-servidor.easypanel.host

### ✅ Checklist Final:

## 📞 Suporte

- [x] Endpoint `/callback` criado para OAuth redirect

- [x] Endpoint `/webhook` configurado para verificação e mensagens- **Easypanel Docs:** https://easypanel.io/docs

- [x] NGINX configurado para rotear corretamente os callbacks- **WhatsApp API:** https://developers.facebook.com/docs/whatsapp

- [x] Frontend usando URLs relativas (funciona em qualquer domínio)- **Issues do Projeto:** Criar issue no seu repositório Git

- [x] Variáveis de ambiente documentadas

- [x] HTTPS obrigatório configurado---

- [x] Healthchecks implementados

- [x] Logs estruturados**Boa sorte com o deploy! 🚀**


### 🚀 Próximos Passos:

1. Faça o deploy no Easypanel seguindo este guia
2. Configure o webhook no Facebook
3. Teste conectando um número real
4. Monitore os logs durante o processo
5. Verifique se as mensagens estão sendo recebidas

**Tudo está organizado e pronto para o Easypanel! 🎊**
