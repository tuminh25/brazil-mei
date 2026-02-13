const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAllPosts() {
    const posts = await prisma.post.findMany({
        select: { slug: true, title: true, isNewsjack: true, status: true }
    });

    console.log(`🔍 Total posts in DB: ${posts.length}`);
    posts.forEach(p => {
        console.log(`- [${p.status}] [Newsjack: ${p.isNewsjack}] ${p.slug}: ${p.title}`);
    });

    await prisma.$disconnect();
}

listAllPosts();
