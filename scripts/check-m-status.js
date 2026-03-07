const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function check() {
    console.log("Checking DB for Miserables...");
    const events = await prisma.event.findMany({
        where: { slug: { contains: 'miserables' } }
    });
    for (let e of events) {
        console.log(`SLUG: ${e.slug}`);
        console.log(`SOURCE: ${e.sourceUrl}`);
        console.log(`NAME: ${e.name}`);
        console.log(`IMAGE: ${e.imageUrl}`);
        console.log(`DESC LENGTH: ${e.description ? e.description.length : 0}`);
        console.log('---');
    }
    await prisma.$disconnect();
}
check();
