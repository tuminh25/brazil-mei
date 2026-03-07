const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSlugs() {
    const slugsToCheck = [
        'paw-patrol-live-singapore-2026-guide',
        'it-show-singapore-2026-guide'
    ];

    console.log('--- Checking Slugs in Event Table ---');
    for (const slug of slugsToCheck) {
        const result = await prisma.event.findUnique({ where: { slug } });
        console.log(`Event [${slug}]: ${result ? `FOUND (Status: ${result.status})` : 'NOT FOUND'}`);
    }

    console.log('\n--- Checking Slugs in Post Table ---');
    for (const slug of slugsToCheck) {
        const result = await prisma.post.findUnique({ where: { slug } });
        console.log(`Post [${slug}]: ${result ? `FOUND (Status: ${result.status})` : 'NOT FOUND'}`);
    }

    console.log('\n--- Searching with partial match ---');
    const partialResults = await prisma.event.findMany({
        where: {
            OR: [
                { slug: { contains: 'paw-patrol', mode: 'insensitive' } },
                { slug: { contains: 'it-show', mode: 'insensitive' } }
            ]
        }
    });
    console.log(`Partial matches found in Event table: ${partialResults.length}`);
    partialResults.forEach(r => console.log(`- ${r.slug} (${r.status})`));

    const partialPosts = await prisma.post.findMany({
        where: {
            OR: [
                { slug: { contains: 'paw-patrol', mode: 'insensitive' } },
                { slug: { contains: 'it-show', mode: 'insensitive' } }
            ]
        }
    });
    console.log(`\nPartial matches found in Post table: ${partialPosts.length}`);
    partialPosts.forEach(r => console.log(`- ${r.slug} (${r.status})`));
}

checkSlugs()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
