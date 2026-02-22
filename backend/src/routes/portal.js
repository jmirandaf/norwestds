import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { prisma } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.get('/projects', async (req, res) => {
  const { role } = req.user

  const where = role === 'client'
    ? { clientId: req.user.id }
    : role === 'pm'
      ? { pmId: req.user.id }
      : {}

  const projects = await prisma.project.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  res.json(projects)
})

router.get('/schedules', async (req, res) => {
  const { role } = req.user

  const where = role === 'client'
    ? { clientId: req.user.id }
    : role === 'pm'
      ? { pmId: req.user.id }
      : {}

  const schedules = await prisma.schedule.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 150,
  })

  res.json(schedules)
})

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'pm', 'client']),
  clientId: z.string().nullable().optional(),
})

router.post('/invites', requireRole(['admin']), async (req, res) => {
  const parsed = inviteSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const payload = parsed.data
  const token = randomUUID()
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000)

  const invite = await prisma.invite.create({
    data: {
      email: payload.email.toLowerCase().trim(),
      role: payload.role,
      clientId: payload.clientId || null,
      token,
      expiresAt,
    },
  })

  res.status(201).json({
    id: invite.id,
    token: invite.token,
    message: `Invitación creada. Token: ${invite.token} (expira en 72h)`,
  })
})

export default router
