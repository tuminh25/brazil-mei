const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
require('dotenv').config();

async function importHtmlGuides() {
  console.log("🚀 [SG Events Hub] Bắt đầu Import bài viết từ file .txt...");

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

      // 3. Hàm trích xuất dữ liệu bằng Tag
      const extract = (tag) => {
        const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[\\/${tag}\\]`, 'i');
        const match = rawArticle.match(regex);
        return match ? match[1].trim() : null;
      };

      const title = extract("TITLE");
      const slug = extract("SLUG") || `guide-${Date.now()}`;
      const content = extract("CONTENT");
      const excerpt = extract("EXCERPT");
      const imageUrl = extract("IMAGEURL");

      if (!title || !content) {
        console.log("⚠️ Bỏ qua một mục do thiếu TITLE hoặc CONTENT.");
        continue;
      }

      // 4. Dọn dẹp nội dung (Xóa Markdown thừa, Citations, và redundant icons)
      const cleanContent = content
        .replace(/\*\*/g, "")
        .replace(/\[[web:\d\s,]+\]/gi, "") // Xóa [web:1], [web:1][web:2], [web:9,14] v.v.
        .replace(/✦/g, "")                 // Xóa icon ✦ vì CSS xử lý rồi
        .replace(/\[\d+\]/g, "");           // Xóa các số trong ngoặc vuông khác nếu có

      // 5. Tìm Tác giả Desmond
      const author = await prisma.author.findFirst({ where: { name: { contains: "Desmond" } } });

      // 6. Lưu vào bảng Post (Dùng upsert để tránh trùng lặp)
      const post = await prisma.post.upsert({
        where: { slug: slug },
        update: {
          title: title,
          content: cleanContent,
          excerpt: excerpt || "",
          isNewsjack: false,
          status: 'PUBLISHED',
          category: 'Expert Guide',
          authorId: author?.id || "cl7vsk9u1000008l6h2x6h6p1",
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200",
          updatedAt: new Date()
        },
        create: {
          title: title,
          slug: slug,
          content: cleanContent,
          excerpt: excerpt || "",
          isNewsjack: false,
          status: 'PUBLISHED',
          category: 'Expert Guide',
          authorId: author?.id || "cl7vsk9u1000008l6h2x6h6p1",
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      console.log(`✅ Đã lên sóng: ${post.title}`);
    }

    console.log("🎉 TẤT CẢ BÀI VIẾT ĐÃ ĐƯỢC NHẬP THÀNH CÔNG!");

  } catch (error) {
    console.error("❌ LỖI RỒI SẾP ƠI:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importHtmlGuides();