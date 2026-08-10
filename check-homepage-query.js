const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Simulate the homepage query for todaysSingapore
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
  console.log('Homepage todaysSingapore posts:');
  posts.forEach(p => console.log('ID:', p.id, 'Slug:', p.slug, 'ImageUrl:', p.imageUrl, 'UpdatedAt:', p.updatedAt));
  await prisma.$disconnect();
}

main().catch(console.error);