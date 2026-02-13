const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSpecificPost() {
    const slug = 'taylor-swift-singapore-2026-rumor-check';
    const post = await prisma.post.findUnique({
        where: { slug }
    });

    if (post) {
        console.log(`✅ Found post: ${post.title}`);
        console.log(`- Status: ${post.status}`);
        console.log(`- Category: ${post.category}`);
        console.log(`- isNewsjack: ${post.isNewsjack} (Type: ${typeof post.isNewsjack})`);
        console.log(`- authorId: ${post.authorId}`);
    } else {
        console.log(`❌ Post not found: ${slug}`);
    }

    await prisma.$disconnect();
}

checkSpecificPost();
