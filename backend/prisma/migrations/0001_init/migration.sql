-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ConflictStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('UN', 'NGO', 'GOVERNMENT', 'MEDIA', 'ACADEMIC', 'OTHER');

-- CreateTable
CREATE TABLE "Conflict" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "status" "ConflictStatus" NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "mainCountriesJson" TEXT NOT NULL,
    "sideAJson" TEXT NOT NULL,
    "sideBJson" TEXT NOT NULL,
    "tagsJson" TEXT NOT NULL,
    "heroLabel" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conflict_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CasualtyRecord" (
    "id" SERIAL NOT NULL,
    "conflictId" INTEGER NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "killedMin" INTEGER,
    "killedMax" INTEGER,
    "killedBest" INTEGER,
    "injuredMin" INTEGER,
    "injuredMax" INTEGER,
    "injuredBest" INTEGER,
    "civilianKilledMin" INTEGER,
    "civilianKilledMax" INTEGER,
    "civilianKilledBest" INTEGER,
    "childKilledMin" INTEGER,
    "childKilledMax" INTEGER,
    "childKilledBest" INTEGER,
    "notes" TEXT,
    "sourceSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CasualtyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" SERIAL NOT NULL,
    "conflictId" INTEGER,
    "sourceType" "SourceType" NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "accessedAt" TIMESTAMP(3),
    "reliabilityScore" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyCounterSnapshot" (
    "id" SERIAL NOT NULL,
    "conflictId" INTEGER NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "displayedKilledTotal" INTEGER NOT NULL,
    "displayedInjuredTotal" INTEGER,
    "dailyIncreaseKilled" INTEGER,
    "dailyIncreaseInjured" INTEGER,
    "smoothingHours" INTEGER NOT NULL DEFAULT 24,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyCounterSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conflict_slug_key" ON "Conflict"("slug");

-- CreateIndex
CREATE INDEX "CasualtyRecord_conflictId_recordDate_idx" ON "CasualtyRecord"("conflictId", "recordDate");

-- CreateIndex
CREATE INDEX "Source_conflictId_idx" ON "Source"("conflictId");

-- CreateIndex
CREATE INDEX "DailyCounterSnapshot_conflictId_snapshotDate_idx" ON "DailyCounterSnapshot"("conflictId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- AddForeignKey
ALTER TABLE "CasualtyRecord" ADD CONSTRAINT "CasualtyRecord_conflictId_fkey" FOREIGN KEY ("conflictId") REFERENCES "Conflict"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_conflictId_fkey" FOREIGN KEY ("conflictId") REFERENCES "Conflict"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyCounterSnapshot" ADD CONSTRAINT "DailyCounterSnapshot_conflictId_fkey" FOREIGN KEY ("conflictId") REFERENCES "Conflict"("id") ON DELETE CASCADE ON UPDATE CASCADE;

