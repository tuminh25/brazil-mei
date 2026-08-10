const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.post.findMany({ 
  orderBy: { createdAt: 'desc' }, 
  take: 20 
}).then(posts => { 
  console.log(JSON.stringify(posts, null, 2)); 
  prisma.$disconnect(); 
}).catch(e => { 
  console.error(e); 
  prisma.$disconnect(); 
});