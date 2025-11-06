/**
 * Script de Teste - Enviar Mensagem via WhatsApp
 * 
 * Este script busca automaticamente os dados salvos e envia uma mensagem de teste.
 * 
 * Uso:
 *   node test-send-message.js 5511999999999 "Sua mensagem aqui"
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Configuração
const API_URL = process.env.APP_URL || 'https://casaecosustentavel-a.k3givk.easypanel.host';
const DATA_FILE = path.join(__dirname, 'data/businesses.json');

async function sendTestMessage(to, message) {
  try {
    console.log('📱 WhatsApp Test Message Sender');
    console.log('================================\n');

    // 1. Carregar dados dos negócios
    console.log('📂 Loading business data...');
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const businesses = JSON.parse(data);

    if (Object.keys(businesses).length === 0) {
      console.error('❌ No businesses found! Please complete the Embedded Signup first.');
      console.log('\n💡 Visit: ' + API_URL);
      process.exit(1);
    }

    // Pega o primeiro negócio cadastrado
    const business = Object.values(businesses)[0];
    
    console.log('✅ Business data loaded');
    console.log(`   WABA ID: ${business.wabaId}`);
    console.log(`   Phone Number ID: ${business.phoneNumberId}`);
    console.log(`   Business ID: ${business.businessId || 'N/A'}`);
    console.log('');

    // 2. Enviar mensagem
    console.log('📤 Sending message...');
    console.log(`   To: ${to}`);
    console.log(`   Message: "${message}"`);
    console.log('');

    const response = await axios.post(
      `${API_URL}/api/send-message`,
      {
        phoneNumberId: business.phoneNumberId,
        to: to,
        message: message,
        accessToken: business.accessToken
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Message sent successfully!');
    console.log('\nResponse:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('\n❌ Error sending message:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    
    process.exit(1);
  }
}

// Processar argumentos
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node test-send-message.js <phone_number> <message>');
  console.log('\nExample:');
  console.log('  node test-send-message.js 5511999999999 "Hello from WhatsApp API!"');
  console.log('\nNote: Phone number format should be: [country_code][area_code][number]');
  console.log('      Example: 5511999999999 (Brazil)');
  process.exit(1);
}

const phoneNumber = args[0];
const message = args.slice(1).join(' ');

// Executar
sendTestMessage(phoneNumber, message);
