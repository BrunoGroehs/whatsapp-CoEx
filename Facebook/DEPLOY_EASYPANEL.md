# 🚀 Deploy no Easypanel - Guia Passo a Passo

Este guia irá ajudá-lo a fazer o deploy da aplicação WhatsApp CoExistence no Easypanel.

## 📝 Pré-requisitos

- Conta no Easypanel
- Acesso ao domínio: `casaecosustentavel-a.k3givk.easypanel.host`
- Credenciais do Facebook Developer configuradas

## 🔧 Configuração no Easypanel

### 1. Criar Novo Projeto

1. Faça login no Easypanel
2. Clique em **"Create Project"** ou **"New Service"**
3. Escolha **"Docker"** como tipo de serviço

### 2. Configurar o Repositório

#### Opção A: Deploy via GitHub

1. Conecte seu repositório GitHub
2. Selecione o branch: `main` ou `master`
3. Dockerfile path: `./Dockerfile`

#### Opção B: Deploy Manual

1. Use Docker Compose ou Dockerfile diretamente
2. Cole o conteúdo do `Dockerfile` fornecido

### 3. Configurar Variáveis de Ambiente

No painel do Easypanel, adicione as seguintes variáveis de ambiente:

```
FACEBOOK_APP_ID=seu_app_id_aqui
FACEBOOK_APP_SECRET=seu_app_secret_aqui
FACEBOOK_CONFIG_ID=seu_config_id_aqui
WEBHOOK_VERIFY_TOKEN=seu_token_de_verificacao_secreto_aqui
PORT=3000
NODE_ENV=production
APP_URL=https://casaecosustentavel-a.k3givk.easypanel.host
```

**⚠️ IMPORTANTE**: 
- Nunca commite o arquivo `.env` no Git
- Use as variáveis de ambiente do Easypanel
- Mantenha o `APP_SECRET` seguro

### 4. Configurar Porta

- **Container Port**: `3000`
- **Public Port**: `80` ou `443` (HTTPS recomendado)

### 5. Configurar Domínio

1. No Easypanel, vá em **"Domains"**
2. Adicione o domínio: `casaecosustentavel-a.k3givk.easypanel.host`
3. Habilite **HTTPS/SSL** (crucial para webhooks do Facebook)
4. Aguarde a propagação do SSL (pode levar alguns minutos)

### 6. Configurar Volumes (Persistência)

Para manter os dados dos negócios mesmo após redeploys:

1. No Easypanel, vá em **"Volumes"**
2. Adicione um volume:
   - **Mount Path**: `/app/data`
   - **Size**: 1GB (suficiente para a maioria dos casos)

### 7. Build e Deploy

1. Clique em **"Deploy"** ou **"Build & Deploy"**
2. Aguarde o build (pode levar 2-5 minutos)
3. Verifique os logs para confirmar que iniciou corretamente

### 8. Verificar Deployment

Após o deploy, verifique:

```bash
# Health check
curl https://casaecosustentavel-a.k3givk.easypanel.host/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-11-05T...",
  "environment": "production"
}
```

## 🔗 Configurar Webhooks no Facebook

Agora que a aplicação está rodando, configure os webhooks:

### 1. Acesse Facebook Developer

1. Vá para [Facebook Developers](https://developers.facebook.com/)
2. Selecione seu app
3. Vá em **WhatsApp** > **Configuração**

### 2. Configurar Webhook

1. Em **Webhooks**, clique em **"Configurar Webhooks"**
2. Preencha:
   ```
   URL de Callback: https://casaecosustentavel-a.k3givk.easypanel.host/webhook
   Token de Verificação: [o mesmo que você colocou em WEBHOOK_VERIFY_TOKEN]
   ```
3. Clique em **"Verificar e Salvar"**

### 3. Inscrever-se em Campos

Após salvar, inscreva-se nos campos:
- ✅ `messages`
- ✅ `message_status`

## 🧪 Testar a Aplicação

### 1. Acesse a Interface Web

Abra no navegador:
```
https://casaecosustentavel-a.k3givk.easypanel.host
```

### 2. Teste o Cadastro

1. Clique em **"🚀 Iniciar Cadastro"**
2. Complete o fluxo de Embedded Signup
3. Você deve ser redirecionado para a página de sucesso com suas credenciais

### 3. Teste o Webhook

Envie uma mensagem para o número cadastrado via WhatsApp. Você deve ver nos logs:

```bash
# Ver logs no Easypanel
📨 Webhook event received: {...}
💬 Message received: {...}
```

### 4. Teste Envio de Mensagem

```bash
curl -X POST https://casaecosustentavel-a.k3givk.easypanel.host/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumberId": "SEU_PHONE_NUMBER_ID",
    "to": "5511999999999",
    "message": "Teste via API",
    "accessToken": "SEU_ACCESS_TOKEN"
  }'
```

## 📊 Monitoramento

### Ver Logs em Tempo Real

No Easypanel:
1. Vá em seu serviço
2. Clique em **"Logs"**
3. Ative **"Auto-scroll"**

### Métricas Importantes

Monitore:
- ✅ CPU e Memória
- ✅ Número de requests
- ✅ Erros (status 5xx)
- ✅ Tempo de resposta

## 🔄 Atualizações e Redeploy

### Deploy Automático (GitHub)

Se configurou via GitHub:
1. Faça commit das mudanças
2. Push para o branch configurado
3. Easypanel fará redeploy automaticamente

### Deploy Manual

1. Faça as alterações localmente
2. Build nova imagem
3. No Easypanel, clique em **"Rebuild"**

## 🛠️ Troubleshooting

### Aplicação não inicia

1. Verifique os logs no Easypanel
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Verifique se a porta 3000 está exposta

### Webhook não funciona

1. Teste o endpoint:
   ```bash
   curl https://casaecosustentavel-a.k3givk.easypanel.host/webhook?hub.mode=subscribe&hub.verify_token=SEU_TOKEN&hub.challenge=test
   ```
2. Deve retornar `test`
3. Verifique se HTTPS está funcionando (Facebook exige)

### SSL/HTTPS não funciona

1. Verifique se o domínio está apontando corretamente
2. No Easypanel, force renovação do SSL
3. Aguarde alguns minutos para propagação

### Dados não persistem após redeploy

1. Verifique se o volume está configurado corretamente
2. Path deve ser `/app/data`
3. Confirme que o volume está montado nos logs

## 📞 Suporte Easypanel

- Documentação: https://easypanel.io/docs
- Discord: https://discord.gg/easypanel
- Email: support@easypanel.io

## ✅ Checklist Final

Antes de ir para produção:

- [ ] SSL/HTTPS configurado e funcionando
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Webhook configurado e testado
- [ ] Volume persistente configurado
- [ ] Health check retorna status OK
- [ ] Teste de cadastro completo realizado
- [ ] Teste de envio de mensagem realizado
- [ ] Teste de recebimento de mensagem (webhook) realizado
- [ ] Logs sem erros críticos
- [ ] Backup das credenciais em local seguro

## 🎉 Pronto!

Sua aplicação WhatsApp CoExistence está agora rodando em produção no Easypanel!

Acesse: `https://casaecosustentavel-a.k3givk.easypanel.host`

---

**Dica**: Salve este documento e as credenciais em um local seguro!
