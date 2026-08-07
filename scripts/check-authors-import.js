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
    select: { title: true, category: true, authorId: true, author: true }
  });
  
  for (const post of posts) {
    console.log('===', post.title, '===');
    console.log('Category:', post.category);
    console.log('Author ID:', post.authorId);
    console.log('Author Name:', post.author?.name);
    console.log('Author Role:', post.author?.role);
    console.log('');
  }
  await prisma.$disconnect();
}
check();