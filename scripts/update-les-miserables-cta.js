const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

const SLUG = 'les-miserables-singapore-2026-sands-theatre-tickets-seats';
const KLOOK_URL = 'https://www.klook.com/en-SG/activity/160259-les-miserables-the-arena-spectacular-world-tour-at-the-sands-theatre/?aid=105111';

async function updateCTA() {
    try {
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
    } catch (error) {
        console.error('❌ Error updating event:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateCTA();
