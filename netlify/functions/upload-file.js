const { v2: cloudinary } = require('cloudinary');

// Max 10 MB
const MAX_BYTES = 10 * 1024 * 1024;

// File types accepted
const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/vnd.ms-excel',                                          // xls
  'application/zip',
  'application/octet-stream',
]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const missingConfig = !process.env.CLOUDINARY_CLOUD_NAME ||
                        !process.env.CLOUDINARY_API_KEY ||
                        !process.env.CLOUDINARY_API_SECRET;
  if (missingConfig) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Cloudinary no configurado' }) };
  }

  try {
    const body = JSON.parse(event.body);
    const { fileBase64, mimeType, fileName } = body;

    if (!fileBase64 || !mimeType || !fileName) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan campos: fileBase64, mimeType, fileName' }) };
    }

    if (!ALLOWED_MIME.has(mimeType)) {
      return { statusCode: 415, body: JSON.stringify({ error: `Tipo de archivo no permitido: ${mimeType}` }) };
    }

    const buffer = Buffer.from(fileBase64, 'base64');
    if (buffer.byteLength > MAX_BYTES) {
      return { statusCode: 413, body: JSON.stringify({ error: 'El archivo supera el límite de 10 MB' }) };
    }

    const dataUri = `data:${mimeType};base64,${fileBase64}`;
    const publicId = `nds-portal/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      resource_type: 'auto',
      use_filename: false,
      overwrite: false,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: result.secure_url,
        publicId: result.public_id,
        bytes: result.bytes,
        format: result.format,
      }),
    };
  } catch (err) {
    console.error('upload-file error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Error al subir el archivo' }) };
  }
};
