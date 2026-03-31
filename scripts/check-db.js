// scripts/check-db.js
// Run with: node scripts/check-db.js
// Verifies the Neon database connection is alive by querying 1 event.

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🔌 Checking database connection...');
    try {
        const event = await prisma.event.findFirst({
            select: { id: true, name: true, slug: true, endDate: true },
        });

        if (event) {
            console.log('✅ Database is ALIVE. Sample event:');
            console.log(`   - ID:      ${event.id}`);
            console.log(`   - Name:    ${event.name}`);
            console.log(`   - Slug:    ${event.slug}`);
            console.log(`   - endDate: ${event.endDate} (type: ${typeof event.endDate})`);
        } else {
            console.warn('⚠️  Database connected but NO events found in the table.');
        }
    } catch (err) {
        console.error('❌ Database connection FAILED:');
        console.error(err.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
