const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: { 
      OR: [
        { imageUrl: { contains: 'imgur' } },
        { imageUrl: { contains: 'unsplash' } },
        { imageUrl: { contains: 'postimg' } }
      ]
    },
    select: { id: true, slug: true, title: true, imageUrl: true }
  });
  console.log(JSON.stringify(posts, null, 2));
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });