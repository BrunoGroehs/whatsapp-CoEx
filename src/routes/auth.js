const express = require('express');
const axios = require('axios');
const router = express.Router();
const { saveBusinessData, subscribeToWebhooks } = require('../utils/business');

/**
 * OAuth Callback - Recebe o código de autorização após o Embedded Signup
 * Esta é a URI de redirecionamento que você deve configurar no Facebook App
 */
router.get('/callback', async (req, res) => {
  try {
    console.log('🔐 OAuth callback received');
    console.log('Query params:', req.query);

    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ 
        error: 'Missing authorization code',
        message: 'Código de autorização não foi recebido'
      });
    }

    // Troca o código por um token de acesso
    console.log('🔄 Exchanging code for access token...');
    const tokenResponse = await exchangeCodeForToken(code);
    
    if (!tokenResponse.access_token) {
      throw new Error('Failed to get access token');
    }

    console.log('✅ Access token obtained');

    // Obtém informações da WABA e phone number
    const businessData = {
      accessToken: tokenResponse.access_token,
      wabaId: req.query.waba_id,
      phoneNumberId: req.query.phone_number_id,
      businessId: req.query.business_id,
      state: state
    };

    console.log('📊 Business data:', {
      wabaId: businessData.wabaId,
      phoneNumberId: businessData.phoneNumberId,
      businessId: businessData.businessId
    });

    // Salva os dados do negócio
    await saveBusinessData(businessData);

    // Inscreve-se nos webhooks da WABA
    if (businessData.wabaId) {
      await subscribeToWebhooks(businessData.wabaId, businessData.accessToken);
    }

    // Retorna sucesso
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cadastro Concluído</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 500px;
          }
          .success-icon {
            font-size: 64px;
            color: #25D366;
            margin-bottom: 20px;
          }
          h1 {
            color: #333;
            margin-bottom: 10px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: #25D366;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
          .info {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            font-size: 14px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>Cadastro Concluído com Sucesso!</h1>
          <p>Seu número do WhatsApp Business foi registrado e configurado.</p>
          
          <div class="info">
            <strong>Informações do Cadastro:</strong><br>
            <strong>WABA ID:</strong> ${businessData.wabaId || 'N/A'}<br>
            <strong>Phone Number ID:</strong> ${businessData.phoneNumberId || 'N/A'}<br>
            <strong>Business ID:</strong> ${businessData.businessId || 'N/A'}
          </div>
          
          <p style="margin-top: 20px;">
            Você já pode começar a usar a API do WhatsApp Business!
          </p>
          
          <a href="/" class="button">Voltar ao Início</a>
        </div>
        <script>
          // Fecha a janela após 3 segundos se foi aberta como popup
          if (window.opener) {
            setTimeout(() => {
              window.opener.postMessage({ type: 'signup_success', data: ${JSON.stringify(businessData)} }, '*');
              window.close();
            }, 3000);
          }
        </script>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('❌ Error in OAuth callback:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Erro no Cadastro</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 500px;
          }
          .error-icon {
            font-size: 64px;
            color: #f5576c;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">❌</div>
          <h1>Erro no Cadastro</h1>
          <p>${error.message}</p>
          <a href="/" style="display:inline-block;margin-top:20px;padding:12px 30px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">Tentar Novamente</a>
        </div>
      </body>
      </html>
    `);
  }
});

/**
 * POST /callback - Recebe dados do popup do Embedded Signup (v3)
 */
router.post('/callback', async (req, res) => {
  try {
    console.log('📨 POST callback received');
    console.log('Body:', req.body);

    const { phone_number_id, waba_id, code } = req.body;

    if (!phone_number_id || !waba_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing phone_number_id or waba_id'
      });
    }

    let accessToken = null;

    // Se tiver código, trocar por token
    if (code) {
      console.log('🔄 Exchanging code for access token...');
      const tokenResponse = await exchangeCodeForToken(code);
      accessToken = tokenResponse.access_token;
      console.log('✅ Access token obtained');
    }

    // Salvar dados do negócio
    const businessData = {
      accessToken: accessToken,
      wabaId: waba_id,
      phoneNumberId: phone_number_id
    };

    await saveBusinessData(businessData);

    // Inscrever nos webhooks
    if (accessToken && waba_id) {
      try {
        await subscribeToWebhooks(waba_id, accessToken);
      } catch (webhookError) {
        console.error('Erro ao inscrever webhooks:', webhookError.message);
      }
    }

    res.json({
      success: true,
      message: 'WhatsApp conectado com sucesso!',
      data: {
        wabaId: waba_id,
        phoneNumberId: phone_number_id,
        hasToken: !!accessToken
      }
    });

  } catch (error) {
    console.error('❌ Error in POST callback:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Troca o código de autorização por um token de acesso
 */
async function exchangeCodeForToken(code) {
  try {
    const response = await axios.post('https://graph.facebook.com/v22.0/oauth/access_token', {
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      grant_type: 'authorization_code',
      code: code
    });

    return response.data;
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    throw new Error('Failed to exchange authorization code for access token');
  }
}

module.exports = router;
