const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      content: true
    }
  });
  let output = '---GUIDES LIST---\n';
  posts.forEach(post => {
    output += `ID: ${post.id}\nTitle: ${post.title}\nSlug: ${post.slug}\n---\n`;
  });
  fs.writeFileSync('posts_info.txt', output);
  console.log('Results written to posts_info.txt');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
