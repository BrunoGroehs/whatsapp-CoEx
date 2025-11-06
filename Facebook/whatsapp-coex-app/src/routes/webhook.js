const express = require('express');
const router = express.Router();

/**
 * Webhook Verification (GET)
 * Facebook/Meta vai chamar esta rota para verificar o webhook
 */
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('📞 Webhook verification request received');

  // Verifica se o token corresponde ao configurado
  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

/**
 * Webhook Handler (POST)
 * Recebe eventos do WhatsApp (mensagens, status, etc.)
 */
router.post('/', async (req, res) => {
  console.log('📨 Webhook event received:', JSON.stringify(req.body, null, 2));

  try {
    const body = req.body;

    // Verifica se é um evento do WhatsApp
    if (body.object === 'whatsapp_business_account') {
      // Processa cada entry
      body.entry?.forEach(entry => {
        // Processa mudanças
        entry.changes?.forEach(change => {
          console.log('🔔 Change type:', change.field);
          
          // Mensagens recebidas
          if (change.field === 'messages') {
            const messages = change.value?.messages;
            if (messages) {
              messages.forEach(message => {
                console.log('💬 Message received:', {
                  from: message.from,
                  type: message.type,
                  timestamp: message.timestamp
                });
                
                // Aqui você pode processar a mensagem
                handleIncomingMessage(message, change.value);
              });
            }
          }

          // Status de mensagens enviadas
          if (change.field === 'message_status') {
            const statuses = change.value?.statuses;
            if (statuses) {
              statuses.forEach(status => {
                console.log('📊 Message status:', {
                  id: status.id,
                  status: status.status,
                  timestamp: status.timestamp
                });
              });
            }
          }
        });
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.sendStatus(500);
  }
});

/**
 * Processa mensagens recebidas
 */
async function handleIncomingMessage(message, metadata) {
  const phoneNumberId = metadata.metadata?.phone_number_id;
  const from = message.from;
  const messageType = message.type;

  console.log(`📱 Processing ${messageType} message from ${from} to phone ${phoneNumberId}`);

  // Exemplo de resposta automática para mensagens de texto
  if (messageType === 'text') {
    const messageText = message.text?.body?.toLowerCase();
    
    // Menu de comandos
    if (messageText === 'menu' || messageText === 'oi' || messageText === 'olá') {
      await sendAutoReply(phoneNumberId, from, 
        '👋 Olá! Bem-vindo(a)!\n\n' +
        'Comandos disponíveis:\n' +
        '📋 *menu* - Ver este menu\n' +
        '❓ *ajuda* - Obter ajuda\n' +
        'ℹ️ *info* - Informações sobre o serviço\n' +
        '📞 *contato* - Falar com atendente'
      );
    }
    // Comando de ajuda
    else if (messageText === 'ajuda') {
      await sendAutoReply(phoneNumberId, from,
        '🆘 *Central de Ajuda*\n\n' +
        'Estamos aqui para ajudar!\n\n' +
        'Envie *menu* para ver as opções disponíveis ou ' +
        '*contato* para falar com um atendente.'
      );
    }
    // Informações
    else if (messageText === 'info') {
      await sendAutoReply(phoneNumberId, from,
        'ℹ️ *Sobre Nós*\n\n' +
        'Este é um bot integrado com WhatsApp Business API.\n\n' +
        'Desenvolvido com CoExistence - permitindo uso simultâneo ' +
        'do app móvel e da API.'
      );
    }
    // Contato
    else if (messageText === 'contato') {
      await sendAutoReply(phoneNumberId, from,
        '📞 *Contato com Atendente*\n\n' +
        'Um atendente entrará em contato em breve.\n' +
        'Horário de atendimento: 9h às 18h'
      );
    }
    // Mensagem padrão
    else {
      await sendAutoReply(phoneNumberId, from,
        '👋 Olá! Recebi sua mensagem.\n\n' +
        'Envie *menu* para ver as opções disponíveis.'
      );
    }
  }
  
  // Resposta para outros tipos de mensagem
  else if (messageType === 'image') {
    await sendAutoReply(phoneNumberId, from, '📷 Imagem recebida! Obrigado.');
  }
  else if (messageType === 'document') {
    await sendAutoReply(phoneNumberId, from, '📄 Documento recebido! Obrigado.');
  }
  else if (messageType === 'audio') {
    await sendAutoReply(phoneNumberId, from, '🎵 Áudio recebido! Obrigado.');
  }
  else if (messageType === 'video') {
    await sendAutoReply(phoneNumberId, from, '🎥 Vídeo recebido! Obrigado.');
  }
}

/**
 * Envia uma resposta automática
 */
async function sendAutoReply(phoneNumberId, to, message) {
  try {
    // Busca o access token do negócio
    const fs = require('fs').promises;
    const path = require('path');
    const dataFile = path.join(__dirname, '../../data/businesses.json');
    
    const data = await fs.readFile(dataFile, 'utf8');
    const businesses = JSON.parse(data);
    
    // Procura o negócio pelo phoneNumberId
    const business = Object.values(businesses).find(b => b.phoneNumberId === phoneNumberId);
    
    if (!business || !business.accessToken) {
      console.log('❌ Business or access token not found for auto-reply');
      return;
    }
    
    const axios = require('axios');
    
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          preview_url: false,
          body: message
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${business.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Auto-reply sent successfully:', response.data);
  } catch (error) {
    console.error('❌ Error sending auto-reply:', error.response?.data || error.message);
  }
}

module.exports = router;
