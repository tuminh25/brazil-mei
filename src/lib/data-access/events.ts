// src/lib/data-access/events.ts
import prisma from "@/lib/prisma";

export type SortOption = "trending" | "upcoming" | "newest";

const DEFAULT_TAKE = 50;

export function normalizeSort(input?: string): SortOption {
  if (input === "upcoming" || input === "newest" || input === "trending") return input;
  return "trending";
}

export async function getEvents(sortBy: SortOption = "trending", take = DEFAULT_TAKE) {
  const orderBy: any = {};

  switch (sortBy) {
    case "trending":
      orderBy.hotnessScore = "desc";
      break;
    case "upcoming":
      orderBy.startDate = "asc";
      break;
    case "newest":
      orderBy.createdAt = "desc";
      break;
  }

  return prisma.event.findMany({
    orderBy,
    take,
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      imageUrl: true,
      startDate: true,
      endDate: true,
      venue: true,
      venueAddress: true,
      price: true,
      isFree: true,
      category: true,
      hotnessScore: true,
      aiVibe: true,
      aiBestFor: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getEventCounts() {
  const [total, trending, free] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { hotnessScore: { gte: 50 } } }),
    prisma.event.count({ where: { isFree: true } }),
  ]);

  return { total, trending, free };
}

export async function getEventsFree() {
  return prisma.event.findMany({
    where: { isFree: true },
    orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
    take: DEFAULT_TAKE,
  });
}

export async function getEventsForFamilies() {
  return prisma.event.findMany({
    where: {
      OR: [
        { category: { in: ["Family", "Kids", "Community"] } },
        { tags: { hasSome: ["family", "kids", "children"] } },
        { name: { contains: "family", mode: "insensitive" } },
        { description: { contains: "family", mode: "insensitive" } },
      ],
    },
    orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
    take: DEFAULT_TAKE,
  });
}

export async function getEventsNearBugis() {
  return prisma.event.findMany({
    where: {
      OR: [
        { venue: { contains: "Bugis", mode: "insensitive" } },
        { venueAddress: { contains: "Bugis", mode: "insensitive" } },
        { venueAddress: { contains: "Victoria", mode: "insensitive" } },
      ],
    },
    orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
    take: DEFAULT_TAKE,
  });
}
