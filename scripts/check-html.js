const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function check() {
    const e = await prisma.event.findUnique({
        where: { slug: 'les-miserables-singapore-2026-sands-theatre-tickets-seats' }
    });
    console.log(e.description.substring(0, 1500));
    await prisma.$disconnect();
}
check();
