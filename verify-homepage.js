const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.post.findMany({ 
  where: { 
    status: 'PUBLISHED', 
    isNewsjack: false, 
    category: { not: 'TRAVEL_GUIDE' } 
  }, 
  orderBy: { createdAt: 'desc' }, 
  take: 8 
}).then(posts => { 
  console.log('Todays Singapore (8 newest):');
  posts.forEach((p, i) => console.log(i+1, p.title, p.category, p.createdAt)); 
  prisma.$disconnect(); 
}).catch(e => { 
  console.error(e); 
  prisma.$disconnect(); 
});