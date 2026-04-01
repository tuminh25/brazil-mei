const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- Cleanup: Moving Guides from Event to Post and Fixing Events ---");

  // 1. Find all Events with category "Events" (these are the guides from the old import-folder.js)
  const legacyGuides = await prisma.event.findMany({
    where: { category: 'Events' }
  });
  console.log(`Found ${legacyGuides.length} legacy guides in Event table.`);

  for (const guide of legacyGuides) {
    console.log(`Migrating/Ensuring Post: ${guide.slug}`);
    await prisma.post.upsert({
      where: { slug: guide.slug },
      update: {
        title: guide.name,
        content: guide.description || '',
        imageUrl: guide.imageUrl,
        category: 'Expert Guide',
        isNewsjack: false,
        status: 'PUBLISHED',
      },
      create: {
        slug: guide.slug,
        title: guide.name,
        content: guide.description || '',
        imageUrl: guide.imageUrl,
        category: 'Expert Guide',
        isNewsjack: false,
        status: 'PUBLISHED',
        authorId: guide.authorId || 'author_1',
      }
    });

    // Delete from Event table after migration
    await prisma.event.delete({
      where: { id: guide.id }
    });
    console.log(`Deleted Event: ${guide.slug}`);
  }

  // 2. Final check of counts
  const postCount = await prisma.post.count();
  const eventCount = await prisma.event.count();
  console.log(`\nFinal Statistics:`);
  console.log(`Total Posts: ${postCount}`);
  console.log(`Total Events: ${eventCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
