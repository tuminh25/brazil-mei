const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEvent() {
  const event = await prisma.event.findUnique({
    where: { slug: 'lao-jiu-the-musical-singapore-2026' }
  });
  console.log(JSON.stringify(event, null, 2));
  await prisma.$disconnect();
}

checkEvent();
