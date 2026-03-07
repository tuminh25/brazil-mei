const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function check() {
    const events = await prisma.event.findMany({
        where: { name: { contains: 'Miserables', mode: 'insensitive' } },
        select: { slug: true, name: true, sourceUrl: true }
    });
    console.log(events);
    await prisma.$disconnect();
}
check();
