import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { prisma } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

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

const ticketStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'closed']),
})

const ticketCommentSchema = z.object({
  body: z.string().min(2),
})

const downloadSchema = z.object({
  projectId: z.string().optional().nullable(),
  projectName: z.string().min(2),
  name: z.string().min(2),
  type: z.string().optional().nullable(),
  category: z.enum(['plano', 'bom', 'manual', 'render', 'otro']).default('otro'),
  size: z.string().optional().nullable(),
  fileUrl: z.string().url().optional().nullable(),
  clientId: z.string().optional().nullable(),
  pmId: z.string().optional().nullable(),
})

const downloadUpdateSchema = downloadSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  { message: 'At least one field is required' }
)

const scopeWhereByRole = (role, userId) => role === 'client'
  ? { clientId: userId }
  : role === 'pm'
    ? { pmId: userId }
    : {}

async function loadTicketOr403(req, res) {
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: req.params.id },
    include: { comments: { orderBy: { createdAt: 'asc' } } },
  })

  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' })
    return null
  }

  if (req.user.role !== 'admin' && ticket.requesterId !== req.user.id) {
    res.status(403).json({ error: 'Forbidden' })
    return null
  }

  return ticket
}

async function loadDownloadOr403(req, res) {
  const download = await prisma.download.findUnique({ where: { id: req.params.id } })

  if (!download) {
    res.status(404).json({ error: 'Download not found' })
    return null
  }

  if (req.user.role === 'pm' && download.pmId && download.pmId !== req.user.id) {
    res.status(403).json({ error: 'Forbidden' })
    return null
  }

  return download
}

router.get('/projects', async (req, res) => {
  const projects = await prisma.project.findMany({
    where: scopeWhereByRole(req.user.role, req.user.id),
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  res.json(projects)
})

router.get('/schedules', async (req, res) => {
  const schedules = await prisma.schedule.findMany({
    where: scopeWhereByRole(req.user.role, req.user.id),
    orderBy: { createdAt: 'desc' },
    take: 150,
  })
  res.json(schedules)
})

router.get('/downloads', async (req, res) => {
  const q = String(req.query.q || '').trim()
  const project = String(req.query.project || '').trim()
  const type = String(req.query.type || '').trim()
  const category = String(req.query.category || '').trim()
  const sort = String(req.query.sort || 'date_desc')

  const where = {
    ...scopeWhereByRole(req.user.role, req.user.id),
    ...(project ? { projectName: project } : {}),
    ...(type ? { type: { equals: type, mode: 'insensitive' } } : {}),
    ...(category ? { category } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { projectName: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const orderBy = sort === 'name_asc'
    ? { name: 'asc' }
    : sort === 'name_desc'
      ? { name: 'desc' }
      : sort === 'date_asc'
        ? { updatedAt: 'asc' }
        : { updatedAt: 'desc' }

  const downloads = await prisma.download.findMany({
    where,
    orderBy,
    take: 300,
  })

  res.json(downloads)
})

router.post('/downloads', requireRole(['admin', 'pm']), async (req, res) => {
  const parsed = downloadSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const payload = parsed.data
  const created = await prisma.download.create({
    data: {
      projectId: payload.projectId || null,
      projectName: payload.projectName,
      name: payload.name,
      type: payload.type || null,
      category: payload.category,
      size: payload.size || null,
      fileUrl: payload.fileUrl || null,
      clientId: payload.clientId || null,
      pmId: req.user.role === 'pm' ? req.user.id : (payload.pmId || null),
    },
  })

  res.status(201).json(created)
})

router.patch('/downloads/:id', requireRole(['admin', 'pm']), async (req, res) => {
  const parsed = downloadUpdateSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const current = await loadDownloadOr403(req, res)
  if (!current) return

  const payload = parsed.data
  const updated = await prisma.download.update({
    where: { id: current.id },
    data: {
      ...(payload.projectId !== undefined ? { projectId: payload.projectId || null } : {}),
      ...(payload.projectName !== undefined ? { projectName: payload.projectName } : {}),
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.type !== undefined ? { type: payload.type || null } : {}),
      ...(payload.category !== undefined ? { category: payload.category } : {}),
      ...(payload.size !== undefined ? { size: payload.size || null } : {}),
      ...(payload.fileUrl !== undefined ? { fileUrl: payload.fileUrl || null } : {}),
      ...(payload.clientId !== undefined ? { clientId: payload.clientId || null } : {}),
      ...(req.user.role === 'admin' && payload.pmId !== undefined ? { pmId: payload.pmId || null } : {}),
    },
  })

  res.json(updated)
})

router.delete('/downloads/:id', requireRole(['admin', 'pm']), async (req, res) => {
  const current = await loadDownloadOr403(req, res)
  if (!current) return

  await prisma.download.delete({ where: { id: current.id } })
  res.status(204).send()
})

router.get('/tickets', async (req, res) => {
  const where = req.user.role === 'admin' ? {} : { requesterId: req.user.id }
  const tickets = await prisma.supportTicket.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { comments: { orderBy: { createdAt: 'asc' } } },
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
    include: { comments: true },
  })

  res.status(201).json(ticket)
})

router.get('/tickets/:id', async (req, res) => {
  const ticket = await loadTicketOr403(req, res)
  if (!ticket) return
  res.json(ticket)
})

router.patch('/tickets/:id/status', requireRole(['admin', 'pm']), async (req, res) => {
  const parsed = ticketStatusSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const ticket = await prisma.supportTicket.findUnique({ where: { id: req.params.id } })
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' })

  const updated = await prisma.supportTicket.update({
    where: { id: ticket.id },
    data: { status: parsed.data.status },
    include: { comments: { orderBy: { createdAt: 'asc' } } },
  })

  res.json(updated)
})

router.post('/tickets/:id/comments', async (req, res) => {
  const parsed = ticketCommentSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

  const ticket = await loadTicketOr403(req, res)
  if (!ticket) return

  await prisma.ticketComment.create({
    data: {
      ticketId: ticket.id,
      body: parsed.data.body,
      authorId: req.user.id,
      author: req.user.displayName || req.user.email,
    },
  })

  const reloaded = await prisma.supportTicket.findUnique({
    where: { id: ticket.id },
    include: { comments: { orderBy: { createdAt: 'asc' } } },
  })

  res.status(201).json(reloaded)
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
