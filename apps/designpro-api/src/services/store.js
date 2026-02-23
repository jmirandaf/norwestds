const jobs = new Map()

const nowIso = () => new Date().toISOString()

export function listJobs({ status, requesterId, limit = 50 } = {}) {
  let rows = [...jobs.values()]

  if (status) rows = rows.filter((j) => j.status === status)
  if (requesterId) rows = rows.filter((j) => j.requesterId === requesterId)

  return rows
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export function createJob(input) {
  const id = `dpj_${Math.random().toString(36).slice(2, 10)}`
  const createdAt = nowIso()

  const job = {
    id,
    type: input.type,
    status: 'queued',
    priority: input.priority || 'normal',
    requesterId: input.requesterId,
    source: input.source || 'portal',
    projectId: input.projectId || null,
    projectName: input.projectName || null,
    params: input.params || {},
    artifacts: [],
    error: null,
    createdAt,
    updatedAt: createdAt,
    startedAt: null,
    finishedAt: null,
  }

  jobs.set(id, job)
  return job
}

export function getJob(id) {
  return jobs.get(id) || null
}

export function updateJob(id, patch) {
  const current = jobs.get(id)
  if (!current) return null

  const updated = {
    ...current,
    ...patch,
    updatedAt: nowIso(),
  }

  jobs.set(id, updated)
  return updated
}

export function appendArtifacts(id, newArtifacts = []) {
  const current = jobs.get(id)
  if (!current) return null

  const artifacts = [...current.artifacts, ...newArtifacts]
  return updateJob(id, { artifacts })
}
