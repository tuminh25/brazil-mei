const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function listEvents() {
    const events = await prisma.event.findMany({
        select: { slug: true, name: true }
    });
    console.log(events.map(e => `${e.slug} - ${e.name}`).join('\n'));
    await prisma.$disconnect();
}
listEvents();
