// scripts/list-titles.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, title: true, slug: true, category: true, isNewsjack: true }
  });
  console.log(JSON.stringify(posts, null, 2));
}

main().finally(() => prisma.$disconnect());
