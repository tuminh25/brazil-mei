// scripts/create-newsjack.ts
// Script này được thiết kế để chạy bằng lệnh: npx tsx scripts/create-newsjack.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Newsjack Seeding ---');

  // 1. TÌM HOẶC TẠO TÁC GIẢ (Author)
  // Author cần thiết để bài viết hiển thị đúng trên UI
  const authorDesmond = await prisma.author.upsert({
    where: { id: 'author_1' }, // Chuyển sang dùng ID mà chúng ta đã định nghĩa
    update: {},
    create: {
      id: 'desmond-news-analyst',
      name: 'Desmond Tan',
      role: 'Chief Analyst',
      bio: 'In-depth analysis on Singapore\'s trending news and events.',
      email: 'desmond@sgeventshub.com',
      // Có thể dùng avatar mặc định hoặc một URL ảnh
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
    }
  });

  console.log(`✅ Author found/created: ${authorDesmond.name} (${authorDesmond.id})`);

  // 2. TẠO HOẶC CẬP NHẬT BÀI VIẾT NEWSJACK
  const newsjackSlug = 'test-newsjack-alert-working';

  const newsjackPost = await prisma.post.upsert({
    where: { slug: newsjackSlug },
    update: {
      isNewsjack: true,
      status: 'PUBLISHED',
      // Cập nhật tiêu đề để xác nhận đã chạy script
      title: `[HOT NEWS ${new Date().toLocaleTimeString()}] Feature Confirmed: The News Alert is LIVE!`
    },
    create: {
      slug: newsjackSlug,
      title: `[HOT NEWS] Feature Confirmed: The News Alert is LIVE!`,
      excerpt: 'Exclusive test to verify the immediate display of high-priority content right after the main hero section.',
      content: '<p>This content confirms that the Newsjack feature is correctly querying the database for the latest post with the `isNewsjack: true` flag and displaying it with the red/orange urgency styling.</p>',
      imageUrl: 'https://images.unsplash.com/photo-1582234057962-d3c52e468b3d?w=1600&q=80', // Ảnh test
      category: 'BREAKING NEWS',
      status: 'PUBLISHED',
      authorId: authorDesmond.id,
      isNewsjack: true // Flag quan trọng nhất
    }
  });

  console.log('✅ Newsjack Post Upserted successfully:');
  console.log(`- Title: ${newsjackPost.title}`);
  console.log(`- isNewsjack: ${newsjackPost.isNewsjack}`);
  console.log(`- Status: ${newsjackPost.status}`);

  console.log('\n--- Seeding Complete. Please Refresh your browser to view the News Alert. ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });