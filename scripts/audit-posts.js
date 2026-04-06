const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, category: true, status: true, isNewsjack: true }
  });

  console.log('=== POST TABLE AUDIT ===');
  console.log('Total posts:', posts.length);
  console.log('');

  posts.forEach(p => {
    console.log(`[${p.id}] status="${p.status}" category="${p.category}" newsjack=${p.isNewsjack} | ${p.title}`);
  });

  const uniqueCategories = [...new Set(posts.map(p => p.category))];
  const publishedCount = posts.filter(p => p.status === 'PUBLISHED').length;
  const evergreenCount = posts.filter(p => p.category === 'Evergreen').length;
  const matchBothCount = posts.filter(p => p.status === 'PUBLISHED' && p.category === 'Evergreen').length;

  console.log('');
  console.log('=== SUMMARY ===');
  console.log('Total posts:', posts.length);
  console.log('Published (status=PUBLISHED):', publishedCount);
  console.log('category=Evergreen:', evergreenCount);
  console.log('MATCHES homepage query (PUBLISHED + Evergreen):', matchBothCount);
  console.log('All unique categories found:', JSON.stringify(uniqueCategories));
  console.log('All unique statuses found:', JSON.stringify([...new Set(posts.map(p => p.status))]));
}

audit()
  .catch(e => { console.error('ERROR:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
