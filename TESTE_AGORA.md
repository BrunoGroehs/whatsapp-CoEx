# 🚀 TESTE AGORA - Passo a Passo

## ✅ Mudanças Aplicadas:

1. ✅ **Event listener robusto** - Detecta 3 formatos diferentes de evento
2. ✅ **redirect_uri adicionado** - Fallback via GET se postMessage falhar  
3. ✅ **featureType corrigido** - De `whatsapp_business_app_onboarding` para `whatsapp_embedded_signup`
4. ✅ **Logging extremo** - Servidor loga TUDO que chegar
5. ✅ **Debug completo** - Console do navegador mostra cada passo

---

## 📋 Como Testar:

### **1. Reiniciar o Servidor**
```bash
# No terminal do seu servidor
cd /path/to/project
npm start
# Ou se estiver usando PM2/Docker, reinicie o serviço
```

### **2. Abrir o Console do Navegador**
1. Abra: https://casaecosustentavel-a.k3givk.easypanel.host
2. Pressione **F12** (ou Ctrl+Shift+I)
3. Vá na aba **Console**
4. Clique no ícone de **Clear console** (🚫) para limpar

### **3. Fazer o Signup**
1. Clique em **"🚀 Iniciar Cadastro"**
2. Complete o fluxo no popup
3. Aguarde o popup fechar

### **4. Analisar os Logs**

#### **No Console do Navegador, você DEVE ver:**
```
🚀 Iniciando Embedded Signup com CoExistence...
📍 URL Embedded Signup: https://business.facebook.com/...
👂 Event listener adicionado
🔔 QUALQUER evento recebido: { ... }
✅ Formato X: ... detectado
📦 Dados de signup válidos encontrados: { ... }
📤 Enviando dados para /auth/callback...
📥 Resposta recebida, status: 200
✅ WhatsApp conectado com sucesso!
```

#### **No Terminal do Servidor, você DEVE ver:**
```
============================================================
📥 POST /auth/callback
⏰ 2025-11-06T...
📦 Body: {
  "phone_number_id": "...",
  "waba_id": "...",
  "code": "..."
}
============================================================

📨 POST /auth/callback recebido
✅ Dados obrigatórios presentes
🔄 Iniciando troca de código por token...
✅ Token obtido com sucesso!
💾 Salvando dados do negócio...
✅ Dados salvos com sucesso
📡 Inscrevendo nos webhooks...
✅ Webhooks inscritos com sucesso
✅ Processamento concluído com sucesso!
```

---

## 🔍 **Se NÃO aparecer nenhum log:**

### **Cenário A: Nenhum log no Console**
Significa que o evento não está sendo disparado.

**Ação:**
1. Verifique se o popup realmente fechou (não minimizou)
2. Tente em outro navegador (Chrome, Edge, Firefox)
3. Verifique se bloqueador de pop-up está ativo

### **Cenário B: Logs no Console mas NENHUM no Servidor**
Significa que o `fetch('/auth/callback')` não está funcionando.

**Ação:**
1. Abra aba **Network** no DevTools
2. Procure por requisição `callback`
3. Veja se foi enviada e qual o status
4. Me envie o erro (se houver)

### **Cenário C: Logs mostram "Formato X detectado" mas dados vazios**
Significa que o evento chegou mas sem os dados esperados.

**Ação:**
1. Copie o conteúdo completo do log `🔔 QUALQUER evento recebido`
2. Me envie para eu ver exatamente o que o Meta está enviando

---

## 🎯 **Informações que Preciso Ver:**

Depois de fazer o teste, me envie:

1. **TODOS os logs do Console** (Ctrl+A, Ctrl+C no Console)
2. **Logs do servidor** (últimas 50 linhas)
3. **Se deu erro**, a mensagem completa
4. **Se funcionou**, confirme que apareceu a mensagem de sucesso

---

## 📊 **Verificação Final:**

Se tudo funcionar, você deve poder:

1. **Ver dados salvos:**
   ```bash
   GET https://casaecosustentavel-a.k3givk.easypanel.host/api/businesses
   ```

2. **Arquivo criado:**
   ```bash
   cat data/businesses.json
   # Deve mostrar seus dados
   ```

3. **Enviar mensagem teste:**
   ```bash
   POST /api/send-message
   {
     "phoneNumberId": "seu_phone_number_id",
     "to": "5511999999999",
     "message": "Teste!",
     "accessToken": "seu_token"
   }
   ```

---

## 🆘 **Suporte Rápido:**

- ❌ **Popup bloqueado?** → Permitir pop-ups no site
- ❌ **Erro 403/404?** → Verificar FACEBOOK_CONFIG_ID no .env
- ❌ **Nenhum log?** → Verificar se servidor está rodando
- ❌ **Token inválido?** → Verificar FACEBOOK_APP_SECRET no .env

---

**Boa sorte! 🍀 Agora temos logs em TODOS os pontos possíveis!**
