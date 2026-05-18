// scripts/deep-clean-titles.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Searching for HTML tags in titles...");
  const posts = await prisma.post.findMany();
  let count = 0;
  for (const post of posts) {
    if (/<[^>]*>/.test(post.title)) {
      const cleanTitle = post.title.replace(/<[^>]*>/g, '').trim();
      await prisma.post.update({
        where: { id: post.id },
        data: { title: cleanTitle }
      });
      console.log(`✓ Cleaned title for ID ${post.id}: "${post.title}" -> "${cleanTitle}"`);
      count++;
    }
  }
  console.log(`Done. Cleaned ${count} titles.`);
}

main().finally(() => prisma.$disconnect());
