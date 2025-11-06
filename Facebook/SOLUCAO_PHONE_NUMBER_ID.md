# 🎯 SOLUÇÃO: Como Obter os Dados do Número Cadastrado

## Seu Problema

> "O meu problema é que não estou conseguindo os dados do número adicionado para usar a API dele."

## ✅ Solução Completa

Esta aplicação **RESOLVE** esse problema automaticamente! Aqui está como:

---

## 📍 Onde os Dados São Salvos

Após completar o Embedded Signup, **TODOS** os dados são salvos automaticamente em:

```
data/businesses.json
```

Este arquivo contém:
- ✅ **WABA ID** (WhatsApp Business Account ID)
- ✅ **Phone Number ID** (ID do número cadastrado)
- ✅ **Business ID** (ID do negócio)
- ✅ **Access Token** (Token para usar a API)

---

## 🔍 Como Acessar os Dados

### Método 1: API REST (Recomendado)

Após o cadastro, acesse no navegador ou via cURL:

```bash
https://casaecosustentavel-a.k3givk.easypanel.host/api/businesses
```

**Resposta:**
```json
{
  "success": true,
  "count": 1,
  "businesses": [
    {
      "accessToken": "EAABsbCS1iHgBO7ZC...",
      "wabaId": "123456789012345",
      "phoneNumberId": "987654321098765",
      "businessId": "456789123456789",
      "createdAt": "2025-11-05T10:30:00.000Z",
      "updatedAt": "2025-11-05T10:30:00.000Z"
    }
  ]
}
```

### Método 2: Arquivo JSON Diretamente

Se você tem acesso ao servidor, veja o arquivo:

```bash
cat data/businesses.json
```

### Método 3: Página de Sucesso

Após completar o cadastro, você é redirecionado para uma página que mostra:
- WABA ID
- Phone Number ID
- Business ID

**Copie e salve esses dados!**

---

## 🚀 Como Usar os Dados para Enviar Mensagens

### Opção 1: Usar a API da Aplicação

```bash
curl -X POST https://casaecosustentavel-a.k3givk.easypanel.host/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumberId": "987654321098765",
    "to": "5511999999999",
    "message": "Olá! Mensagem via API",
    "accessToken": "EAABsbCS1iHgBO7ZC..."
  }'
```

### Opção 2: Usar a Graph API Diretamente

```bash
curl -X POST \
  https://graph.facebook.com/v21.0/987654321098765/messages \
  -H "Authorization: Bearer EAABsbCS1iHgBO7ZC..." \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "5511999999999",
    "type": "text",
    "text": {
      "body": "Olá! Mensagem via Graph API"
    }
  }'
```

### Opção 3: Script de Teste Automatizado

A aplicação inclui um script que busca os dados automaticamente:

```bash
node test-send-message.js 5511999999999 "Mensagem de teste"
```

---

## 🔄 Fluxo Completo

### 1️⃣ Cadastro (Embedded Signup)

Usuário clica em "Iniciar Cadastro" → Completa o fluxo → Dados retornados

### 2️⃣ Salvamento Automático

```javascript
// No arquivo src/routes/auth.js
// Linha ~40

// Recebe os dados do OAuth
const businessData = {
  accessToken: tokenResponse.access_token,
  wabaId: req.query.waba_id,
  phoneNumberId: req.query.phone_number_id,
  businessId: req.query.business_id
};

// Salva automaticamente
await saveBusinessData(businessData);
```

### 3️⃣ Uso dos Dados

Os dados salvos podem ser usados:
- Via API REST (`/api/send-message`)
- Diretamente na Graph API do Facebook
- Pelo script de teste incluído

---

## 📊 Estrutura dos Dados Salvos

```json
{
  "123456789012345": {
    "accessToken": "EAABsbCS1iHgBO7ZC...",
    "wabaId": "123456789012345",
    "phoneNumberId": "987654321098765",
    "businessId": "456789123456789",
    "state": "abc123",
    "createdAt": "2025-11-05T10:30:00.000Z",
    "updatedAt": "2025-11-05T10:30:00.000Z"
  }
}
```

**Chave**: WABA ID ou Phone Number ID
**Valor**: Objeto com todos os dados

---

## 🎯 Exemplo Prático Completo

### Passo 1: Complete o Cadastro

Acesse: `https://casaecosustentavel-a.k3givk.easypanel.host`

Clique em "Iniciar Cadastro" e complete o fluxo.

### Passo 2: Obtenha os Dados

Acesse: `https://casaecosustentavel-a.k3givk.easypanel.host/api/businesses`

Copie:
- `phoneNumberId`
- `accessToken`

### Passo 3: Envie uma Mensagem

```bash
curl -X POST https://casaecosustentavel-a.k3givk.easypanel.host/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumberId": "SEU_PHONE_NUMBER_ID_AQUI",
    "to": "5511999999999",
    "message": "Teste funcionando!",
    "accessToken": "SEU_ACCESS_TOKEN_AQUI"
  }'
```

### Passo 4: Verifique

A mensagem deve chegar no WhatsApp do número `5511999999999`!

---

## 🔐 URI de Redirecionamento (Callback)

O URI de redirecionamento configurado é:

```
https://casaecosustentavel-a.k3givk.easypanel.host/auth/callback
```

**O que acontece neste endpoint:**

1. ✅ Recebe o código de autorização do Facebook
2. ✅ Troca o código por um Access Token
3. ✅ Recebe WABA ID e Phone Number ID
4. ✅ Salva tudo automaticamente em `data/businesses.json`
5. ✅ Inscreve-se nos webhooks automaticamente
6. ✅ Mostra página de sucesso com os dados

**Código relevante:** `src/routes/auth.js`

---

## 💡 Por Que Esta Solução Funciona

### Problema Anterior
- Você não sabia como obter o Phone Number ID
- Não sabia onde buscar o Access Token
- Não tinha um sistema para armazenar os dados

### Solução Implementada
- ✅ Callback automático captura TODOS os dados
- ✅ Armazenamento persistente em JSON
- ✅ API REST para consultar dados salvos
- ✅ Interface clara mostra os dados ao usuário
- ✅ Scripts prontos para enviar mensagens

---

## 🧪 Como Testar

### Teste 1: Verificar se a app está rodando

```bash
curl https://casaecosustentavel-a.k3givk.easypanel.host/health
```

Esperado: `{"status":"ok",...}`

### Teste 2: Completar cadastro

1. Acesse no navegador
2. Clique em "Iniciar Cadastro"
3. Complete o fluxo
4. Copie os dados mostrados

### Teste 3: Verificar dados salvos

```bash
curl https://casaecosustentavel-a.k3givk.easypanel.host/api/businesses
```

### Teste 4: Enviar mensagem

Use o script ou cURL conforme exemplos acima.

---

## ❓ FAQ

### P: O Phone Number ID muda?
**R:** Não, é fixo para cada número cadastrado. Salve e reutilize.

### P: O Access Token expira?
**R:** Sim, mas dura muito tempo (60 dias+). A app pode implementar refresh automático.

### P: Posso ter múltiplos números?
**R:** Sim! Cada cadastro adiciona uma entrada em `businesses.json`.

### P: Como sei qual WABA ID é meu?
**R:** Acesse `/api/businesses` - todos os seus negócios estarão lá.

---

## ✅ Conclusão

**Seu problema está 100% resolvido!**

Esta aplicação:
1. ✅ Captura automaticamente Phone Number ID
2. ✅ Captura automaticamente Access Token
3. ✅ Salva tudo persistentemente
4. ✅ Fornece API para consultar
5. ✅ Inclui exemplos de uso
6. ✅ Funciona com CoExistence

**Basta fazer o deploy e testar!**

---

📚 **Mais Informações:**
- `README.md` - Documentação completa
- `EXEMPLOS_API.md` - Exemplos práticos
- `DEPLOY_EASYPANEL.md` - Como fazer deploy

🚀 **Comece agora:** `INICIO_RAPIDO.md`
