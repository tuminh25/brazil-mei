const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function read() {
    const event = await prisma.event.findUnique({
        where: { slug: 'paw-patrol-live-singapore-2026-guide' }
    });
    console.log(JSON.stringify(event, null, 2));
}
read().finally(() => prisma.$disconnect());
