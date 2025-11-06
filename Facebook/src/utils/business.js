const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const DATA_FILE = path.join(__dirname, '../../data/businesses.json');

/**
 * Garante que o diretório de dados existe
 */
async function ensureDataDirectory() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

/**
 * Lê os dados dos negócios cadastrados
 */
async function readBusinessData() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

/**
 * Salva os dados de um negócio
 */
async function saveBusinessData(businessData) {
  try {
    await ensureDataDirectory();
    
    const allData = await readBusinessData();
    
    const key = businessData.wabaId || businessData.phoneNumberId;
    allData[key] = {
      ...businessData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(DATA_FILE, JSON.stringify(allData, null, 2));
    
    console.log('✅ Business data saved:', key);
    
    return allData[key];
  } catch (error) {
    console.error('Error saving business data:', error);
    throw error;
  }
}

/**
 * Obtém dados de um negócio específico
 */
async function getBusinessData(key) {
  const allData = await readBusinessData();
  return allData[key] || null;
}

/**
 * Obtém todos os negócios cadastrados
 */
async function getAllBusinesses() {
  const allData = await readBusinessData();
  return Object.values(allData);
}

/**
 * Inscreve o app nos webhooks da WABA
 */
async function subscribeToWebhooks(wabaId, accessToken) {
  try {
    console.log(`📡 Subscribing to webhooks for WABA ${wabaId}...`);

    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${wabaId}/subscribed_apps`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    console.log('✅ Webhook subscription successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error subscribing to webhooks:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Registra o número do WhatsApp Business
 */
async function registerPhoneNumber(phoneNumberId, accessToken, pin = '111111') {
  try {
    console.log(`📞 Registering phone number ${phoneNumberId}...`);

    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/register`,
      {
        messaging_product: 'whatsapp',
        pin: pin
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Phone number registered:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error registering phone number:', error.response?.data || error.message);
    // Não lança erro pois pode já estar registrado
    return null;
  }
}

module.exports = {
  saveBusinessData,
  getBusinessData,
  getAllBusinesses,
  subscribeToWebhooks,
  registerPhoneNumber
};
