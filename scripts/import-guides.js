// scripts/import-guides.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const prisma = new PrismaClient();

// Hàm hút ảnh từ trang gốc (giữ nguyên tính năng xịn)
async function fetchMetaImage(url) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
    const $ = cheerio.load(data);
    return $('meta[property="og:image"]').attr('content') || null;
  } catch (e) { return null; }
}

async function run() {
  console.log('🚀 IMPORTING GUIDES (AUTO-MAPPING MODE)...');
  
  try {
    const filePath = 'scripts/new_guides.json';
    if (!fs.existsSync(filePath)) {
        console.error('❌ Lỗi: Không tìm thấy file scripts/new_guides.json');
        return;
    }

    const rawData = fs.readFileSync(filePath, 'utf8').trim();
    
    // Xử lý JSON linh hoạt
    const jsonMatch = rawData.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) throw new Error("JSON format không hợp lệ");
    
    const data = JSON.parse(jsonMatch[0]);

    for (const item of data) {
      try {
        console.log(`\n--- 📖 Đang xử lý: ${item.name || item.title} ---`);

        // --- BỘ CHUYỂN ĐỔI DỮ LIỆU (ADAPTER) ---
        // Tự động map các trường từ Event sang Post
        const title = item.title || item.name || "Untitled Guide";
        const content = item.content || item.description || "";
        const excerpt = item.excerpt || item.aiSummary || "";
        
        // Xử lý ảnh
        let finalImage = item.imageUrl;
        if ((!finalImage || finalImage.includes('unsplash') || finalImage.includes('esplanade')) && item.sourceUrl) {
            // Nếu ảnh chưa ưng ý, thử đi hút ảnh mới
           const fetched = await fetchMetaImage(item.sourceUrl);
           if (fetched) finalImage = fetched;
        }
        // Fallback ảnh nếu vẫn trống
        if (!finalImage) finalImage = `https://loremflickr.com/1200/800/singapore,concert,music/all?lock=${title.length}`;

        // LÀM SẠCH NỘI DUNG (Dọn rác EEAT/SEO)
        const cleanContent = content.split(/From an EEAT standpoint|EEAT-wise|In terms of EEAT/i)[0].trim();

        // Đẩy vào bảng Post
        await prisma.post.upsert({
          where: { slug: item.slug },
          update: { 
            title: title,
            content: cleanContent, 
            imageUrl: finalImage, 
            excerpt: excerpt,
            category: item.category || "Expert Guide",
            updatedAt: new Date()
          },
          create: {
            slug: item.slug,
            title: title, // Đã map từ name
            excerpt: excerpt, // Đã map từ aiSummary
            content: cleanContent, // Đã map từ description
            imageUrl: finalImage,
            category: item.category || "Expert Guide",
            status: "DRAFT",
            authorId: 'author_3' // Gán mặc định cho Jax (Music/Nightlife) vì đây là bài Music
          }
        });
        console.log(`✅ Thành công: ${title}`);
      } catch (e) {
        console.error(`❌ Lỗi bài này: ${e.message}`);
      }
    }
    console.log('\n🎉 HOÀN TẤT NHẬP GUIDES!');
  } catch (globalError) {
    console.error('💥 Lỗi hệ thống:', globalError.message);
  } finally {
    await prisma.$disconnect();
  }
}
run();