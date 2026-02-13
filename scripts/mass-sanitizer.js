// scripts/mass-sanitizer.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
    console.log("🧹 STARTING MASS SANITIZATION...");

    // Sanitizing Posts
    const posts = await prisma.post.findMany();
    console.log(`📝 Processing ${posts.length} posts...`);
    for (const post of posts) {
        let content = post.content || "";
        // Remove ✦ or ** at the start of tags
        // Matches <li>✦ or <p>✦ or <li>** or <p>** etc.
        const cleanContent = content
            .replace(/(<[a-z0-9]+[^>]*>)\s*[✦*]{1,2}\s*/gi, "$1")
            .replace(/<li[^>]*>\s*✦\s*/gi, "<li>");

        if (cleanContent !== content) {
            await prisma.post.update({
                where: { id: post.id },
                data: { content: cleanContent }
            });
            console.log(`✅ Sanitized Post: ${post.title}`);
        }
    }

    // Sanitizing Events
    const events = await prisma.event.findMany();
    console.log(`📅 Processing ${events.length} events...`);
    for (const event of events) {
        let description = event.description || "";
        const cleanDescription = description
            .replace(/(<[a-z0-9]+[^>]*>)\s*[✦*]{1,2}\s*/gi, "$1")
            .replace(/<li[^>]*>\s*✦\s*/gi, "<li>");

        if (cleanDescription !== description) {
            await prisma.event.update({
                where: { id: event.id },
                data: { description: cleanDescription }
            });
            console.log(`✅ Sanitized Event: ${event.name}`);
        }
    }

    console.log("🎉 MASS SANITIZATION COMPLETE!");
    await prisma.$disconnect();
}

run().catch((e) => {
    console.error("💥 Error during sanitization:", e.message);
    prisma.$disconnect();
});
