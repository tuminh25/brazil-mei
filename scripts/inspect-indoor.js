// scripts/inspect-indoor.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.findUnique({
    where: { slug: '15-best-indoor-playgrounds-in-singapore' }
  });
  if (post) {
    console.log('TITLE:', JSON.stringify(post.title));
    if (post.title.includes('</title>')) {
      console.log('Found </title>! Cleaning...');
      const cleanTitle = post.title.replace(/<\/title>/g, '').trim();
      await prisma.post.update({
        where: { id: post.id },
        data: { title: cleanTitle }
      });
      console.log('Cleaned title.');
    } else {
      console.log('No </title> found in title.');
    }
  } else {
    console.log('Post not found.');
  }
}

main().finally(() => prisma.$disconnect());
