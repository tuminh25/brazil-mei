const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scrubHtml() {
    console.log("🚀 [SG Events Hub] Bắt đầu dọn dẹp Database (Xóa Inline Styles)...");

    try {
        // 1. Dọn dẹp bảng Post (Guides)
        const posts = await prisma.post.findMany();
        console.log(`🔍 Tìm thấy ${posts.length} bài viết.`);

        for (const post of posts) {
            const scrubbedContent = post.content.replace(/style="[^"]*"/gi, '');
            const scrubbedExcerpt = post.excerpt ? post.excerpt.replace(/style="[^"]*"/gi, '') : post.excerpt;

            if (scrubbedContent !== post.content || scrubbedExcerpt !== post.excerpt) {
                await prisma.post.update({
                    where: { id: post.id },
                    data: {
                        content: scrubbedContent,
                        excerpt: scrubbedExcerpt
                    }
                });
                console.log(`✅ Đã dọn dẹp Post: ${post.title}`);
            }
        }

        // 2. Dọn dẹp bảng Event
        const events = await prisma.event.findMany();
        console.log(`🔍 Tìm thấy ${events.length} sự kiện.`);

        for (const event of events) {
            const scrubbedDescription = event.description ? event.description.replace(/style="[^"]*"/gi, '') : event.description;

            if (scrubbedDescription !== event.description) {
                await prisma.event.update({
                    where: { id: event.id },
                    data: {
                        description: scrubbedDescription
                    }
                });
                console.log(`✅ Đã dọn dẹp Event: ${event.name}`);
            }
        }

        console.log("🎉 DATABASE ĐÃ SẠCH BÓNG INLINE STYLES!");

    } catch (error) {
        console.error("❌ LỖI KHI DỌN DẸP DATABASE:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

scrubHtml();
