const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

async function hardCleanPost() {
    const slug = "15-best-indoor-playgrounds-in-singapore";
    console.log(`🚀 [SG Events Hub] Starting hard clean for post: ${slug}`);

    try {
        // 1. Find the post
        const post = await prisma.post.findUnique({
            where: { slug: slug }
        });

        if (!post) {
            console.error(`❌ Post not found: ${slug}`);
            return;
        }

        console.log(`🔍 Found post: "${post.title}"`);
        let content = post.content;

        // 2. Remove <style>...</style> blocks completely (including content)
        content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

        // 3. Remove style="..." attributes
        content = content.replace(/style="[^"]*"/gi, '');

        // 4. Remove EVERY SINGLE HTML TAG except <h2>, <h3>, <p>, <ul>, <li>, <strong>
        // Regex: matches any tag NOT in the whitelist
        const tagWhitelistRegex = /<(?!\/?(h2|h3|p|ul|li|strong)\b)[^>]*>/gi;
        content = content.replace(tagWhitelistRegex, '');

        // 5. Clean up extra whitespace if any (optional but good for "hard clean")
        content = content.trim();

        // 6. Update the DB
        const updatedPost = await prisma.post.update({
            where: { id: post.id },
            data: { content: content }
        });

        console.log(`✅ Post updated successfully!`);

        // 7. Verify: Log first 500 characters
        console.log(`\n--- CLEANED CONTENT PREVIEW (First 500 chars) ---\n`);
        console.log(content.substring(0, 500));
        console.log(`\n------------------------------------------------\n`);

        // 8. Force Revalidate
        const secret = "BOSS2026";
        const revalidateUrl = `http://localhost:3000/api/revalidate?path=/guides/${slug}&secret=${secret}`;
        
        console.log(`🔄 Triggering revalidation: ${revalidateUrl}`);
        try {
            const response = await axios.get(revalidateUrl);
            console.log(`✅ Revalidation successful:`, response.data);
        } catch (revError) {
            console.warn(`⚠️ Revalidation failed (Server might not be running): ${revError.message}`);
            console.log(`💡 You can manually revalidate by visiting: ${revalidateUrl}`);
        }

    } catch (error) {
        console.error("❌ ERROR DURING CLEANUP:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

hardCleanPost();
