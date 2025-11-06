const axios = require('axios');

/**
 * Envia uma mensagem via WhatsApp Business API
 */
async function sendWhatsAppMessage(phoneNumberId, to, message, accessToken) {
  try {
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
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending message:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Envia uma mensagem de template
 */
async function sendTemplateMessage(phoneNumberId, to, templateName, language, components, accessToken) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: language
          },
          components: components
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Template message sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error sending template:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Marca uma mensagem como lida
 */
async function markMessageAsRead(phoneNumberId, messageId, accessToken) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error marking message as read:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  sendWhatsAppMessage,
  sendTemplateMessage,
  markMessageAsRead
};
