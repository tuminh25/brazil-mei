// scripts/import-folder.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const prisma = new PrismaClient();
const QUEUE_DIR = path.join(__dirname, '../content-queue'); 

const KLOOK_AID = '105111';
const TRIP_ALLIANCE_ID = '7367361';
const TRIP_SID = '278066643';

// --- HÀM TỰ ĐỘNG ĐẢM BẢO TÁC GIẢ TỒN TẠI ---
async function ensureAuthorsExist() {
  console.log('👥 Đang kiểm tra danh sách tác giả...');
  const authors = [
    { id: 'author_1', name: 'Desmond Ho', role: 'Chief Editor & 25-Year Local', bio: 'Living in Singapore since 1998. Expert in travel and local gems.', avatarUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400' },
    { id: 'author_2', name: 'Sarah Tan', role: 'Family & Kids Editor', bio: 'Mom of two. Expert in playgrounds and family-friendly hacks.', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
    { id: 'author_3', name: 'Jax', role: 'Nightlife & Trends Scout', bio: 'Chasing the best beats and hidden nightlife spots in SG.', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400' }
  ];

  for (const a of authors) {
    await prisma.author.upsert({
      where: { id: a.id },
      update: { name: a.name, role: a.role, bio: a.bio, avatarUrl: a.avatarUrl },
      create: a
    });
  }
  console.log('✅ Hệ thống tác giả đã sẵn sàng.');
}

function generateSlug(text) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').substring(0, 100);
}

function pickAuthorId(title) {
  const t = (title || "").toLowerCase();
  if (t.includes('kid') || t.includes('family') || t.includes('zoo') || t.includes('oceanarium')) return 'author_2';
  if (t.includes('night') || t.includes('party') || t.includes('bike') || t.includes('concert')) return 'author_3';
  return 'author_1';
}

async function fetchMetaImage(url) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
    const $ = cheerio.load(data);
    return $('meta[property="og:image"]').attr('content') || null;
  } catch (e) { return null; }
}

function attachAffiliateTags(url, type) {
    if (!url || !url.startsWith('http')) return url;
    const separator = url.includes('?') ? '&' : '?';
    if (url.includes('klook.com')) return `${url}${separator}aid=${KLOOK_AID}&utm_medium=affiliate-alwayson&utm_source=non-network&utm_campaign=${KLOOK_AID}`;
    if (url.includes('trip.com')) return `${url}${separator}Allianceid=${TRIP_ALLIANCE_ID}&SID=${TRIP_SID}`;
    return url;
}

async function runBatchImport() {
  try {
    console.log('🚀 KHỞI ĐỘNG CỖ MÁY IMPORT EVERGREEN...');
    
    await ensureAuthorsExist();

    if (!fs.existsSync(QUEUE_DIR)) return console.error("❌ Folder content-queue trống!");

    const files = fs.readdirSync(QUEUE_DIR).filter(file => file.endsWith('.json'));
    console.log(`📊 Tìm thấy ${files.length} file.`);

    for (const file of files) {
      try {
        const rawContent = fs.readFileSync(path.join(QUEUE_DIR, file), 'utf8');
        let data = JSON.parse(rawContent);
        if (Array.isArray(data)) data = data[0];

        const name = data.name || data.title;
        const slug = data.slug || generateSlug(name);
        
        // Luôn gán cho Desmond theo yêu cầu Sếp
        const authorId = 'author_1'; 

        console.log(`\n📄 Đang xử lý: ${name}`);

        let imageUrl = data.imageUrl;
        if (!imageUrl) {
          imageUrl = await fetchMetaImage(data.sourceUrl);
        }
        if (!imageUrl) imageUrl = `https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200`;

        // SMART MAPPING: Ánh xạ các trường thông minh
        const insiderPrice = data.insiderPrice || data.price || data.ticketPrice || null;
        const bestTime = data.bestTime || data.timing || data.openingHours || data.bestVisitTime || null;
        
        // Xử lý secretTip: Nếu là object (aiSmartTips) thì chuyển thành text hoặc lấy chuỗi
        let secretTip = data.secretTip || data.tips || data.aiSmartTips;
        if (typeof secretTip === 'object' && secretTip !== null) {
          secretTip = JSON.stringify(secretTip).substring(0, 500); // Rút gọn nếu là object
        }

        const postData = {
          slug: slug,
          title: name,
          content: (data.description || data.content || "").split(/From an EEAT/i)[0].trim(),
          imageUrl: imageUrl,
          excerpt: data.aiSummary || data.excerpt || name.substring(0, 160),
          category: "Evergreen", // Ép về Evergreen
          authorId: authorId,    // Ép về Desmond
          isNewsjack: false,     // Luôn false
          status: 'PUBLISHED',   // Luôn PUBLISHED
          insiderPrice: insiderPrice,
          bestTime: bestTime,
          secretTip: secretTip,
          updatedAt: new Date()
        };

        await prisma.post.upsert({
          where: { slug: slug },
          update: postData,
          create: postData
        });

        console.log(`✅ Thành công: ${name}`);

      } catch (e) { console.error(`❌ Lỗi file ${file}:`, e.message); }
    }
    console.log('\n🎉 TẤT CẢ ĐÃ LÊN SÓNG MƯỢT MÀ!');
    
    // BƯỚC CUỐI: Gọi revalidate (Sử dụng API đã tạo)
    try {
      console.log('🔄 Đang kích hoạt revalidate...');
      // Giả sử server đang chạy local hoặc ta chỉ cần thông báo Sếp
      console.log('👉 Tip: Truy cập /api/revalidate?path=/&secret=BOSS2026 để xóa cache ngay.');
    } catch (revalidateError) {
      console.error('⚠️ Không thể tự động revalidate:', revalidateError.message);
    }

  } catch (err) { console.error('💥 Lỗi hệ thống:', err.message); } finally { await prisma.$disconnect(); }
}

runBatchImport();