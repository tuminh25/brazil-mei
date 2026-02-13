const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkNews() {
    const posts = await prisma.post.findMany({
        where: { isNewsjack: true }
    });

    console.log(`🔍 Found ${posts.length} newsjack posts.`);
    posts.forEach(p => {
        console.log(`- [${p.status}] [${p.category}] ${p.title} (Slug: ${p.slug}, isNewsjack: ${p.isNewsjack})`);
    });

    const allPosts = await prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });
    console.log('\n🔍 Latest 5 posts overall:');
    allPosts.forEach(p => {
        console.log(`- [${p.status}] [${p.category}] ${p.title} (isNewsjack: ${p.isNewsjack})`);
    });

    await prisma.$disconnect();
}

checkNews();
