const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update the 3 posts with local image paths
  await prisma.post.update({
    where: { slug: 'singapore-events-attractions-2026-complete-guide' },
    data: { imageUrl: '/images/guides/singapore-events-attractions-2026-complete-guide.png' }
  });
  console.log('Updated singapore-events-attractions-2026-complete-guide');

  await prisma.post.update({
    where: { slug: 'singapore-2026-mrt-cdc-vouchers-ai-economy' },
    data: { imageUrl: '/images/guides/singapore-2026-mrt-cdc-vouchers-ai-economy.png' }
  });
  console.log('Updated singapore-2026-mrt-cdc-vouchers-ai-economy');

  await prisma.post.update({
    where: { slug: 'universal-studios-singapore-guide-2026' },
    data: { imageUrl: '/images/guides/universal-studios-singapore-guide-2026.png' }
  });
  console.log('Updated universal-studios-singapore-guide-2026');

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });