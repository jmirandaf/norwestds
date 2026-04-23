export async function uploadFile(file) {
  if (!file) throw new Error('No file provided')

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const base64 = reader.result.split(',')[1]
        const res = await fetch('/.netlify/functions/upload-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64,
            mimeType: file.type,
            fileName: file.name,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error al subir archivo')
        resolve(data) // { url, publicId, bytes, format }
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsDataURL(file)
  })
}
