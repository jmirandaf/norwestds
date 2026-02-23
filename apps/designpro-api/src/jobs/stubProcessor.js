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

    updateJob(id, {
      status: 'processing',
      startedAt: new Date().toISOString(),
      error: null,
    })

    await sleep(1200)

    appendArtifacts(id, [
      {
        id: `art_${Math.random().toString(36).slice(2, 10)}`,
        kind: 'report',
        name: 'job-summary.json',
        url: null,
        createdAt: new Date().toISOString(),
      },
    ])

    updateJob(id, {
      status: 'done',
      finishedAt: new Date().toISOString(),
    })
  }

  running = false
}

export function enqueueStubJob(id) {
  queue.push(id)
  processLoop().catch((error) => {
    console.error('[DesignProStubProcessor]', error)
    updateJob(id, {
      status: 'failed',
      error: String(error?.message || error),
      finishedAt: new Date().toISOString(),
    })
  })
}
