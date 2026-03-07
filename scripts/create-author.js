const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Creating/Verifying author: Jamie Loh...');
    const author = await prisma.author.upsert({
        where: { id: 'author_jamie' },
        update: {
            name: 'Jamie Loh',
            role: 'Singapore-based family travel writer',
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            bio: "Jamie has covered Singapore's family events and school holiday calendar for 8+ years, attending every major children's production at Sands Theatre since 2016."
        },
        create: {
            id: 'author_jamie',
            name: 'Jamie Loh',
            role: 'Singapore-based family travel writer',
            avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            bio: "Jamie has covered Singapore's family events and school holiday calendar for 8+ years, attending every major children's production at Sands Theatre since 2016."
        }
    });
    console.log('✅ Author created/verified:', author.name);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
