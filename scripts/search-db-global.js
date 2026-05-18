// scripts/search-db-global.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  posts.forEach(p => {
    if (JSON.stringify(p).includes('</title>')) {
      console.log('Found in Post ID:', p.id);
      console.log(JSON.stringify(p, null, 2));
    }
  });

  const events = await prisma.event.findMany();
  events.forEach(e => {
    if (JSON.stringify(e).includes('</title>')) {
      console.log('Found in Event ID:', e.id);
      console.log(JSON.stringify(e, null, 2));
    }
  });

  const authors = await prisma.author.findMany();
  authors.forEach(a => {
    if (JSON.stringify(a).includes('</title>')) {
      console.log('Found in Author ID:', a.id);
      console.log(JSON.stringify(a, null, 2));
    }
  });
}

main().finally(() => prisma.$disconnect());
