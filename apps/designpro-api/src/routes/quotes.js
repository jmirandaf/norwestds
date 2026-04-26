import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function r2(n) { return Math.round(n * 100) / 100 }

async function buildItems(job, extraMaterials = []) {
  const res  = job.params?.result     || {}
  const dims = job.params?.dimensions || {}

  const { provider, series, totalMeters, profileCount } = res
  if (!provider || !series || totalMeters == null) {
    throw new Error('El job no tiene datos de resultado completos (provider/series/totalMeters)')
  }

  const items = []

  // ── 1. Perfil de aluminio ─────────────────────────────────────────────────
  const spec = await prisma.profileSpec.findUnique({
    where: { providerId_series: { providerId: provider, series: String(series) } },
  })
  if (spec) {
    const meters = r2(totalMeters)
    items.push({
      type: 'profile',
      description: `Perfil ${spec.sizeMm}×${spec.sizeMm} mm Serie ${series} (${provider})`,
      qty: meters, unit: 'm',
      unitPrice: r2(spec.priceMxnM),
      total: r2(meters * spec.priceMxnM),
    })
  }

  // ── 2. Accesorios estimados por número de uniones ─────────────────────────
  // Estimación: joints ≈ profileCount (un conector por pieza en promedio)
  const joints = profileCount || 12

  const accs = await prisma.accessory.findMany({
    where: { providerId: provider, active: true, compatibleSeries: { has: String(series) } },
  })
  const byCategory = {}
  for (const a of accs) { if (!byCategory[a.category]) byCategory[a.category] = a }

  const bracket = byCategory['bracket']
  if (bracket) {
    items.push({
      type: 'accessory', sku: bracket.sku,
      description: bracket.name,
      qty: joints, unit: 'pza',
      unitPrice: r2(bracket.priceMxn),
      total: r2(joints * bracket.priceMxn),
    })

    const tnutQty = joints * (bracket.tNutsRequired ?? 2)
    const tnut = byCategory['t_nut']
    if (tnut) {
      items.push({
        type: 'accessory', sku: tnut.sku,
        description: tnut.name,
        qty: tnutQty, unit: 'pza',
        unitPrice: r2(tnut.priceMxn),
        total: r2(tnutQty * tnut.priceMxn),
      })
    }

    const screwQty = joints * (bracket.screwsRequired ?? 2)
    const screw = byCategory['screw']
    if (screw) {
      items.push({
        type: 'accessory', sku: screw.sku,
        description: screw.name,
        qty: screwQty, unit: 'pza',
        unitPrice: r2(screw.priceMxn),
        total: r2(screwQty * screw.priceMxn),
      })
    }
  }

  const endCap = byCategory['end_cap']
  if (endCap) {
    const capQty = (profileCount || 12) * 2
    items.push({
      type: 'accessory', sku: endCap.sku,
      description: endCap.name,
      qty: capQty, unit: 'pza',
      unitPrice: r2(endCap.priceMxn),
      total: r2(capQty * endCap.priceMxn),
    })
  }

  // ── 3. Materiales adicionales seleccionados por el cliente ────────────────
  for (const { id, qty } of extraMaterials) {
    const mat = await prisma.materialPrice.findUnique({ where: { id } })
    if (!mat || !mat.active) continue
    const q = Math.max(1, Number(qty) || 1)
    items.push({
      type: 'material', sku: mat.sku,
      description: mat.name,
      qty: q, unit: mat.unit,
      unitPrice: r2(mat.priceMxn),
      total: r2(q * mat.priceMxn),
    })
  }

  return items
}

export async function generateQuoteRoute(body) {
  const { jobId, requesterId, extraMaterials = [], notes = '' } = body
  if (!jobId || !requesterId) {
    return { status: 400, body: { error: 'jobId y requesterId son requeridos' } }
  }

  const job = await prisma.designProJob.findUnique({ where: { id: jobId } })
  if (!job)                return { status: 404, body: { error: 'Job no encontrado' } }
  if (job.status !== 'done') return { status: 409, body: { error: 'El job aún no está completado' } }

  let items
  try { items = await buildItems(job, extraMaterials) }
  catch (e) { return { status: 400, body: { error: e.message } } }

  const subtotal = r2(items.reduce((s, i) => s + i.total, 0))
  const tax = 0
  const total = r2(subtotal + tax)

  const quote = await prisma.quote.upsert({
    where:  { jobId },
    update: { requesterId, items, subtotal, tax, total, notes, status: 'draft' },
    create: { jobId, requesterId, items, subtotal, tax, total, notes },
  })
  return { status: 200, body: quote }
}

export async function listQuotesRoute(requesterId, isAdmin = false) {
  const quotes = await prisma.quote.findMany({
    where: isAdmin ? {} : { requesterId },
    orderBy: { createdAt: 'desc' },
  })
  return { status: 200, body: quotes }
}

export async function getQuoteRoute(id) {
  const quote = await prisma.quote.findUnique({ where: { id } })
  if (!quote) return { status: 404, body: { error: 'Cotización no encontrada' } }
  return { status: 200, body: quote }
}

export async function getQuoteByJobRoute(jobId) {
  const quote = await prisma.quote.findUnique({ where: { jobId } })
  if (!quote) return { status: 404, body: { error: 'Sin cotización para este job' } }
  return { status: 200, body: quote }
}

export async function updateQuoteStatusRoute(id, status) {
  const valid = ['draft', 'sent', 'accepted', 'rejected']
  if (!valid.includes(status)) return { status: 400, body: { error: 'Estado inválido' } }
  const quote = await prisma.quote.update({ where: { id }, data: { status } })
  return { status: 200, body: quote }
}
