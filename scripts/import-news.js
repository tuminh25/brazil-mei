const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
require('dotenv').config();

// HTML SANITIZER (The Cleaner)
function cleanHtml(rawHtml) {
  if (!rawHtml) return "";
  return rawHtml
    .replace(/<!DOCTYPE.*?>/gi, '')
    .replace(/<html.*?>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '') // Remove head block entirely
    .replace(/<body.*?>/gi, '')
    .replace(/<\/body>/gi, '')
    .trim();
}

async function runNewsjackImport() {
  console.log("🚀 [SG Events Hub] Khởi động Newsjack Importer V5.1 (Resilient IndexOf Strategy)...");

  try {
    const filePath = 'scripts/news_queue.txt';
    if (!fs.existsSync(filePath)) throw new Error("File scripts/news_queue.txt không tồn tại!");

    // BOM REMOVAL (Crucial)
    let rawContent = fs.readFileSync(filePath, 'utf8');
    rawContent = rawContent.replace(/^\uFEFF/, '');

    // DEBUG LOGGING
    console.log('--- RAW START ---', rawContent.substring(0, 50).replace(/\n/g, ' '));

    // Tách các bài báo bằng dấu phân cách ===
    const rawItems = rawContent.split(/===.*===/);

    for (let rawItem of rawItems) {
      if (rawItem.trim().length < 50) continue;

      const extract = (tag) => {
        const startTag = `[${tag.toUpperCase()}]`;
        const endTag = `[/${tag.toUpperCase()}]`;

        const startIndex = rawItem.indexOf(startTag);
        if (startIndex === -1) {
          console.log(`❌ FAILED: Could not find ${startTag} tag.`);
          return null;
        }

        const contentStart = startIndex + startTag.length;
        const endIndex = rawItem.indexOf(endTag, contentStart);

        if (endIndex === -1) {
          // CHIẾN THUẬT CỨU VÀN: Nếu thiếu Tag đóng, lấy hết phần còn lại của block
          console.warn(`⚠️ WARNING: Missing closing tag ${endTag}. Capturing until end of block.`);
          return rawItem.substring(contentStart).trim();
        }

        return rawItem.substring(contentStart, endIndex).trim();
      };

      const title = extract("TITLE");
      const slug = extract("SLUG");
      const excerpt = extract("EXCERPT");
      const imageUrl = extract("IMAGEURL");
      let content = extract("CONTENT");

      if (!title || !slug || !content) {
        console.log(`⚠️ BỎ QUA ITEM: Thiếu dữ liệu bắt buộc (Title, Slug, hoặc Content).`);
        continue;
      }

      // HTML SANITIZER
      content = cleanHtml(content);

      // DATABASE SETTINGS
      const DESMOND_ID = "author_1";

      await prisma.post.upsert({
        where: { slug: slug },
        update: {
          title,
          content,
          excerpt,
          imageUrl,
          isNewsjack: true,
          category: 'Trending News',
          status: 'PUBLISHED',
          authorId: DESMOND_ID,
          updatedAt: new Date(),
        },
        create: {
          slug,
          title,
          content,
          excerpt,
          imageUrl,
          isNewsjack: true,
          category: 'Trending News',
          status: 'PUBLISHED',
          authorId: DESMOND_ID,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      console.log(`✅ IMPORTED: ${title}`);
    }
    console.log("🎉 TẤT CẢ TIN TỨC TRENDING ĐÃ ĐƯỢC CẬP NHẬT THÀNH CÔNG (V5.1)!");
  } catch (error) {
    console.error("❌ Lỗi Import News:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runNewsjackImport();
