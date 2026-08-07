const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const authors = await prisma.author.findMany();
  console.log('Current authors:', JSON.stringify(authors, null, 2));
  await prisma.$disconnect();
}
check();