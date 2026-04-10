const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({ select: { slug: true } });
  posts.forEach(p => console.log(p.slug));
}

main().catch(console.error).finally(() => prisma.$disconnect());
