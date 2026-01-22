import prisma from "../src/lib/prisma";

function looksFree(text: string) {
  const t = text.toLowerCase();
  return (
    t.includes("free") ||
    t.includes("no admission fee") ||
    t.includes("no entry fee") ||
    t.includes("complimentary") ||
    t.includes("free entry") ||
    t.includes("free admission") ||
    t.includes("sgd 0") ||
    t.includes("$0") ||
    t.includes("0 sgd")
  );
}

function parseMinPriceSGD(price: string): number | null {
  const t = price.toLowerCase();

  if (looksFree(t)) return 0;

  // try to extract numbers like "40.91", "12", "$12", "SGD 20", "From 15"
  const m = t.match(/(\d+(\.\d+)?)/);
  if (!m) return null;

  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Heuristic hotness:
 * - base from recency (newly created gets more)
 * - closer upcoming startDate gets more
 * - has image/venue gets more
 * - free gets a small boost
 * Produces 0..100
 */
function computeHotnessScore(e: {
  createdAt: Date;
  startDate: Date | null;
  imageUrl: string | null;
  venue: string | null;
  isFree: boolean | null;
}) {
  const now = Date.now();

  // recency: 0..35
  const ageDays = (now - e.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const recency = clamp(35 - ageDays * 2, 0, 35);

  // upcoming proximity: 0..40
  let upcoming = 0;
  if (e.startDate) {
    const deltaDays = (e.startDate.getTime() - now) / (1000 * 60 * 60 * 24);
    // events in next 0..14 days get high score
    upcoming = clamp(40 - Math.abs(deltaDays) * 2.5, 0, 40);
  }

  // completeness: 0..20
  const completeness =
    (e.imageUrl ? 10 : 0) +
    (e.venue ? 10 : 0);

  // free boost: 0..5
  const freeBoost = e.isFree ? 5 : 0;

  return Math.round(clamp(recency + upcoming + completeness + freeBoost, 0, 100));
}

async function main() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      price: true,
      description: true,
      isFree: true,
      hotnessScore: true,
      createdAt: true,
      startDate: true,
      imageUrl: true,
      venue: true,
    },
  });

  let updated = 0;

  for (const e of events) {
    const mergedText = [e.price ?? "", e.description ?? ""].join(" ").trim();

    // isFree inference
    let nextIsFree: boolean | null = e.isFree;
    if (e.isFree === null) {
      if (mergedText && looksFree(mergedText)) nextIsFree = true;
    }

    // if price parses to 0, mark free even if isFree currently false/null
    if (e.price) {
      const minPrice = parseMinPriceSGD(e.price);
      if (minPrice === 0) nextIsFree = true;
    }

    // hotness inference (always compute; but only set if null)
    const computedHotness = computeHotnessScore({
      createdAt: e.createdAt,
      startDate: e.startDate,
      imageUrl: e.imageUrl,
      venue: e.venue,
      isFree: nextIsFree,
    });

    const data: any = {};
    if (e.isFree !== nextIsFree && nextIsFree !== null) data.isFree = nextIsFree;
    if (e.hotnessScore === null) data.hotnessScore = computedHotness;

    if (Object.keys(data).length > 0) {
      await prisma.event.update({ where: { id: e.id }, data });
      updated++;
    }
  }

  const [total, free, trending70] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { isFree: true } }),
    prisma.event.count({ where: { hotnessScore: { gte: 70 } } }),
  ]);

  console.log({ updated, total, free, trending70 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
