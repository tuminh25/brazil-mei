// scripts/import-news.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const prisma = new PrismaClient();

// HÀM LẤY ẢNH TỪ LINK GỐC
async function fetchMetaImage(url) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const { data } = await axios.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 5000 
    });
    const $ = cheerio.load(data);
    return $('meta[property="og:image"]').attr('content') || null;
  } catch (e) { return null; }
}

// HÀM TẠO SLUG
function generateSlug(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .substring(0, 100);
}

async function runNewsImport() {
  console.log('🚀 KHỞI ĐỘNG NEWSJACK ENGINE (PUBLISH NGAY)...');
  
  try {
    const filePath = 'scripts/news_queue.json';
    if (!fs.existsSync(filePath)) {
        console.error('❌ Không tìm thấy file scripts/news_queue.json');
        return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8').trim();
    // Tự động tìm mảng JSON
    const jsonMatch = fileContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
    
    if (!jsonMatch) {
        console.error('❌ JSON không hợp lệ. Nhớ bọc trong [...]');
        return;
    }

    const newsItems = JSON.parse(jsonMatch[0]);

    for (const item of newsItems) {
      try {
        const title = item.title || item.name;
        console.log(`\n--- 📰 Đang xử lý tin: ${title} ---`);

        // 1. Tự động lấy ảnh báo chí
        let imageUrl = item.imageUrl;
        if (!imageUrl || imageUrl.includes('unsplash')) {
             const metaImg = await fetchMetaImage(item.sourceUrl);
             if (metaImg) imageUrl = metaImg;
             else imageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80"; // Ảnh báo chí mặc định
        }

        // 2. Làm sạch nội dung
        const cleanContent = (item.content || item.description || "").split(/From an EEAT/i)[0].trim();
        const slug = item.slug || generateSlug(title);

        // 3. ĐẨY THẲNG VÀO BẢNG POST - TRẠNG THÁI PUBLISHED
        await prisma.post.upsert({
          where: { slug: slug },
          update: {
            title: title,
            content: cleanContent,
            excerpt: item.excerpt || item.aiSummary,
            imageUrl: imageUrl,
            category: 'Trending News', // <--- CỐ ĐỊNH CATEGORY
            status: 'PUBLISHED',       // <--- XUẤT BẢN LUÔN
            updatedAt: new Date()
          },
          create: {
            slug: slug,
            title: title,
            content: cleanContent,
            excerpt: item.excerpt || item.aiSummary,
            imageUrl: imageUrl,
            category: 'Trending News',
            authorId: 'author_1', // Gán cho Desmond Ho (Editor)
            status: 'PUBLISHED',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });

        console.log(`✅ ĐÃ LÊN SÓNG: ${title}`);

      } catch (e) { console.error(`❌ Lỗi tin: ${e.message}`); }
    }
    console.log('\n🎉 ĐÃ XONG! CHECK TAB TRENDING TRÊN WEB NGAY.');
  } catch (err) { console.error('💥 Lỗi hệ thống:', err.message); } finally { await prisma.$disconnect(); }
}

runNewsImport();