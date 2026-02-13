// scripts/sync-guide-to-event.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
    const guideSlug = "chinatown-little-india-kampong-glam-route-timing-tips";
    console.log(`🔍 Syncing guide ${guideSlug} to Event table...`);

    const post = await prisma.post.findUnique({
        where: { slug: guideSlug },
        include: { author: true }
    });

    if (!post) {
        console.error("❌ Post not found!");
        return;
    }

    // Create or Update the attraction in the Event table
    const event = await prisma.event.upsert({
        where: { slug: guideSlug },
        update: {
            name: post.title,
            description: post.content, // Using the transformed HTML
            imageUrl: post.imageUrl || "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200",
            category: "Attraction",
            status: "PUBLISHED",
            sourceUrl: "https://www.klook.com/en-SG/city/6-singapore-things-to-do/", // Add sourceUrl
            aiSummary: post.excerpt || "A comprehensive insider guide to Singapore's three main cultural heritage districts.",
            venue: "Chinatown, Little India, Kampong Glam",
            price: "FREE",
            isFree: true,
            hotnessScore: 95,
            authorId: post.authorId,
            updatedAt: new Date()
        },
        create: {
            slug: guideSlug,
            name: post.title,
            description: post.content,
            imageUrl: post.imageUrl || "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200",
            category: "Attraction",
            status: "PUBLISHED",
            sourceUrl: "https://www.klook.com/en-SG/city/6-singapore-things-to-do/", // Add sourceUrl
            aiSummary: post.excerpt || "A comprehensive insider guide to Singapore's three main cultural heritage districts.",
            venue: "Chinatown, Little India, Kampong Glam",
            price: "FREE",
            isFree: true,
            hotnessScore: 95,
            status: "PUBLISHED",
            authorId: post.authorId,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    console.log(`✅ Successfully synced: ${event.name} as Attraction.`);
    await prisma.$disconnect();
}

run().catch(e => {
    console.error("💥 Error during sync:", e.message);
    prisma.$disconnect();
});
