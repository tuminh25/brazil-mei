const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const posts = await prisma.post.findMany({
    where: { slug: { in: [
      'hdb-resale-grants-2026-complete-guide',
      'cpf-changes-2026-singapore-residents-guide',
      'chas-medisave-medishield-life-singapore-healthcare-financing-guide',
      'singapore-transport-costs-2026-mrt-bus-grab-car-comparison',
      'skillsfuture-level-up-programme-explained-2026',
      'cdc-vouchers-2026-grocery-hawker-budgeting-families'
    ]}},
    select: { title: true, category: true, imageUrl: true, content: true }
  });
  
  for (const post of posts) {
    console.log('===', post.title, '===');
    console.log('Category:', post.category);
    console.log('Image:', post.imageUrl);
    console.log('Content length:', post.content.length);
    console.log('Has Suggested Internal Links:', post.content.includes('Suggested Internal Links'));
    console.log('Has Recommended Schema:', post.content.includes('Recommended Schema'));
    console.log('Has Secondary Keywords:', post.content.includes('Secondary Keywords'));
    console.log('Starts with H1:', post.content.trim().startsWith('<h1>'));
    console.log('First 200 chars:', post.content.substring(0, 200));
    console.log('');
  }
  await prisma.$disconnect();
}
check();