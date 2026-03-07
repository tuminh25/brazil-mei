const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function checkSlug() {
    const event = await prisma.event.findFirst({
        where: { name: { contains: 'Lao Jiu', mode: 'insensitive' } }
    });
    if (event) {
        fs.writeFileSync('slug_debug.txt', `"${event.slug}"`);
    } else {
        fs.writeFileSync('slug_debug.txt', 'NOT FOUND');
    }
    await prisma.$disconnect();
}

checkSlug();
