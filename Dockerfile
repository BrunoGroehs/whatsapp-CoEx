# ==============================================================================
# Multi-stage Dockerfile para WhatsApp CoEx
# Deploy completo em um único container (Backend + Frontend + Nginx)
# ==============================================================================

# ==============================================================================
# Stage 1: Build Backend
# ==============================================================================
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copiar package.json e instalar dependências
COPY backend/package.json ./
RUN npm install --production

# Copiar código do backend
COPY backend/ ./

# ==============================================================================
# Stage 2: Build Frontend (Preparar arquivos estáticos)
# ==============================================================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copiar arquivos do frontend
COPY frontend/package.json ./
RUN npm install --production || true

# Copiar código do frontend
COPY frontend/ ./

# ==============================================================================
# Stage 3: Imagem Final - Nginx + Node.js
# ==============================================================================
FROM nginx:alpine

# Instalar Node.js no container Nginx
RUN apk add --no-cache nodejs npm

# Criar diretórios
WORKDIR /app

# ==============================================================================
# Copiar Backend (da stage 1)
# ==============================================================================
COPY --from=backend-builder /app/backend /app/backend

# ==============================================================================
# Copiar Frontend (da stage 2)
# ==============================================================================
COPY --from=frontend-builder /app/frontend/public /usr/share/nginx/html

# ==============================================================================
# Configurar Nginx
# ==============================================================================
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# ==============================================================================
# Script de inicialização (Start Backend + Nginx)
# ==============================================================================
RUN cat > /app/start.sh << 'EOF'
#!/bin/sh

echo "🚀 Iniciando WhatsApp CoEx..."

# Iniciar Backend em background
echo "📱 Iniciando Backend..."
cd /app/backend
node src/index.js &
BACKEND_PID=$!

# Aguardar backend iniciar
sleep 3

# Iniciar Nginx em foreground
echo "🌐 Iniciando Nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!

# Manter container rodando e monitorar processos
echo "✅ Aplicação iniciada!"
echo "   Backend PID: $BACKEND_PID"
echo "   Nginx PID: $NGINX_PID"

# Função para limpar ao sair
cleanup() {
    echo "🛑 Encerrando aplicação..."
    kill $BACKEND_PID 2>/dev/null
    kill $NGINX_PID 2>/dev/null
    exit 0
}

trap cleanup SIGTERM SIGINT

# Aguardar qualquer processo terminar
wait -n

# Se algum processo morrer, encerrar tudo
cleanup
EOF

RUN chmod +x /app/start.sh

# ==============================================================================
# Expor portas
# ==============================================================================
EXPOSE 80

# ==============================================================================
# Health Check
# ==============================================================================
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# ==============================================================================
# Iniciar aplicação
# ==============================================================================
CMD ["/app/start.sh"]
