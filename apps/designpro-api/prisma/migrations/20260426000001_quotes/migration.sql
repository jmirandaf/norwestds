-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('draft', 'sent', 'accepted', 'rejected');

-- CreateTable material_prices
CREATE TABLE "material_prices" (
    "id"        TEXT             NOT NULL,
    "sku"       TEXT             NOT NULL,
    "name"      TEXT             NOT NULL,
    "category"  TEXT             NOT NULL,
    "unit"      TEXT             NOT NULL DEFAULT 'pza',
    "priceMxn"  DOUBLE PRECISION NOT NULL,
    "active"    BOOLEAN          NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3)     NOT NULL,
    CONSTRAINT "material_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable quotes
CREATE TABLE "quotes" (
    "id"          TEXT             NOT NULL,
    "jobId"       TEXT             NOT NULL,
    "requesterId" TEXT             NOT NULL,
    "status"      "QuoteStatus"    NOT NULL DEFAULT 'draft',
    "items"       JSONB            NOT NULL,
    "subtotal"    DOUBLE PRECISION NOT NULL,
    "tax"         DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total"       DOUBLE PRECISION NOT NULL,
    "notes"       TEXT,
    "createdAt"   TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3)     NOT NULL,
    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex
CREATE UNIQUE INDEX "material_prices_sku_key" ON "material_prices"("sku");
CREATE UNIQUE INDEX "quotes_jobId_key"         ON "quotes"("jobId");

-- CreateIndex
CREATE INDEX "quotes_requesterId_idx" ON "quotes"("requesterId");
