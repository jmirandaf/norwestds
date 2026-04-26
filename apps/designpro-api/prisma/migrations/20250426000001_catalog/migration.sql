-- CreateTable providers
CREATE TABLE "providers" (
    "id"      TEXT    NOT NULL,
    "name"    TEXT    NOT NULL,
    "country" TEXT    NOT NULL DEFAULT 'MX',
    "active"  BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable profile_specs
CREATE TABLE "profile_specs" (
    "id"              TEXT             NOT NULL,
    "providerId"      TEXT             NOT NULL,
    "series"          TEXT             NOT NULL,
    "sizeMm"          DOUBLE PRECISION NOT NULL,
    "weightKgM"       DOUBLE PRECISION NOT NULL,
    "grooveWidthMm"   DOUBLE PRECISION NOT NULL,
    "grooveDepthMm"   DOUBLE PRECISION NOT NULL,
    "cornerRadiusMm"  DOUBLE PRECISION NOT NULL,
    "wallThicknessMm" DOUBLE PRECISION NOT NULL,
    "priceMxnM"       DOUBLE PRECISION NOT NULL,
    "maxLoadNM"       DOUBLE PRECISION NOT NULL,
    "active"          BOOLEAN          NOT NULL DEFAULT true,
    "updatedAt"       TIMESTAMP(3)     NOT NULL,
    CONSTRAINT "profile_specs_pkey" PRIMARY KEY ("id")
);

-- CreateTable accessories
CREATE TABLE "accessories" (
    "id"               TEXT             NOT NULL,
    "providerId"       TEXT             NOT NULL,
    "sku"              TEXT             NOT NULL,
    "name"             TEXT             NOT NULL,
    "category"         TEXT             NOT NULL,
    "compatibleSeries" TEXT[]           NOT NULL DEFAULT ARRAY[]::TEXT[],
    "priceMxn"         DOUBLE PRECISION NOT NULL,
    "tNutsRequired"    INTEGER,
    "screwsRequired"   INTEGER,
    "active"           BOOLEAN          NOT NULL DEFAULT true,
    "updatedAt"        TIMESTAMP(3)     NOT NULL,
    CONSTRAINT "accessories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "profile_specs" ADD CONSTRAINT "profile_specs_providerId_fkey"
    FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessories" ADD CONSTRAINT "accessories_providerId_fkey"
    FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateUniqueIndex
CREATE UNIQUE INDEX "profile_specs_providerId_series_key" ON "profile_specs"("providerId", "series");
CREATE UNIQUE INDEX "accessories_sku_key" ON "accessories"("sku");

-- CreateIndex
CREATE INDEX "accessories_providerId_idx" ON "accessories"("providerId");
