const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { name, email, company, message } = JSON.parse(event.body);

    if (!name || !email || !company || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Todos los campos son requeridos' })
      };
    }

    // Variables declaradas ANTES de usarlas
    const mailFrom    = process.env.ZOHO_MAIL_FROM    || process.env.VITE_ZOHO_MAIL_FROM;
    const mailTo      = process.env.ZOHO_MAIL_TO      || process.env.VITE_ZOHO_MAIL_TO;
    const accessToken = process.env.ZOHO_MAIL_ACCESS_TOKEN || process.env.VITE_ZOHO_MAIL_ACCESS_TOKEN;

    if (!mailFrom || !mailTo || !accessToken) {
      console.error('Missing env vars:', { mailFrom: !!mailFrom, mailTo: !!mailTo, accessToken: !!accessToken });
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error de configuración del servidor' })
      };
    }

    const emailData = {
      fromAddress: mailFrom,
      toAddress: mailTo,
      subject: `Nuevo contacto de ${name} - ${company}`,
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #007DA6;">Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Empresa:</strong> ${company}</p>
          <p><strong>Mensaje:</strong></p>
          <p style="background:#f4f7fb; padding:12px; border-radius:8px;">${message}</p>
          <hr style="border:none; border-top:1px solid #dbe3ee; margin:20px 0;">
          <p style="color:#64748b; font-size:13px;">
            Enviado desde el formulario de contacto de norwestds.com
          </p>
        </div>
      `,
      askReceipt: true,
      mailFormat: 'html',
    };

    const response = await axios({
      method: 'post',
      url: `https://mail.zoho.com/api/accounts/${mailFrom}/messages/send`,
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: emailData,
    });

    console.log('Zoho response:', response.status);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Correo enviado exitosamente' })
    };

  } catch (error) {
    console.error('send-email error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Token de Zoho expirado o inválido' })
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error al enviar el correo',
        details: error.response?.data || error.message,
      })
    };
  }
};
