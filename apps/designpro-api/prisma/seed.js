import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const prisma = new PrismaClient()
const __dir = dirname(fileURLToPath(import.meta.url))

async function main() {
  // In Docker: /app/data/profiles.json (copied from worker data)
  // In dev: ../../designpro-worker/data/profiles.json
  const candidates = [
    join(__dir, '../data/profiles.json'),
    join(__dir, '../../designpro-worker/data/profiles.json'),
  ]
  const dataPath = candidates.find(p => { try { readFileSync(p); return true } catch { return false } })
  if (!dataPath) throw new Error('profiles.json not found')
  const raw = readFileSync(dataPath, 'utf8')
  const { providers } = JSON.parse(raw)

  for (const [id, data] of Object.entries(providers)) {
    await prisma.provider.upsert({
      where: { id },
      update: { name: data.name, country: data.country },
      create: { id, name: data.name, country: data.country },
    })

    for (const [series, spec] of Object.entries(data.series)) {
      await prisma.profileSpec.upsert({
        where: { providerId_series: { providerId: id, series } },
        update: {
          sizeMm:          spec.size_mm,
          weightKgM:       spec.weight_kg_m,
          grooveWidthMm:   spec.groove_width_mm,
          grooveDepthMm:   spec.groove_depth_mm,
          cornerRadiusMm:  spec.corner_radius_mm,
          wallThicknessMm: spec.wall_thickness_mm,
          priceMxnM:       spec.price_mxn_m,
          maxLoadNM:       spec.max_load_n_m,
        },
        create: {
          providerId:      id,
          series,
          sizeMm:          spec.size_mm,
          weightKgM:       spec.weight_kg_m,
          grooveWidthMm:   spec.groove_width_mm,
          grooveDepthMm:   spec.groove_depth_mm,
          cornerRadiusMm:  spec.corner_radius_mm,
          wallThicknessMm: spec.wall_thickness_mm,
          priceMxnM:       spec.price_mxn_m,
          maxLoadNM:       spec.max_load_n_m,
        },
      })
    }

    const CATEGORY_MAP = {
      bracket_inner_90: 'bracket',
      bracket_outer_90: 'bracket',
      bracket_double:   'bracket',
      t_nut_m6:         't_nut',
      t_nut_m8:         't_nut',
      screw_m6x12:      'screw',
      screw_m8x16:      'screw',
      end_cap:          'end_cap',
    }

    for (const [key, acc] of Object.entries(data.accessories)) {
      const sku = acc.sku
      await prisma.accessory.upsert({
        where: { sku },
        update: {
          name:             acc.name,
          category:         CATEGORY_MAP[key] ?? key,
          compatibleSeries: acc.compatible_series,
          priceMxn:         acc.price_mxn,
          tNutsRequired:    acc.t_nuts_required ?? null,
          screwsRequired:   acc.screws_required ?? null,
        },
        create: {
          providerId:       id,
          sku,
          name:             acc.name,
          category:         CATEGORY_MAP[key] ?? key,
          compatibleSeries: acc.compatible_series,
          priceMxn:         acc.price_mxn,
          tNutsRequired:    acc.t_nuts_required ?? null,
          screwsRequired:   acc.screws_required ?? null,
        },
      })
    }
  }

  console.log('Catalog seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
