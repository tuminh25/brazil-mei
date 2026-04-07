import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    orderBy: { title: 'asc' },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      isNewsjack: true,
      status: true,
    }
  });

  console.log('--- POSTS LIST ---');
  posts.forEach(post => {
    console.log(`[${post.id}] Title: "${post.title}" | Slug: "${post.slug}" | Category: ${post.category} | isNewsjack: ${post.isNewsjack} | Status: ${post.status}`);
  });

  // Find duplicates by title
  const titleCounts = posts.reduce((acc, post) => {
    acc[post.title] = (acc[post.title] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const duplicates = Object.entries(titleCounts).filter(([_, count]) => count > 1);

  if (duplicates.length > 0) {
    console.log('\n--- DUPLICATES FOUND BY TITLE ---');
    duplicates.forEach(([title, count]) => {
      console.log(`Title: "${title}" appears ${count} times.`);
      const sameTitlePosts = posts.filter(p => p.title === title);
      sameTitlePosts.forEach(p => {
        console.log(`  - ID: ${p.id}, Slug: ${p.slug}, Category: ${p.category}, isNewsjack: ${p.isNewsjack}`);
      });
    });
  } else {
    console.log('\nNo duplicates found by title.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
