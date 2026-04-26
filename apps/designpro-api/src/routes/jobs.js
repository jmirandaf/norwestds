import fs from 'node:fs/promises'
import path from 'node:path'
import { claimNextJob, createArtifact, createJob, getJob, listJobs, updateJob } from '../services/store.js'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

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

// ─── Worker routes ─────────────────────────────────────────────────

export async function workerClaimRoute() {
  const job = await claimNextJob()
  if (!job) return { status: 204, body: null }
  return { status: 200, body: job }
}

export async function workerUploadRoute(id, reqBody) {
  const job = await getJob(id)
  if (!job) return { status: 404, body: { error: 'Job not found' } }
  if (job.status !== 'processing') return { status: 409, body: { error: 'Job is not processing' } }

  const { kind, name, data } = reqBody
  if (!kind || !name || !data) return { status: 400, body: { error: 'kind, name, and data are required' } }

  const safeFilename = `${id}_${name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  await fs.writeFile(path.join(UPLOAD_DIR, safeFilename), Buffer.from(data, 'base64'))

  const artifact = await createArtifact({ jobId: id, kind, name, url: `/files/${safeFilename}` })
  return { status: 201, body: artifact }
}

export async function workerCompleteRoute(id, reqBody) {
  const job = await getJob(id)
  if (!job) return { status: 404, body: { error: 'Job not found' } }
  const updated = await updateJob(id, {
    status: 'done',
    finishedAt: new Date(),
    params: { ...(job.params || {}), result: reqBody.result || {} },
  })
  return { status: 200, body: updated }
}

export async function workerFailRoute(id, reqBody) {
  const job = await getJob(id)
  if (!job) return { status: 404, body: { error: 'Job not found' } }
  const updated = await updateJob(id, {
    status: 'failed',
    error: String(reqBody.error || 'Worker reported failure'),
    finishedAt: new Date(),
  })
  return { status: 200, body: updated }
}
