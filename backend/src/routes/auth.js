// Rotas de autenticação
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

// Middleware de validação
const validateExchangeCode = [
  body('code').notEmpty().withMessage('Código é obrigatório'),
  body('phone_number_id').notEmpty().withMessage('phone_number_id é obrigatório'),
  body('waba_id').notEmpty().withMessage('waba_id é obrigatório'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// POST /api/auth/exchange-code
// Trocar código de autorização por access token
router.post('/exchange-code', validateExchangeCode, authController.exchangeCode);

// GET /api/auth/status
// Verificar status da conexão
router.get('/status', authController.getStatus);

// POST /api/auth/disconnect
// Desconectar conta
router.post('/disconnect', [
  body('waba_id').notEmpty().withMessage('waba_id é obrigatório')
], authController.disconnect);

// GET /api/auth/sync-status/:wabaId
// Verificar status de sincronização (CoEx)
router.get('/sync-status/:wabaId', authController.getSyncStatus);

module.exports = router;
