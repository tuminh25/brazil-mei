const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function globalSearch() {
    console.log('--- Searching Events ---');
    const events = await prisma.event.findMany({
        where: {
            OR: [
                { name: { contains: 'paw', mode: 'insensitive' } },
                { slug: { contains: 'paw', mode: 'insensitive' } },
                { name: { contains: 'it show', mode: 'insensitive' } },
                { slug: { contains: 'it show', mode: 'insensitive' } },
                { slug: { contains: 'it-show', mode: 'insensitive' } }
            ]
        }
    });
    console.log(`Found ${events.length} events:`);
    events.forEach(e => console.log(`- [${e.status}] ${e.name} (${e.slug})`));

    console.log('\n--- Searching Posts ---');
    const posts = await prisma.post.findMany({
        where: {
            OR: [
                { title: { contains: 'paw', mode: 'insensitive' } },
                { slug: { contains: 'paw', mode: 'insensitive' } },
                { title: { contains: 'it show', mode: 'insensitive' } },
                { slug: { contains: 'it show', mode: 'insensitive' } },
                { slug: { contains: 'it-show', mode: 'insensitive' } }
            ]
        }
    });
    console.log(`Found ${posts.length} posts:`);
    posts.forEach(p => console.log(`- [${p.status}] ${p.title} (${p.slug})`));
}

globalSearch().finally(() => prisma.$disconnect());
