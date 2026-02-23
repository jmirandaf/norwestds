import { prisma } from '../db.js'

export async function listJobs({ status, requesterId, limit = 50 } = {}) {
  const rows = await prisma.designProJob.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(requesterId ? { requesterId } : {}),
    },
    include: { artifacts: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return rows
}

export async function createJob(input) {
  const job = await prisma.designProJob.create({
    data: {
      type: input.type,
      status: 'queued',
      priority: input.priority || 'normal',
      requesterId: input.requesterId,
      source: input.source || 'portal',
      projectId: input.projectId || null,
      projectName: input.projectName || null,
      params: input.params || {},
    },
    include: { artifacts: true },
  })

  return job
}

export async function getJob(id) {
  return prisma.designProJob.findUnique({
    where: { id },
    include: { artifacts: { orderBy: { createdAt: 'asc' } } },
  })
}

export async function updateJob(id, patch) {
  return prisma.designProJob.update({
    where: { id },
    data: patch,
    include: { artifacts: { orderBy: { createdAt: 'asc' } } },
  })
}

export async function appendArtifacts(id, newArtifacts = []) {
  if (!newArtifacts.length) return getJob(id)

  await prisma.designProArtifact.createMany({
    data: newArtifacts.map((a) => ({
      jobId: id,
      kind: a.kind || 'artifact',
      name: a.name || 'artifact',
      url: a.url || null,
    })),
  })

  return getJob(id)
}
