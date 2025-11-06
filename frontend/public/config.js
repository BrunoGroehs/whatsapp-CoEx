// Configuração do frontend
// Este arquivo será servido como estático e pode usar variáveis de ambiente injetadas

window.APP_CONFIG = {
    // Em produção, o NGINX vai rotear /api para o backend
    // então usamos caminho relativo
    API_URL: window.location.origin,
    
    // Facebook App ID (mesmo para todos os ambientes)
    FACEBOOK_APP_ID: '1335317331469574',
    
    // WhatsApp Config ID (mesmo para todos os ambientes)
    WHATSAPP_CONFIG_ID: '2031952424274683',
    
    // Versão da API do Facebook
    FACEBOOK_API_VERSION: 'v24.0'
};
