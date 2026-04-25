import { appendArtifacts, getJob, updateJob } from '../services/store.js'

const queue = []
let running = false

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function calcMockResult(params = {}) {
  const dims = params.dimensions || {}
  const opts = params.options || {}
  const L = Number(dims.length) || 1200
  const W = Number(dims.width)  || 800
  const H = Number(dims.height) || 900
  const series = opts.profileSeries || '40'
  const load   = opts.loadClass || 'medium'

  const kgPerMeter = series === '45' ? 4.2 : series === '40' ? 3.1 : 2.1
  const loadFactor = load === 'heavy' ? 1.4 : load === 'light' ? 0.7 : 1.0

  const verticals    = Math.ceil((L / 500) + 1) * Math.ceil((W / 500) + 1)
  const horizontalsL = Math.ceil(L / 500) * Math.ceil(H / 400)
  const horizontalsW = Math.ceil(W / 500) * Math.ceil(H / 400)
  const profileCount = Math.round((verticals + horizontalsL + horizontalsW) * loadFactor)
  const totalMeters  = (profileCount * ((L + W + H) / 3) / 1000).toFixed(1)
  const weightKg     = Math.round(totalMeters * kgPerMeter)
  const estimatedCost = Math.round(weightKg * 85 * loadFactor)

  return { profileCount, weightKg: Number(weightKg), totalMeters: Number(totalMeters), estimatedCost }
}

async function processLoop() {
  if (running) return
  running = true

  while (queue.length > 0) {
    const id = queue.shift()

    await updateJob(id, { status: 'processing', startedAt: new Date(), error: null })
    await sleep(1400)

    const job = await getJob(id)
    const mockResult = calcMockResult(job?.params)

    await appendArtifacts(id, [
      { kind: 'bom',    name: 'lista-materiales.json' },
      { kind: 'step',   name: 'modelo-cad.step' },
      { kind: 'pdf',    name: 'hoja-especificaciones.pdf' },
      { kind: 'render', name: 'preview-3d.glb' },
    ])

    await updateJob(id, {
      status: 'done',
      finishedAt: new Date(),
      params: { ...(job?.params || {}), result: mockResult },
    })
  }

  running = false
}

export function enqueueStubJob(id) {
  queue.push(id)
  processLoop().catch(async (error) => {
    console.error('[DesignProStubProcessor]', error)
    try {
      await updateJob(id, {
        status: 'failed',
        error: String(error?.message || error),
        finishedAt: new Date(),
      })
    } catch {}
  })
}
