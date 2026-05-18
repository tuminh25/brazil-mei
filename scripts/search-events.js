// scripts/search-events.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany({
    where: {
      OR: [
        { name: { contains: 'Indoor Playgrounds' } },
        { metaTitle: { contains: 'title' } }
      ]
    }
  });
  console.log(JSON.stringify(events, null, 2));
}

main().finally(() => prisma.$disconnect());
