const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listEvents() {
    const events = await prisma.event.findMany({
        where: { status: 'PUBLISHED' },
        take: 5
    });
    events.forEach(e => {
        console.log(`ID: ${e.id} | Slug: ${e.slug} | Category: ${e.category} | Name: ${e.name}`);
    });
    await prisma.$disconnect();
}

listEvents();
