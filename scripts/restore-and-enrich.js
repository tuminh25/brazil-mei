/**
 * scripts/restore-and-enrich.js
 * Restores full article content from original JSON and injects deep affiliate links.
 * 100% preservation of original masterpiece text + appended CTA.
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const K_AID = "105111";
const T_AID = "7367361";
const T_SID = "278066643";

const ASSET_DATA = {
  "river-wonders-singapore-insider-guide-2026": {
    klookUrl: "https://www.klook.com/activity/124-river-wonders-singapore-tickets/",
    tripUrl: "https://www.trip.com/travel-guide/attraction/singapore/river-wonders-98700/",
    imageUrl: "https://ak-d.tripcdn.com/images/0101e120009xar9nq605F_C_1200_800_Q70.webp"
  },
  "bird-paradise-singapore-insider-guide-2026": {
    klookUrl: "https://www.klook.com/activity/81816-bird-paradise-singapore-tickets/",
    tripUrl: "https://www.trip.com/travel-guide/attraction/singapore/bird-paradise-76137/",
    imageUrl: "https://ak-d.tripcdn.com/images/0105k12000be08m3f695C_C_1200_800_Q70.webp"
  },
  "universal-studios-singapore-guide-2026": {
    klookUrl: "https://www.klook.com/activity/117-universal-studios-singapore-ticket/",
    tripUrl: "https://sg.trip.com/travel-guide/attraction/singapore/universal-studios-singapore-89732/",
    imageUrl: "https://ak-d.tripcdn.com/images/0101x120009u6yn4b4837_W_1440_810_Q80.webp"
  },
  "gardens-by-the-bay-supertree-grove-guide": {
    klookUrl: "https://www.klook.com/activity/127-gardens-by-the-bay-singapore-tickets/",
    tripUrl: "https://www.trip.com/travel-guide/attraction/singapore/gardens-by-the-bay-94795/",
    imageUrl: "https://ak-d.tripcdn.com/images/1lo3512000rrs7tc05930_W_1440_810_Q80.webp"
  },
  "marina-bay-sands-insider-guide-skypark-timings-hacks": {
    klookUrl: "https://www.klook.com/activity/44-skypark-observation-deck-singapore/",
    tripUrl: "https://sg.trip.com/travel-guide/attraction/singapore/sands-skypark-15131377/",
    imageUrl: "https://dimg04.c-ctrip.com/images/0106h12000rfjgpu16D44_W_1440_810_Q80.webp"
  },
  "singapore-cable-car-sentosa-insider-guide-2026": {
    klookUrl: "https://www.klook.com/activity/126-cable-car-sky-pass-singapore/",
    tripUrl: "https://www.trip.com/travel-guide/attraction/singapore/singapore-cable-car-10570019/",
    imageUrl: "https://ak-d.tripcdn.com/images/10080p000000gd8074B9E_W_1440_810_Q80.webp"
  },
  "adventure-cove-insider-guide-skip-lines": {
    klookUrl: "https://www.klook.com/activity/118-adventure-cove-waterpark-singapore-tickets/",
    tripUrl: "https://www.trip.com/travel-guide/attraction/singapore/adventure-cove-waterpark-15490538/",
    imageUrl: "https://ak-d.tripcdn.com/images/1lo5i12000e0kjphkDE81_W_1440_810_Q80.webp"
  },
  "madame-tussauds-singapore-insider-guide-2026": {
    klookUrl: "https://www.klook.com/activity/125-madame-tussauds-singapore/",
    tripUrl: "https://www.trip.com/travel-guide/attraction/singapore/madame-tussauds-singapore-15043697/",
    imageUrl: "https://dimg04.c-ctrip.com/images/1lo2o12000pw3v41x0667_W_1440_810_Q80.webp"
  },
  "jewel-changi-wings-of-time-insider-guide-2026": {
    klookUrl: "https://www.klook.com/activity/129-wings-of-time-singapore/",
    tripUrl: "https://id.trip.com/travel-guide/attraction/singapore/wings-of-time-fireworks-symphony-13384526/",
    imageUrl: "https://ak-d.tripcdn.com/images/1lo1n12000re3snorE7C3_W_1440_810_Q80.webp"
  },
  "trick-eye-museum-singapore-insider-guide-2026": {
    klookUrl: "https://www.klook.com/activity/27315-trick-eye-museum-ticket-singapore/",
    tripUrl: "https://www.trip.com/travel-guide/attraction/singapore/trickeye-singapore-13682424/",
    imageUrl: "https://ak-d.tripcdn.com/images/1lo1m12000dfxg0tlFBBE_W_1440_810_Q80.webp"
  },
  "sentosa-island-complete-guide-singapore": {
    klookUrl: "https://www.klook.com/activity/180-sentosa-fun-pass-singapore/",
    tripUrl: "https://www.trip.com/things-to-do/detail/73166528/",
    imageUrl: "https://ak-d.tripcdn.com/images/150o16000000z6v4vB0D8_W_1440_810_Q80.webp"
  },
  "singapore-chinatown-little-india-kampong-glam-insider-guide-2026": {
    klookUrl: "https://www.klook.com/activity/10321-chinatown-food-tasting-walking-tour-singapore/",
    tripUrl: "https://www.trip.com/travel-guide/attraction/singapore/chinatown-89745/",
    imageUrl: "https://res.klook.com/image/upload/fl_lossy.progressive,q_85/c_fill,w_1360,h_816/activities/f3f3f3-chinatown-food-tasting-walking-tour-singapore.webp"
  }
};

const QUEUE_DIR = path.join(__dirname, '../content-queue');

async function main() {
  console.log('🚀 RESTORATION & ENRICHMENT MISSION START...');

  const posts = await prisma.post.findMany();
  console.log(`Found ${posts.length} posts to audit.`);

  for (const post of posts) {
    const asset = ASSET_DATA[post.slug];
    
    // 1. Tìm file gốc để RESTORE
    const jsonPath = fs.readdirSync(QUEUE_DIR).find(f => {
      const data = JSON.parse(fs.readFileSync(path.join(QUEUE_DIR, f), 'utf8'));
      const item = Array.isArray(data) ? data[0] : data;
      return item.slug === post.slug;
    });

    let finalContent = post.content;
    if (jsonPath) {
      console.log(`✅ Restoring full content for: ${post.slug} from ${jsonPath}`);
      const data = JSON.parse(fs.readFileSync(path.join(QUEUE_DIR, jsonPath), 'utf8'));
      const item = Array.isArray(data) ? data[0] : data;
      finalContent = item.description || item.content || post.content;
    }

    // 2. Append Deep Link CTA Box (Only if not already there)
    if (asset && !finalContent.includes("insider-intelligence-cta-box")) {
      console.log(`🔗 Injecting Deep Links for: ${post.slug}`);
      const kUrl = `${asset.klookUrl}?aid=${K_AID}`;
      const tUrl = `${asset.tripUrl}?allianceid=${T_AID}&sid=${T_SID}`;
      
      const ctaBox = `
<div class="insider-intelligence-cta-box" style="margin-top: 6rem; padding: 4rem; background: #0a0a12; border: 1px solid rgba(59,130,246,0.2); border-radius: 2.5rem; text-align: center;">
  <p style="font-family: monospace; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.3em; font-size: 0.75rem; margin-bottom: 2rem;">// SECURE ENTRY & BEST RATES</p>
  <h2 style="color: white; font-size: 2.5rem; margin-bottom: 1.5rem; border: none; padding: 0;">Access Vetted Booking Channels</h2>
  <p style="color: #9ca3af; margin-bottom: 3rem; font-size: 1.1rem; line-height: 1.8;">Our research shows that these direct channels are consistently 15-20% cheaper than gate prices and guarantee instant digital confirmation.</p>
  <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center;">
    <a href="${kUrl}" target="_blank" style="background: #ff5b00; color: white; padding: 1.25rem 2.5rem; border-radius: 1rem; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; transition: 0.3s;">Book on Klook (Best Price)</a>
    <a href="${tUrl}" target="_blank" style="background: white; color: black; padding: 1.25rem 2.5rem; border-radius: 1rem; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; transition: 0.3s;">Stay with Trip.com</a>
  </div>
</div>`;
      finalContent += ctaBox;
    }

    // 3. UPDATE DATABASE
    await prisma.post.update({
      where: { id: post.id },
      data: {
        content: finalContent,
        imageUrl: asset ? asset.imageUrl : post.imageUrl,
        tripUrl: asset ? asset.tripUrl : post.tripUrl,
        klookUrl: asset ? asset.klookUrl : post.klookUrl,
        category: 'Evergreen'
      }
    });
  }

  console.log('✨ MISSION COMPLETE. SITE RESTORED & OPTIMIZED.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
