const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.post.count({ 
  where: { 
    status: 'PUBLISHED' 
  } 
}).then(count => { 
  console.log('Total PUBLISHED posts:', count); 
  prisma.$disconnect(); 
}).catch(e => { 
  console.error(e); 
  prisma.$disconnect(); 
});