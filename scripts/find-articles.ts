import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { slug: { contains: 'hdb' } },
        { slug: { contains: 'home-based' } },
        { slug: { contains: 'food-business' } }
      ]
    },
    select: { slug: true, title: true, category: true }
  });
  console.log(JSON.stringify(posts, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());