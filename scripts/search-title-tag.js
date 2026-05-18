// scripts/search-title-tag.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  for (const p of posts) {
    if (p.title.includes('title')) {
       console.log('ID:', p.id, 'Title:', p.title);
    }
  }
}
main().finally(() => prisma.$disconnect());
