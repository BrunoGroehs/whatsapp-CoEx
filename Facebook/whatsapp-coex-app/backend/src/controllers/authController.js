// Controller para autenticação WhatsApp
const whatsappService = require('../services/whatsappService');
const tokenService = require('../services/tokenService');

class AuthController {
  /**
   * Trocar código de autorização por access token
   * POST /api/auth/exchange-code
   */
  async exchangeCode(req, res) {
    try {
      const { code, phone_number_id, waba_id } = req.body;

      // Validar parâmetros
      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Código de autorização é obrigatório'
        });
      }

      if (!phone_number_id || !waba_id) {
        return res.status(400).json({
          success: false,
          message: 'phone_number_id e waba_id são obrigatórios'
        });
      }

      console.log('Recebida solicitação de troca de código');
      console.log(`WABA ID: ${waba_id}, Phone Number ID: ${phone_number_id}`);

      // Trocar código por token
      const tokenData = await whatsappService.exchangeCodeForToken(code);
      
      // Armazenar token de forma segura
      await whatsappService.storeToken(
        tokenData.accessToken,
        waba_id,
        phone_number_id,
        tokenData.expiresIn
      );

      // Inscrever app nos webhooks
      try {
        await whatsappService.subscribeAppToWebhooks(waba_id, tokenData.accessToken);
      } catch (webhookError) {
        console.error('Erro ao inscrever webhooks (não crítico):', webhookError.message);
        // Continuar mesmo se falhar (webhook pode já estar inscrito)
      }

      // Tentar registrar número (pode falhar em CoEx se já registrado)
      try {
        await whatsappService.registerPhoneNumber(phone_number_id, tokenData.accessToken);
      } catch (registerError) {
        console.error('Erro ao registrar número (esperado em CoEx):', registerError.message);
        // Continuar mesmo se falhar
      }

      // Obter informações da conta
      let accountInfo = null;
      try {
        accountInfo = await whatsappService.getAccountInfo(waba_id, tokenData.accessToken);
      } catch (infoError) {
        console.error('Erro ao obter informações da conta:', infoError.message);
      }

      // Obter informações do número
      let phoneInfo = null;
      try {
        phoneInfo = await whatsappService.getPhoneNumberInfo(phone_number_id, tokenData.accessToken);
      } catch (phoneError) {
        console.error('Erro ao obter informações do número:', phoneError.message);
      }

      // Retornar sucesso
      res.json({
        success: true,
        message: 'WhatsApp conectado com sucesso!',
        data: {
          wabaId: waba_id,
          phoneNumberId: phone_number_id,
          expiresIn: tokenData.expiresIn,
          accountInfo: accountInfo,
          phoneInfo: phoneInfo
        }
      });

    } catch (error) {
      console.error('Erro no controller exchangeCode:', error.message);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao processar autenticação'
      });
    }
  }

  /**
   * Verificar status da conexão
   * GET /api/auth/status
   */
  async getStatus(req, res) {
    try {
      // Verificar se há dados armazenados
      if (!global.wabaData || Object.keys(global.wabaData).length === 0) {
        return res.json({
          connected: false,
          message: 'Nenhuma conta conectada'
        });
      }

      const wabaIds = Object.keys(global.wabaData);
      const statuses = [];

      for (const wabaId of wabaIds) {
        const data = global.wabaData[wabaId];
        const token = tokenService.getToken(wabaId);

        if (token) {
          // Validar token
          const validation = await tokenService.validateToken(token);

          statuses.push({
            wabaId: wabaId,
            phoneNumberId: data.phoneNumberId,
            connected: validation.isValid,
            expiresAt: new Date(data.expiresAt).toISOString(),
            createdAt: new Date(data.createdAt).toISOString()
          });
        } else {
          statuses.push({
            wabaId: wabaId,
            phoneNumberId: data.phoneNumberId,
            connected: false,
            message: 'Token expirado ou inválido'
          });
        }
      }

      res.json({
        connected: statuses.some(s => s.connected),
        accounts: statuses
      });

    } catch (error) {
      console.error('Erro ao obter status:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Desconectar conta
   * POST /api/auth/disconnect
   */
  async disconnect(req, res) {
    try {
      const { waba_id } = req.body;

      if (!waba_id) {
        return res.status(400).json({
          success: false,
          message: 'waba_id é obrigatório'
        });
      }

      // Remover dados armazenados
      if (global.tokens && global.tokens[waba_id]) {
        delete global.tokens[waba_id];
      }

      if (global.wabaData && global.wabaData[waba_id]) {
        delete global.wabaData[waba_id];
      }

      res.json({
        success: true,
        message: 'Conta desconectada com sucesso'
      });

    } catch (error) {
      console.error('Erro ao desconectar:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Verificar status de sincronização (CoEx)
   * GET /api/auth/sync-status/:wabaId
   */
  async getSyncStatus(req, res) {
    try {
      const { wabaId } = req.params;

      if (!wabaId) {
        return res.status(400).json({
          success: false,
          message: 'wabaId é obrigatório'
        });
      }

      const token = tokenService.getToken(wabaId);
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token não encontrado ou expirado'
        });
      }

      const syncStatus = await whatsappService.checkSyncStatus(wabaId, token);

      res.json({
        success: true,
        wabaId: wabaId,
        syncStatus: syncStatus
      });

    } catch (error) {
      console.error('Erro ao obter status de sincronização:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();
