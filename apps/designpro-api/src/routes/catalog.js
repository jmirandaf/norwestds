import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ── Helpers ───────────────────────────────────────────────────────────────────

function ok(body) { return { status: 200, body } }
function created(body) { return { status: 201, body } }
function notFound(msg = 'Not found') { return { status: 404, body: { error: msg } } }
function bad(msg) { return { status: 400, body: { error: msg } } }

// ── Providers ─────────────────────────────────────────────────────────────────

export async function listProvidersRoute() {
  const providers = await prisma.provider.findMany({
    include: {
      profiles:    { where: { active: true }, orderBy: { series: 'asc' } },
      accessories: { where: { active: true }, orderBy: [{ category: 'asc' }, { sku: 'asc' }] },
    },
    orderBy: { id: 'asc' },
  })
  return ok(providers)
}

export async function upsertProviderRoute(body) {
  const { id, name, country } = body
  if (!id || !name) return bad('id and name required')
  const provider = await prisma.provider.upsert({
    where: { id },
    update: { name, country: country ?? 'MX' },
    create: { id, name, country: country ?? 'MX' },
  })
  return ok(provider)
}

export async function toggleProviderRoute(id) {
  const p = await prisma.provider.findUnique({ where: { id } })
  if (!p) return notFound()
  const updated = await prisma.provider.update({
    where: { id },
    data: { active: !p.active },
  })
  return ok(updated)
}

// ── Profile specs ─────────────────────────────────────────────────────────────

export async function createProfileRoute(body) {
  const { providerId, series, sizeMm, weightKgM, grooveWidthMm, grooveDepthMm,
          cornerRadiusMm, wallThicknessMm, priceMxnM, maxLoadNM } = body
  if (!providerId || !series) return bad('providerId and series required')
  try {
    const profile = await prisma.profileSpec.create({
      data: {
        providerId, series: String(series),
        sizeMm:          Number(sizeMm),
        weightKgM:       Number(weightKgM),
        grooveWidthMm:   Number(grooveWidthMm),
        grooveDepthMm:   Number(grooveDepthMm),
        cornerRadiusMm:  Number(cornerRadiusMm),
        wallThicknessMm: Number(wallThicknessMm),
        priceMxnM:       Number(priceMxnM),
        maxLoadNM:       Number(maxLoadNM),
      },
    })
    return created(profile)
  } catch (e) {
    if (e.code === 'P2002') return bad('Profile for this provider+series already exists')
    throw e
  }
}

export async function updateProfileRoute(id, body) {
  const allowed = ['sizeMm','weightKgM','grooveWidthMm','grooveDepthMm',
                   'cornerRadiusMm','wallThicknessMm','priceMxnM','maxLoadNM','active']
  const data = {}
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = key === 'active' ? Boolean(body[key]) : Number(body[key])
  }
  if (!Object.keys(data).length) return bad('No valid fields to update')
  const profile = await prisma.profileSpec.update({ where: { id }, data })
  return ok(profile)
}

// ── Accessories ───────────────────────────────────────────────────────────────

export async function createAccessoryRoute(body) {
  const { providerId, sku, name, category, compatibleSeries, priceMxn,
          tNutsRequired, screwsRequired } = body
  if (!providerId || !sku || !name || !category) return bad('providerId, sku, name, category required')
  try {
    const acc = await prisma.accessory.create({
      data: {
        providerId,
        sku,
        name,
        category,
        compatibleSeries: compatibleSeries ?? [],
        priceMxn:         Number(priceMxn),
        tNutsRequired:    tNutsRequired ? Number(tNutsRequired) : null,
        screwsRequired:   screwsRequired ? Number(screwsRequired) : null,
      },
    })
    return created(acc)
  } catch (e) {
    if (e.code === 'P2002') return bad('SKU already exists')
    throw e
  }
}

export async function updateAccessoryRoute(id, body) {
  const allowed = ['name','category','compatibleSeries','priceMxn',
                   'tNutsRequired','screwsRequired','active']
  const data = {}
  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === 'active')           data[key] = Boolean(body[key])
      else if (key === 'compatibleSeries') data[key] = body[key]
      else                            data[key] = body[key] === null ? null : Number(body[key])
    }
  }
  if (body.name !== undefined)     data.name = body.name
  if (body.category !== undefined) data.category = body.category
  if (!Object.keys(data).length) return bad('No valid fields to update')
  const acc = await prisma.accessory.update({ where: { id }, data })
  return ok(acc)
}
