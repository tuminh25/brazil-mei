const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.post.findMany({ 
  where: { 
    status: 'PUBLISHED' 
  }, 
  orderBy: { createdAt: 'desc' }, 
  take: 20 
}).then(posts => { 
  console.log('All posts (20 newest):');
  posts.forEach((p, i) => console.log(i+1, p.title, p.category, p.isNewsjack, p.createdAt)); 
  prisma.$disconnect(); 
}).catch(e => { 
  console.error(e); 
  prisma.$disconnect(); 
});