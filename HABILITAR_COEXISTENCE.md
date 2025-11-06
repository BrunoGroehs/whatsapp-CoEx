# 🔧 Como Habilitar CoExistence (Coexistência)

## ⚠️ IMPORTANTE: Configuração no Facebook App

Para que o **CoExistence** funcione e permita usar números já conectados ao WhatsApp Business App, você **PRECISA** configurar isso no painel do Facebook Developers.

---

## 📋 Passo a Passo

### 1️⃣ Acesse o Facebook Developers
👉 https://developers.facebook.com/apps/

### 2️⃣ Selecione seu App
- App ID: `1335317331469574`

### 3️⃣ Vá em "WhatsApp" no menu lateral

### 4️⃣ Clique em "Configuration" (Configuração)

### 5️⃣ Procure pela seção "Embedded Signup"

### 6️⃣ **ATIVE a opção "Coexistence"**
Procure por uma opção como:
- ✅ **Enable Coexistence**
- ✅ **Allow existing WhatsApp Business numbers**
- ✅ **Embedded Signup with Coexistence**

### 7️⃣ Salve as alterações

---

## 🎯 O que é CoExistence?

CoExistence (Coexistência) permite que você:

✅ Use números **JÁ CONECTADOS** ao WhatsApp Business App  
✅ Migre gradualmente do App para a API  
✅ Mantenha o App funcionando enquanto testa a API  
✅ Não perca acesso ao seu número durante a transição  

❌ **SEM** CoExistence:
- Você precisa criar uma nova conta do zero
- Precisa de um número que NUNCA foi usado no WhatsApp Business

---

## 🔍 Como Verificar se está Funcionando

### No fluxo de Embedded Signup, você deve ver:

**✅ COM CoExistence:**
```
1. Login Facebook
2. Selecionar Business Account existente
3. "Usar número existente" ou "Adicionar novo número"  ← Esta opção aparece!
4. Selecionar número do WhatsApp Business App
5. Concluir
```

**❌ SEM CoExistence:**
```
1. Login Facebook
2. Criar nova conta Business
3. Adicionar número novo apenas
```

---

## 🛠️ Verificação Técnica

### Verifique se o Configuration ID está correto:

1. No Facebook Developers, vá em **WhatsApp > Configuration**
2. Procure por **"Embedded Signup Configuration"**
3. Copie o **Configuration ID**
4. Cole no arquivo `.env`:

```env
FACEBOOK_CONFIG_ID=2031952424274683
```

### Verifique se o código está correto:

No navegador, abra o Console (F12) e execute:
```javascript
console.log('Config ID:', FACEBOOK_CONFIG_ID);
```

Deve mostrar: `2031952424274683`

---

## 📱 Requisitos para CoExistence

### Seu número precisa:
1. ✅ Estar registrado no **WhatsApp Business App** (versão mobile)
2. ✅ Estar vinculado a uma **Business Account** no Facebook Business Manager
3. ✅ Ter um **Business Manager** ativo
4. ✅ Você ser **Admin** da conta Business

### Seu App no Facebook precisa:
1. ✅ Ter o produto **WhatsApp** adicionado
2. ✅ Ter **CoExistence habilitado** na configuração
3. ✅ Ter um **Configuration ID** válido para Embedded Signup
4. ✅ Status de revisão aprovado (ou modo desenvolvimento)

---

## 🚨 Troubleshooting

### "Não vejo opção para usar número existente"
👉 CoExistence **NÃO** está habilitado no Facebook App  
👉 Vá em WhatsApp > Configuration e ative

### "Não vejo meu número na lista"
👉 Número não está vinculado ao Business Manager  
👉 Vincule o número no WhatsApp Business App primeiro

### "Erro ao selecionar número existente"
👉 Você não é Admin da conta Business  
👉 Peça acesso Admin no Business Manager

---

## 📚 Documentação Oficial

Meta WhatsApp Business Platform - Embedded Signup with Coexistence:
👉 https://developers.facebook.com/docs/whatsapp/embedded-signup/coex

---

## ✅ Checklist Final

Antes de testar novamente, confirme:

- [ ] CoExistence está **HABILITADO** no Facebook Developers
- [ ] Configuration ID está **CORRETO** no `.env`
- [ ] Você tem um número no **WhatsApp Business App**
- [ ] Número está vinculado ao **Business Manager**
- [ ] Você é **Admin** da conta Business
- [ ] O código tem `coexistent_onboarding: true`

---

## 🔄 Após Habilitar

1. **Limpe o cache do navegador** (Ctrl + Shift + Delete)
2. **Reinicie o servidor** se necessário
3. Tente o fluxo novamente
4. Agora você deve ver a opção de usar número existente!

---

**Dúvidas?** Verifique os logs do console no navegador (F12) durante o fluxo.
