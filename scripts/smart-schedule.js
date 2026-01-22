// scripts/smart-schedule.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const prisma = new PrismaClient();

// --- CẤU HÌNH ĐIỀU KHIỂN (SẾP CHỈNH Ở ĐÂY) ---
const BATCH_SIZE = 2;       // Số bài muốn đăng trong lần chạy này (Sếp bảo 2 bài)
const DELAY_MINUTES = 3;    // Thời gian nghỉ giữa các bài (Sếp bảo 3 phút)

// CẤU HÌNH AFFILIATE
const KLOOK_AID = '105111';
const TRIP_ALLIANCE_ID = '7367361';
const TRIP_SID = '278066643';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// HÀM: Tự động phân loại Event/Attraction
function classifyCategory(name, venue) {
  const text = (name + " " + (venue || "")).toLowerCase();
  const evergreenKeywords = [
    'universal studios', 'zoo', 'night safari', 'river wonders', 'bird paradise',
    'gardens by the bay', 'cloud forest', 'flower dome', 'aquarium', 'skyline luge', 
    'cable car', 'flyer', 'marina bay sands', 'artscience', 'museum'
  ];
  if (evergreenKeywords.some(key => text.includes(key))) return 'Attraction';
  return 'Event';
}

// HÀM: Tự động chọn tác giả
function pickAuthorId(title) {
  const text = (title || "").toLowerCase();
  if (text.includes('kid') || text.includes('family')) return 'author_2'; // Sarah
  if (text.includes('night') || text.includes('party')) return 'author_3'; // Jax
  return 'author_1'; // Desmond
}

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

function attachAffiliateTags(url, type) {
  if (!url || !url.startsWith('http')) return url;
  const separator = url.includes('?') ? '&' : '?';
  if (type === 'KLOOK' || url.includes('klook.com')) {
    if (!url.includes(`aid=${KLOOK_AID}`)) return `${url}${separator}aid=${KLOOK_AID}&utm_medium=affiliate-alwayson&utm_source=non-network&utm_campaign=${KLOOK_AID}`;
  }
  if (type === 'TRIP' || url.includes('trip.com')) {
    if (!url.includes(`Allianceid=${TRIP_ALLIANCE_ID}`)) return `${url}${separator}Allianceid=${TRIP_ALLIANCE_ID}&SID=${TRIP_SID}`;
  }
  return url;
}

async function runScheduler() {
  console.log(`🚀 KHỞI ĐỘNG CỖ MÁY SMART SCHEDULE...`);
  console.log(`🎯 Mục tiêu: Đăng ${BATCH_SIZE} bài. Nghỉ: ${DELAY_MINUTES} phút/bài.`);

  const filePath = 'scripts/new_events.json';
  
  try {
    if (!fs.existsSync(filePath)) throw new Error("Không tìm thấy file new_events.json!");
    
    // Đọc file JSON
    const fileContent = fs.readFileSync(filePath, 'utf8').trim();
    // Logic trích xuất JSON an toàn
    const jsonMatch = fileContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) throw new Error("File JSON rỗng hoặc sai định dạng!");
    
    let allEvents = JSON.parse(jsonMatch[0]);

    if (allEvents.length === 0) {
      console.log("🎉 KHO HÀNG ĐÃ TRỐNG! Sếp hãy nạp thêm bài mới.");
      return;
    }

    // Lấy ra số lượng bài cần đăng (Batch)
    const eventsToPublish = allEvents.slice(0, BATCH_SIZE);
    // Số bài còn lại để dành
    const remainingEvents = allEvents.slice(BATCH_SIZE);

    console.log(`📦 Trong kho có: ${allEvents.length} bài. Sẽ đăng: ${eventsToPublish.length} bài.`);

    for (let i = 0; i < eventsToPublish.length; i++) {
      const item = eventsToPublish[i];
      const eventName = item.name || item.title;
      console.log(`\n--- ⏳ [${i + 1}/${eventsToPublish.length}] Đang xử lý: ${eventName} ---`);

      // 1. Xử lý dữ liệu
      const category = classifyCategory(eventName, item.venue);
      const authorId = pickAuthorId(eventName);
      let imageUrl = await fetchMetaImage(item.sourceUrl);
      
      if (!imageUrl) {
         imageUrl = `https://loremflickr.com/1200/800/singapore,${category === 'Attraction' ? 'landmark' : 'fun'}/all?lock=${eventName.length}`;
      }

      const klookLink = attachAffiliateTags(`https://www.klook.com/en-SG/search/result/?query=${encodeURIComponent(item.klookQuery || eventName)}`, 'KLOOK');
      const tripLink = attachAffiliateTags(`https://www.trip.com/hotels/list?city=65&searchTerm=${encodeURIComponent(item.tripQuery || item.venue || 'Singapore')}`, 'TRIP');
      
      const cleanDesc = (item.description || item.content || "").split(/From an EEAT/i)[0].trim();
      const marketingPitch = `${item.marketingPitch || ''}\n\n🔗 Book activities: ${klookLink}\n🛌 Hotels: ${tripLink}`;

      const dataPayload = {
          slug: item.slug,
          name: eventName,
          description: cleanDesc,
          imageUrl: imageUrl,
          startDate: item.startDate ? new Date(item.startDate) : new Date(),
          venue: item.venue || "Singapore",
          venueAddress: item.venueAddress || "",
          latitude: item.latitude || 0,
          longitude: item.longitude || 0,
          price: item.price?.toString() || "TBA",
          sourceUrl: attachAffiliateTags(item.sourceUrl),
          category: category,
          authorId: authorId,
          aiSummary: item.aiSummary,
          aiSmartTips: item.aiSmartTips,
          aiFaq: item.aiFaq,
          aiBestFor: item.aiBestFor,
          aiVibe: item.aiVibe,
          aiDurationHint: item.aiDurationHint,
          marketingPitch: marketingPitch,
          nearbyAttractions: item.nearbyAttractions,
          status: 'PUBLISHED',
          updatedAt: new Date()
      };

      // 2. Đẩy vào DB
      await prisma.event.upsert({
        where: { slug: item.slug },
        update: dataPayload,
        create: dataPayload
      });

      console.log(`✅ Đã đăng thành công: ${eventName}`);

      // 3. Cơ chế chờ (Drip Feed) - Trừ bài cuối cùng không cần chờ
      if (i < eventsToPublish.length - 1) {
        console.log(`☕ Đang chờ ${DELAY_MINUTES} phút trước khi đăng bài tiếp theo...`);
        await sleep(DELAY_MINUTES * 60 * 1000);
      }
    }

    // 4. CẬP NHẬT LẠI FILE JSON (Xóa các bài đã đăng)
    fs.writeFileSync(filePath, JSON.stringify(remainingEvents, null, 2));
    console.log(`\n💾 Đã cập nhật kho hàng. Còn lại: ${remainingEvents.length} bài chưa đăng.`);

  } catch (err) {
    console.error('💥 Lỗi:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

runScheduler();