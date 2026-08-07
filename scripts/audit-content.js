const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      slug: {
        in: [
          'singapore-events-attractions-2026-complete-guide',
          'singapore-2026-mrt-cdc-vouchers-ai-economy',
          'universal-studios-singapore-guide-2026'
        ]
      }
    },
    select: {
      id: true,
      slug: true,
      title: true,
      content: true
    }
  });
  
  posts.forEach(p => {
    console.log('=== POST:', p.slug, '===');
    console.log('ID:', p.id);
    console.log('Title:', p.title);
    console.log('Content length:', p.content?.length);
    console.log('Content preview (first 5000 chars):');
    console.log(p.content?.substring(0, 5000));
    console.log('---');
  });
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });