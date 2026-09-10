const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPosts() {
  const slugs = [
    'hdb-renovation-cost-guide-singapore',
    'singapore-wedding-cost-ang-bao-guide',
    'singapore-pr-self-submission-guide',
    'p1-registration-phases-distance-guide',
    'foreign-domestic-worker-hiring-cost-guide'
  ];
  
  for (const slug of slugs) {
    const post = await prisma.post.findUnique({ where: { slug } });
    if (post) {
      console.log('FOUND:', slug);
      console.log('Title:', post.title);
      console.log('Category:', post.category);
      console.log('Content length:', post.content?.length);
      console.log('---First 500 chars of content---');
      console.log(post.content?.substring(0, 500));
      console.log('========================');
    } else {
      console.log('NOT FOUND:', slug);
      console.log('========================');
    }
  }
  await prisma.$disconnect();
}

checkPosts().catch(console.error);