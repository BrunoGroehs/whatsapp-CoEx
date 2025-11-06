// Serviço para interagir com WhatsApp Business API
const axios = require('axios');
const tokenService = require('./tokenService');

class WhatsAppService {
  constructor() {
    this.apiVersion = process.env.WHATSAPP_API_VERSION || 'v24.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  /**
   * Trocar código de autorização por access token
   * @param {string} code - Código de autorização recebido do frontend
   * @returns {Promise<Object>} - Dados do token
   */
  async exchangeCodeForToken(code) {
    try {
      console.log('Iniciando troca de código por token...');
      
      const response = await axios.post(`${this.baseUrl}/oauth/access_token`, null, {
        params: {
          client_id: process.env.WHATSAPP_APP_ID,
          client_secret: process.env.WHATSAPP_APP_SECRET,
          code: code,
          redirect_uri: process.env.REDIRECT_URI || 'http://localhost:8080/callback'
        }
      });

      console.log('Token obtido com sucesso!');
      
      return {
        accessToken: response.data.access_token,
        tokenType: response.data.token_type,
        expiresIn: response.data.expires_in
      };
    } catch (error) {
      console.error('Erro ao trocar código por token:', error.response?.data || error.message);
      throw new Error(`Falha ao obter token: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Inscrever app nos webhooks da WABA
   * @param {string} wabaId - ID da conta WhatsApp Business
   * @param {string} accessToken - Access token válido
   * @returns {Promise<Object>} - Resultado da inscrição
   */
  async subscribeAppToWebhooks(wabaId, accessToken) {
    try {
      console.log(`Inscrevendo app nos webhooks para WABA: ${wabaId}`);
      
      const response = await axios.post(
        `${this.baseUrl}/${wabaId}/subscribed_apps`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      console.log('App inscrito nos webhooks com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro ao inscrever app nos webhooks:', error.response?.data || error.message);
      throw new Error(`Falha ao inscrever webhooks: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Registrar número de telefone
   * @param {string} phoneNumberId - ID do número de telefone
   * @param {string} accessToken - Access token válido
   * @param {string} pin - PIN de dois fatores (opcional)
   * @returns {Promise<Object>} - Resultado do registro
   */
  async registerPhoneNumber(phoneNumberId, accessToken, pin = null) {
    try {
      console.log(`Registrando número de telefone: ${phoneNumberId}`);
      
      const data = {
        messaging_product: 'whatsapp'
      };

      if (pin) {
        data.pin = pin;
      }

      const response = await axios.post(
        `${this.baseUrl}/${phoneNumberId}/register`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Número de telefone registrado com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar número:', error.response?.data || error.message);
      
      // Pode falhar se o número já estiver registrado (isso é ok em CoEx)
      if (error.response?.data?.error?.code === 131031) {
        console.log('Número já registrado (esperado em CoEx)');
        return { success: true, message: 'Número já registrado' };
      }
      
      throw new Error(`Falha ao registrar número: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Obter informações da conta WhatsApp Business
   * @param {string} wabaId - ID da conta WhatsApp Business
   * @param {string} accessToken - Access token válido
   * @returns {Promise<Object>} - Informações da conta
   */
  async getAccountInfo(wabaId, accessToken) {
    try {
      console.log(`Obtendo informações da conta: ${wabaId}`);
      
      const response = await axios.get(
        `${this.baseUrl}/${wabaId}`,
        {
          params: {
            fields: 'id,name,timezone_id,message_template_namespace,account_review_status'
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      console.log('Informações da conta obtidas com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter informações da conta:', error.response?.data || error.message);
      throw new Error(`Falha ao obter informações: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Obter informações do número de telefone
   * @param {string} phoneNumberId - ID do número de telefone
   * @param {string} accessToken - Access token válido
   * @returns {Promise<Object>} - Informações do número
   */
  async getPhoneNumberInfo(phoneNumberId, accessToken) {
    try {
      console.log(`Obtendo informações do número: ${phoneNumberId}`);
      
      const response = await axios.get(
        `${this.baseUrl}/${phoneNumberId}`,
        {
          params: {
            fields: 'id,verified_name,display_phone_number,quality_rating,code_verification_status'
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      console.log('Informações do número obtidas com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter informações do número:', error.response?.data || error.message);
      throw new Error(`Falha ao obter informações do número: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Armazenar token de forma segura
   * @param {string} accessToken - Access token
   * @param {string} wabaId - ID da conta WhatsApp Business
   * @param {string} phoneNumberId - ID do número de telefone
   * @param {number} expiresIn - Segundos até expiração
   */
  async storeToken(accessToken, wabaId, phoneNumberId, expiresIn) {
    try {
      console.log('Armazenando token de forma segura...');
      
      // Armazenar usando o serviço de token
      tokenService.storeToken(wabaId, accessToken, expiresIn);

      // Em produção, também salvar phoneNumberId e outras informações em banco
      if (!global.wabaData) {
        global.wabaData = {};
      }

      global.wabaData[wabaId] = {
        phoneNumberId: phoneNumberId,
        createdAt: Date.now(),
        expiresAt: Date.now() + (expiresIn * 1000)
      };

      console.log(`Dados armazenados para WABA: ${wabaId}, Phone: ${phoneNumberId}`);
    } catch (error) {
      console.error('Erro ao armazenar token:', error.message);
      throw error;
    }
  }

  /**
   * Verificar status de sincronização do chat (CoEx)
   * @param {string} wabaId - ID da conta WhatsApp Business
   * @param {string} accessToken - Access token válido
   * @returns {Promise<Object>} - Status da sincronização
   */
  async checkSyncStatus(wabaId, accessToken) {
    try {
      console.log(`Verificando status de sincronização para WABA: ${wabaId}`);
      
      const response = await axios.get(
        `${this.baseUrl}/${wabaId}`,
        {
          params: {
            fields: 'on_behalf_of_business_info'
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao verificar sincronização:', error.response?.data || error.message);
      return { error: error.message };
    }
  }
}

module.exports = new WhatsAppService();
