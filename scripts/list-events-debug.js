const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany();
  console.log(`--- Events in DB (${events.length}) ---`);
  events.forEach(e => {
    console.log(`- [Event] ${e.id} | Slug: ${e.slug} | Name: ${e.name} | Cat: ${e.category}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
