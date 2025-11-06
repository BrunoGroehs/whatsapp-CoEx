# 📱 WhatsApp Business CoExistence - Embedded Signup

Aplicação Node.js para cadastro incorporado (Embedded Signup) do WhatsApp Business com suporte a **CoExistence** - permitindo usar números que já estão no WhatsApp Business App.

## 🎯 O que é CoExistence?

CoExistence permite que você use um número que já está ativo no WhatsApp Business App para também acessar a API do WhatsApp Business Platform. Isso significa que o mesmo número pode:
- Continuar funcionando no app móvel WhatsApp Business
- Ser usado via API para automação e integrações

## 🚀 Features

- ✅ Embedded Signup com CoExistence habilitado
- ✅ OAuth 2.0 flow completo
- ✅ Troca automática de código por token de acesso
- ✅ Registro automático do número no WhatsApp Business
- ✅ Webhooks configurados e funcionais
- ✅ API REST para envio de mensagens
- ✅ Armazenamento local de dados de negócios
- ✅ Pronto para deploy com Docker
- ✅ Interface web amigável

## 📋 Pré-requisitos

### 1. Criar um App no Facebook Developer

1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Vá em **Meus Apps** > **Criar App**
3. Escolha **Negócios** como tipo de app
4. Preencha os dados:
   - **Nome do App**: WhatsApp CoEx App (ou seu nome)
   - **Email de contato**: seu email
   - **Business Portfolio**: selecione ou crie um

### 2. Adicionar o Produto WhatsApp

1. No painel do app, clique em **Adicionar Produto**
2. Encontre **WhatsApp** e clique em **Configurar**
3. Siga o assistente de configuração

### 3. Obter as Credenciais

#### App ID e App Secret

1. No painel do app, vá em **Configurações** > **Básico**
2. Copie:
   - **ID do App** (Facebook App ID)
   - **Chave Secreta do App** (Facebook App Secret) - clique em "Mostrar"

#### Configuration ID (para Embedded Signup)

1. No painel do app, vá em **WhatsApp** > **Configuração**
2. Role até **Embedded Signup**
3. Clique em **Criar configuração** ou use uma existente
4. Copie o **Configuration ID**

**OU use o Embedded Signup Builder:**

1. Vá em **WhatsApp** > **Embedded Signup Builder**
2. Configure as opções:
   - Permissões: `whatsapp_business_management`, `whatsapp_business_messaging`
   - Callback URL: `https://casaecosustentavel-a.k3givk.easypanel.host/auth/callback`
3. Gere o código e copie o **Configuration ID**

### 4. Configurar OAuth Redirect URIs

1. Vá em **Configurações** > **Básico** > **Domínios do App**
2. Adicione seu domínio: `casaecosustentavel-a.k3givk.easypanel.host`
3. Vá em **Produtos** > **Facebook Login** > **Configurações**
4. Em **URIs de redirecionamento do OAuth válidos**, adicione:
   ```
   https://casaecosustentavel-a.k3givk.easypanel.host/auth/callback
   ```

### 5. Configurar Webhooks

1. No painel do app, vá em **WhatsApp** > **Configuração**
2. Em **Webhooks**, clique em **Configurar Webhooks**
3. Preencha:
   - **URL de Callback**: `https://casaecosustentavel-a.k3givk.easypanel.host/webhook`
   - **Token de Verificação**: crie um token secreto (ex: `meu_token_secreto_12345`)
4. Clique em **Verificar e Salvar**
5. Inscreva-se nos campos:
   - `messages` (mensagens recebidas)
   - `message_status` (status de entrega)

## 🛠️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd whatsapp-coex-app
```

### 2. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Facebook App Credentials
FACEBOOK_APP_ID=seu_app_id_aqui
FACEBOOK_APP_SECRET=seu_app_secret_aqui
FACEBOOK_CONFIG_ID=seu_configuration_id_aqui

# Webhook Configuration
WEBHOOK_VERIFY_TOKEN=seu_token_de_verificacao_secreto_aqui

# Server Configuration
PORT=3000
NODE_ENV=production

# Deploy URL
APP_URL=https://casaecosustentavel-a.k3givk.easypanel.host
```

### 3. Configure as credenciais no HTML

Edite o arquivo `src/public/index.html` e substitua:

```javascript
const FACEBOOK_APP_ID = 'SEU_APP_ID_AQUI';
const FACEBOOK_CONFIG_ID = 'SEU_CONFIG_ID_AQUI';
```

Por suas credenciais reais:

```javascript
const FACEBOOK_APP_ID = '123456789012345';
const FACEBOOK_CONFIG_ID = '987654321098765';
```

## 🐳 Deploy com Docker

### Opção 1: Docker Compose (Recomendado)

```bash
# Build e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### Opção 2: Docker Manual

```bash
# Build da imagem
docker build -t whatsapp-coex-app .

# Executar container
docker run -d \
  --name whatsapp-coex-app \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e FACEBOOK_APP_ID=seu_app_id \
  -e FACEBOOK_APP_SECRET=seu_app_secret \
  -e FACEBOOK_CONFIG_ID=seu_config_id \
  -e WEBHOOK_VERIFY_TOKEN=seu_token \
  -e APP_URL=https://casaecosustentavel-a.k3givk.easypanel.host \
  whatsapp-coex-app
```

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev

# Iniciar em modo produção
npm start
```

Acesse: `http://localhost:3000`

## 📡 Endpoints da API

### Webhooks

- `GET /webhook` - Verificação do webhook (Facebook faz isso automaticamente)
- `POST /webhook` - Recebe eventos do WhatsApp

### Autenticação

- `GET /auth/callback` - OAuth callback (redirecionamento após signup)

### API

- `GET /api/businesses` - Lista todos os negócios cadastrados
- `GET /api/business/:wabaId` - Obtém dados de um negócio específico
- `POST /api/send-message` - Envia uma mensagem via WhatsApp

### Health Check

- `GET /health` - Verifica status da aplicação

## 🔧 Como Usar

### 1. Acessar a Interface

Abra `https://casaecosustentavel-a.k3givk.easypanel.host` no navegador

### 2. Iniciar Cadastro

1. Clique em **"🚀 Iniciar Cadastro"**
2. Faça login com sua conta Facebook/Meta
3. Aceite as permissões solicitadas
4. Selecione ou crie um WhatsApp Business Account (WABA)
5. **Para CoExistence**: Selecione um número que já está no WhatsApp Business App
6. Complete o processo

### 3. Receber Credenciais

Após completar o cadastro, você receberá:
- **WABA ID**: ID da sua conta WhatsApp Business
- **Phone Number ID**: ID do número cadastrado
- **Access Token**: Token de acesso à API (salvo automaticamente)

### 4. Enviar Mensagens

Use o endpoint da API para enviar mensagens:

```bash
curl -X POST https://casaecosustentavel-a.k3givk.easypanel.host/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumberId": "SEU_PHONE_NUMBER_ID",
    "to": "5511999999999",
    "message": "Olá! Mensagem de teste via API",
    "accessToken": "SEU_ACCESS_TOKEN"
  }'
```

## 📊 Estrutura do Projeto

```
whatsapp-coex-app/
├── src/
│   ├── public/
│   │   └── index.html          # Interface web
│   ├── routes/
│   │   ├── webhook.js          # Webhooks do WhatsApp
│   │   ├── auth.js             # OAuth callback
│   │   └── api.js              # API REST
│   ├── utils/
│   │   ├── business.js         # Lógica de negócios
│   │   └── whatsapp.js         # API WhatsApp
│   └── server.js               # Servidor Express
├── data/
│   └── businesses.json         # Dados dos negócios (gerado automaticamente)
├── .env                        # Variáveis de ambiente
├── .env.example                # Exemplo de variáveis
├── Dockerfile                  # Configuração Docker
├── docker-compose.yml          # Docker Compose
├── package.json                # Dependências Node.js
└── README.md                   # Esta documentação
```

## 🔍 Debugging

### Verificar logs do Docker

```bash
docker-compose logs -f
```

### Verificar se o webhook está configurado

```bash
curl https://casaecosustentavel-a.k3givk.easypanel.host/health
```

### Testar webhook localmente (ngrok)

Se estiver desenvolvendo localmente:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta local
ngrok http 3000

# Use a URL gerada pelo ngrok nas configurações do Facebook
```

## ⚠️ Problemas Comuns

### 1. "Não estou recebendo o Phone Number ID"

**Solução**: O Phone Number ID é retornado no callback após o signup. Verifique:
- Se as permissões estão corretas
- Se o redirect URI está configurado corretamente
- Se você completou todo o fluxo de cadastro

### 2. "Webhook não está sendo chamado"

**Solução**: Verifique:
- Se a URL do webhook está acessível publicamente
- Se o token de verificação está correto
- Se você inscreveu-se nos campos corretos (messages, message_status)

### 3. "Erro ao enviar mensagem"

**Solução**: Verifique:
- Se o access token está válido
- Se o número de destino está no formato correto (com código do país)
- Se você tem limite de mensagens disponível

### 4. "CoExistence não está funcionando"

**Solução**:
- Certifique-se de que o número já está no WhatsApp Business App
- Verifique se você selecionou a opção correta no fluxo de signup
- O número deve estar verificado no app móvel

## 📚 Documentação Oficial

- [WhatsApp Embedded Signup](https://developers.facebook.com/docs/whatsapp/embedded-signup)
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [CoExistence](https://developers.facebook.com/docs/whatsapp/embedded-signup/custom-flows/onboarding-business-app-users)

## 📝 Licença

MIT

## 🤝 Suporte

Para suporte, abra uma issue no repositório ou entre em contato.

---

**Desenvolvido com ❤️ para facilitar a integração com WhatsApp Business**
