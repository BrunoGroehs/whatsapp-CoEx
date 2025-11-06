# Backend Dockerfile
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências (usar npm install ao invés de npm ci)
RUN npm install --production --no-package-lock

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "src/index.js"]
