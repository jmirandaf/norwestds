import { appendArtifacts, updateJob } from '../services/store.js'

const queue = []
let running = false

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function processLoop() {
  if (running) return
  running = true

  while (queue.length > 0) {
    const id = queue.shift()

    await updateJob(id, {
      status: 'processing',
      startedAt: new Date(),
      error: null,
    })

    await sleep(1200)

    await appendArtifacts(id, [
      {
        kind: 'report',
        name: 'job-summary.json',
        url: null,
      },
    ])

    await updateJob(id, {
      status: 'done',
      finishedAt: new Date(),
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
