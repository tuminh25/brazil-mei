// scripts/search-encoded-tags.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  posts.forEach(p => {
    if (JSON.stringify(p).includes('&lt;/title&gt;')) {
      console.log('Found encoded tag in Post ID:', p.id);
    }
  });
}

main().finally(() => prisma.$disconnect());
