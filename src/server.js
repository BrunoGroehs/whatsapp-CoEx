require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de logging detalhado para debug
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📥 ${req.method} ${req.path}`);
  console.log(`⏰ ${timestamp}`);
  console.log(`🌐 Origin: ${req.get('origin') || 'N/A'}`);
  console.log(`📋 Headers:`, JSON.stringify({
    'content-type': req.get('content-type'),
    'user-agent': req.get('user-agent'),
    'referer': req.get('referer')
  }, null, 2));
  if (Object.keys(req.query).length > 0) {
    console.log(`🔍 Query:`, JSON.stringify(req.query, null, 2));
  }
  if (Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
  }
  console.log(`${'='.repeat(60)}\n`);
  next();
});

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/webhook', webhookRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Rota principal - página de cadastro
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 WhatsApp Embedded Signup CoExistence`);
  console.log(`🌐 URL: ${process.env.APP_URL || `http://localhost:${PORT}`}`);
  console.log(`✅ App ID: ${process.env.FACEBOOK_APP_ID ? '✓ Configurado' : '✗ Não configurado'}`);
});

module.exports = app;
