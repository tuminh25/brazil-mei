const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

async function main() {
    console.log('--- Searching Events for "it-show" ---');
    const events = await prisma.event.findMany({
        where: { slug: { contains: 'it-show' } },
        select: { slug: true, name: true, status: true }
    });
    console.log(JSON.stringify(events, null, 2));

    console.log('\n--- Searching Posts for "it-show" ---');
    const posts = await prisma.post.findMany({
        where: { slug: { contains: 'it-show' } },
        select: { slug: true, title: true, status: true }
    });
    console.log(JSON.stringify(posts, null, 2));

    await prisma.$disconnect();
}
main();
