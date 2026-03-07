const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

async function main() {
  // List all events
  const events = await prisma.event.findMany({
    select: { slug: true, name: true, status: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });
  console.log(`\n📋 Total events in DB: ${events.length}`);
  events.forEach(e => {
    console.log(`  [${e.status}] ${e.slug} — ${e.name?.substring(0, 60)}`);
  });
  await prisma.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
