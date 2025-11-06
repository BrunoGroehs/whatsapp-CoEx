const express = require('express');
const router = express.Router();
const { getBusinessData, getAllBusinesses } = require('../utils/business');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

/**
 * Retorna as configurações públicas do .env
 */
router.get('/config', (req, res) => {
  res.json({
    appId: process.env.FACEBOOK_APP_ID,
    configId: process.env.FACEBOOK_CONFIG_ID
  });
});

/**
 * Lista todos os negócios cadastrados
 */
router.get('/businesses', async (req, res) => {
  try {
    const businesses = await getAllBusinesses();
    res.json({
      success: true,
      count: businesses.length,
      businesses: businesses
    });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Obtém dados de um negócio específico
 */
router.get('/business/:wabaId', async (req, res) => {
  try {
    const business = await getBusinessData(req.params.wabaId);
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Business not found'
      });
    }

    res.json({
      success: true,
      business: business
    });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Envia uma mensagem de teste via WhatsApp
 */
router.post('/send-message', async (req, res) => {
  try {
    const { phoneNumberId, to, message, accessToken } = req.body;

    if (!phoneNumberId || !to || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: phoneNumberId, to, message'
      });
    }

    const result = await sendWhatsAppMessage(phoneNumberId, to, message, accessToken);

    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
