# 🚀 INÍCIO RÁPIDO - 5 Minutos

## ⚡ Passos Rápidos para Começar

### 1. Configure as Credenciais (2 min)

```bash
# Copie o .env.example
cp .env.example .env
```

Edite `.env` e adicione:
- `FACEBOOK_APP_ID` - do Facebook Developer
- `FACEBOOK_APP_SECRET` - do Facebook Developer  
- `FACEBOOK_CONFIG_ID` - do Embedded Signup Builder
- `WEBHOOK_VERIFY_TOKEN` - crie um token secreto qualquer

### 2. Configure o HTML (1 min)

Edite `src/public/index.html` nas linhas ~200:
```javascript
const FACEBOOK_APP_ID = 'SEU_APP_ID_AQUI';      // ← Cole seu App ID
const FACEBOOK_CONFIG_ID = 'SEU_CONFIG_ID_AQUI'; // ← Cole seu Config ID
```

### 3. Deploy no Easypanel (2 min)

1. Crie novo serviço Docker
2. Conecte repositório ou faça upload
3. Adicione variáveis de ambiente (do .env)
4. Configure domínio: `casaecosustentavel-a.k3givk.easypanel.host`
5. Habilite SSL
6. Deploy!

### 4. Configure Webhook no Facebook

1. WhatsApp > Configuração > Webhooks
2. URL: `https://casaecosustentavel-a.k3givk.easypanel.host/webhook`
3. Token: o mesmo do `WEBHOOK_VERIFY_TOKEN`
4. Inscreva-se: `messages`, `message_status`

## ✅ Teste

Acesse: `https://casaecosustentavel-a.k3givk.easypanel.host`

Clique em **"🚀 Iniciar Cadastro"** e complete o fluxo!

## 📚 Documentação Completa

- `README.md` - Documentação completa
- `DEPLOY_EASYPANEL.md` - Guia de deploy detalhado
- `CHECKLIST.md` - Checklist de configuração
- `EXEMPLOS_API.md` - Exemplos de uso da API

## ❓ Problemas?

### Webhook não verifica
- Verifique se HTTPS está funcionando
- Confirme que o token está correto

### Não recebo Phone Number ID
- Complete todo o fluxo de signup
- Verifique os logs no Easypanel
- Os dados são salvos em `data/businesses.json`

### Erro ao enviar mensagem
- Verifique se o número está no formato correto: `5511999999999`
- Confirme que o access token está válido
- Número de destino deve estar no WhatsApp

## 🎯 Próximos Passos

1. Complete o cadastro
2. Teste enviar uma mensagem
3. Configure respostas automáticas
4. Integre com seu sistema

---

**Boa sorte! 🚀**
