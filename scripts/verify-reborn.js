const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  console.log('🧐 [SG Events Hub] Verifying database state...');
  
  const authorCount = await prisma.author.count();
  const authors = await prisma.author.findMany({
    select: { id: true, name: true, email: true }
  });
  
  const postCount = await prisma.post.count();
  const samplePosts = await prisma.post.findMany({
    take: 3,
    select: { title: true, slug: true }
  });

  console.log(`\n👥 Authors (${authorCount}):`);
  authors.forEach(a => console.log(`- ${a.name} (${a.id}) | Email: ${a.email}`));

  console.log(`\n📚 Posts (${postCount}):`);
  samplePosts.forEach(p => console.log(`- ${p.title} (${p.slug})`));

  if (authorCount >= 3 && postCount > 0) {
    console.log('\n✅ Verification SUCCESS: Database is populated and synced!');
  } else {
    console.log('\n⚠️ Verification WARNING: Expected data missing.');
  }

  await prisma.$disconnect();
}

check().catch(console.error);
