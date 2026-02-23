import { enqueueStubJob } from '../jobs/stubProcessor.js'
import { createJob, getJob, listJobs } from '../services/store.js'

const ALLOWED_TYPES = new Set(['structure_generate', 'structure_validate', 'estimate_preview'])
const ALLOWED_PRIORITIES = new Set(['low', 'normal', 'high'])

export function parseCreateJobPayload(body = {}) {
  const type = String(body.type || '').trim()
  if (!ALLOWED_TYPES.has(type)) {
    return { error: 'Invalid type. Allowed: structure_generate, structure_validate, estimate_preview' }
  }

  const priority = body.priority ? String(body.priority).trim() : 'normal'
  if (!ALLOWED_PRIORITIES.has(priority)) {
    return { error: 'Invalid priority. Allowed: low, normal, high' }
  }

  const requesterId = String(body.requesterId || '').trim()
  if (!requesterId) {
    return { error: 'requesterId is required' }
  }

  return {
    value: {
      type,
      priority,
      requesterId,
      source: body.source || 'portal',
      projectId: body.projectId || null,
      projectName: body.projectName || null,
      params: typeof body.params === 'object' && body.params !== null ? body.params : {},
    },
  }
}

export async function createJobRoute(reqBody) {
  const parsed = parseCreateJobPayload(reqBody)
  if (parsed.error) return { status: 400, body: { error: parsed.error } }

  const job = await createJob(parsed.value)
  enqueueStubJob(job.id)
  return { status: 201, body: job }
}

export async function listJobsRoute(query = {}) {
  const limit = Number(query.limit || 50)
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 200) : 50

  const rows = await listJobs({
    status: query.status ? String(query.status) : undefined,
    requesterId: query.requesterId ? String(query.requesterId) : undefined,
    limit: safeLimit,
  })

  return { status: 200, body: rows }
}

export async function getJobRoute(id) {
  const job = await getJob(id)
  if (!job) return { status: 404, body: { error: 'Job not found' } }

  return { status: 200, body: job }
}

export async function getJobResultRoute(id) {
  const job = await getJob(id)
  if (!job) return { status: 404, body: { error: 'Job not found' } }
  if (job.status !== 'done') {
    return { status: 409, body: { error: 'Job not completed', status: job.status } }
  }

  return {
    status: 200,
    body: {
      jobId: job.id,
      artifacts: job.artifacts,
      generatedAt: job.finishedAt,
    },
  }
}
