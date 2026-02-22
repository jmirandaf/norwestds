import axios from 'axios'

const API_BASE = import.meta.env.VITE_DESIGNPRO_API_BASE || 'http://localhost:8787'

export async function generateDesignPro(payload) {
  const { data } = await axios.post(`${API_BASE}/generate`, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 120000,
  })
  return data
}
