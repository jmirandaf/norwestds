-- CreateEnum
CREATE TYPE "DesignProJobStatus" AS ENUM ('queued', 'processing', 'done', 'failed');

-- CreateEnum
CREATE TYPE "DesignProJobPriority" AS ENUM ('low', 'normal', 'high');

-- CreateTable
CREATE TABLE "DesignProJob" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "DesignProJobStatus" NOT NULL DEFAULT 'queued',
    "priority" "DesignProJobPriority" NOT NULL DEFAULT 'normal',
    "requesterId" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'portal',
    "projectId" TEXT,
    "projectName" TEXT,
    "params" JSONB,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignProJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignProArtifact" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignProArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DesignProJob_status_idx" ON "DesignProJob"("status");

-- CreateIndex
CREATE INDEX "DesignProJob_requesterId_idx" ON "DesignProJob"("requesterId");

-- CreateIndex
CREATE INDEX "DesignProJob_createdAt_idx" ON "DesignProJob"("createdAt");

-- CreateIndex
CREATE INDEX "DesignProArtifact_jobId_idx" ON "DesignProArtifact"("jobId");

-- AddForeignKey
ALTER TABLE "DesignProArtifact" ADD CONSTRAINT "DesignProArtifact_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "DesignProJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
