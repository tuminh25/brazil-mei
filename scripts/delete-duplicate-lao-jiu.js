const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

const SLUG_TO_DELETE = 'lao-jiu-the-musical-singapore-2026';

async function deleteEvent() {
    try {
        const result = await prisma.event.delete({
            where: { slug: SLUG_TO_DELETE }
        });
        console.log('✅ Deleted event:', result.name, `(${SLUG_TO_DELETE})`);
    } catch (error) {
        console.error('❌ Error deleting event:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

deleteEvent();
