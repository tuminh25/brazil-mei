const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEvent() {
    const event = await prisma.event.findUnique({
        where: { slug: 'lao-jiu-the-musical-singapore-2026' }
    });
    if (event) {
        console.log("Slug:", event.slug);
        console.log("Status:", event.status);
        console.log("Category:", event.category);
    } else {
        console.log("Event not found!");
    }
    await prisma.$disconnect();
}

checkEvent();
