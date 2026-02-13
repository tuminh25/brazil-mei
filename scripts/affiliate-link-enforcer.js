const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function enforceAffiliateLinks() {
    console.log("🚀 [SG Events Hub] Bắt đầu Enforce Affiliate Links...");

    const KLOOK_GARDENS_LINK = "https://www.klook.com/en-SG/activity/127-gardens-by-the-bay-singapore/?aid=105111";

    try {
        const events = await prisma.event.findMany({
            where: {
                OR: [
                    { description: { contains: "riverhongbao.sg" } },
                    { description: { contains: "gardensbythebay.com.sg" } }
                ]
            }
        });

        console.log(`🔍 Tìm thấy ${events.length} sự kiện có chứa link leak.`);

        for (const event of events) {
            if (!event.description) continue;

            // Regex để tìm các thẻ <a> trỏ đến các domain bị cấm
            const forbiddenDomainsRegex = /<a\s+(?:[^>]*?\s+)?href="https?:\/\/(?:www\.)?(?:riverhongbao\.sg|gardensbythebay\.com\.sg)[^"]*"(?:[^>]*?)>(.*?)<\/a>/gi;

            const newDescription = event.description.replace(forbiddenDomainsRegex, (match, anchorText) => {
                console.log(`🔗 Thay thế link leak trong [${event.name}]: ${match} -> Klook`);
                return `<a href="${KLOOK_GARDENS_LINK}" target="_blank" rel="noopener noreferrer">${anchorText}</a>`;
            });

            if (newDescription !== event.description) {
                await prisma.event.update({
                    where: { id: event.id },
                    data: { description: newDescription }
                });
                console.log(`✅ Đã cập nhật xong: ${event.name}`);
            }
        }

        console.log("🎉 TẤT CẢ LINK LEAK ĐÃ ĐƯỢC CHẶN VÀ CHUYỂN HƯỚNG SANG KLOOK!");

    } catch (error) {
        console.error("❌ LỖI KHI CHẠY ENFORCER:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

enforceAffiliateLinks();
