const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.findUnique({ where: { id: 145 } });
  console.log(JSON.stringify(post, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);