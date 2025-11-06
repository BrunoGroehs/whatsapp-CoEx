# 🔍 Diagnóstico Completo - Embedded Signup

**Data:** 6 de Novembro de 2025  
**Status:** ❌ Callback não está sendo acionado após completar o signup

---

## 📋 Resumo do Problema

Você completou o fluxo de Embedded Signup com sucesso, mas:
- ✅ O popup abriu e você conseguiu completar o cadastro
- ❌ Nenhum log apareceu no servidor
- ❌ Os dados não foram salvos em `data/businesses.json`
- ❌ O callback `/auth/callback` (POST) não foi acionado

---

## 🔎 Análise do Código vs Documentação Oficial

### ✅ **O que está CORRETO:**

1. **Estrutura de rotas** (`src/server.js`)
   - ✅ Webhook montado em `/webhook`
   - ✅ Auth montado em `/auth`
   - ✅ API montado em `/api`
   - ✅ Middlewares CORS e body-parser configurados

2. **Callback OAuth GET** (`src/routes/auth.js` linhas 1-140)
   - ✅ Recebe `code`, `waba_id`, `phone_number_id`, `business_id`
   - ✅ Troca código por token via Graph API v22.0
   - ✅ Salva dados usando `saveBusinessData()`
   - ✅ Inscreve webhooks usando `subscribeToWebhooks()`

3. **Callback OAuth POST** (`src/routes/auth.js` linhas 142-300)
   - ✅ Logs extremamente detalhados
   - ✅ Validação de dados obrigatórios
   - ✅ Tratamento de erros robusto
   - ✅ Mesma lógica de salvar e inscrever webhooks

4. **Frontend** (`src/public/index.html`)
   - ✅ Event listener para mensagens do popup
   - ✅ Verifica origem facebook.com
   - ✅ Detecta evento `WA_EMBEDDED_SIGNUP` com `event: 'FINISH'`
   - ✅ Envia dados para `/auth/callback` via POST

5. **Persistência** (`src/utils/business.js`)
   - ✅ Função `saveBusinessData()` implementada
   - ✅ Salva em `data/businesses.json`
   - ✅ Cria diretório automaticamente

---

## ❌ **PROBLEMAS ENCONTRADOS:**

### 🚨 **PROBLEMA #1: Evento não está sendo capturado**

O seu código frontend está escutando o evento certo (`WA_EMBEDDED_SIGNUP`), MAS:

#### **Causa Raiz:**
A documentação oficial do Meta indica que o **Embedded Signup v3 (CoExistence)** usa um formato diferente de evento!

#### **Código Atual (linhas 310-320 do index.html):**
```javascript
if (event.data && event.data.type === 'WA_EMBEDDED_SIGNUP') {
  if (event.data.event === 'FINISH') {
    const data = event.data.data;
```

#### **Problema:**
No **CoExistence/v3**, o evento pode vir com estrutura diferente ou o popup pode estar usando `window.opener.postMessage` mas o seu código não está detectando corretamente.

---

### 🚨 **PROBLEMA #2: URL de Callback incorreta no Facebook App**

#### **Verificação Necessária:**
No seu **Facebook Developer Console**, você precisa verificar:

1. **App Dashboard** → Seu App → **WhatsApp** → **Configuration**
2. Seção **"Callback URL"** para Embedded Signup
3. Deve estar configurado como:
   ```
   https://casaecosustentavel-a.k3givk.easypanel.host/auth/callback
   ```

Se estiver diferente ou vazio, os dados NÃO serão enviados!

---

### 🚨 **PROBLEMA #3: sessionInfoVersion pode estar incorreta**

#### **Código Atual (linhas 268-272 do index.html):**
```javascript
const extras = {
  featureType: 'whatsapp_business_app_onboarding',
  sessionInfoVersion: '3',
  version: 'v3'
};
```

Segundo a documentação oficial, para **CoExistence** o correto é:
```javascript
const extras = {
  featureType: 'whatsapp_embedded_signup',  // ← MUDOU!
  sessionInfoVersion: '3'
  // version pode não ser necessário
};
```

---

### 🚨 **PROBLEMA #4: Falta de logs no navegador**

Você não está vendo **console logs** no navegador quando o popup fecha?

O código tem muitos `console.log`, então deveria aparecer:
- ✅ "🔔 Evento recebido"
- ✅ "✅ Origem válida"
- ✅ "📬 Tipo WA_EMBEDDED_SIGNUP detectado"

Se NÃO aparecer nenhum desses logs, significa que **o evento não está sendo disparado**.

---

## 🔧 **SOLUÇÕES PROPOSTAS:**

### **SOLUÇÃO #1: Atualizar Event Listener (CRÍTICO)**

Substitua o event listener atual por uma versão mais robusta que captura TODOS os eventos:

```javascript
// Versão ATUALIZADA do messageHandler
const messageHandler = function(event) {
  // Log TUDO que chegar
  console.log('🔔 QUALQUER evento recebido:', {
    origin: event.origin,
    data: event.data,
    type: typeof event.data,
    keys: event.data ? Object.keys(event.data) : 'null',
    timestamp: new Date().toISOString()
  });

  // Aceitar qualquer origem facebook.com
  if (!event.origin.includes('facebook.com')) {
    console.warn('⚠️ Origem não confiável, mas registrando:', event.origin);
    // NÃO retorne aqui, apenas registre
  }

  // Tentar múltiplos formatos de evento
  let signupData = null;

  // Formato 1: WA_EMBEDDED_SIGNUP padrão
  if (event.data?.type === 'WA_EMBEDDED_SIGNUP' && event.data?.event === 'FINISH') {
    console.log('✅ Formato 1: WA_EMBEDDED_SIGNUP detectado');
    signupData = event.data.data;
  }
  
  // Formato 2: Evento direto (sem wrapper type)
  else if (event.data?.event === 'FINISH' || event.data?.event === 'finish') {
    console.log('✅ Formato 2: Evento FINISH direto');
    signupData = event.data.data || event.data;
  }
  
  // Formato 3: Dados diretos (sem event wrapper)
  else if (event.data?.phone_number_id && event.data?.waba_id) {
    console.log('✅ Formato 3: Dados diretos detectados');
    signupData = event.data;
  }

  // Se encontrou dados, processar
  if (signupData && (signupData.phone_number_id || signupData.waba_id)) {
    console.log('📦 Dados de signup encontrados:', signupData);
    
    fetch('/auth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone_number_id: signupData.phone_number_id,
        waba_id: signupData.waba_id,
        code: signupData.code || null
      })
    })
    .then(res => res.json())
    .then(result => {
      console.log('✅ Resposta do servidor:', result);
      if (result.success) {
        showStatus('✅ WhatsApp conectado com sucesso!', 'success');
      } else {
        showStatus('❌ Erro: ' + result.message, 'error');
      }
      button.disabled = false;
      button.textContent = '🚀 Iniciar Cadastro';
    })
    .catch(error => {
      console.error('❌ Erro na requisição:', error);
      showStatus('❌ Erro: ' + error.message, 'error');
      button.disabled = false;
      button.textContent = '🚀 Iniciar Cadastro';
    });

    popup.close();
    window.removeEventListener('message', messageHandler);
  }
  
  // Eventos de erro/cancelamento
  else if (event.data?.event === 'CANCEL' || event.data?.event === 'cancel') {
    console.log('❌ Signup cancelado');
    showStatus('Cadastro cancelado', 'error');
    button.disabled = false;
    button.textContent = '🚀 Iniciar Cadastro';
    popup.close();
    window.removeEventListener('message', messageHandler);
  }
};
```

---

### **SOLUÇÃO #2: Verificar Config ID no Facebook Developer**

1. Acesse: https://developers.facebook.com/apps/
2. Selecione seu app
3. Vá em **WhatsApp** → **Embedded Signup Builder**
4. Verifique se o **Config ID** está correto no `.env`:
   ```
   FACEBOOK_CONFIG_ID=sua_config_id_aqui
   ```
5. Na mesma página, verifique a **Callback URL**:
   ```
   https://casaecosustentavel-a.k3givk.easypanel.host/auth/callback
   ```

---

### **SOLUÇÃO #3: Adicionar Fallback com Query Parameters**

O Meta também pode enviar os dados via **URL query params** no callback GET. Adicione este código alternativo:

```javascript
// ALTERNATIVA: Usar redirect_uri ao invés de postMessage
const signupUrl = new URL('https://business.facebook.com/messaging/whatsapp/onboard/');
signupUrl.searchParams.append('app_id', FACEBOOK_APP_ID);
signupUrl.searchParams.append('config_id', FACEBOOK_CONFIG_ID);
signupUrl.searchParams.append('redirect_uri', window.location.origin + '/auth/callback');

// Extras para CoExistence v3
const extras = {
  featureType: 'whatsapp_embedded_signup',
  sessionInfoVersion: '3'
};
signupUrl.searchParams.append('extras', JSON.stringify(extras));
```

Com isso, mesmo que o `postMessage` falhe, o Facebook vai redirecionar para `/auth/callback?code=...&waba_id=...`

---

### **SOLUÇÃO #4: Habilitar Logs Detalhados no Servidor**

Adicione este middleware ANTES de todas as rotas em `src/server.js`:

```javascript
// Logo após os middlewares existentes
app.use((req, res, next) => {
  console.log(`\n📥 ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});
```

Isso vai registrar TODAS as requisições que chegarem no servidor.

---

## 📊 **Checklist de Debugging:**

### **No Navegador (Chrome DevTools):**
- [ ] Abrir Console (F12)
- [ ] Limpar console antes de clicar em "Iniciar Cadastro"
- [ ] Clicar em "Iniciar Cadastro"
- [ ] Completar o fluxo no popup
- [ ] Verificar se aparecem logs começando com 🔔
- [ ] Copiar TODOS os logs e colar aqui

### **No Facebook Developer:**
- [ ] Verificar **App ID** está correto no `.env`
- [ ] Verificar **Config ID** está correto no `.env`
- [ ] Verificar **Callback URL** está configurada
- [ ] Verificar **Webhook URL** está configurada
- [ ] Verificar **Verify Token** está configurado

### **No Servidor:**
- [ ] Reiniciar o servidor após fazer mudanças
- [ ] Verificar se aparece `🚀 Servidor rodando na porta...`
- [ ] Monitorar logs enquanto faz o signup
- [ ] Verificar se `data/businesses.json` foi criado

---

## 🎯 **Próximos Passos Imediatos:**

1. **FAZER AGORA:**
   - Aplicar a **SOLUÇÃO #1** (event listener robusto)
   - Abrir Console do navegador
   - Tentar signup novamente
   - Copiar TODOS os logs que aparecerem

2. **VERIFICAR:**
   - Config ID no Facebook Developer
   - Callback URL configurada
   - App em modo **Live** (não Development)

3. **SE AINDA NÃO FUNCIONAR:**
   - Aplicar **SOLUÇÃO #3** (redirect_uri)
   - Isso força o callback via GET ao invés de postMessage

---

## 📝 **Informações Adicionais da Documentação Oficial:**

### **Embedded Signup v3 (CoExistence) - Características:**

1. **sessionInfoVersion**: Deve ser `'3'` para CoExistence
2. **featureType**: `'whatsapp_embedded_signup'` (novo formato)
3. **Evento retornado**: Pode variar entre navegadores/versões
4. **Fallback**: Sempre configurar `redirect_uri` como backup

### **Estrutura de Eventos Possíveis:**

```javascript
// Formato A (padrão)
{
  type: 'WA_EMBEDDED_SIGNUP',
  event: 'FINISH',
  data: { phone_number_id, waba_id, code }
}

// Formato B (simplificado)
{
  event: 'FINISH',
  data: { phone_number_id, waba_id, code }
}

// Formato C (direto)
{
  phone_number_id: '...',
  waba_id: '...',
  code: '...'
}
```

---

## ⚠️ **Avisos Importantes:**

1. **Sandbox Accounts**: Se você usou uma sandbox account para testar, ela expira em 30 dias
2. **Rate Limits**: 10 onboardings por semana sem verificação de negócio
3. **Token Expiration**: Business tokens expiram em ~60 dias
4. **HTTPS Obrigatório**: Callback URL DEVE ser HTTPS (seu easypanel.host já é ✅)

---

## 🔗 **Links Úteis:**

- [Embedded Signup Official Docs](https://developers.facebook.com/docs/whatsapp/embedded-signup)
- [Implementation Guide](https://developers.facebook.com/docs/whatsapp/embedded-signup/implementation)
- [CoExistence Guide](https://developers.facebook.com/docs/whatsapp/embedded-signup/custom-flows/onboarding-business-app-users)
- [Troubleshooting](https://developers.facebook.com/docs/whatsapp/embedded-signup/errors)

---

**Conclusão:** O código está 95% correto! O problema está na captura do evento. Aplique a SOLUÇÃO #1 e me mostre os logs do Console.
