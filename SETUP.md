# 🔧 Setup Rápido - WhatsApp CoEx

## ⚡ Setup em 5 Minutos

### 1. Pré-requisitos
- [ ] Docker e Docker Compose instalados
- [ ] App do Facebook criado
- [ ] WhatsApp Business App instalado (versão 2.24.17+)
- [ ] Número ativo no app por 7+ dias

### 2. Configuração Inicial

```bash
# 1. Copiar .env.example para .env
cp .env.example .env

# 2. Editar .env com seus dados
# Use seu editor favorito (vim, nano, notepad, vscode, etc)
```

### 3. Variáveis Obrigatórias no .env

```env
# ✅ Já preenchidos (seus dados)
WHATSAPP_APP_ID=1335317331469574
WHATSAPP_CONFIG_ID=2031952424274683
BUSINESS_ID=1132877482331513

# ⚠️ VOCÊ PRECISA PREENCHER:
WHATSAPP_APP_SECRET=             # Pegar em developers.facebook.com
SYSTEM_USER_TOKEN=               # Gerar em business.facebook.com
WEBHOOK_VERIFY_TOKEN=            # Criar uma string aleatória
ENCRYPTION_KEY=                  # Gerar chave de 32 caracteres
```

### 4. Onde Obter Cada Credencial

#### App Secret
1. Acesse: https://developers.facebook.com/apps/1335317331469574/settings/basic/
2. Copie o "App Secret" (clique em Show)

#### System User Token
1. Acesse: https://business.facebook.com/settings/system-users/1132877482331513
2. Clique em "Gerar novo token"
3. Selecione seu app (1335317331469574)
4. Marque permissões:
   - ✅ whatsapp_business_management
   - ✅ whatsapp_business_messaging
5. Copie o token

#### Webhook Verify Token
```bash
# Gerar token aleatório (Linux/Mac)
openssl rand -hex 32

# Ou use qualquer string, exemplo:
meu_webhook_token_super_secreto_12345
```

#### Encryption Key
```bash
# Gerar chave de 32 caracteres (Linux/Mac)
openssl rand -base64 32 | cut -c1-32

# Ou crie manualmente (32 caracteres):
abcdefghijklmnopqrstuvwxyz123456
```

### 5. Configurar Webhook no Facebook

1. Acesse: https://developers.facebook.com/apps/1335317331469574/whatsapp-business/wa-settings/
2. Clique em "Configuration" ou "Webhook"
3. Clique em "Edit"
4. Configure:
   - **Callback URL**: `https://seu-dominio.com/webhook`
     - ⚠️ Para teste local, use ngrok: `https://abc123.ngrok.io/webhook`
   - **Verify Token**: O mesmo que você colocou em `WEBHOOK_VERIFY_TOKEN`
5. Subscribe aos campos:
   - ✅ messages
   - ✅ message_echoes (importante para CoEx!)
   - ✅ messaging_postbacks

### 6. Iniciar Aplicação

```bash
# Build e start
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Verificar se está rodando
docker-compose ps
```

### 7. Testar

1. Abrir navegador: http://localhost:8080
2. Clicar em "Conectar WhatsApp com CoEx"
3. Fazer login no Facebook
4. Escanear QR Code no WhatsApp Business App
5. Pronto! ✅

---

## 🧪 Teste Local com ngrok

Se você estiver testando localmente e precisar de uma URL HTTPS para o webhook:

```bash
# 1. Instalar ngrok: https://ngrok.com/download

# 2. Iniciar ngrok
ngrok http 3000

# 3. Copiar a URL HTTPS fornecida (ex: https://abc123.ngrok.io)

# 4. Atualizar webhook no Facebook com a URL do ngrok
# Callback URL: https://abc123.ngrok.io/webhook

# 5. Atualizar .env
WEBHOOK_URL=https://abc123.ngrok.io/webhook
```

---

## ✅ Checklist de Verificação

Antes de começar, verifique:

### Facebook/WhatsApp
- [ ] App do Facebook criado
- [ ] WhatsApp adicionado ao app
- [ ] Config ID criado (Embedded Signup)
- [ ] Domínios autorizados configurados
- [ ] Webhook configurado e verificado

### Ambiente
- [ ] Docker instalado (`docker --version`)
- [ ] Docker Compose instalado (`docker-compose --version`)
- [ ] Arquivo `.env` criado e preenchido
- [ ] Portas 80, 3000, 8080 disponíveis

### WhatsApp Business App
- [ ] App versão 2.24.17 ou superior
- [ ] Número ativo por 7+ dias
- [ ] País suportado para CoEx
- [ ] Número não usado em outra WABA

---

## 🚨 Problemas Comuns

### "Port already in use"
```bash
# Mudar portas no docker-compose.yml
# Porta 3000 -> 3001
# Porta 8080 -> 8081
# Porta 80 -> 8000
```

### "Cannot connect to Docker daemon"
```bash
# Iniciar Docker
sudo systemctl start docker

# Ou no Windows: iniciar Docker Desktop
```

### "Permission denied"
```bash
# Linux: adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

### Frontend não carrega
```bash
# Verificar logs
docker-compose logs frontend

# Rebuild
docker-compose build frontend
docker-compose restart frontend
```

### Backend retorna erro 500
```bash
# Verificar variáveis de ambiente
docker exec whatsapp-coex-backend env

# Ver logs de erro
docker-compose logs backend
```

---

## 📱 Testando o Fluxo Completo

### 1. Conectar (Frontend)
- Acessar http://localhost:8080
- Clicar no botão verde
- Login no Facebook
- Autorizar permissões
- Escanear QR Code

### 2. Verificar Conexão (API)
```bash
curl http://localhost:3000/api/auth/status
```

### 3. Enviar Mensagem (WhatsApp API)
```bash
# Pegar o phone_number_id do status
PHONE_ID="seu_phone_number_id_aqui"
TOKEN="seu_access_token_aqui"

curl -X POST "https://graph.facebook.com/v24.0/$PHONE_ID/messages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "text",
    "text": {"body": "Teste CoEx!"}
  }'
```

### 4. Verificar Webhook
```bash
# Ver se webhook está recebendo mensagens
docker-compose logs -f backend | grep webhook
```

---

## 🎯 Próximos Passos

Depois de configurar e testar:

1. **Implementar banco de dados** (MongoDB/PostgreSQL) para produção
2. **Configurar SSL/HTTPS** com Let's Encrypt
3. **Deploy em servidor** (AWS, DigitalOcean, Azure, etc)
4. **Configurar domínio** próprio
5. **Implementar monitoramento** (logs, métricas, alertas)
6. **Adicionar funcionalidades**:
   - Envio de mídia (imagens, vídeos, documentos)
   - Templates de mensagem
   - Botões interativos
   - Respostas automáticas
   - Integração com CRM

---

## 📞 Suporte

- Documentação oficial: https://developers.facebook.com/docs/whatsapp
- WhatsApp Business API: https://business.whatsapp.com/products/business-platform
- Meta for Developers: https://developers.facebook.com

---

**Boa sorte! 🚀**
