const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const event = await prisma.event.findUnique({
        where: { slug: 'les-miserables-singapore-2026-sands-theatre-tickets-seats' }
    });
    console.log('Event by slug:', JSON.stringify(event, null, 2));

    const allEvents = await prisma.event.findMany({
        select: { slug: true, name: true }
    });
    console.log('\nAll Event Slugs:', JSON.stringify(allEvents, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
