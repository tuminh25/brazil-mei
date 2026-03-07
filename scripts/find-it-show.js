const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function search() {
    console.log('--- Searching for "IT Show" in DB ---');

    const events = await prisma.event.findMany({
        where: {
            OR: [
                { name: { contains: 'IT Show', mode: 'insensitive' } },
                { slug: { contains: 'it-show', mode: 'insensitive' } },
                { description: { contains: 'IT Show', mode: 'insensitive' } }
            ]
        }
    });

    console.log(`Found ${events.length} events:`);
    events.forEach(e => console.log(`- [${e.status}] ${e.name} (${e.slug})`));

    const posts = await prisma.post.findMany({
        where: {
            OR: [
                { title: { contains: 'IT Show', mode: 'insensitive' } },
                { slug: { contains: 'it-show', mode: 'insensitive' } },
                { content: { contains: 'IT Show', mode: 'insensitive' } }
            ]
        }
    });

    console.log(`\nFound ${posts.length} posts:`);
    posts.forEach(p => console.log(`- [${p.status}] ${p.title} (${p.slug})`));
}

search()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
