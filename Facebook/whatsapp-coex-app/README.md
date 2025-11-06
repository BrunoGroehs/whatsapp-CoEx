# 🚀 WhatsApp CoEx - Embedded Signup

Aplicação completa para implementar **Cadastro Incorporado (Embedded Signup) do WhatsApp** com suporte a **CoEx (Coexistence)**, permitindo usar a mesma linha telefônica tanto no WhatsApp Business App quanto na API de nuvem.

## 📋 Índice

- [Características](#características)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [CoEx (Coexistence)](#coex-coexistence)
- [Troubleshooting](#troubleshooting)
- [Segurança](#segurança)
- [Produção](#produção)

## ✨ Características

- ✅ **Embedded Signup Flow** completo do WhatsApp
- ✅ **CoEx (Coexistence)** - use o mesmo número no App e API
- ✅ **Autenticação segura** com Facebook OAuth
- ✅ **Captura automática** de phone_number_id e waba_id
- ✅ **Troca de código por token** (server-to-server)
- ✅ **Sincronização de histórico** (até 6 meses)
- ✅ **Docker Compose** pronto para produção
- ✅ **Interface web moderna** e responsiva
- ✅ **Logs em tempo real** de todos os eventos
- ✅ **Rate limiting** e segurança

## 🔧 Pré-requisitos

### Software Necessário

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Node.js** (v18+) - apenas para desenvolvimento local
- **Git** - para clonar o repositório

### Requisitos WhatsApp/Facebook

1. **App do Facebook** criado em [developers.facebook.com](https://developers.facebook.com)
2. **WhatsApp Business App** versão 2.24.17+ instalado no celular
3. **Número ativo no app** por 7+ dias (recomendado 1-2 meses)
4. **País/região que suporta CoEx**:
   - ✅ Brasil, México, Índia, EUA, Singapura, Colômbia, Argentina, Peru, Chile, Malásia, Tailândia, Indonésia
   - ❌ UE, UK, Austrália, Japão, Nigéria, Filipinas, Rússia, Coreia do Sul, Arábia Saudita, Turquia

## ⚙️ Configuração

### 1. Clonar ou criar a estrutura do projeto

```bash
cd whatsapp-coex-app
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha com seus dados:

```env
# WhatsApp Configuration
WHATSAPP_APP_ID=1335317331469574
WHATSAPP_CONFIG_ID=2031952424274683
WHATSAPP_APP_SECRET=seu_app_secret_aqui
WHATSAPP_API_VERSION=v24.0

# Server Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=http://localhost:8080

# Webhook
WEBHOOK_URL=sua_url_webhook_aqui
WEBHOOK_VERIFY_TOKEN=seu_token_verificacao_aleatorio

# Sistema User Token
SYSTEM_USER_TOKEN=seu_system_user_token_aqui

# Business ID
BUSINESS_ID=1132877482331513

# Redirect URI
REDIRECT_URI=http://localhost:8080/callback

# Encryption Key (32 caracteres)
ENCRYPTION_KEY=sua_chave_aleatoria_32_caracteres
```

### 3. Obter credenciais necessárias

#### App Secret (WHATSAPP_APP_SECRET)

1. Acesse [developers.facebook.com/apps](https://developers.facebook.com/apps)
2. Selecione seu app
3. Vá em **Settings** > **Basic**
4. Copie o **App Secret** (clique em "Show")

#### System User Token (SYSTEM_USER_TOKEN)

1. Acesse [business.facebook.com](https://business.facebook.com)
2. Vá em **Configurações do Negócio** > **Usuários** > **Usuários do Sistema**
3. Clique em **Adicionar** e crie um usuário do sistema
4. Clique em **Gerar novo token**
5. Selecione seu app e as permissões:
   - `whatsapp_business_management`
   - `whatsapp_business_messaging`
6. Copie o token gerado

#### Webhook Verify Token (WEBHOOK_VERIFY_TOKEN)

Crie uma string aleatória segura:

```bash
# No Linux/Mac
openssl rand -hex 32

# Ou use qualquer string aleatória
echo "meu_token_super_secreto_$(date +%s)"
```

#### Encryption Key (ENCRYPTION_KEY)

Gere uma chave de 32 caracteres:

```bash
openssl rand -base64 32 | cut -c1-32
```

### 4. Configurar webhook no Facebook

1. Acesse seu app em [developers.facebook.com](https://developers.facebook.com/apps)
2. Vá em **WhatsApp** > **Configuration**
3. Em **Webhook**, clique em **Edit**
4. Configure:
   - **Callback URL**: `https://seu-dominio.com/webhook`
   - **Verify Token**: o mesmo que você definiu em `WEBHOOK_VERIFY_TOKEN`
5. Marque os campos de assinatura:
   - `messages`
   - `message_echoes` (importante para CoEx!)
   - `messaging_postbacks`

## 🚀 Instalação

### Usando Docker Compose (Recomendado)

```bash
# Build das imagens
docker-compose build

# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down
```

### Desenvolvimento Local (Sem Docker)

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

Abra `frontend/public/index.html` em um navegador ou use um servidor HTTP:

```bash
cd frontend/public
npx http-server -p 8080
```

## 📱 Uso

### 1. Acessar a aplicação

Abra o navegador em: `http://localhost:8080` (ou porta 80 se usando nginx)

### 2. Conectar WhatsApp

1. Clique no botão **"Conectar WhatsApp com CoEx"**
2. Uma janela popup do Facebook será aberta
3. Faça login com sua conta Facebook
4. Selecione **"Connect your existing WhatsApp Business app"** (CoEx)
5. Escaneie o QR Code com seu WhatsApp Business App
6. Autorize as permissões solicitadas
7. Aguarde a sincronização do histórico

### 3. Verificar conexão

Após conectar com sucesso:
- A interface mostrá as informações da conta conectada
- O histórico de mensagens começará a sincronizar automaticamente
- Você verá logs de todos os eventos

### 4. Usar a API

Agora você pode usar a WhatsApp Business API para enviar mensagens:

```bash
# Obter o access token (armazenado no backend)
curl http://localhost:3000/api/auth/status

# Enviar mensagem (exemplo)
curl -X POST https://graph.facebook.com/v24.0/SEU_PHONE_NUMBER_ID/messages \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "text",
    "text": {
      "body": "Olá! Esta mensagem foi enviada via API com CoEx!"
    }
  }'
```

## 📁 Estrutura do Projeto

```
whatsapp-coex-app/
├── docker-compose.yml          # Orquestração Docker
├── .env.example                # Exemplo de variáveis de ambiente
├── .dockerignore               # Arquivos ignorados pelo Docker
├── README.md                   # Esta documentação
│
├── backend/                    # Backend Node.js
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js           # Servidor Express
│       ├── routes/
│       │   └── auth.js        # Rotas de autenticação
│       ├── controllers/
│       │   └── authController.js
│       ├── services/
│       │   ├── whatsappService.js  # Integração WhatsApp API
│       │   └── tokenService.js     # Gerenciamento de tokens
│       └── middleware/
│           └── errorHandler.js
│
├── frontend/                   # Frontend HTML/CSS/JS
│   ├── Dockerfile
│   ├── package.json
│   └── public/
│       └── index.html         # Página principal
│
└── nginx/                      # Reverse Proxy
    ├── Dockerfile
    └── nginx.conf             # Configuração Nginx
```

## 🔌 API Endpoints

### POST `/api/auth/exchange-code`

Troca código de autorização por access token.

**Body:**
```json
{
  "code": "código_de_autorização",
  "phone_number_id": "123456789",
  "waba_id": "987654321"
}
```

**Response:**
```json
{
  "success": true,
  "message": "WhatsApp conectado com sucesso!",
  "data": {
    "wabaId": "987654321",
    "phoneNumberId": "123456789",
    "expiresIn": 5184000,
    "accountInfo": {...},
    "phoneInfo": {...}
  }
}
```

### GET `/api/auth/status`

Verifica status da conexão.

**Response:**
```json
{
  "connected": true,
  "accounts": [
    {
      "wabaId": "987654321",
      "phoneNumberId": "123456789",
      "connected": true,
      "expiresAt": "2024-03-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### POST `/api/auth/disconnect`

Desconecta uma conta.

**Body:**
```json
{
  "waba_id": "987654321"
}
```

### GET `/api/auth/sync-status/:wabaId`

Verifica status de sincronização (CoEx).

**Response:**
```json
{
  "success": true,
  "wabaId": "987654321",
  "syncStatus": {...}
}
```

### GET `/webhook`

Verificação do webhook (Facebook).

### POST `/webhook`

Recebe eventos do WhatsApp.

## 🔄 CoEx (Coexistence)

### O que é CoEx?

**CoEx (Coexistence)** permite usar o **mesmo número de telefone** tanto no WhatsApp Business App quanto na API de nuvem simultaneamente.

### Características

- ✅ Mensagens são espelhadas entre app e API
- ✅ Histórico sincronizado (até 6 meses)
- ✅ Sem interrupção de serviço
- ✅ Transição suave do app para API

### Requisitos

1. **WhatsApp Business App 2.24.17+**
2. **Número ativo por 7+ dias** (ideal: 1-2 meses)
3. **País que suporte CoEx** (ver lista acima)
4. **Número não usado em outra WABA recentemente**

### Sincronização de Histórico

| Período | Tipo de Sincronização |
|---------|----------------------|
| Contatos | Instantânea |
| Últimas 24h | Tempo real |
| Últimos 90 dias | Background (imediato) |
| Últimos 6 meses | Background (gradual) |

### Pricing em CoEx

1. **App responde** (sem usar API): **GRÁTIS** ✅
2. **API responde** (após app receber): **PAGO** 💰
3. **API inicia conversa**: **PAGO** 💰
4. **Template após API**: **PAGO** 💰

## 🐛 Troubleshooting

### Erro: "Your phone number isn't eligible to connect"

**Causa:** Número não tem 7+ dias de atividade no app.

**Solução:** Use o WhatsApp Business App por pelo menos 7 dias antes de integrar.

### Erro: "Unsupported Country"

**Causa:** Seu país não suporta CoEx.

**Solução:** Use um número de um país suportado (ex: Brasil, México, EUA).

### Erro: "Previous WABA Usage"

**Causa:** Número foi usado em outra WABA recentemente.

**Solução:** Aguarde 1-2 meses antes de tentar novamente.

### QR Code expirou

**Causa:** QR Code tem validade de ~5 minutos.

**Solução:** Gere um novo QR Code clicando novamente no botão.

### Webhook não recebe mensagens

**Verificações:**

1. URL do webhook é HTTPS? (obrigatório)
2. Verify token está correto?
3. App inscrito nos eventos corretos?
4. Firewall bloqueando requisições do Facebook?

```bash
# Testar webhook manualmente
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Token expirado

Tokens do Facebook expiram após 60 dias por padrão.

**Solução:** Implementar renovação automática (já incluído no `tokenService.js`).

### Erro CORS no frontend

**Causa:** Backend não permite requisições do frontend.

**Solução:** Verifique se `FRONTEND_URL` no `.env` está correto.

### Container não inicia

```bash
# Ver logs de erro
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx

# Rebuild forçado
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🔒 Segurança

### Implementado

- ✅ HTTPS obrigatório para webhooks
- ✅ Tokens criptografados (AES-256-CBC)
- ✅ Rate limiting (100 req/min)
- ✅ Validação de input
- ✅ CORS configurado
- ✅ Helmet.js (headers de segurança)
- ✅ Logging de operações sensíveis

### Recomendações Adicionais

1. **Nunca commitar `.env`** ao Git
2. **Usar HTTPS em produção** (obrigatório)
3. **Renovar tokens regularmente**
4. **Implementar banco de dados** (não usar memória)
5. **Backup de tokens** e dados importantes
6. **Monitoramento** de logs e erros

### Validação de Webhook

O backend valida automaticamente:
- Origem das requisições
- Assinatura do Facebook (se configurada)
- Verify token

## 🌐 Produção

### 1. Configurar domínio e SSL

```bash
# Instalar Certbot (Let's Encrypt)
sudo apt-get install certbot

# Obter certificado SSL
sudo certbot certonly --standalone -d seu-dominio.com

# Copiar certificados para o projeto
cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem nginx/ssl/key.pem
```

### 2. Atualizar nginx.conf

Descomente a seção HTTPS no `nginx/nginx.conf` e configure:

```nginx
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... resto da configuração
}
```

### 3. Atualizar .env para produção

```env
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com
REDIRECT_URI=https://seu-dominio.com/callback
WEBHOOK_URL=https://seu-dominio.com/webhook
```

### 4. Implementar banco de dados

Para produção, **NÃO use armazenamento em memória**. Implemente MongoDB, PostgreSQL ou MySQL.

Exemplo com MongoDB:

```javascript
// backend/src/services/databaseService.js
const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  wabaId: String,
  token: String,
  expiresAt: Date,
  createdAt: Date
});

const Token = mongoose.model('Token', TokenSchema);

async function storeToken(wabaId, token, expiresAt) {
  await Token.findOneAndUpdate(
    { wabaId },
    { wabaId, token, expiresAt, createdAt: new Date() },
    { upsert: true }
  );
}
```

### 5. Monitoramento

Implemente logging e monitoramento:

- **PM2** para gerenciar processo Node.js
- **Winston** para logs estruturados
- **Sentry** para tracking de erros
- **Prometheus** + **Grafana** para métricas

### 6. Backup

Configure backup automático de:
- Banco de dados
- Tokens criptografados
- Configurações

## 📞 Suporte

### Documentação Oficial

- [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp)
- [Embedded Signup](https://developers.facebook.com/docs/whatsapp/embedded-signup)
- [CoExistence](https://developers.facebook.com/docs/whatsapp/coexistence)

### Recursos

- [Meta for Developers](https://developers.facebook.com)
- [WhatsApp Business API](https://business.whatsapp.com/products/business-platform)

## 📄 Licença

ISC

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para facilitar a integração WhatsApp Business API com CoEx**
