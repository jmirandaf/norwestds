import http from 'node:http'

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, service: 'designpro-api' }))
    return
  }

  res.writeHead(404, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not Found' }))
})

const port = process.env.PORT || 8788
server.listen(port, () => {
  console.log(`designpro-api listening on :${port}`)
})
