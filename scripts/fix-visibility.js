const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
    console.log("🛠 Restoring categories and flags for guides...");

    const result = await prisma.post.updateMany({
        where: {
            slug: {
                in: [
                    "chinatown-little-india-kampong-glam-route-timing-tips",
                    "singapore-airshow-2026-guide",
                    "how-to-get-to-singapore-airshow-2026-transport-guide"
                ]
            }
        },
        data: {
            category: "Expert Guide",
            isNewsjack: false,
            status: "PUBLISHED"
        }
    });

    console.log(`✅ Fixed ${result.count} posts.`);

    // Also fix anything else that might have been accidentally changed to 'Guides' or 'Guides'
    const result2 = await prisma.post.updateMany({
        where: {
            category: "Guides"
        },
        data: {
            category: "Expert Guide",
            isNewsjack: false
        }
    });
    console.log(`✅ Fixed ${result2.count} additional posts with 'Guides' category.`);

    await prisma.$disconnect();
}

fix();
