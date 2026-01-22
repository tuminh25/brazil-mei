import prisma from "../src/lib/prisma";

async function main() {
  const [total, free, trending] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { isFree: true } }),
    prisma.event.count({ where: { hotnessScore: { gte: 70 } } }),
  ]);

  console.log({ total, free, trending });
}

main().finally(async () => {
  await prisma.$disconnect();
});
