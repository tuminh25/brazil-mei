const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const postCount = await prisma.post.count();
  const eventCount = await prisma.event.count();
  
  console.log(`--- Statistics ---`);
  console.log(`Total Posts: ${postCount}`);
  console.log(`Total Events: ${eventCount}`);

  const posts = await prisma.post.findMany({ take: 20 });
  console.log(`\n--- Last 20 Posts ---`);
  posts.forEach(p => console.log(`- [Post] ${p.title} (ID: ${p.id}, Slug: ${p.slug}, Cat: ${p.category})`));

  const events = await prisma.event.findMany({ take: 20 });
  console.log(`\n--- Last 20 Events ---`);
  events.forEach(e => console.log(`- [Event] ${e.name} (ID: ${e.id}, Slug: ${e.slug}, Cat: ${e.category})`));
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
