import axios from 'axios'

const API_BASE = import.meta.env.VITE_DESIGNPRO_API_BASE || 'http://localhost:8788'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
})

export async function fetchDesignProCatalogs() {
  const { data } = await client.get('/designpro/catalogs')
  return data
}

export async function createDesignProJob(payload) {
  const { data } = await client.post('/designpro/jobs', payload)
  return data
}

export async function getDesignProJob(jobId) {
  const { data } = await client.get(`/designpro/jobs/${jobId}`)
  return data
}

export async function getDesignProJobResult(jobId) {
  const { data } = await client.get(`/designpro/jobs/${jobId}/result`)
  return data
}

export async function listDesignProJobs(params = {}) {
  const { data } = await client.get('/designpro/jobs', { params })
  return Array.isArray(data) ? data : []
}
