const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOldSlug() {
    const oldSlug = 'lao-jiu-musical-2026-insider-guide-singapore-theatre';
    const event = await prisma.event.findUnique({
        where: { slug: oldSlug }
    });
    if (event) {
        console.log("OLD SLUG STILL EXISTS! ID:", event.id);
    } else {
        console.log("Old slug not found in DB.");
    }
    await prisma.$disconnect();
}

checkOldSlug();
