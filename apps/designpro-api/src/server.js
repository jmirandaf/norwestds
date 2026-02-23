import http from 'node:http'
import { catalogs } from './routes/catalogs.js'
import {
  createJobRoute,
  getJobResultRoute,
  getJobRoute,
  listJobsRoute,
} from './routes/jobs.js'

function json(res, status, body) {
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization',
  })
  res.end(JSON.stringify(body))
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 1_000_000) {
        reject(new Error('Payload too large'))
      }
    })
    req.on('end', () => {
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('Invalid JSON body'))
      }
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

  if (method === 'OPTIONS') {
    return json(res, 204, {})
  }

  if (method === 'GET' && pathname === '/health') {
    return json(res, 200, { ok: true, service: 'designpro-api' })
  }

  if (method === 'GET' && pathname === '/designpro/catalogs') {
    return json(res, 200, catalogs)
  }

  if (method === 'GET' && pathname === '/designpro/jobs') {
    const response = listJobsRoute(Object.fromEntries(url.searchParams.entries()))
    return json(res, response.status, response.body)
  }

  if (method === 'POST' && pathname === '/designpro/jobs') {
    try {
      const body = await parseJsonBody(req)
      const response = createJobRoute(body)
      return json(res, response.status, response.body)
    } catch (error) {
      return json(res, 400, { error: String(error.message || error) })
    }
  }

  const resultMatch = pathname.match(/^\/designpro\/jobs\/([^/]+)\/result$/)
  if (method === 'GET' && resultMatch) {
    const response = getJobResultRoute(resultMatch[1])
    return json(res, response.status, response.body)
  }

  const jobMatch = pathname.match(/^\/designpro\/jobs\/([^/]+)$/)
  if (method === 'GET' && jobMatch) {
    const response = getJobRoute(jobMatch[1])
    return json(res, response.status, response.body)
  }

  return json(res, 404, { error: 'Not Found' })
})

const port = process.env.PORT || 8788
server.listen(port, () => {
  console.log(`designpro-api listening on :${port}`)
})
