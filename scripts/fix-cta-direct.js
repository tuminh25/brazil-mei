const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

const SLUG = 'les-miserables-singapore-2026-sands-theatre-tickets-seats';
const KLOOK_URL = 'https://www.klook.com/en-SG/activity/160259-les-miserables-the-arena-spectacular-world-tour-at-the-sands-theatre/?spm=SearchResult.SearchResult_LIST&clickId=ed02c7c229&aid=105111';

async function updateAndMonitor() {
    try {
        console.log("Forcing update to DB...");
        const result = await prisma.event.update({
            where: { slug: SLUG },
            data: {
                sourceUrl: KLOOK_URL,
                enrichedContent: {
                    klookUrl: KLOOK_URL
                }
            }
        });
        console.log('✅ Updated CTA for:', result.name);
        console.log('   New sourceUrl:', result.sourceUrl);

        console.log("Checking DB after 3 seconds...");
        await new Promise(resolve => setTimeout(resolve, 3000));

        const check = await prisma.event.findUnique({
            where: { slug: SLUG }
        });

        console.log("Current sourceUrl in DB:", check.sourceUrl);

    } catch (error) {
        console.error('❌ Error updating event:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAndMonitor();
