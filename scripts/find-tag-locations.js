// scripts/find-tag-locations.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  posts.forEach(p => {
    for (const [key, value] of Object.entries(p)) {
      if (typeof value === 'string' && value.includes('</title>')) {
        console.log(`FOUND in Post ${p.id}, field ${key}: "${value.substring(0, 50)}..."`);
      }
    }
  });
}

main().finally(() => prisma.$disconnect());
