const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const posts = await prisma.post.findMany({
        select: { slug: true, category: true, status: true, isNewsjack: true }
    });
    console.log(JSON.stringify(posts, null, 2));
    await prisma.$disconnect();
}

check();
