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

export async function fetchDownloads({ getToken, query = {} }) {
  const headers = await authHeaders(getToken)
  const { data } = await client.get('/api/portal/downloads', { headers, params: query })
  return Array.isArray(data) ? data : []
}

export async function createDownload({ payload, getToken }) {
  const headers = await authHeaders(getToken)
  const { data } = await client.post('/api/portal/downloads', payload, { headers })
  return data
}

export async function updateDownload({ id, payload, getToken }) {
  const headers = await authHeaders(getToken)
  const { data } = await client.patch(`/api/portal/downloads/${id}`, payload, { headers })
  return data
}

export async function deleteDownload({ id, getToken }) {
  const headers = await authHeaders(getToken)
  await client.delete(`/api/portal/downloads/${id}`, { headers })
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

export async function updateTicketStatus({ ticketId, status, getToken }) {
  const headers = await authHeaders(getToken)
  const { data } = await client.patch(`/api/portal/tickets/${ticketId}/status`, { status }, { headers })
  return data
}

export async function addTicketComment({ ticketId, body, getToken }) {
  const headers = await authHeaders(getToken)
  const { data } = await client.post(`/api/portal/tickets/${ticketId}/comments`, { body }, { headers })
  return data
}
