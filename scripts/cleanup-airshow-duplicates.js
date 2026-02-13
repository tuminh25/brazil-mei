// scripts/cleanup-airshow-duplicates.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
    console.log("🧹 Cleaning up duplicate Airshow posts...");

    // Delete posts where slug contains 'how-to-get-to-singapore-airshow-2026-transport-guide-' (with timestamp)
    const deleted = await prisma.post.deleteMany({
        where: {
            slug: {
                contains: "how-to-get-to-singapore-airshow-2026-transport-guide-"
            }
        }
    });

    console.log(`✅ Deleted ${deleted.count} duplicate posts.`);
    await prisma.$disconnect();
}

run().catch((e) => {
    console.error("💥 Error:", e.message);
    prisma.$disconnect();
});
