import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import portalRoutes from './routes/portal.js'

const app = express()
const port = Number(process.env.PORT || 8787)

app.use(cors({
  origin: process.env.FRONTEND_URL?.split(',').map((v) => v.trim()) || '*',
  credentials: true,
}))
app.use(express.json())

app.get('/health', (_, res) => res.json({ ok: true }))
app.use('/api/portal', portalRoutes)

app.listen(port, () => {
  console.log(`[norwestds-backend] running on http://localhost:${port}`)
})
