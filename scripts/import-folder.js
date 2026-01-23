// scripts/import-folder.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const prisma = new PrismaClient();
const QUEUE_DIR = path.join(__dirname, '../content-queue'); 

// CẤU HÌNH AFFILIATE
const KLOOK_AID = '105111';
const TRIP_ALLIANCE_ID = '7367361';
const TRIP_SID = '278066643';

// ... (CÁC HÀM BỔ TRỢ GIỮ NGUYÊN) ...
function generateSlug(text) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').substring(0, 100);
}
function pickAuthorId(title) {
  const t = (title || "").toLowerCase();
  if (t.includes('kid') || t.includes('family')) return 'author_2';
  if (t.includes('night') || t.includes('party')) return 'author_3';
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
    if (type === 'KLOOK' && url.includes('klook.com') && !url.includes('aid=')) return `${url}${separator}aid=${KLOOK_AID}&utm_medium=affiliate-alwayson&utm_source=non-network&utm_campaign=${KLOOK_AID}`;
    if (type === 'TRIP' && url.includes('trip.com') && !url.includes('Allianceid=')) return `${url}${separator}Allianceid=${TRIP_ALLIANCE_ID}&SID=${TRIP_SID}`;
    return url;
}

async function runBatchImport() {
  // LẤY TÊN FILE TỪ LỆNH CỦA SẾP
  const targetFile = process.argv[2]; 

  if (targetFile) {
    console.log(`🎯 CHẾ ĐỘ TEST: Đang chỉ định chạy file "${targetFile}"...`);
  } else {
    console.log(`🚀 CHẾ ĐỘ HÀNG LOẠT: Đang quét toàn bộ thư mục...`);
  }

  if (!fs.existsSync(QUEUE_DIR)) {
    console.error("❌ Lỗi: Không tìm thấy thư mục 'content-queue'");
    return;
  }

  let files = [];
  if (targetFile) {
    // Nếu Sếp chỉ định file, chỉ chạy file đó
    if (fs.existsSync(path.join(QUEUE_DIR, targetFile))) {
        files = [targetFile];
    } else {
        console.error(`❌ Lỗi: Không tìm thấy file "${targetFile}" trong thư mục content-queue`);
        return;
    }
  } else {
    // Nếu không chỉ định, chạy hết các file .json
    files = fs.readdirSync(QUEUE_DIR).filter(file => file.endsWith('.json'));
  }

  console.log(`📊 Tìm thấy ${files.length} file để xử lý.`);

  for (const file of files) {
    const filePath = path.join(QUEUE_DIR, file);
    try {
      console.log(`\n📄 Đang xử lý file: ${file}`);
      const rawContent = fs.readFileSync(filePath, 'utf8');
      
      // Xử lý linh hoạt JSON
      let data;
      try {
          data = JSON.parse(rawContent);
      } catch (jsonErr) {
          throw new Error("Lỗi cú pháp JSON. Sếp check lại dấu phẩy hoặc ngoặc kép!");
      }
      
      if (Array.isArray(data)) data = data[0]; 

      const name = data.name || data.title;
      if (!name) throw new Error("File thiếu tên bài viết");

      const slug = data.slug || generateSlug(name);
      let imageUrl = await fetchMetaImage(data.sourceUrl);
      if (!imageUrl) imageUrl = `https://loremflickr.com/1200/800/singapore,travel/all?lock=${name.length}`;

      const finalPitch = `${data.marketingPitch || ''}\n\n🔗 Book: ${attachAffiliateTags(data.sourceUrl, 'KLOOK')}`;
      
      const eventData = {
        slug: slug,
        name: name,
        description: (data.description || data.content || "").split(/From an EEAT/i)[0].trim(),
        imageUrl: imageUrl,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        venue: data.venue || "Singapore",
        venueAddress: data.venueAddress || "",
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        price: data.price?.toString() || "TBA",
        sourceUrl: attachAffiliateTags(data.sourceUrl, 'TRIP'),
        category: "Attraction",
        authorId: pickAuthorId(name),
        aiSummary: data.aiSummary,
        aiSmartTips: data.aiSmartTips,
        aiFaq: data.aiFaq,
        marketingPitch: finalPitch,
        nearbyAttractions: data.nearbyAttractions,
        
        // VẪN ĐỂ DRAFT ĐỂ AN TOÀN KHI TEST
        status: 'DRAFT', 
        updatedAt: new Date()
      };

      await prisma.event.upsert({
        where: { slug: slug },
        update: eventData,
        create: eventData
      });

      console.log(`✅ TEST THÀNH CÔNG: ${name} (Đã vào kho DRAFT)`);

    } catch (e) {
      console.error(`❌ Lỗi file ${file}:`, e.message);
    }
  }

  console.log(`\n🎉 HOÀN TẤT QUY TRÌNH.`);
}

runBatchImport();