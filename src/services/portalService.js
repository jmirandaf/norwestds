import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

const client = axios.create({
  baseURL: apiBase,
  timeout: 15000,
})

const authHeaders = async (getToken) => {
  if (!getToken) return {}
  const token = await getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchProjects({ role, userId, getToken }) {
  const headers = await authHeaders(getToken)
  const { data } = await client.get('/api/portal/projects', {
    headers,
    params: { role, userId },
  })
  return Array.isArray(data) ? data : []
}

export async function fetchSchedules({ role, userId, getToken }) {
  const headers = await authHeaders(getToken)
  const { data } = await client.get('/api/portal/schedules', {
    headers,
    params: { role, userId },
  })
  return Array.isArray(data) ? data : []
}

export async function createInvite({ payload, getToken }) {
  const headers = await authHeaders(getToken)
  const { data } = await client.post('/api/portal/invites', payload, { headers })
  return data
}

export async function fetchDownloads({ getToken }) {
  const headers = await authHeaders(getToken)
  const { data } = await client.get('/api/portal/downloads', { headers })
  return Array.isArray(data) ? data : []
}

export async function fetchTickets({ getToken }) {
  const headers = await authHeaders(getToken)
  const { data } = await client.get('/api/portal/tickets', { headers })
  return Array.isArray(data) ? data : []
}

export async function createTicket({ payload, getToken }) {
  const headers = await authHeaders(getToken)
  const { data } = await client.post('/api/portal/tickets', payload, { headers })
  return data
}
