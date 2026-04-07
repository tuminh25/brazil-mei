import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      isNewsjack: true,
    }
  });

  console.log('Total posts:', posts.length);

  const normalized = posts.map(p => ({
    ...p,
    normTitle: p.title.toLowerCase().replace(/[^a-z0-9]/g, '')
  }));

  const duplicates = [];
  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      if (normalized[i].normTitle === normalized[j].normTitle) {
        duplicates.push([normalized[i], normalized[j]]);
      }
    }
  }

  if (duplicates.length > 0) {
    console.log('Potential duplicates found:');
    duplicates.forEach(([p1, p2]) => {
      console.log(`- "${p1.title}" (ID: ${p1.id}, Slug: ${p1.slug}, Cat: ${p1.category})`);
      console.log(`  AND "${p2.title}" (ID: ${p2.id}, Slug: ${p2.slug}, Cat: ${p2.category})`);
    });
  } else {
    console.log('No potential duplicates found by normalized title.');
  }
}

main().finally(() => prisma.$disconnect());
