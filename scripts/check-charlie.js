require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
    const r = await prisma.event.findFirst({
        where: { slug: { contains: 'charlie' } },
        select: { name: true, slug: true, status: true, category: true, startDate: true, endDate: true }
    });
    console.log(JSON.stringify(r, null, 2));
    await prisma.$disconnect();
}
check();
