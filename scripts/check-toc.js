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
    select: { title: true, content: true }
  });
  
  for (const post of posts) {
    console.log('===', post.title, '===');
    
    // Extract H2 headings
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    let match;
    const headings = [];
    
    while ((match = h2Regex.exec(post.content)) !== null) {
      const cleanText = match[1].replace(/<[^>]*>/g, '').trim();
      if (cleanText) {
        headings.push(cleanText);
      }
    }
    
    console.log('H2 Headings found:', headings.length);
    headings.forEach((h, i) => {
      console.log(`  ${String(i+1).padStart(2, '0')}. ${h}`);
    });
    console.log('');
  }
  await prisma.$disconnect();
}
check();