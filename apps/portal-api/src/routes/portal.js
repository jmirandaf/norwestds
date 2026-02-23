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

router.get('/downloads', async (req, res) => {
  const { role } = req.user

  const where = role === 'client'
    ? { clientId: req.user.id }
    : role === 'pm'
      ? { pmId: req.user.id }
      : {}

  const downloads = await prisma.download.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: 200,
  })

  res.json(downloads)
})

router.get('/tickets', async (req, res) => {
  const { role } = req.user
  const where = role === 'admin' ? {} : { requesterId: req.user.id }

  const tickets = await prisma.supportTicket.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  res.json(tickets)
})

router.post('/tickets', async (req, res) => {
  const parsed = ticketSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const ticket = await prisma.supportTicket.create({
    data: {
      subject: parsed.data.subject,
      message: parsed.data.message,
      priority: parsed.data.priority,
      requesterId: req.user.id,
    },
  })

  res.status(201).json(ticket)
})

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'pm', 'client']),
  clientId: z.string().nullable().optional(),
})

const ticketSchema = z.object({
  subject: z.string().min(4),
  message: z.string().min(8),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
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
