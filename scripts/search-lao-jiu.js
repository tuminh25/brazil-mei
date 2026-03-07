const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function searchLaoJiu() {
    const events = await prisma.event.findMany({
        where: {
            name: { contains: 'Lao Jiu', mode: 'insensitive' }
        }
    });
    console.log("Found:", events.length, "events");
    events.forEach(e => {
        console.log(`ID: ${e.id} | Slug: ${e.slug} | Status: ${e.status} | Name: ${e.name}`);
    });
    await prisma.$disconnect();
}

searchLaoJiu();
