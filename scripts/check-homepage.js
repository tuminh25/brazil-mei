const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  // Check what the homepage query returns
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      isNewsjack: false,
      category: { not: 'TRAVEL_GUIDE' },
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });
  
  console.log('Homepage query results:', posts.length);
  posts.forEach(p => console.log(' -', p.title, '|', p.category, '|', p.status, '|', p.isNewsjack));
  
  await prisma.$disconnect();
}
check();