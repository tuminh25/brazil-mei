-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'ENRICHING', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "venue" TEXT,
    "venueAddress" TEXT,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "price" TEXT,
    "currency" TEXT DEFAULT 'SGD',
    "isFree" BOOLEAN DEFAULT false,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "sourceUrl" TEXT,
    "sourceProvider" TEXT,
    "aiSummary" TEXT,
    "aiSmartTips" JSONB,
    "aiFullExperience" JSONB,
    "aiFaq" JSONB,
    "aiBestFor" TEXT,
    "aiVibe" TEXT,
    "aiDurationHint" TEXT,
    "hotnessScore" INTEGER DEFAULT 0,
    "affiliateSearchKeywords" JSONB,
    "marketingPitch" TEXT,
    "nearbyAttractions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MrtStation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "line" TEXT,

    CONSTRAINT "MrtStation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_slug_idx" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "Event"("category");

-- CreateIndex
CREATE INDEX "Event_hotnessScore_idx" ON "Event"("hotnessScore");

-- CreateIndex
CREATE INDEX "Event_postalCode_idx" ON "Event"("postalCode");

-- CreateIndex
CREATE UNIQUE INDEX "MrtStation_name_key" ON "MrtStation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MrtStation_slug_key" ON "MrtStation"("slug");
