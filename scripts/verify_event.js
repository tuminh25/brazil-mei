const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEvent() {
    const event = await prisma.event.findUnique({
        where: { slug: 'charlie-and-the-chocolate-factory-singapore-2026' }
    });

    if (event) {
        console.log('Event Name:', event.name);
        console.log('Status:', event.status);
        console.log('Source URL:', event.sourceUrl);
        console.log('Image URL:', event.imageUrl);
        console.log('Category:', event.category);
    } else {
        console.log('Event not found.');
    }
    await prisma.$disconnect();
}

checkEvent();
