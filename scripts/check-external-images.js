const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      imageUrl: {
        contains: 'https://'
      }
    },
    select: { slug: true, imageUrl: true }
  });
  console.log('Posts with external images:', posts.length);
  posts.forEach(p => console.log(p.slug, p.imageUrl));
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });