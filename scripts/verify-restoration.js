const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  const post = await prisma.post.findUnique({
    where: { slug: 'river-wonders-singapore-insider-guide-2026' },
  });

  if (!post) {
    console.error('❌ Post not found!');
  } else {
    console.log('--- RIVER WONDERS VERIFICATION ---');
    console.log('Title:', post.title);
    console.log('Content Length:', post.content.length);
    console.log('Has CTA Box:', post.content.includes('insider-intelligence-cta-box') ? '✅ Yes' : '❌ No');
    console.log('Sample Content (last 500 chars):', post.content.slice(-500));
  }
}

verify().finally(() => prisma.$disconnect());
