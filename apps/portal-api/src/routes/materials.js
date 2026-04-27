import { Router } from 'express'
import { createClerkClient } from '@clerk/backend'

const router = Router()
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
const DESIGNPRO_URL = (process.env.DESIGNPRO_API_URL || 'http://designpro-api:8788').replace(/\/$/, '')
const WORKER_SECRET = process.env.WORKER_SECRET || ''

async function requireAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'Token requerido' })
    const payload = await clerk.verifyToken(token)
    if (payload.publicMetadata?.role !== 'admin') {
      return res.status(403).json({ error: 'Se requiere rol admin' })
    }
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

// Public — list active materials
router.get('/', async (req, res) => {
  const { status, data } = await proxy('GET', '/designpro/materials')
  res.status(status).json(data)
})

// Admin writes
router.use(requireAdmin)

router.post('/', async (req, res) => {
  const { status, data } = await proxy('POST', '/designpro/materials', req.body)
  res.status(status).json(data)
})

router.patch('/:id', async (req, res) => {
  const { status, data } = await proxy('PATCH', `/designpro/materials/${req.params.id}`, req.body)
  res.status(status).json(data)
})

export default router
