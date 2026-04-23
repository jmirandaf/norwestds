const { createClient } = require('@supabase/supabase-js');

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/zip',
  'application/octet-stream',
]);

const BUCKET = 'nds-portal';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const supabaseUrl    = process.env.SUPABASE_URL;
  const supabaseKey    = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Supabase no configurado' }) };
  }

  try {
    const { fileBase64, mimeType, fileName } = JSON.parse(event.body);

    if (!fileBase64 || !mimeType || !fileName) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Faltan campos: fileBase64, mimeType, fileName' }) };
    }

    if (!ALLOWED_MIME.has(mimeType)) {
      return { statusCode: 415, body: JSON.stringify({ error: `Tipo no permitido: ${mimeType}` }) };
    }

    const buffer = Buffer.from(fileBase64, 'base64');
    if (buffer.byteLength > MAX_BYTES) {
      return { statusCode: 413, body: JSON.stringify({ error: 'El archivo supera el límite de 10 MB' }) };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `uploads/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, { contentType: mimeType, upsert: false });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return { statusCode: 500, body: JSON.stringify({ error: uploadError.message }) };
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: publicUrl, bytes: buffer.byteLength }),
    };

  } catch (err) {
    console.error('upload-file error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Error interno' }) };
  }
};
