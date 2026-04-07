import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING DATABASE PURGE ---');

  // 1. Specific Fix: Delete older Marina Bay Sands (ID 20)
  try {
    const deletedMBS = await prisma.post.delete({
      where: { id: 20 }
    });
    console.log(`✅ Deleted specific duplicate: [20] "${deletedMBS.title}"`);
  } catch (error) {
    console.log(`ℹ️ Post ID 20 already deleted or not found.`);
  }

  // 2. Exact Title Duplicates Audit
  const allPosts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  const seenTitles = new Set<string>();
  const toDelete: number[] = [];

  for (const post of allPosts) {
    if (seenTitles.has(post.title)) {
      toDelete.push(post.id);
    } else {
      seenTitles.add(post.title);
    }
  }

  if (toDelete.length > 0) {
    console.log(`Found ${toDelete.length} additional exact title duplicates. Purging...`);
    for (const id of toDelete) {
      const deleted = await prisma.post.delete({ where: { id } });
      console.log(`✅ Deleted duplicate: [${id}] "${deleted.title}"`);
    }
  } else {
    console.log('No additional exact title duplicates found.');
  }

  console.log('--- PURGE COMPLETE ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
