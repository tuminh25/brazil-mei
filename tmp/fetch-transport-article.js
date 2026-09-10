const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  const post = await prisma.post.findFirst({
    where: { slug: 'singapore-transport-costs-2026-mrt-bus-grab-car-comparison' },
    select: { id: true, slug: true, title: true, excerpt: true, content: true, metaTitle: true, category: true, status: true },
  });
  if (!post) {
    console.log('NOT FOUND');
    return;
  }
  console.log(JSON.stringify({ id: post.id, title: post.title, slug: post.slug, category: post.category, status: post.status }, null, 2));
  fs.writeFileSync('tmp/transport-article.html', post.content);
  console.log('content length:', post.content.length);
  console.log('content written to tmp/transport-article.html');
}

main().finally(() => prisma.$disconnect());
