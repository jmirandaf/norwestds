import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function listMaterialsRoute(includeInactive = false) {
  const materials = await prisma.materialPrice.findMany({
    where: includeInactive ? {} : { active: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })
  return { status: 200, body: materials }
}

export async function createMaterialRoute(body) {
  const { sku, name, category, unit, priceMxn } = body
  if (!sku || !name || !category || priceMxn == null) {
    return { status: 400, body: { error: 'sku, name, category y priceMxn son requeridos' } }
  }
  try {
    const m = await prisma.materialPrice.create({
      data: { sku, name, category, unit: unit || 'pza', priceMxn: Number(priceMxn) },
    })
    return { status: 201, body: m }
  } catch (e) {
    if (e.code === 'P2002') return { status: 400, body: { error: 'SKU ya existe' } }
    throw e
  }
}

export async function updateMaterialRoute(id, body) {
  const allowed = ['name', 'category', 'unit', 'priceMxn', 'active']
  const data = {}
  for (const key of allowed) {
    if (body[key] !== undefined) {
      data[key] = key === 'active' ? Boolean(body[key])
                : key === 'priceMxn' ? Number(body[key])
                : body[key]
    }
  }
  if (!Object.keys(data).length) return { status: 400, body: { error: 'Sin campos válidos' } }
  const m = await prisma.materialPrice.update({ where: { id }, data })
  return { status: 200, body: m }
}
