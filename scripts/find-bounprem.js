const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findBounPrem() {
    console.log("🔍 Searching for BounPrem posts...");
    const posts = await prisma.post.findMany({
        where: {
            OR: [
                { title: { contains: 'BounPrem', mode: 'insensitive' } },
                { content: { contains: 'BounPrem', mode: 'insensitive' } },
                { slug: { contains: 'bounprem', mode: 'insensitive' } }
            ]
        },
        include: { author: true }
    });

    if (posts.length === 0) {
        console.log("❌ No BounPrem posts found.");
        return;
    }

    posts.forEach(p => {
        console.log(`\n--- POST: ${p.title} ---`);
        console.log(`ID: ${p.id}`);
        console.log(`Slug: ${p.slug}`);
        console.log(`Status: ${p.status}`);
        console.log(`Category: ${p.category}`);
        console.log(`isNewsjack: ${p.isNewsjack}`);
        console.log(`Image URL: ${p.imageUrl}`);
        console.log(`Excerpt: ${p.excerpt}`);
    });

    await prisma.$disconnect();
}

findBounPrem();
