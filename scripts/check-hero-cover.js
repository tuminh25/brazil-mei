const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: { 
      OR: [
        { heroImage: { contains: 'postimg' } },
        { coverImage: { contains: 'postimg' } }
      ]
    },
    select: { id: true, slug: true, title: true, heroImage: true, coverImage: true, imageUrl: true }
  });
  console.log(JSON.stringify(posts, null, 2));
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });