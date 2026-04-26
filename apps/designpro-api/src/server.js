import fs from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { catalogs } from './routes/catalogs.js'
import {
  createJobRoute,
  getJobResultRoute,
  getJobRoute,
  listJobsRoute,
  workerClaimRoute,
  workerCompleteRoute,
  workerFailRoute,
  workerUploadRoute,
} from './routes/jobs.js'
import {
  listProvidersRoute,
  upsertProviderRoute,
  toggleProviderRoute,
  createProfileRoute,
  updateProfileRoute,
  createAccessoryRoute,
  updateAccessoryRoute,
} from './routes/catalog.js'
import {
  listMaterialsRoute,
  createMaterialRoute,
  updateMaterialRoute,
} from './routes/materials.js'
import {
  generateQuoteRoute,
  listQuotesRoute,
  getQuoteRoute,
  getQuoteByJobRoute,
  updateQuoteStatusRoute,
} from './routes/quotes.js'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
const WORKER_SECRET = process.env.WORKER_SECRET || ''

function isWorkerAuth(req) {
  if (!WORKER_SECRET) return true
  return req.headers['x-worker-secret'] === WORKER_SECRET
}

function json(res, status, body) {
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization, X-Worker-Secret',
  })
  res.end(JSON.stringify(body))
}

function parseJsonBody(req, maxBytes = 1_000_000) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > maxBytes) reject(new Error('Payload too large'))
    })
    req.on('end', () => {
      if (!raw) return resolve({})
      try { resolve(JSON.parse(raw)) }
      catch { reject(new Error('Invalid JSON body')) }
    })
    req.on('error', reject)
  })
}

function parseUrl(req) {
  const host = req.headers.host || 'localhost'
  return new URL(req.url || '/', `http://${host}`)
}

const server = http.createServer(async (req, res) => {
  const method = req.method || 'GET'
  const url = parseUrl(req)
  const pathname = url.pathname

  if (method === 'OPTIONS') return json(res, 204, {})

  if (method === 'GET' && pathname === '/health') {
    return json(res, 200, { ok: true, service: 'designpro-api' })
  }

  if (method === 'GET' && pathname === '/designpro/catalogs') {
    return json(res, 200, catalogs)
  }

  // ── Catalog CRUD (worker-auth protected for writes) ───────────────

  if (method === 'GET' && pathname === '/designpro/catalog/providers') {
    const response = await listProvidersRoute()
    return json(res, response.status, response.body)
  }

  if (method === 'POST' && pathname === '/designpro/catalog/providers') {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const body = await parseJsonBody(req)
    return json(res, ...(r => [r.status, r.body])(await upsertProviderRoute(body)))
  }

  const providerToggle = pathname.match(/^\/designpro\/catalog\/providers\/([^/]+)\/toggle$/)
  if (method === 'POST' && providerToggle) {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const r = await toggleProviderRoute(providerToggle[1])
    return json(res, r.status, r.body)
  }

  if (method === 'POST' && pathname === '/designpro/catalog/profiles') {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const body = await parseJsonBody(req)
    const r = await createProfileRoute(body)
    return json(res, r.status, r.body)
  }

  const profileMatch = pathname.match(/^\/designpro\/catalog\/profiles\/([^/]+)$/)
  if (method === 'PATCH' && profileMatch) {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const body = await parseJsonBody(req)
    const r = await updateProfileRoute(profileMatch[1], body)
    return json(res, r.status, r.body)
  }

  if (method === 'POST' && pathname === '/designpro/catalog/accessories') {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const body = await parseJsonBody(req)
    const r = await createAccessoryRoute(body)
    return json(res, r.status, r.body)
  }

  const accMatch = pathname.match(/^\/designpro\/catalog\/accessories\/([^/]+)$/)
  if (method === 'PATCH' && accMatch) {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const body = await parseJsonBody(req)
    const r = await updateAccessoryRoute(accMatch[1], body)
    return json(res, r.status, r.body)
  }

  // ── Material prices ──────────────────────────────────────────────

  if (method === 'GET' && pathname === '/designpro/materials') {
    const all = url.searchParams.get('all') === 'true'
    const r = await listMaterialsRoute(all && isWorkerAuth(req))
    return json(res, r.status, r.body)
  }

  if (method === 'POST' && pathname === '/designpro/materials') {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const body = await parseJsonBody(req)
    const r = await createMaterialRoute(body)
    return json(res, r.status, r.body)
  }

  const matMatch = pathname.match(/^\/designpro\/materials\/([^/]+)$/)
  if (method === 'PATCH' && matMatch) {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const body = await parseJsonBody(req)
    const r = await updateMaterialRoute(matMatch[1], body)
    return json(res, r.status, r.body)
  }

  // ── Quotes ────────────────────────────────────────────────────────

  if (method === 'POST' && pathname === '/designpro/quotes') {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const body = await parseJsonBody(req)
    const r = await generateQuoteRoute(body)
    return json(res, r.status, r.body)
  }

  if (method === 'GET' && pathname === '/designpro/quotes') {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const requesterId = url.searchParams.get('requesterId') || ''
    const isAdmin = url.searchParams.get('admin') === 'true'
    const r = await listQuotesRoute(requesterId, isAdmin)
    return json(res, r.status, r.body)
  }

  const quoteJobMatch = pathname.match(/^\/designpro\/quotes\/by-job\/([^/]+)$/)
  if (method === 'GET' && quoteJobMatch) {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const r = await getQuoteByJobRoute(quoteJobMatch[1])
    return json(res, r.status, r.body)
  }

  const quoteStatusMatch = pathname.match(/^\/designpro\/quotes\/([^/]+)\/status$/)
  if (method === 'PATCH' && quoteStatusMatch) {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const body = await parseJsonBody(req)
    const r = await updateQuoteStatusRoute(quoteStatusMatch[1], body.status)
    return json(res, r.status, r.body)
  }

  const quoteMatch = pathname.match(/^\/designpro\/quotes\/([^/]+)$/)
  if (method === 'GET' && quoteMatch) {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const r = await getQuoteRoute(quoteMatch[1])
    return json(res, r.status, r.body)
  }

  // ── Jobs ─────────────────────────────────────────────────────────

  if (method === 'GET' && pathname === '/designpro/jobs') {
    const response = await listJobsRoute(Object.fromEntries(url.searchParams.entries()))
    return json(res, response.status, response.body)
  }

  if (method === 'POST' && pathname === '/designpro/jobs') {
    try {
      const body = await parseJsonBody(req)
      const response = await createJobRoute(body)
      return json(res, response.status, response.body)
    } catch (error) {
      return json(res, 400, { error: String(error.message || error) })
    }
  }

  const resultMatch = pathname.match(/^\/designpro\/jobs\/([^/]+)\/result$/)
  if (method === 'GET' && resultMatch) {
    const response = await getJobResultRoute(resultMatch[1])
    return json(res, response.status, response.body)
  }

  // ── Worker endpoints ─────────────────────────────────────────────

  if (method === 'GET' && pathname === '/designpro/jobs/next') {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    const response = await workerClaimRoute()
    if (response.status === 204) {
      res.writeHead(204, { 'access-control-allow-origin': '*' })
      return res.end()
    }
    return json(res, response.status, response.body)
  }

  const uploadMatch = pathname.match(/^\/designpro\/jobs\/([^/]+)\/upload$/)
  if (method === 'POST' && uploadMatch) {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    try {
      const body = await parseJsonBody(req, 50_000_000)
      const response = await workerUploadRoute(uploadMatch[1], body)
      return json(res, response.status, response.body)
    } catch (error) {
      return json(res, 400, { error: String(error.message || error) })
    }
  }

  const completeMatch = pathname.match(/^\/designpro\/jobs\/([^/]+)\/complete$/)
  if (method === 'POST' && completeMatch) {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    try {
      const body = await parseJsonBody(req)
      const response = await workerCompleteRoute(completeMatch[1], body)
      return json(res, response.status, response.body)
    } catch (error) {
      return json(res, 400, { error: String(error.message || error) })
    }
  }

  const failMatch = pathname.match(/^\/designpro\/jobs\/([^/]+)\/fail$/)
  if (method === 'POST' && failMatch) {
    if (!isWorkerAuth(req)) return json(res, 401, { error: 'Unauthorized' })
    try {
      const body = await parseJsonBody(req)
      const response = await workerFailRoute(failMatch[1], body)
      return json(res, response.status, response.body)
    } catch (error) {
      return json(res, 400, { error: String(error.message || error) })
    }
  }

  const jobMatch = pathname.match(/^\/designpro\/jobs\/([^/]+)$/)
  if (method === 'GET' && jobMatch) {
    const response = await getJobRoute(jobMatch[1])
    return json(res, response.status, response.body)
  }

  // ── Static files ─────────────────────────────────────────────────

  const fileMatch = pathname.match(/^\/files\/([^/]+)$/)
  if (method === 'GET' && fileMatch) {
    const filename = decodeURIComponent(fileMatch[1])
    if (filename.includes('..') || /[/\\]/.test(filename)) {
      return json(res, 400, { error: 'Invalid filename' })
    }
    try {
      const data = await fs.readFile(path.join(UPLOAD_DIR, filename))
      const ext = path.extname(filename).toLowerCase()
      const contentType = {
        '.json': 'application/json',
        '.step': 'application/octet-stream',
        '.stp':  'application/octet-stream',
        '.glb':  'model/gltf-binary',
        '.gltf': 'model/gltf+json',
        '.pdf':  'application/pdf',
        '.png':  'image/png',
        '.jpg':  'image/jpeg',
      }[ext] || 'application/octet-stream'
      res.writeHead(200, {
        'content-type': contentType,
        'content-length': data.length,
        'access-control-allow-origin': '*',
        'cache-control': 'public, max-age=86400',
      })
      return res.end(data)
    } catch {
      return json(res, 404, { error: 'File not found' })
    }
  }

  return json(res, 404, { error: 'Not Found' })
})

const port = process.env.PORT || 8788
server.listen(port, () => {
  console.log(`designpro-api listening on :${port}`)
})
