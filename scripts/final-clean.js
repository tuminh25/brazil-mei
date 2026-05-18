// scripts/final-clean.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting final database cleanup...");
  
  const posts = await prisma.post.findMany();
  for (const p of posts) {
    let changed = false;
    let newTitle = p.title;
    let newExcerpt = p.excerpt;

    if (newTitle && (newTitle.includes('</title>') || newTitle.includes('<title>'))) {
      newTitle = newTitle.replace(/<\/title>/g, '').replace(/<title>/g, '').trim();
      changed = true;
    }
    if (newExcerpt && (newExcerpt.includes('</title>') || newExcerpt.includes('<title>'))) {
      newExcerpt = newExcerpt.replace(/<\/title>/g, '').replace(/<title>/g, '').trim();
      changed = true;
    }

    if (changed) {
      await prisma.post.update({
        where: { id: p.id },
        data: { title: newTitle, excerpt: newExcerpt }
      });
      console.log(`✓ Cleaned ID ${p.id}`);
    }
  }
  console.log("Cleanup complete.");
}

main().finally(() => prisma.$disconnect());
