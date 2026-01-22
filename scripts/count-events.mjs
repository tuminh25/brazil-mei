import prisma from "../src/lib/prisma.js";

const [total, free, trending] = await Promise.all([
  prisma.event.count(),
  prisma.event.count({ where: { isFree: true } }),
  prisma.event.count({ where: { hotnessScore: { gte: 70 } } }),
]);

console.log({ total, free, trending });
process.exit(0);
