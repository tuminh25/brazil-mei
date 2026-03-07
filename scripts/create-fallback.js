const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createFallback() {
    const oldSlug = 'lao-jiu-musical-2026-insider-guide-singapore-theatre';
    const newSlug = 'lao-jiu-the-musical-singapore-2026';

    // Get the content from the new slug
    const sourceEvent = await prisma.event.findUnique({
        where: { slug: newSlug }
    });

    if (!sourceEvent) {
        console.error("Source event not found!");
        await prisma.$disconnect();
        return;
    }

    // Create or update the old slug record with same content
    await prisma.event.upsert({
        where: { slug: oldSlug },
        update: {
            name: sourceEvent.name,
            description: sourceEvent.description,
            imageUrl: sourceEvent.imageUrl,
            startDate: sourceEvent.startDate,
            endDate: sourceEvent.endDate,
            status: 'PUBLISHED',
            category: sourceEvent.category,
            venue: sourceEvent.venue,
            price: sourceEvent.price,
            sourceUrl: sourceEvent.sourceUrl,
            enrichedContent: sourceEvent.enrichedContent,
            authorId: sourceEvent.authorId,
            updatedAt: new Date()
        },
        create: {
            slug: oldSlug,
            name: sourceEvent.name,
            description: sourceEvent.description,
            imageUrl: sourceEvent.imageUrl,
            startDate: sourceEvent.startDate,
            endDate: sourceEvent.endDate,
            status: 'PUBLISHED',
            category: sourceEvent.category,
            venue: sourceEvent.venue,
            price: sourceEvent.price,
            sourceUrl: sourceEvent.sourceUrl,
            enrichedContent: sourceEvent.enrichedContent,
            authorId: sourceEvent.authorId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    console.log("✅ Fallback record created/updated for old slug.");
    await prisma.$disconnect();
}

createFallback();
