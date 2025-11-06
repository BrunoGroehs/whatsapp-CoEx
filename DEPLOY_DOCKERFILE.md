# 🐳 Deploy com Dockerfile Único no Easypanel

Guia completo para fazer deploy usando apenas um Dockerfile (sem docker-compose).

---

## 📦 Arquivo Criado

✅ **Dockerfile** - Container único com Backend + Frontend + Nginx

---

## 🚀 Como Fazer Deploy no Easypanel

### Opção 1: Usando Dockerfile Único (Recomendado para Easypanel)

#### 1. Configurar Projeto no Easypanel

1. **Acesse Easypanel** e crie novo projeto
2. **Tipo de projeto**: Selecione **"Docker"** (não Docker Compose)
3. **Configurações**:
   - **Project Name**: `whatsapp-coex`
   - **Repository**: `https://github.com/BrunoGroehs/whatsapp-CoEx.git`
   - **Branch**: `main`
   - **Dockerfile Path**: `Dockerfile` (na raiz)
   - **Build Context**: `.` (raiz)

#### 2. Configurar Variáveis de Ambiente

Adicione todas as variáveis no Easypanel:

```env
# WhatsApp App
WHATSAPP_APP_ID=1335317331469574
WHATSAPP_CONFIG_ID=2031952424274683
WHATSAPP_APP_SECRET=<seu_app_secret>
WHATSAPP_API_VERSION=v24.0

# Server
NODE_ENV=production
PORT=3000

# URLs
FRONTEND_URL=https://<seu-dominio>
REDIRECT_URI=https://<seu-dominio>/callback
WEBHOOK_URL=https://<seu-dominio>/webhook

# Tokens
WEBHOOK_VERIFY_TOKEN=<token_aleatorio>
ENCRYPTION_KEY=<chave_32_chars>

# Facebook
BUSINESS_ID=<seu_business_id>
SYSTEM_USER_TOKEN=<opcional>
```

#### 3. Configurar Porta

No Easypanel:
- **Port**: `80`
- **Protocol**: `HTTP`

#### 4. Deploy

Clique em **Deploy** e aguarde o build (3-5 minutos)

---

## 🏗️ Como o Dockerfile Funciona

### Estrutura Multi-Stage:

```
Stage 1: Backend Builder
  ├── Instala dependências do backend
  └── Prepara código do backend

Stage 2: Frontend Builder
  ├── Prepara arquivos estáticos do frontend
  └── Copia arquivos HTML/CSS/JS

Stage 3: Imagem Final
  ├── Nginx (servidor web)
  ├── Node.js (runtime do backend)
  ├── Backend (rodando em background)
  ├── Frontend (servido pelo Nginx)
  └── Script de inicialização
```

### Quando o Container Inicia:

1. **Backend** inicia na porta 3000 (interno)
2. **Nginx** inicia na porta 80
3. **Nginx** roteia:
   - `/api/*` → Backend (porta 3000)
   - `/webhook` → Backend (porta 3000)
   - `/callback` → Backend (porta 3000)
   - `/health` → Backend (porta 3000)
   - `/` → Frontend (arquivos estáticos)

---

## 🔄 Alternativa: Manter Docker Compose

Se preferir usar docker-compose.easypanel.yml (3 containers separados):

### Vantagens Docker Compose:
- ✅ Separação de serviços
- ✅ Escalabilidade individual
- ✅ Logs separados por serviço
- ✅ Restart independente

### Vantagens Dockerfile Único:
- ✅ Mais simples de configurar
- ✅ Usa menos recursos
- ✅ Deploy mais rápido
- ✅ Um único container

---

## 📊 Comparação

| Aspecto | Dockerfile Único | Docker Compose |
|---------|-----------------|----------------|
| **Simplicidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Recursos** | Menos RAM/CPU | Mais RAM/CPU |
| **Escalabilidade** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Manutenção** | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Deploy Speed** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🧪 Testar Localmente

### Build da imagem:

```powershell
docker build -t whatsapp-coex .
```

### Executar container:

```powershell
docker run -d `
  -p 80:80 `
  -e WHATSAPP_APP_ID=1335317331469574 `
  -e WHATSAPP_CONFIG_ID=2031952424274683 `
  -e WHATSAPP_APP_SECRET=seu_secret `
  -e WEBHOOK_VERIFY_TOKEN=seu_token `
  -e ENCRYPTION_KEY=sua_chave `
  -e BUSINESS_ID=seu_business_id `
  -e FRONTEND_URL=http://localhost `
  -e REDIRECT_URI=http://localhost/callback `
  -e WEBHOOK_URL=http://localhost/webhook `
  --name whatsapp-coex `
  whatsapp-coex
```

### Testar:

```powershell
# Health check
curl http://localhost/health

# Frontend
curl http://localhost/
```

### Ver logs:

```powershell
docker logs -f whatsapp-coex
```

### Parar:

```powershell
docker stop whatsapp-coex
docker rm whatsapp-coex
```

---

## 🔍 Troubleshooting

### Build falha

```powershell
# Ver logs detalhados
docker build --progress=plain -t whatsapp-coex .
```

### Container não inicia

```powershell
# Ver logs
docker logs whatsapp-coex

# Executar interativo
docker run -it whatsapp-coex /bin/sh
```

### Backend não responde

```powershell
# Entrar no container
docker exec -it whatsapp-coex /bin/sh

# Verificar processos
ps aux | grep node

# Testar backend diretamente
wget -O- http://localhost:3000/health
```

### Nginx não serve frontend

```powershell
# Verificar arquivos
docker exec -it whatsapp-coex ls -la /usr/share/nginx/html

# Verificar config do nginx
docker exec -it whatsapp-coex cat /etc/nginx/nginx.conf
```

---

## 📝 Fazer Push e Deploy

```powershell
# Adicionar arquivos
git add Dockerfile .dockerignore

# Commit
git commit -m "feat: Adicionar Dockerfile único para deploy simplificado"

# Push
git push origin main
```

No Easypanel:
1. Redeploy do projeto
2. Aguardar build
3. Testar endpoints

---

## ✅ Checklist

- [ ] Dockerfile criado
- [ ] .dockerignore configurado
- [ ] Build local testado (opcional)
- [ ] Push para GitHub
- [ ] Projeto configurado no Easypanel
- [ ] Variáveis de ambiente adicionadas
- [ ] Deploy realizado
- [ ] Endpoints testados
- [ ] Health check funcionando
- [ ] Webhook verificado no Facebook

---

## 🎯 Recomendação

**Para Easypanel**: Use o **Dockerfile único** - é mais simples e usa menos recursos.

**Para produção escalável**: Use o **docker-compose.easypanel.yml** - permite escalar serviços individualmente.

---

**Boa sorte com o deploy! 🚀**
