# Comandos Úteis - WhatsApp CoEx

## Docker Commands

### Build e Start
```bash
# Build todas as imagens
docker-compose build

# Iniciar todos os containers
docker-compose up -d

# Build e start em um comando
docker-compose up -d --build

# Rebuild forçado (sem cache)
docker-compose build --no-cache
```

### Logs
```bash
# Ver logs de todos os containers
docker-compose logs -f

# Ver logs de um container específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Últimas 100 linhas
docker-compose logs --tail=100 -f
```

### Stop e Restart
```bash
# Parar todos os containers
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Restart de um serviço específico
docker-compose restart backend

# Restart de todos
docker-compose restart
```

### Acesso aos Containers
```bash
# Entrar no container backend
docker exec -it whatsapp-coex-backend sh

# Entrar no container frontend
docker exec -it whatsapp-coex-frontend sh

# Executar comando no container
docker exec whatsapp-coex-backend npm list
```

### Limpeza
```bash
# Remover containers parados
docker container prune

# Remover imagens não utilizadas
docker image prune

# Limpar tudo (cuidado!)
docker system prune -a

# Remover apenas este projeto
docker-compose down --rmi all -v
```

## API Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Verificar Status
```bash
curl http://localhost:3000/api/auth/status
```

### Testar Webhook (GET)
```bash
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=seu_token&hub.challenge=12345"
```

### Testar Webhook (POST)
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "changes": [{
        "field": "messages",
        "value": {
          "messages": [{
            "from": "5511999999999",
            "text": {
              "body": "Teste"
            }
          }]
        }
      }]
    }]
  }'
```

### Exchange Code (exemplo)
```bash
curl -X POST http://localhost:3000/api/auth/exchange-code \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SEU_CODIGO_AQUI",
    "phone_number_id": "123456789",
    "waba_id": "987654321"
  }'
```

### Disconnect
```bash
curl -X POST http://localhost:3000/api/auth/disconnect \
  -H "Content-Type: application/json" \
  -d '{
    "waba_id": "987654321"
  }'
```

## WhatsApp API Calls

### Enviar Mensagem de Texto
```bash
curl -X POST "https://graph.facebook.com/v24.0/PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "text",
    "text": {
      "body": "Olá! Mensagem via API com CoEx!"
    }
  }'
```

### Enviar Template
```bash
curl -X POST "https://graph.facebook.com/v24.0/PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": {
        "code": "en_US"
      }
    }
  }'
```

### Obter Informações da WABA
```bash
curl "https://graph.facebook.com/v24.0/WABA_ID?fields=id,name,timezone_id" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Obter Informações do Número
```bash
curl "https://graph.facebook.com/v24.0/PHONE_NUMBER_ID?fields=id,verified_name,display_phone_number,quality_rating" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Validar Token
```bash
curl "https://graph.facebook.com/debug_token?input_token=ACCESS_TOKEN&access_token=APP_ID|APP_SECRET"
```

## Desenvolvimento Local

### Backend (sem Docker)
```bash
cd backend
npm install
npm run dev
```

### Frontend (servidor HTTP simples)
```bash
cd frontend/public
npx http-server -p 8080
```

### Backend + Frontend
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend/public && npx http-server -p 8080
```

## Database (quando implementado)

### MongoDB
```bash
# Conectar ao MongoDB
docker exec -it mongo-container mongosh

# Backup
docker exec mongo-container mongodump --out /backup

# Restore
docker exec mongo-container mongorestore /backup
```

### PostgreSQL
```bash
# Conectar ao PostgreSQL
docker exec -it postgres-container psql -U username -d database

# Backup
docker exec postgres-container pg_dump -U username database > backup.sql

# Restore
docker exec -i postgres-container psql -U username database < backup.sql
```

## SSL/HTTPS (Produção)

### Let's Encrypt
```bash
# Instalar Certbot
sudo apt-get install certbot

# Obter certificado
sudo certbot certonly --standalone -d seu-dominio.com

# Renovar certificado
sudo certbot renew

# Auto-renovação (crontab)
0 0 1 * * certbot renew --quiet
```

## Monitoramento

### Ver uso de recursos
```bash
# Docker stats
docker stats

# Stats de um container específico
docker stats whatsapp-coex-backend
```

### Ver processos
```bash
docker-compose ps
```

### Inspecionar container
```bash
docker inspect whatsapp-coex-backend
```

## Troubleshooting

### Ver variáveis de ambiente
```bash
docker exec whatsapp-coex-backend env
```

### Verificar conectividade
```bash
# Ping entre containers
docker exec whatsapp-coex-frontend ping backend

# Teste de porta
docker exec whatsapp-coex-backend nc -zv backend 3000
```

### Logs de erro do Nginx
```bash
docker exec whatsapp-coex-nginx cat /var/log/nginx/error.log
```

### Restart específico
```bash
# Apenas backend
docker-compose restart backend

# Recarregar Nginx (sem restart)
docker exec whatsapp-coex-nginx nginx -s reload
```

## Backup e Restore

### Backup completo
```bash
# Criar backup
tar -czf backup-$(date +%Y%m%d).tar.gz \
  .env \
  backend/src \
  frontend/public \
  nginx/nginx.conf

# Restore
tar -xzf backup-YYYYMMDD.tar.gz
```

## Aliases Úteis (adicionar ao .bashrc ou .zshrc)

```bash
# Adicionar ao seu shell config
alias dc='docker-compose'
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'
alias dcrestart='docker-compose restart'
alias dcbuild='docker-compose build'
alias dcps='docker-compose ps'

# Usar
dcup
dclogs backend
```

## URLs Importantes

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/
- Health: http://localhost:3000/health
- Webhook: http://localhost:3000/webhook
- Nginx: http://localhost:80

## Ambiente de Produção

### Deploy
```bash
# Pull do repositório
git pull origin main

# Rebuild e restart
docker-compose down
docker-compose build
docker-compose up -d

# Verificar logs
docker-compose logs -f
```

### Rollback
```bash
# Voltar para versão anterior
git checkout HEAD~1
docker-compose down
docker-compose build
docker-compose up -d
```
