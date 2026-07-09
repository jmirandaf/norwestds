/**
 * Scraper — Industriamaquiladora.com
 *
 * Ejecutar localmente:
 *   node scripts/scraper-maquiladoras.js
 *
 * Requires: node-fetch (npm install node-fetch)
 *
 * Output: scripts/maquiladoras.json
 */

import fs from 'fs'

const BASE = 'https://industriamaquiladora.com'
const OUT  = './scripts/maquiladoras.json'
const DELAY_MS = 1200

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; research-bot/1.0)',
      'Accept': 'text/html',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`)
  return res.text()
}

function extractListings(html) {
  const companies = []
  const re = /<a[^>]+href="(\/empresa\/[^"]+)"[^>]*>([^<]+)<\/a>/g
  let m
  while ((m = re.exec(html)) !== null) {
    companies.push({ path: m[1], name: m[2].trim() })
  }
  return companies
}

function extractDetail(html, path) {
  const sector = (html.match(/Sector:\s*<\/[^>]+>\s*([^<]+)/) || [])[1]?.trim()
  const address = (html.match(/Dirección:\s*<\/[^>]+>\s*([^<]+)/) || [])[1]?.trim()
  const employees = (html.match(/Empleados:\s*<\/[^>]+>\s*([\d,]+)/) || [])[1]?.replace(/,/g, '')
  return { sector, address, employees: employees ? parseInt(employees, 10) : null }
}

async function geocode(query) {
  await sleep(1100)
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Baja California, Mexico')}&format=json&limit=1`
  const res = await fetch(url, { headers: { 'User-Agent': 'NorwestDS-Research/1.0 (juanddmiranda@gmail.com)' } })
  const data = await res.json()
  if (!data.length) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}

async function main() {
  const pages = []
  for (let p = 1; p <= 20; p++) {
    try {
      const html = await fetchHtml(`${BASE}/empresas/?page=${p}`)
      const found = extractListings(html)
      if (!found.length) break
      pages.push(...found)
      console.log(`Page ${p}: ${found.length} companies`)
      await sleep(DELAY_MS)
    } catch (e) {
      console.error(`Page ${p} failed:`, e.message)
      break
    }
  }

  console.log(`\nTotal raw: ${pages.length}. Fetching details + geocoding…\n`)

  const results = []
  for (const { path, name } of pages) {
    try {
      const html = await fetchHtml(`${BASE}${path}`)
      const detail = extractDetail(html, path)
      const geo = detail.address ? await geocode(detail.address) : await geocode(name + ' Tijuana')
      results.push({
        name,
        sector: detail.sector || 'No especificado',
        address: detail.address || null,
        employees: detail.employees,
        lat: geo?.lat ?? null,
        lng: geo?.lng ?? null,
        potential: 0,
        status: 'prospecto',
      })
      console.log(`✓ ${name} (${detail.sector}) [${geo ? `${geo.lat},${geo.lng}` : 'sin geo'}]`)
      await sleep(DELAY_MS)
    } catch (e) {
      console.error(`✗ ${name}: ${e.message}`)
    }
  }

  fs.writeFileSync(OUT, JSON.stringify(results, null, 2))
  console.log(`\nGuardado en ${OUT} — ${results.length} empresas`)
}

main().catch(console.error)
