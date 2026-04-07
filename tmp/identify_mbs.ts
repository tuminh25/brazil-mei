import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: 'Marina Bay Sands', mode: 'insensitive' } },
        // Add other potential duplicates if known
      ]
    },
    select: {
      id: true,
      title: true,
      slug: true,
      updatedAt: true,
      category: true,
      isNewsjack: true,
    },
    orderBy: { updatedAt: 'desc' }
  });

  console.log('--- POTENTIAL DUPLICATES (MARINA BAY SANDS) ---');
  posts.forEach(p => {
    console.log(`[${p.id}] Title: "${p.title}" | Slug: "${p.slug}" | Updated: ${p.updatedAt.toISOString()} | Cat: ${p.category} | Newsjack: ${p.isNewsjack}`);
  });
}

main().finally(() => prisma.$disconnect());
