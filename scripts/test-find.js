const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function run() {
    const ev = await prisma.event.findFirst({
        where: { name: { contains: 'Miserables' } }
    });
    console.log("EVENT:", ev);

    const post = await prisma.post.findFirst({
        where: { title: { contains: 'Miserables' } }
    });
    console.log("POST:", post);

    await prisma.$disconnect();
}
run();
