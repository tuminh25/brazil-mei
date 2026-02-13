// scripts/fix-imported-guides.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
    console.log("🛠  FIXING IMPORTED GUIDES VISIBILITY...");

    const result = await prisma.post.updateMany({
        where: {
            OR: [
                { status: 'DRAFT' },
                { category: { not: 'Expert Guide' } },
                { isNewsjack: null },
                { isNewsjack: true }
            ]
        },
        data: {
            status: 'PUBLISHED',
            category: 'Expert Guide',
            isNewsjack: false
        }
    });

    console.log(`✅ Successfully updated ${result.count} guides.`);
    await prisma.$disconnect();
}

run().catch((e) => {
    console.error("💥 Error during migration:", e.message);
    prisma.$disconnect();
});
