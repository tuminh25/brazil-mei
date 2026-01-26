// scripts/seed-newsjack.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Tạo author nếu chưa có
  const author = await prisma.author.upsert({
    where: { email: 'news@example.com' },
    update: {},
    create: {
      name: 'News Alert Team',
      role: 'Breaking News Analyst',
      bio: 'Covering the latest trending news in Singapore',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
    }
  });

  // Tạo bài viết Newsjack
  const newsjackPost = await prisma.post.upsert({
    where: { slug: 'singapore-new-attraction-2025' },
    update: {
      isNewsjack: true
    },
    create: {
      slug: 'singapore-new-attraction-2025',
      title: 'BREAKING: Singapore Announces Major New Attraction for 2025',
      excerpt: 'Exclusive insider analysis of the newly announced mega-attraction set to transform Singapore tourism next year.',
      content: '<p>Singapore has just announced a groundbreaking new attraction...</p>',
      imageUrl: 'https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1600&q=80',
      category: 'Breaking News',
      status: 'PUBLISHED',
      authorId: author.id,
      isNewsjack: true // <-- QUAN TRỌNG: Đặt thành true
    }
  });

  console.log('✅ Created newsjack post:', newsjackPost.title);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });