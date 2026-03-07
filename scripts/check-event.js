const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

async function check() {
  const slug = process.argv[2] || 'it-show-singapore-2026-guide';
  const event = await prisma.event.findUnique({
    where: { slug },
    select: { name: true, status: true, slug: true, category: true, description: true, imageUrl: true }
  });
  if (event) {
    console.log('✅ FOUND:', event.name);
    console.log('   Status:', event.status);
    console.log('   Category:', event.category);
    console.log('   Description length:', event.description?.length, 'chars');
    console.log('   Image URL:', event.imageUrl);
  } else {
    console.log('❌ Not found:', slug);
  }
  await prisma.$disconnect();
}
check().catch(e => { console.error(e.message); process.exit(1); });
