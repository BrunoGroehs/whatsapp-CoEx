# 📋 Checklist de Configuração - WhatsApp CoExistence

Use este checklist para garantir que tudo está configurado corretamente.

## 1️⃣ Facebook Developer - Criar App

- [ ] Acessei https://developers.facebook.com/
- [ ] Criei um novo app do tipo **"Negócios"**
- [ ] Adicionei o produto **WhatsApp**
- [ ] App ID copiado: `_________________`
- [ ] App Secret copiado: `_________________`

## 2️⃣ Embedded Signup - Configuration ID

- [ ] Acessei **WhatsApp** > **Embedded Signup Builder**
- [ ] Configurei as permissões:
  - [ ] `whatsapp_business_management`
  - [ ] `whatsapp_business_messaging`
  - [ ] `business_management`
- [ ] Adicionei o Redirect URI: `https://casaecosustentavel-a.k3givk.easypanel.host/auth/callback`
- [ ] Configuration ID copiado: `_________________`

## 3️⃣ OAuth Redirect URI

- [ ] Acessei **Produtos** > **Facebook Login** > **Configurações**
- [ ] Adicionei URI: `https://casaecosustentavel-a.k3givk.easypanel.host/auth/callback`
- [ ] Salvei as alterações

## 4️⃣ Domínios do App

- [ ] Acessei **Configurações** > **Básico** > **Domínios do App**
- [ ] Adicionei: `casaecosustentavel-a.k3givk.easypanel.host`
- [ ] Salvei as alterações

## 5️⃣ Webhook (Aguarde deploy da aplicação primeiro)

- [ ] Acessei **WhatsApp** > **Configuração**
- [ ] Cliquei em **Configurar Webhooks**
- [ ] URL de Callback: `https://casaecosustentavel-a.k3givk.easypanel.host/webhook`
- [ ] Token de Verificação criado: `_________________`
- [ ] Webhook verificado com sucesso ✅
- [ ] Inscrito nos campos:
  - [ ] `messages`
  - [ ] `message_status`

## 6️⃣ Arquivo .env

- [ ] Copiei `.env.example` para `.env`
- [ ] Preenchi `FACEBOOK_APP_ID`
- [ ] Preenchi `FACEBOOK_APP_SECRET`
- [ ] Preenchi `FACEBOOK_CONFIG_ID`
- [ ] Preenchi `WEBHOOK_VERIFY_TOKEN`
- [ ] Confirmei que `.env` está no `.gitignore`

## 7️⃣ Arquivo HTML

- [ ] Abri `src/public/index.html`
- [ ] Substituí `FACEBOOK_APP_ID` pela credencial real
- [ ] Substituí `FACEBOOK_CONFIG_ID` pela credencial real
- [ ] Salvei o arquivo

## 8️⃣ Deploy no Easypanel

- [ ] Criei novo serviço/projeto no Easypanel
- [ ] Conectei repositório GitHub OU fiz upload manual
- [ ] Configurei variáveis de ambiente:
  - [ ] `FACEBOOK_APP_ID`
  - [ ] `FACEBOOK_APP_SECRET`
  - [ ] `FACEBOOK_CONFIG_ID`
  - [ ] `WEBHOOK_VERIFY_TOKEN`
  - [ ] `APP_URL`
- [ ] Configurei porta: `3000`
- [ ] Configurei domínio: `casaecosustentavel-a.k3givk.easypanel.host`
- [ ] Habilitei HTTPS/SSL ✅
- [ ] Configurei volume persistente: `/app/data`
- [ ] Fiz o deploy

## 9️⃣ Testes

- [ ] Acessei `https://casaecosustentavel-a.k3givk.easypanel.host`
- [ ] Página carregou sem erros
- [ ] Testei health check: `https://casaecosustentavel-a.k3givk.easypanel.host/health`
- [ ] Retornou `{"status": "ok", ...}` ✅
- [ ] Cliquei em "Iniciar Cadastro"
- [ ] Completei o fluxo de Embedded Signup
- [ ] Recebi WABA ID: `_________________`
- [ ] Recebi Phone Number ID: `_________________`
- [ ] Enviei mensagem de teste via API
- [ ] Recebi webhook ao receber mensagem no WhatsApp

## 🔟 Documentação

- [ ] Li o `README.md` completo
- [ ] Li o `DEPLOY_EASYPANEL.md`
- [ ] Salvei as credenciais em local seguro
- [ ] Fiz backup do arquivo `.env`

## ✅ Tudo Pronto!

Data de configuração: ___/___/2025

Notas adicionais:
_____________________________________________
_____________________________________________
_____________________________________________

---

**🎉 Parabéns! Sua aplicação WhatsApp CoExistence está configurada e funcionando!**
