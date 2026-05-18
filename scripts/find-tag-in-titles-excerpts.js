// scripts/find-tag-in-titles-excerpts.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  posts.forEach(p => {
    if (p.title && p.title.includes('</title>')) {
      console.log(`FOUND in Post ${p.id} TITLE: "${p.title}"`);
    }
    if (p.excerpt && p.excerpt.includes('</title>')) {
      console.log(`FOUND in Post ${p.id} EXCERPT: "${p.excerpt}"`);
    }
  });
}

main().finally(() => prisma.$disconnect());
