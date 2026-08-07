const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      imageUrl: { not: null }
    },
    select: {
      id: true,
      slug: true,
      imageUrl: true
    }
  });
  
  const hostnames = new Set();
  
  posts.forEach(p => {
    if (p.imageUrl) {
      try {
        const url = new URL(p.imageUrl);
        hostnames.add(url.hostname);
      } catch (e) {
        console.log('Invalid URL:', p.imageUrl);
      }
    }
  });
  
  console.log('Unique hostnames found:');
  Array.from(hostnames).sort().forEach(h => console.log(`  { protocol: 'https', hostname: '${h}' },`));
  
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });