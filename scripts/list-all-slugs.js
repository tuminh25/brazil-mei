const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listEverything() {
    console.log('--- ALL EVENT SLUGS ---');
    const events = await prisma.event.findMany({ select: { slug: true, status: true } });
    events.forEach(e => console.log(`- [${e.status}] ${e.slug}`));

    console.log('\n--- ALL POST SLUGS ---');
    const posts = await prisma.post.findMany({ select: { slug: true, status: true } });
    posts.forEach(p => console.log(`- [${p.status}] ${p.slug}`));
}

listEverything().finally(() => prisma.$disconnect());
