// scripts/remove-old-disclosure.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
    const oldText = "Disclosure: We may earn a commission when you book through our links, at no extra cost to you.";
    console.log(`🧹 Scanning for old disclosure: "${oldText}"`);

    // Cleanup Posts
    const posts = await prisma.post.findMany({
        where: {
            content: { contains: oldText }
        }
    });
    console.log(`📝 Found ${posts.length} posts with old disclosure.`);
    for (const post of posts) {
        const cleanContent = post.content.replace(oldText, "").trim();
        await prisma.post.update({
            where: { id: post.id },
            data: { content: cleanContent }
        });
        console.log(`✅ Cleaned Post: ${post.title}`);
    }

    // Cleanup Events
    const events = await prisma.event.findMany({
        where: {
            description: { contains: oldText }
        }
    });
    console.log(`📅 Found ${events.length} events with old disclosure.`);
    for (const event of events) {
        const cleanDescription = event.description.replace(oldText, "").trim();
        await prisma.event.update({
            where: { id: event.id },
            data: { description: cleanDescription }
        });
        console.log(`✅ Cleaned Event: ${event.name}`);
    }

    console.log("🎉 OLD DISCLOSURE REMOVAL COMPLETE!");
    await prisma.$disconnect();
}

run().catch((e) => {
    console.error("💥 Error during cleanup:", e.message);
    prisma.$disconnect();
});
