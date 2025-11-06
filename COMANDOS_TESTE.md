# 🧪 Comandos de Teste - WhatsApp CoEx

Comandos úteis para testar sua aplicação após o deploy no Easypanel.

---

## 🔧 Configuração Inicial

Substitua `SEU-DOMINIO` pelo seu domínio real antes de executar os comandos:

```bash
# Definir variável (Linux/Mac)
export DOMINIO="seu-app.easypanel.host"

# Definir variável (Windows PowerShell)
$DOMINIO = "seu-app.easypanel.host"
```

---

## ✅ 1. Testar Health Check

### Linux/Mac:
```bash
curl https://$DOMINIO/health
```

### Windows PowerShell:
```powershell
Invoke-RestMethod -Uri "https://$DOMINIO/health"
```

### Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2025-11-05T12:34:56.789Z",
  "uptime": 123.45
}
```

---

## 🔗 2. Testar Callback OAuth

### Linux/Mac:
```bash
curl -I https://$DOMINIO/callback
```

### Windows PowerShell:
```powershell
Invoke-WebRequest -Uri "https://$DOMINIO/callback" -Method GET -MaximumRedirection 0
```

### Resposta esperada:
```
HTTP/1.1 302 Found
Location: /
```

---

## 📡 3. Testar Webhook (Verificação)

Primeiro, defina seu token:

```bash
# Linux/Mac
export WEBHOOK_TOKEN="seu_webhook_verify_token"

# Windows PowerShell
$WEBHOOK_TOKEN = "seu_webhook_verify_token"
```

### Teste de Verificação (GET):

**Linux/Mac:**
```bash
curl "https://$DOMINIO/webhook?hub.mode=subscribe&hub.verify_token=$WEBHOOK_TOKEN&hub.challenge=12345"
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://$DOMINIO/webhook?hub.mode=subscribe&hub.verify_token=$WEBHOOK_TOKEN&hub.challenge=12345"
```

### Resposta esperada:
```
12345
```

---

## 📨 4. Testar Webhook (Receber Mensagens)

### Simular mensagem recebida:

**Linux/Mac:**
```bash
curl -X POST https://$DOMINIO/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "123456789",
      "changes": [{
        "value": {
          "messaging_product": "whatsapp",
          "metadata": {
            "display_phone_number": "5511999999999",
            "phone_number_id": "987654321"
          },
          "messages": [{
            "from": "5511988888888",
            "id": "wamid.ABC123",
            "timestamp": "1699200000",
            "text": {
              "body": "Olá! Esta é uma mensagem de teste."
            },
            "type": "text"
          }]
        },
        "field": "messages"
      }]
    }]
  }'
```

**Windows PowerShell:**
```powershell
$body = @{
    object = "whatsapp_business_account"
    entry = @(
        @{
            id = "123456789"
            changes = @(
                @{
                    value = @{
                        messaging_product = "whatsapp"
                        metadata = @{
                            display_phone_number = "5511999999999"
                            phone_number_id = "987654321"
                        }
                        messages = @(
                            @{
                                from = "5511988888888"
                                id = "wamid.ABC123"
                                timestamp = "1699200000"
                                text = @{
                                    body = "Olá! Esta é uma mensagem de teste."
                                }
                                type = "text"
                            }
                        )
                    }
                    field = "messages"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "https://$DOMINIO/webhook" -Method POST -Body $body -ContentType "application/json"
```

### Resposta esperada:
```
Status: 200
```

---

## 🔐 5. Testar API de Autenticação

### Verificar Status:

**Linux/Mac:**
```bash
curl https://$DOMINIO/api/auth/status
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://$DOMINIO/api/auth/status"
```

### Resposta esperada (sem conexão):
```json
{
  "connected": false,
  "message": "Nenhuma conta conectada"
}
```

### Resposta esperada (com conexão):
```json
{
  "connected": true,
  "accounts": [
    {
      "wabaId": "123456789",
      "phoneNumberId": "987654321",
      "connected": true,
      "expiresAt": "2025-12-05T12:34:56.789Z",
      "createdAt": "2025-11-05T12:34:56.789Z"
    }
  ]
}
```

---

## 📄 6. Testar Frontend

### Verificar se página carrega:

**Linux/Mac:**
```bash
curl -I https://$DOMINIO/
```

**Windows PowerShell:**
```powershell
Invoke-WebRequest -Uri "https://$DOMINIO/" -Method HEAD
```

### Resposta esperada:
```
HTTP/1.1 200 OK
Content-Type: text/html
```

### Verificar config.js:

**Linux/Mac:**
```bash
curl https://$DOMINIO/config.js
```

**Windows PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://$DOMINIO/config.js"
```

### Resposta esperada:
```javascript
window.APP_CONFIG = {
    API_URL: window.location.origin,
    FACEBOOK_APP_ID: '1335317331469574',
    WHATSAPP_CONFIG_ID: '2031952424274683',
    FACEBOOK_API_VERSION: 'v24.0'
};
```

---

## 🔍 7. Verificar SSL/HTTPS

### Linux/Mac:
```bash
openssl s_client -connect $DOMINIO:443 -servername $DOMINIO
```

### Windows PowerShell:
```powershell
Test-NetConnection -ComputerName $DOMINIO -Port 443
```

### Verificar certificado no navegador:
```
https://seu-dominio.easypanel.host
```
- Clicar no cadeado 🔒
- Verificar se certificado é válido

---

## 📊 8. Monitorar Logs (via Easypanel)

### Acessar logs:
1. Easypanel Dashboard
2. Selecionar projeto `whatsapp-coex`
3. Ir em **Logs**
4. Selecionar container:
   - `backend` - Para API logs
   - `frontend` - Para Nginx logs
   - `nginx` - Para proxy logs

### Logs importantes para monitorar:

**Backend (quando conectar WhatsApp):**
```
Callback OAuth recebido
🔑 Código de autorização recebido
Iniciando troca de código por token...
Token obtido com sucesso!
Inscrevendo app nos webhooks para WABA: 123456789
✅ WhatsApp conectado com sucesso!
```

**Backend (quando receber mensagem):**
```
Webhook recebido: {
  "object": "whatsapp_business_account",
  "entry": [...]
}
Mensagem recebida: {...}
```

---

## 🧪 9. Teste Completo de Fluxo

Execute em sequência:

```bash
# 1. Health Check
echo "Testando Health Check..."
curl https://$DOMINIO/health

# 2. Callback
echo -e "\nTestando Callback..."
curl -I https://$DOMINIO/callback

# 3. Webhook Verification
echo -e "\nTestando Webhook Verification..."
curl "https://$DOMINIO/webhook?hub.mode=subscribe&hub.verify_token=$WEBHOOK_TOKEN&hub.challenge=12345"

# 4. API Status
echo -e "\nTestando API Status..."
curl https://$DOMINIO/api/auth/status

# 5. Frontend
echo -e "\nTestando Frontend..."
curl -I https://$DOMINIO/

echo -e "\n✅ Todos os testes concluídos!"
```

**Windows PowerShell:**
```powershell
# 1. Health Check
Write-Host "Testando Health Check..."
Invoke-RestMethod -Uri "https://$DOMINIO/health"

# 2. Callback
Write-Host "`nTestando Callback..."
Invoke-WebRequest -Uri "https://$DOMINIO/callback" -Method GET -MaximumRedirection 0

# 3. Webhook Verification
Write-Host "`nTestando Webhook Verification..."
Invoke-RestMethod -Uri "https://$DOMINIO/webhook?hub.mode=subscribe&hub.verify_token=$WEBHOOK_TOKEN&hub.challenge=12345"

# 4. API Status
Write-Host "`nTestando API Status..."
Invoke-RestMethod -Uri "https://$DOMINIO/api/auth/status"

# 5. Frontend
Write-Host "`nTestando Frontend..."
Invoke-WebRequest -Uri "https://$DOMINIO/" -Method HEAD

Write-Host "`n✅ Todos os testes concluídos!"
```

---

## 🐛 10. Troubleshooting

### Teste de Conectividade:

**Ping:**
```bash
ping seu-dominio.easypanel.host
```

**DNS Lookup:**
```bash
# Linux/Mac
nslookup seu-dominio.easypanel.host

# Windows
nslookup seu-dominio.easypanel.host
```

### Verificar Portas:

**Linux/Mac:**
```bash
nc -zv seu-dominio.easypanel.host 443
```

**Windows:**
```powershell
Test-NetConnection -ComputerName seu-dominio.easypanel.host -Port 443
```

### Testar com Verbose:

**cURL verbose:**
```bash
curl -v https://$DOMINIO/health
```

**PowerShell verbose:**
```powershell
Invoke-WebRequest -Uri "https://$DOMINIO/health" -Verbose
```

---

## 📝 11. Gerar Tokens Aleatórios

### Webhook Verify Token:

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### Encryption Key (32 caracteres):

**Linux/Mac:**
```bash
openssl rand -hex 16
```

**Windows PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

---

## 🔄 12. Testar Redeploy

### Fazer alteração e redeploy:

```bash
# 1. Fazer alteração no código
git add .
git commit -m "Test redeploy"
git push origin main

# 2. No Easypanel: clicar em "Redeploy"

# 3. Aguardar build (3-5 minutos)

# 4. Testar novamente
curl https://$DOMINIO/health
```

---

## 📊 13. Benchmark de Performance

### Apache Bench (se instalado):

```bash
ab -n 100 -c 10 https://$DOMINIO/health
```

### PowerShell (teste simples):

```powershell
Measure-Command {
    1..100 | ForEach-Object {
        Invoke-RestMethod -Uri "https://$DOMINIO/health"
    }
}
```

---

## 🎯 Resumo dos Testes

| Teste | Comando | Esperado |
|-------|---------|----------|
| Health | `curl https://$DOMINIO/health` | `{"status":"ok"}` |
| Callback | `curl -I https://$DOMINIO/callback` | `302 Redirect` |
| Webhook | `curl "https://$DOMINIO/webhook?..."` | `12345` |
| API Status | `curl https://$DOMINIO/api/auth/status` | `{"connected":false}` |
| Frontend | `curl -I https://$DOMINIO/` | `200 OK` |

---

**Todos os testes passando = Aplicação 100% funcional! ✅**
