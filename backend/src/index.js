// Servidor Express principal
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Importar rotas
const authRoutes = require('./routes/auth');

// Importar middleware
const errorHandler = require('./middleware/errorHandler');

// Criar app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // Máximo 100 requisições por IP por minuto
  message: 'Muitas requisições deste IP, tente novamente em um minuto'
});

// Middlewares
app.use(helmet()); // Segurança de headers HTTP
app.use(morgan('combined')); // Logging de requisições
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
})); // CORS
app.use(express.json()); // Parser de JSON
app.use(express.urlencoded({ extended: true })); // Parser de URL encoded
app.use('/api/', limiter); // Rate limiting

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);

// Rota de callback OAuth (para redirecionamento do Facebook)
app.get('/callback', (req, res) => {
  // Esta rota serve apenas para o redirecionamento inicial
  // O código será capturado pelo Facebook SDK no frontend
  console.log('Callback OAuth recebido');
  res.redirect('/');
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    name: 'WhatsApp CoEx API',
    version: '1.0.0',
    description: 'API para WhatsApp Embedded Signup com CoEx (Coexistence)',
    endpoints: {
      health: '/health',
      callback: 'GET /callback',
      webhook: {
        verify: 'GET /webhook',
        receive: 'POST /webhook'
      },
      auth: {
        exchangeCode: 'POST /api/auth/exchange-code',
        status: 'GET /api/auth/status',
        disconnect: 'POST /api/auth/disconnect',
        syncStatus: 'GET /api/auth/sync-status/:wabaId'
      }
    }
  });
});

// Webhook do WhatsApp (verificação)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Verificar token
  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook verificado com sucesso!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Webhook do WhatsApp (receber mensagens)
app.post('/webhook', (req, res) => {
  console.log('Webhook recebido:', JSON.stringify(req.body, null, 2));

  // Processar mensagens recebidas
  if (req.body.object === 'whatsapp_business_account') {
    req.body.entry?.forEach(entry => {
      entry.changes?.forEach(change => {
        if (change.field === 'messages') {
          const messages = change.value.messages;
          if (messages) {
            messages.forEach(message => {
              console.log('Mensagem recebida:', message);
              // Aqui você processaria a mensagem
            });
          }
        }
      });
    });
  }

  res.sendStatus(200);
});

// Middleware de erro (deve ser o último)
app.use(errorHandler);

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 WhatsApp CoEx API v1.0.0`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log('='.repeat(50));
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;
