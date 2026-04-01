const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const authors = await prisma.author.findMany();
  console.log("Authors:", authors);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
