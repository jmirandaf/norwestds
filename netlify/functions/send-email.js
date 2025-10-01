const fetch = require('node-fetch');

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
      data: [{
        from: {
          address: process.env.ZOHO_MAIL_FROM,
          name: "Norwest DS Formulario"
        },
        to: [{
          address: process.env.ZOHO_MAIL_TO,
          name: "Ventas Norwest"
        }],
        subject: `Nuevo contacto de ${name} - ${company}`,
        textBody: `
Nuevo mensaje de contacto:

Nombre: ${name}
Email: ${email}
Empresa: ${company}

Mensaje:
${message}

---
Este mensaje fue enviado desde el formulario de contacto de norwestds.com
        `,
        htmlBody: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Empresa:</strong> ${company}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
          <hr>
          <p><em>Este mensaje fue enviado desde el formulario de contacto de norwestds.com</em></p>
        `
      }]
    };

    // Enviar el correo usando la API de Zoho
    const response = await fetch(
      'https://mail.zoho.com/api/v1/accounts/' + process.env.ZOHO_MAIL_FROM + '/messages',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ZOHO_MAIL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Correo enviado exitosamente' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al enviar el correo' })
    };
  }
};