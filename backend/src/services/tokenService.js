// Serviço de gerenciamento de tokens
const crypto = require('crypto');

class TokenService {
  constructor() {
    // Chave de criptografia (deve vir do .env)
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-this-32-char';
    // Garantir que a chave tenha 32 caracteres
    this.key = Buffer.from(this.encryptionKey.padEnd(32, '0').substring(0, 32));
  }

  /**
   * Validar token com Facebook Graph API
   * @param {string} token - Access token a ser validado
   * @returns {Promise<Object>} - Informações sobre a validade do token
   */
  async validateToken(token) {
    try {
      const axios = require('axios');
      const appId = process.env.WHATSAPP_APP_ID;
      const appSecret = process.env.WHATSAPP_APP_SECRET;

      const response = await axios.get('https://graph.facebook.com/debug_token', {
        params: {
          input_token: token,
          access_token: `${appId}|${appSecret}`
        }
      });

      const data = response.data.data;
      
      return {
        isValid: data.is_valid,
        expiresAt: data.expires_at,
        scopes: data.scopes,
        userId: data.user_id,
        appId: data.app_id
      };
    } catch (error) {
      console.error('Erro ao validar token:', error.message);
      return {
        isValid: false,
        error: error.message
      };
    }
  }

  /**
   * Renovar token se necessário
   * @param {string} token - Token atual
   * @param {number} expiresIn - Segundos até expiração
   * @returns {Promise<Object>} - Novo token ou token atual
   */
  async refreshTokenIfNeeded(token, expiresIn) {
    try {
      // Se faltam menos de 7 dias (604800 segundos) para expirar
      const SEVEN_DAYS = 604800;
      
      if (expiresIn < SEVEN_DAYS) {
        console.log('Token próximo da expiração, renovando...');
        
        const axios = require('axios');
        const response = await axios.get('https://graph.facebook.com/oauth/access_token', {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: process.env.WHATSAPP_APP_ID,
            client_secret: process.env.WHATSAPP_APP_SECRET,
            fb_exchange_token: token
          }
        });

        return {
          renewed: true,
          accessToken: response.data.access_token,
          expiresIn: response.data.expires_in,
          tokenType: response.data.token_type
        };
      }

      return {
        renewed: false,
        accessToken: token,
        expiresIn: expiresIn
      };
    } catch (error) {
      console.error('Erro ao renovar token:', error.message);
      throw error;
    }
  }

  /**
   * Criptografar token para armazenamento seguro
   * @param {string} token - Token a ser criptografado
   * @returns {string} - Token criptografado
   */
  encryptToken(token) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);
      
      let encrypted = cipher.update(token, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Retornar IV + encrypted (separados por :)
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('Erro ao criptografar token:', error.message);
      throw error;
    }
  }

  /**
   * Descriptografar token
   * @param {string} encryptedToken - Token criptografado
   * @returns {string} - Token original
   */
  decryptToken(encryptedToken) {
    try {
      const parts = encryptedToken.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Erro ao descriptografar token:', error.message);
      throw error;
    }
  }

  /**
   * Armazenar token em memória (em produção, usar banco de dados)
   * @param {string} wabaId - ID da conta WhatsApp Business
   * @param {string} token - Access token
   * @param {number} expiresIn - Segundos até expiração
   */
  storeToken(wabaId, token, expiresIn) {
    // Em produção, salvar em banco de dados
    // Por enquanto, usar variável global (apenas para desenvolvimento)
    if (!global.tokens) {
      global.tokens = {};
    }

    const encryptedToken = this.encryptToken(token);
    const expiresAt = Date.now() + (expiresIn * 1000);

    global.tokens[wabaId] = {
      token: encryptedToken,
      expiresAt: expiresAt,
      createdAt: Date.now()
    };

    console.log(`Token armazenado para WABA ID: ${wabaId}`);
  }

  /**
   * Recuperar token armazenado
   * @param {string} wabaId - ID da conta WhatsApp Business
   * @returns {string|null} - Token descriptografado ou null
   */
  getToken(wabaId) {
    if (!global.tokens || !global.tokens[wabaId]) {
      return null;
    }

    const stored = global.tokens[wabaId];
    
    // Verificar se token expirou
    if (stored.expiresAt < Date.now()) {
      console.log(`Token expirado para WABA ID: ${wabaId}`);
      delete global.tokens[wabaId];
      return null;
    }

    return this.decryptToken(stored.token);
  }
}

module.exports = new TokenService();
