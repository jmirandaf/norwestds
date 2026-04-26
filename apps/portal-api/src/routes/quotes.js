import { Router } from 'express'
import { createClerkClient } from '@clerk/backend'

const router = Router()
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
const DESIGNPRO_URL = (process.env.DESIGNPRO_API_URL || 'http://designpro-api:8788').replace(/\/$/, '')
const WORKER_SECRET = process.env.WORKER_SECRET || ''

async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'Token requerido' })
    const payload = await clerk.verifyToken(token)
    req.userId  = payload.sub
    req.isAdmin = payload.publicMetadata?.role === 'admin'
    next()
  } catch { res.status(401).json({ error: 'Token inválido' }) }
}

async function proxy(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Worker-Secret': WORKER_SECRET },
  }
  if (body) opts.body = JSON.stringify(body)
  const r = await fetch(`${DESIGNPRO_URL}${path}`, opts)
  const data = await r.json().catch(() => ({}))
  return { status: r.status, data }
}

router.use(requireAuth)

// Generate / regenerate quote for a job
router.post('/', async (req, res) => {
  const { status, data } = await proxy('POST', '/designpro/quotes', {
    ...req.body,
    requesterId: req.userId,
  })
  res.status(status).json(data)
})

// List quotes for the authenticated user (admins see all)
router.get('/', async (req, res) => {
  const qs = req.isAdmin
    ? '?admin=true'
    : `?requesterId=${encodeURIComponent(req.userId)}`
  const { status, data } = await proxy('GET', `/designpro/quotes${qs}`)
  res.status(status).json(data)
})

// Get quote by job ID
router.get('/by-job/:jobId', async (req, res) => {
  const { status, data } = await proxy('GET', `/designpro/quotes/by-job/${req.params.jobId}`)
  res.status(status).json(data)
})

// Update status (admin only)
router.patch('/:id/status', async (req, res) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Se requiere rol admin' })
  const { status, data } = await proxy('PATCH', `/designpro/quotes/${req.params.id}/status`, req.body)
  res.status(status).json(data)
})

// Get single quote
router.get('/:id', async (req, res) => {
  const { status, data } = await proxy('GET', `/designpro/quotes/${req.params.id}`)
  res.status(status).json(data)
})

export default router
