import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.findUnique({
    where: { slug: 'singapore-transport-costs-2026-mrt-bus-grab-car-comparison' },
    include: { author: true }
  });
  console.log(JSON.stringify(post, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());