const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deepCheck() {
    const posts = await prisma.post.findMany({
        where: { slug: 'taylor-swift-singapore-2026-rumor-check' }
    });

    if (posts.length > 0) {
        const p = posts[0];
        console.log(`--- POST DATA ---`);
        console.log(`Title: "${p.title}"`);
        console.log(`Category: "${p.category}"`);
        console.log(`Status: "${p.status}"`);
        console.log(`isNewsjack: ${p.isNewsjack} (Type: ${typeof p.isNewsjack})`);
        console.log(`-----------------`);
    } else {
        console.log(`❌ Post NOT FOUND`);
    }

    await prisma.$disconnect();
}

deepCheck();
