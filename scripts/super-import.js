const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
require('dotenv').config();

async function superImportHtmlEvents() {
  console.log("🚀 [SG Events Hub] Bắt đầu Siêu Nhập Khẩu V3.0 (Universal Importer)...");

  try {
    const filePath = 'scripts/new_events.txt';
    if (!fs.existsSync(filePath)) throw new Error("File new_events.txt không tồn tại!");

    // ENCODING FIX: Đọc UTF8 và xóa BOM
    let rawContent = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const rawEvents = rawContent.split(/===.*===/);

    for (let rawEvent of rawEvents) {
      if (rawEvent.trim().length < 50) continue;

      // X-RAY LOGGING: Xem dữ liệu thô để tìm ký tự ẩn
      console.log('--- SCANNING RAW DATA ---', rawEvent.substring(0, 300).replace(/\n/g, ' '));

      // UPGRADE EXTRACTOR: Case-insensitive, handles [ NAME ] and [NAME], trims content
      const extract = (tag) => {
        const tagLower = tag.toLowerCase();

        // Tìm vị trí mở tag (chấp nhận [TAG] hoặc [ TAG ])
        const startRegex = new RegExp(`\\[\\s*${tagLower}\\s*\\]`, 'i');
        const startMatch = rawEvent.match(startRegex);
        if (!startMatch) return null;

        const startIndex = startMatch.index;
        const contentStart = startIndex + startMatch[0].length;

        // Tìm vị trí đóng tag (chấp nhận [/TAG] hoặc [ / TAG ])
        const endRegex = new RegExp(`\\[\\s*/\\s*${tagLower}\\s*\\]`, 'i');
        const endMatch = rawEvent.match(endRegex);
        if (!endMatch) return null;

        const endIndex = endMatch.index;

        return rawEvent.substring(contentStart, endIndex).trim();
      };

      // ALIAS LOGIC: Thử cả NAME/TITLE và DESCRIPTION/CONTENT
      const name = extract("NAME") || extract("TITLE");
      const rawDescription = extract("DESCRIPTION") || extract("CONTENT");
      const slug = extract("SLUG");

      const venue = extract("VENUE");
      const price = extract("PRICE");
      const sourceUrl = extract("SOURCEURL");
      const imageUrl = extract("IMAGEURL");

      // DETAILED ERROR REPORT
      const missingTags = [];
      if (!slug) missingTags.push("SLUG");
      if (!name) missingTags.push("NAME/TITLE");
      if (!rawDescription) missingTags.push("DESCRIPTION/CONTENT");

      if (missingTags.length > 0) {
        console.log(`⚠️ Bỏ qua Event do thiếu các thẻ bắt buộc: ${missingTags.join(', ')}`);
        continue;
      }

      // --- AUTO-CLEANING LOGIC ---
      console.log(`🧹 Đang dọn dẹp nội dung cho: ${name}...`);
      let cleanDescription = rawDescription
        .replace(/\[\d+\]/g, '') // 1. Xóa citation [1][2]...
        .replace(/Images are illustrative.*?\./g, '') // 2. Xóa disclaimer "Images are illustrative"
        .replace(/Verify at.*?\./gi, '') // 3. Xóa disclaimer "Verify at..."
        .replace(/<em>Images are illustrative.*?<\/em>/gi, '')
        .replace(/<p>Images are illustrative.*?<\/p>/gi, '')
        .trim();

      // --- AFFILIATE INJECTION LOGIC ---
      const KLOOK_AFF = "https://www.klook.com/en-SG/search/result/?query=singapore&aid=105111";
      const TRIP_AFF = "https://www.trip.com/hotels/list?city=65&allianceid=7367361&sid=278066643";

      // Force Klook for "Book Now" links
      cleanDescription = cleanDescription.replace(/<a\s+[^>]*>([^<]*Book Now[^<]*)<\/a>/gi, (match, text) => {
        console.log(`💉 Injected Klook Link for: [${text}]`);
        return `<a href="${KLOOK_AFF}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      });

      // Force Trip.com for "Search Hotels" links
      cleanDescription = cleanDescription.replace(/<a\s+[^>]*>([^<]*Search Hotels[^<]*)<\/a>/gi, (match, text) => {
        console.log(`💉 Injected Trip.com Link for: [${text}]`);
        return `<a href="${TRIP_AFF}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      });

      // ID của Jax (Author cho Events)
      const AUTHOR_JAX_ID = "author_3";

      // DÙNG UPSERT: Nếu slug đã có thì UPDATE, chưa có thì CREATE
      await prisma.event.upsert({
        where: { slug: slug },
        update: {
          name,
          description: cleanDescription,
          venue,
          price,
          sourceUrl,
          imageUrl,
          status: 'PUBLISHED',
          category: 'Event',
          authorId: AUTHOR_JAX_ID,
          updatedAt: new Date(),
        },
        create: {
          name,
          slug,
          description: cleanDescription,
          venue,
          price,
          sourceUrl,
          imageUrl,
          status: 'PUBLISHED',
          category: 'Event',
          authorId: AUTHOR_JAX_ID,
          startDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      console.log(`✅ [CLEANED & INJECTED] Đã cập nhật xong: ${name}`);
    }
    console.log("🎉 TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC XỬ LÝ VÀ DỌN DẸP XONG!");
  } catch (error) {
    console.error("❌ Lỗi Siêu Nhập Khẩu:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

superImportHtmlEvents();
