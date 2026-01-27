// scripts/super-import.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const prisma = new PrismaClient();

const KLOOK_AID = '105111';
const TRIP_ALLIANCE_ID = '7367361';
const TRIP_SID = '278066643';
const BANNED_IMAGE_ID = 'photo-1525625239513';

// HÀM CẮT AN TOÀN (CHÌA KHÓA CHỐNG SẬP)
function safeTruncate(str, maxLength) {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength);
}

function pickAuthorId(title, category) {
  const text = ((title || "") + " " + (category || "")).toLowerCase();
  const familyKeywords = ['kid', 'family', 'toddler', 'child', 'baby', 'zoo', 'aquarium', 'playground', 'park', 'waterpark'];
  if (familyKeywords.some(key => text.includes(key))) return 'author_2';
  const partyKeywords = ['night', 'party', 'club', 'dj', 'rave', 'festival', 'concert', 'music', 'bar'];
  if (partyKeywords.some(key => text.includes(key))) return 'author_3';
  return 'author_1'; 
}

function generateSlug(text) {
  if (!text) return `event-${Date.now()}`;
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .substring(0, 100); // Giới hạn slug 100 ký tự
}

function classifyCategory(name, venue) {
  const text = ((name || "") + " " + (venue || "")).toLowerCase();
  const evergreenKeywords = ['universal studios', 'night safari', 'river wonders', 'gardens by the bay', 'aquarium', 'skyline luge', 'flyer', 'marina bay sands', 'singapore zoo', 'bird paradise', 'artscience museum', 'botanic gardens', 'cable car', 'sentosa', 'merlion park', 'chinatown', 'little india', 'arab street', 'clarke quay', 'orchard road', 'raffles hotel', 'changi airport', 'adventure cove', 'madame tussauds', 'cloud forest', 'supertree grove', 'macritchie reservoir', 'jewel changi', 'rain vortex', 'esplanade', 'fort canning', 'national museum', 'haw par villa', 'science centre', 'snow city', 'ifly', 'henderson waves', 'southern ridges', 'pulau ubin', 'east coast park', 'bukit timah', 'wings of time', 'trick eye museum', 'marina barrage', 'sungei buloh', 'labrador park', 'kampong glam', 'peranakan museum', 'chinatown heritage centre', 'jurong lake gardens', 'coney island', 'helix bridge', 'asian civilisations museum', 'ion sky', 'vivocity', 'capitaspring'];
  if (evergreenKeywords.some(key => text.includes(key))) return 'Attraction';
  return 'Event';
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

async function fetchMetaImage(url) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
    const $ = cheerio.load(data);
    return $('meta[property="og:image"]').attr('content') || null;
  } catch (e) { return null; }
}

function getSmartImage(name, category) {
    const keywords = (name + " " + (category || "")).toLowerCase().split(' ');
    const keyword = keywords.find(k => ['concert', 'art', 'kids', 'food', 'night'].includes(k)) || 'singapore';
    return `https://loremflickr.com/1200/800/singapore,${keyword}/all?lock=${name.length}`;
}

async function runImport() {
  console.log('🚀 CỖ MÁY V41.0: SAFETY CUT & IMPORT...');
  
  try {
    const fileContent = fs.readFileSync('scripts/new_events.json', 'utf8').trim();
    const jsonMatch = fileContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
    
    if (!jsonMatch) {
        console.error('❌ Lỗi: Không tìm thấy JSON hợp lệ!');
        return;
    }

    const events = JSON.parse(jsonMatch[0]);

    for (const item of events) {
      try {
        const rawName = item.name || item.title || "Unknown Event";
        
        // --- CHỐT CHẶN AN TOÀN ---
        // Cắt tên xuống 200 ký tự (Tránh lỗi Index quá khổ)
        const eventName = safeTruncate(rawName, 200);
        
        let finalSlug = item.slug;
        if (!finalSlug || finalSlug.trim() === "") {
            finalSlug = generateSlug(eventName);
        }
        // Cắt Slug xuống 100 ký tự
        finalSlug = safeTruncate(finalSlug, 100);

        console.log(`\n--- 📥 Nạp kho: ${eventName} ---`);

        const authorId = pickAuthorId(eventName, item.category || "");
        const category = classifyCategory(eventName, item.venue);

        let imageUrl = await fetchMetaImage(item.sourceUrl);
        if (!imageUrl || imageUrl.includes(BANNED_IMAGE_ID) || imageUrl.includes('logo')) {
            imageUrl = getSmartImage(eventName, category);
        }

        const klookLink = attachAffiliateTags(`https://www.klook.com/en-SG/search/result/?query=${encodeURIComponent(item.klookQuery || eventName)}`, 'KLOOK');
        const tripLink = attachAffiliateTags(`https://www.trip.com/hotels/list?city=65&searchTerm=${encodeURIComponent(item.tripQuery || item.venue || 'Singapore')}`, 'TRIP');
        const marketingPitch = `${item.marketingPitch || ''}\n\n🔗 Book activities: ${klookLink}\n🛌 Hotels: ${tripLink}`;

        const cleanDesc = (item.description || item.content || "").split(/From an EEAT/i)[0].trim();
        
        let validDate = new Date();
        if (item.startDate) validDate = new Date(item.startDate);
        if (isNaN(validDate.getTime())) validDate = new Date();

        const dataPayload = {
          slug: finalSlug,
          name: eventName,
          description: cleanDesc,
          imageUrl: imageUrl,
          startDate: validDate,
          venue: safeTruncate(item.venue || "Singapore", 150),
          venueAddress: safeTruncate(item.venueAddress || "", 200),
          latitude: item.latitude || 0,
          longitude: item.longitude || 0,
          price: safeTruncate(item.price?.toString() || "TBA", 50),
          sourceUrl: attachAffiliateTags(item.sourceUrl),
          category: category,
          authorId: authorId,
          aiSummary: item.aiSummary,
          aiSmartTips: item.aiSmartTips,
          aiFaq: item.aiFaq,
          aiBestFor: safeTruncate(item.aiBestFor, 100),
          aiVibe: safeTruncate(item.aiVibe, 100),
          aiDurationHint: safeTruncate(item.aiDurationHint, 100),
          marketingPitch: marketingPitch,
          nearbyAttractions: item.nearbyAttractions,
          status: 'PUBLISHED', // NẠP VÀO KHO
          updatedAt: new Date()
        };

        await prisma.event.upsert({
          where: { slug: finalSlug },
          update: dataPayload,
          create: dataPayload
        });

        console.log(`✅ Đã nạp thành công: ${eventName}`);

      } catch (e) { console.error(`❌ Lỗi dòng tin:`, e.message); }
    }
    console.log('\n🎉 HOÀN TẤT!');
  } catch (err) { console.error('💥 Lỗi hệ thống:', err.message); } finally { await prisma.$disconnect(); }
}

runImport();