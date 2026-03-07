const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixDates() {
    const slug = 'lao-jiu-the-musical-singapore-2026';
    const event = await prisma.event.update({
        where: { slug: slug },
        data: {
            startDate: new Date('2026-04-02T20:00:00Z'),
            endDate: new Date('2026-04-19T22:00:00Z'),
            status: 'PUBLISHED'
        }
    });
    console.log("Updated Slug:", event.slug);
    console.log("Updated StartDate:", event.startDate);
    await prisma.$disconnect();
}

fixDates();
