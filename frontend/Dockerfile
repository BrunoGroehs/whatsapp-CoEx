# Frontend Dockerfile
FROM nginx:alpine

# Copiar arquivos estáticos para nginx
COPY public/ /usr/share/nginx/html/

# Copiar configuração customizada do nginx (se necessário)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
