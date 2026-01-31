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
    console.log('🚀 KHỞI ĐỘNG CỖ MÁY V21.0...');
    
    // BƯỚC QUAN TRỌNG: TỰ TẠO TÁC GIẢ NẾU THIẾU
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
        const authorId = pickAuthorId(name);

        console.log(`\n📄 Đang xử lý: ${name}`);

        let imageUrl = await fetchMetaImage(data.sourceUrl);
        if (!imageUrl) imageUrl = `https://loremflickr.com/1200/800/singapore,city/all?lock=${name.length}`;

        const eventData = {
          slug: slug,
          name: name,
          description: (data.description || data.content || "").split(/From an EEAT/i)[0].trim(),
          imageUrl: imageUrl,
          startDate: data.startDate ? new Date(data.startDate) : new Date(),
          venue: data.venue || "Singapore",
          price: data.price?.toString() || "TBA",
          sourceUrl: attachAffiliateTags(data.sourceUrl),
          category: "Events",
          authorId: authorId, // <--- BÂY GIỜ CHẮC CHẮN SẼ CÓ ID NÀY
          aiSummary: data.aiSummary || data.excerpt,
          aiFaq: data.aiFaq || [],
          aiBestFor: data.aiBestFor || "",
          aiVibe: data.aiVibe || "",
          marketingPitch: data.marketingPitch || "",
          status: 'PUBLISHED', // ĐĂNG LUÔN ĐỂ KIỂM TRA
          updatedAt: new Date()
        };

        await prisma.event.upsert({
          where: { slug: slug },
          update: eventData,
          create: eventData
        });

        console.log(`✅ Thành công: ${name}`);

      } catch (e) { console.error(`❌ Lỗi file ${file}:`, e.message); }
    }
    console.log('\n🎉 TẤT CẢ ĐÃ LÊN SÓNG MƯỢT MÀ!');
  } catch (err) { console.error('💥 Lỗi hệ thống:', err.message); } finally { await prisma.$disconnect(); }
}

runBatchImport();