const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      imageUrl: {
        contains: 'i.postimg'
      }
    },
    select: { slug: true, imageUrl: true }
  });
  console.log('Posts with i.postimg:', posts);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });