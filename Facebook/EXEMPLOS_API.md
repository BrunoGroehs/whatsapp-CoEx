# Exemplos de Uso da API

Este arquivo contém exemplos práticos de como usar a API após configurar o WhatsApp CoExistence.

## 📝 Antes de Começar

Após completar o Embedded Signup, você receberá:
- `WABA_ID`: ID da sua conta WhatsApp Business
- `PHONE_NUMBER_ID`: ID do número cadastrado
- `ACCESS_TOKEN`: Token de acesso (salvo automaticamente em `data/businesses.json`)

## 🔍 1. Listar Todos os Negócios Cadastrados

```bash
curl -X GET https://casaecosustentavel-a.k3givk.easypanel.host/api/businesses
```

Resposta:
```json
{
  "success": true,
  "count": 1,
  "businesses": [
    {
      "accessToken": "EAAB...",
      "wabaId": "123456789",
      "phoneNumberId": "987654321",
      "businessId": "456789123",
      "createdAt": "2025-11-05T10:30:00.000Z",
      "updatedAt": "2025-11-05T10:30:00.000Z"
    }
  ]
}
```

## 🔎 2. Obter Dados de um Negócio Específico

```bash
curl -X GET https://casaecosustentavel-a.k3givk.easypanel.host/api/business/123456789
```

## 📤 3. Enviar Mensagem de Texto Simples

```bash
curl -X POST https://casaecosustentavel-a.k3givk.easypanel.host/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumberId": "SEU_PHONE_NUMBER_ID",
    "to": "5511999999999",
    "message": "Olá! Esta é uma mensagem de teste via WhatsApp Business API.",
    "accessToken": "SEU_ACCESS_TOKEN"
  }'
```

Resposta de sucesso:
```json
{
  "success": true,
  "result": {
    "messaging_product": "whatsapp",
    "contacts": [
      {
        "input": "5511999999999",
        "wa_id": "5511999999999"
      }
    ],
    "messages": [
      {
        "id": "wamid.HBgNNTUxMTk5OTk5OTk5ORUCABIYIDNBNzI0..."
      }
    ]
  }
}
```

## 📋 4. Usar Dados Salvos Automaticamente

Depois do primeiro cadastro, os dados ficam salvos. Você pode criar um script para buscar automaticamente:

```javascript
// exemplo-envio.js
const axios = require('axios');

async function enviarMensagem() {
  // 1. Buscar dados do negócio
  const businesses = await axios.get('https://casaecosustentavel-a.k3givk.easypanel.host/api/businesses');
  
  // Pegar o primeiro negócio cadastrado
  const business = businesses.data.businesses[0];
  
  // 2. Enviar mensagem
  const response = await axios.post(
    'https://casaecosustentavel-a.k3givk.easypanel.host/api/send-message',
    {
      phoneNumberId: business.phoneNumberId,
      to: '5511999999999',
      message: 'Olá! Mensagem automática.',
      accessToken: business.accessToken
    }
  );
  
  console.log('Mensagem enviada:', response.data);
}

enviarMensagem();
```

## 📲 5. Enviar Mensagem Diretamente pela Graph API

Se preferir usar a Graph API diretamente:

```bash
curl -X POST \
  https://graph.facebook.com/v21.0/SEU_PHONE_NUMBER_ID/messages \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "5511999999999",
    "type": "text",
    "text": {
      "preview_url": false,
      "body": "Olá! Mensagem via Graph API."
    }
  }'
```

## 📨 6. Enviar Mensagem com Template

Templates precisam ser aprovados primeiro no WhatsApp Manager.

```bash
curl -X POST \
  https://graph.facebook.com/v21.0/SEU_PHONE_NUMBER_ID/messages \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": {
        "code": "pt_BR"
      }
    }
  }'
```

## 🖼️ 7. Enviar Imagem

```bash
curl -X POST \
  https://graph.facebook.com/v21.0/SEU_PHONE_NUMBER_ID/messages \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "5511999999999",
    "type": "image",
    "image": {
      "link": "https://exemplo.com/imagem.jpg",
      "caption": "Legenda da imagem"
    }
  }'
```

## 📄 8. Enviar Documento

```bash
curl -X POST \
  https://graph.facebook.com/v21.0/SEU_PHONE_NUMBER_ID/messages \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "5511999999999",
    "type": "document",
    "document": {
      "link": "https://exemplo.com/documento.pdf",
      "caption": "Documento importante",
      "filename": "relatorio.pdf"
    }
  }'
```

## 🎯 9. Enviar Botões Interativos

```bash
curl -X POST \
  https://graph.facebook.com/v21.0/SEU_PHONE_NUMBER_ID/messages \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "5511999999999",
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": {
        "text": "Escolha uma opção:"
      },
      "action": {
        "buttons": [
          {
            "type": "reply",
            "reply": {
              "id": "sim",
              "title": "Sim"
            }
          },
          {
            "type": "reply",
            "reply": {
              "id": "nao",
              "title": "Não"
            }
          }
        ]
      }
    }
  }'
```

## 📋 10. Enviar Lista

```bash
curl -X POST \
  https://graph.facebook.com/v21.0/SEU_PHONE_NUMBER_ID/messages \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "5511999999999",
    "type": "interactive",
    "interactive": {
      "type": "list",
      "header": {
        "type": "text",
        "text": "Menu de Opções"
      },
      "body": {
        "text": "Selecione uma opção:"
      },
      "action": {
        "button": "Ver Opções",
        "sections": [
          {
            "title": "Produtos",
            "rows": [
              {
                "id": "produto1",
                "title": "Produto 1",
                "description": "Descrição do produto 1"
              },
              {
                "id": "produto2",
                "title": "Produto 2",
                "description": "Descrição do produto 2"
              }
            ]
          }
        ]
      }
    }
  }'
```

## 🔍 11. Verificar Status de Mensagem

O status é recebido via webhook automaticamente, mas você também pode consultar:

```bash
curl -X GET \
  "https://graph.facebook.com/v21.0/MESSAGE_ID" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

## 📊 12. Obter Informações do Número

```bash
curl -X GET \
  "https://graph.facebook.com/v21.0/SEU_PHONE_NUMBER_ID" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

Resposta:
```json
{
  "verified_name": "Meu Negócio",
  "display_phone_number": "+55 11 99999-9999",
  "quality_rating": "GREEN",
  "id": "987654321"
}
```

## 📞 13. Obter Informações da WABA

```bash
curl -X GET \
  "https://graph.facebook.com/v21.0/SEU_WABA_ID?fields=id,name,timezone_id,message_template_namespace" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

## 🔔 14. Webhook - Estrutura de Mensagem Recebida

Quando alguém envia uma mensagem, você recebe no webhook:

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WABA_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15551234567",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "contacts": [
              {
                "profile": {
                  "name": "João"
                },
                "wa_id": "5511999999999"
              }
            ],
            "messages": [
              {
                "from": "5511999999999",
                "id": "wamid.XXX",
                "timestamp": "1699999999",
                "text": {
                  "body": "Olá, preciso de ajuda"
                },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

## 💡 Dicas Importantes

### Formato do Número
- Use código do país sem `+`: `5511999999999`
- Não use espaços, traços ou parênteses
- Formato: `[código_país][código_área][número]`

### Limites de Mensagens
- Novas contas começam com limite de 250 conversas/24h
- O limite aumenta automaticamente com uso consistente e qualidade

### Qualidade da Conta
- Mantenha baixa taxa de bloqueios
- Responda rápido
- Não envie spam
- Rating: GREEN (bom), YELLOW (alerta), RED (ruim)

### Segurança
- NUNCA exponha seu `ACCESS_TOKEN` publicamente
- Use variáveis de ambiente
- Guarde credenciais em local seguro
- Renove tokens periodicamente

## 📚 Referências

- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Interactive Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#interactive-messages)

---

**🎉 Pronto para começar a enviar mensagens!**
