const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Trimming bushes and planting seeds...');

  // 1. Force all Posts to be 'Expert Guide' to fix the Homepage fetching
  const updatePosts = await prisma.post.updateMany({
    where: { status: 'PUBLISHED' },
    data: { category: 'Expert Guide' },
  });
  console.log(`✅ Fixed ${updatePosts.count} posts to be 'Expert Guide'`);

  // 2. See if author_1 exists
  const desmond = await prisma.author.findUnique({ where: { id: 'author_1' } });
  if (!desmond) {
    console.log('⚠️ author_1 not found! Posts might not display author info.');
  } else {
    console.log('✅ author_1 (Desmond) verified.');
  }

  // 3. Clear existing events just in case
  await prisma.event.deleteMany({});
  console.log('🧹 Cleared existing events.');

  // 4. Seed Headliners (Events)
  await prisma.event.createMany({
    data: [
      {
        slug: 'sneaker-con-sea-2026',
        name: 'Sneaker Con SEA 2026',
        description: 'The premier sneaker convention returning to Southeast Asia.',
        venue: 'Singapore Expo',
        imageUrl: 'https://images.unsplash.com/photo-1608667508765-33cdb79b69b5?q=80&w=800',
        status: 'PUBLISHED',
        category: 'Event',
        authorId: 'author_1',
        startDate: new Date('2026-06-15'),
        hotnessScore: 90
      },
      {
        slug: 'f1-night-race-2026',
        name: 'Formula 1 Singapore Airlines Singapore Grand Prix 2026',
        description: 'The original night race roars back to the Marina Bay Street Circuit.',
        venue: 'Marina Bay Street Circuit',
        imageUrl: 'https://images.unsplash.com/photo-1541348263662-e068c818817a?q=80&w=800',
        status: 'PUBLISHED',
        category: 'Event',
        authorId: 'author_1',
        startDate: new Date('2026-09-18'),
        hotnessScore: 99
      },
      {
        slug: 'zoukout-2026',
        name: 'ZoukOut Singapore 2026',
        description: 'Asia’s longest running dance music festival on the beach.',
        venue: 'Siloso Beach, Sentosa',
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c090be5c5a4?q=80&w=800',
        status: 'PUBLISHED',
        category: 'Event',
        authorId: 'author_1',
        startDate: new Date('2026-12-10'),
        hotnessScore: 85
      }
    ]
  });
  console.log('✅ Seeded 3 Headliner Events.');

  // 5. Seed Icons (Attractions)
  await prisma.event.createMany({
    data: [
      {
        slug: 'gardens-by-the-bay',
        name: 'Gardens by the Bay',
        description: 'A national garden and premier horticultural attraction for local and international visitors.',
        venue: 'Marina Bay',
        imageUrl: 'https://images.unsplash.com/photo-1555513812-70b79e12bf5a?q=80&w=800',
        status: 'PUBLISHED',
        category: 'Attraction',
        authorId: 'author_1',
        hotnessScore: 95
      },
      {
        slug: 'marina-bay-sands',
        name: 'Marina Bay Sands',
        description: 'Integrated resort notable for transforming Singapore’s city skyline and tourism landscape.',
        venue: 'Bayfront',
        imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8bcbf6dd04c?q=80&w=800',
        status: 'PUBLISHED',
        category: 'Attraction',
        authorId: 'author_1',
        hotnessScore: 90
      },
      {
        slug: 'singapore-zoo',
        name: 'Singapore Zoo',
        description: 'An award-winning wildlife park known for its open-concept habitats.',
        venue: 'Mandai',
        imageUrl: 'https://images.unsplash.com/photo-1564755866170-eb05e81d7731?q=80&w=800',
        status: 'PUBLISHED',
        category: 'Attraction',
        authorId: 'author_1',
        hotnessScore: 88
      }
    ]
  });
  console.log('✅ Seeded 3 Icon Attractions.');

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🎉 Seeding complete!');
  });
