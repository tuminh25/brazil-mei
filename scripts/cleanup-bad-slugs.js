const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.post.deleteMany({
        where: {
            slug: {
                startsWith: '/'
            }
        }
    });
    console.log(`Deleted ${result.count} posts with leading slash slugs.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
