const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

async function main() {
    const slugs = ['paw-patrol-live-singapore-2026-guide', 'it-show-singapore-2026-guide'];

    console.log('--- Checking Event Table ---');
    for (const slug of slugs) {
        const e = await prisma.event.findUnique({ where: { slug } });
        console.log(`${slug}: ${e ? 'FOUND' : 'NOT FOUND'}`);
    }

    console.log('\n--- Checking Post Table ---');
    for (const slug of slugs) {
        const p = await prisma.post.findUnique({ where: { slug } });
        console.log(`${slug}: ${p ? 'FOUND' : 'NOT FOUND'}`);
    }

    await prisma.$disconnect();
}
main();
