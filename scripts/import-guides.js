const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
require('dotenv').config();

// Helper to slugify text
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}

async function importHtmlGuides() {
  console.log("🚀 [SG Events Hub] Bắt đầu Universal Import Processor...");

  try {
    // 1. Đọc file text
    const filePath = 'scripts/new_guides.txt';
    if (!fs.existsSync(filePath)) {
      throw new Error("Không tìm thấy file scripts/new_guides.txt. Sếp hãy tạo nó nhé!");
    }
    const rawContent = fs.readFileSync(filePath, 'utf8');

    // 2. Tách các bài viết nếu có nhiều bài (dùng dấu === NEXT_GUIDE ===)
    const rawArticles = rawContent.split(/===.*===/);

    for (let rawArticle of rawArticles) {
      if (rawArticle.trim().length < 50) continue;

      // 3. Hàm trích xuất dữ liệu bằng Tag (Robust & Flexible)
      const extract = (tag) => {
        // Tìm vị trí của tag không phân biệt hoa thường
        const startTagLower = `[${tag.toLowerCase()}]`;
        const endTagLower = `[/${tag.toLowerCase()}]`;

        const rawLower = rawArticle.toLowerCase();

        // Tìm start tag
        let startIndex = rawLower.indexOf(startTagLower);
        if (startIndex === -1) return null;

        let contentStart = startIndex + startTagLower.length;

        // Tìm end tag sau start tag
        let endIndex = rawLower.indexOf(endTagLower, contentStart);
        if (endIndex === -1) return null;

        return rawArticle.substring(contentStart, endIndex).trim();
      };

      let title = extract("TITLE");
      let slug = extract("SLUG");
      let content = extract("CONTENT");
      let excerpt = extract("EXCERPT");
      const imageUrl = extract("IMAGEURL");

      // FALLBACK LOGIC
      if (!content) {
        console.log(`⚠️ Bỏ qua một mục do hoàn toàn không tìm thấy [CONTENT].`);
        continue;
      }

      // 1. Nếu thiếu Title, tìm trong <h1>
      if (!title) {
        const h1Match = content.match(/<h1>(.*?)<\/h1>/i);
        if (h1Match) {
          title = h1Match[1].trim();
          console.log(`ℹ️ Auto-extracted TITLE from H1: [${title}]`);
        }
      }

      // 2. Nếu thiếu Slug, tạo từ Title
      if (!slug && title) {
        slug = slugify(title);
        console.log(`ℹ️ Auto-generated SLUG from Title: [${slug}]`);
      } else if (!slug) {
        slug = `guide-${Date.now()}`;
      }

      // 3. Tự động dọn dẹp Content (Citations, Stars, Icons)
      const cleanContent = content
        .replace(/\*\*/g, "")               // Xóa Markdown bold **
        .replace(/\[[web:\d\s,]+\]/gi, "") // Xóa [web:1], [web:1][web:2], etc.
        .replace(/✦/g, "")                 // Xóa icon ✦ thủ công
        .replace(/\[\d+\]/g, "")           // Xóa các số trong ngoặc vuông khác
        .trim();

      // 4. Nếu thiếu Excerpt, lấy từ Content
      if (!excerpt) {
        excerpt = cleanContent
          .replace(/<[^>]*>/g, "") // Loại bỏ HTML tags để lấy text sạch cho excerpt
          .substring(0, 160)
          .trim() + "...";
        console.log(`ℹ️ Auto-generated EXCERPT from Content.`);
      }

      if (!title) {
        console.log(`⚠️ Bỏ qua một mục do thiếu TITLE và không tìm thấy H1 fallback.`);
        continue;
      }

      // 5. Tác giả Desmond Ho (Dùng ID thật: author_1)
      const DESMOND_ID = "author_1";

      // 6. Lưu vào bảng Post (Dùng upsert theo slug)
      const post = await prisma.post.upsert({
        where: { slug: slug },
        update: {
          title: title,
          content: cleanContent,
          excerpt: excerpt,
          status: 'PUBLISHED',
          category: 'Expert Guide',
          authorId: DESMOND_ID,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200",
          updatedAt: new Date()
        },
        create: {
          title: title,
          slug: slug,
          content: cleanContent,
          excerpt: excerpt,
          status: 'PUBLISHED',
          category: 'Expert Guide',
          authorId: DESMOND_ID,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      console.log(`✅ IMPORTED: ${post.title} (Slug: ${post.slug})`);
    }

    console.log("🎉 TẤT CẢ BÀI VIẾT ĐÃ ĐƯỢC XỬ LÝ THÀNH CÔNG!");

  } catch (error) {
    console.error("❌ LỖI RỒI SẾP ƠI:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importHtmlGuides();
