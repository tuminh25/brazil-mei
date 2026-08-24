const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFivePosts() {
    const slugs = [
        'grocery-store-near-me-singapore',
        'supermarket-near-me-singapore',
        'grocery-store-singapore',
        'giants-supermarket-singapore',
        'sctp-singapore-guide'
    ];
    
    console.log('Checking 5 specific posts:');
    console.log('============================');
    
    for (const slug of slugs) {
        const post = await prisma.post.findUnique({
            where: { slug }
        });
        
        if (post) {
            console.log('Found post: ' + post.title);
            console.log('  - Slug: ' + post.slug);
            console.log('  - Status: ' + post.status);
            console.log('  - Category: ' + post.category);
            console.log('  - isNewsjack: ' + post.isNewsjack);
            console.log('  - Created: ' + post.createdAt);
            console.log('  - Updated: ' + post.updatedAt);
            console.log('');
        } else {
            console.log('Post NOT FOUND: ' + slug);
            console.log('');
        }
    }
    
    await prisma.$disconnect();
}

checkFivePosts().catch(console.error);