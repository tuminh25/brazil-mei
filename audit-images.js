const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.post.findMany({ 
  where: { 
    status: 'PUBLISHED' 
  }, 
  orderBy: { createdAt: 'desc' }, 
  take: 6,
  select: {
    id: true,
    slug: true,
    title: true,
    imageUrl: true,
    createdAt: true,
    category: true
  }
}).then(posts => { 
  console.log('=== 6 NEWEST POSTS - DATABASE IMAGE URLs ===');
  posts.forEach((p, i) => {
    console.log(`${i+1}. ID: ${p.id}`);
    console.log(`   Slug: ${p.slug}`);
    console.log(`   Title: ${p.title}`);
    console.log(`   Category: ${p.category}`);
    console.log(`   ImageURL: ${p.imageUrl}`);
    console.log(`   CreatedAt: ${p.createdAt}`);
    console.log('');
  });
  
  // Check for duplicates
  const urls = posts.map(p => p.imageUrl);
  const uniqueUrls = [...new Set(urls)];
  console.log('=== DUPLICATE CHECK ===');
  console.log(`Total URLs: ${urls.length}`);
  console.log(`Unique URLs: ${uniqueUrls.length}`);
  if (urls.length !== uniqueUrls.length) {
    console.log('⚠️  DUPLICATES FOUND!');
    urls.forEach((url, idx) => {
      const count = urls.filter(u => u === url).length;
      if (count > 1) {
        console.log(`   "${url}" appears ${count} times`);
      }
    });
  } else {
    console.log('✅ All image URLs are unique');
  }
  
  prisma.$disconnect(); 
}).catch(e => { 
  console.error(e); 
  prisma.$disconnect(); 
});