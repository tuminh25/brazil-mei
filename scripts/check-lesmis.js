const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const events = await prisma.event.findMany({
        where: { name: { contains: 'miserables', mode: 'insensitive' } }
    });
    console.log('Results by name:', JSON.stringify(events, null, 2));

    const recentEvents = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
    });
    console.log('\n10 Most Recent Events:', JSON.stringify(recentEvents.map(e => ({ slug: e.slug, name: e.name })), null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
