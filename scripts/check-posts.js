const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany();
  console.log("All Posts:");
  for (const p of posts) {
    console.log(`- [${p.id}] ${p.title} (Category: ${p.category}, isNewsjack: ${p.isNewsjack})`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
