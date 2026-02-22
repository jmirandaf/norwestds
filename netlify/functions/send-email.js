const axios = require('axios');

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { name, email, company, message } = JSON.parse(event.body);

    // Validar los campos requeridos
    if (!name || !email || !company || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Todos los campos son requeridos' })
      };
    }

    const emailData = {
      fromAddress: mailFrom,
      toAddress: mailTo,
      subject: `Nuevo contacto de ${name} - ${company}`,
      content: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Empresa:</strong> ${company}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
          <hr>
          <p><em>Este mensaje fue enviado desde el formulario de contacto de norwestds.com</em></p>
        </div>
      `,
      askReceipt: true,
      mailFormat: "html"
    };

    // Log de variables de entorno (sin mostrar valores sensibles)
    console.log('Environment variables present:', {
      ZOHO_MAIL_FROM: !!process.env.ZOHO_MAIL_FROM,
      VITE_ZOHO_MAIL_FROM: !!process.env.VITE_ZOHO_MAIL_FROM,
      ZOHO_MAIL_TO: !!process.env.ZOHO_MAIL_TO,
      VITE_ZOHO_MAIL_TO: !!process.env.VITE_ZOHO_MAIL_TO,
      ZOHO_MAIL_ACCESS_TOKEN: !!process.env.ZOHO_MAIL_ACCESS_TOKEN,
      VITE_ZOHO_MAIL_ACCESS_TOKEN: !!process.env.VITE_ZOHO_MAIL_ACCESS_TOKEN
    });

    // Usar variables con o sin prefijo VITE_
    const mailFrom = process.env.ZOHO_MAIL_FROM || process.env.VITE_ZOHO_MAIL_FROM;
    const mailTo = process.env.ZOHO_MAIL_TO || process.env.VITE_ZOHO_MAIL_TO;
    const accessToken = process.env.ZOHO_MAIL_ACCESS_TOKEN || process.env.VITE_ZOHO_MAIL_ACCESS_TOKEN;

    // Verificar variables de entorno
    if (!mailFrom || !mailTo || !accessToken) {
      console.error('Missing environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Error de configuración del servidor',
          details: 'Faltan variables de entorno necesarias',
          debug: {
            mailFrom: !!mailFrom,
            mailTo: !!mailTo,
            accessToken: !!accessToken
          }
        })
      };
    }

    // Enviar el correo usando la API de Zoho
    try {
      console.log('Intentando enviar email con los siguientes datos:', {
        to: mailTo,
        from: mailFrom,
        subject: `Nuevo contacto de ${name} - ${company}`
      });

      const response = await axios({
        method: 'post',
        url: 'https://mail.zoho.com/api/accounts/ventas@norwestds.com/messages/send',
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: emailData
      });

      console.log('Zoho API Response:', response.status, response.data);

      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: 'Correo enviado exitosamente',
          responseData: response.data
        })
      };

    } catch (error) {
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      // Si es un error de autenticación
      if (error.response?.status === 401) {
        return {
          statusCode: 401,
          body: JSON.stringify({ 
            error: 'Error de autenticación con Zoho',
            details: 'El token de acceso puede haber expirado'
          })
        };
      }

      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Error al enviar el correo',
          details: error.response?.data || error.message,
          status: error.response?.status
        })
      };
    }
  } catch (error) {
    console.error('Error general:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message
      })
    };
  }
};