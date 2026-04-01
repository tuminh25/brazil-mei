const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Updating Posts to match Homepage filters...");
  const result = await prisma.post.updateMany({
    where: {
      category: 'Travel Guide'
    },
    data: {
      category: 'Expert Guide',
      isNewsjack: false,
      authorId: 'author_1'
    }
  });

  console.log(`Updated ${result.count} posts.`);

  // Also catch any other posts that might need isNewsjack: false
  const result2 = await prisma.post.updateMany({
    where: {
      category: 'Expert Guide',
      isNewsjack: null
    },
    data: {
      isNewsjack: false
    }
  });
  console.log(`Updated another ${result2.count} posts to set isNewsjack: false.`);
  
  const postsCount = await prisma.post.count();
  const eventsCount = await prisma.event.count();
  console.log(`Total live Posts: ${postsCount}`);
  console.log(`Total live Events: ${eventsCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
