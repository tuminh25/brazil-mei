/**
 * scripts/update-premium-assets.js
 * Injects real high-res images and deep affiliate links into the 14 key Evergreen guides.
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PREM_ID = "105111"; // Klook AID
const T_AID = "7367361";  // Trip Alliance ID
const T_SID = "278066643"; // Trip SID

const ASSET_MAP = [
  {
    slug: 'river-wonders-singapore-insider-guide-2026',
    title: "River Wonders",
    imageUrl: 'https://images.unsplash.com/photo-1544890225-2f3faec4cd60?w=1200',
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/river-wonders-10511059/?allianceid=${T_AID}&sid=${T_SID}`,
    klookUrl: `https://www.klook.com/en-SG/activity/121-river-wonders-singapore/?aid=${PREM_ID}`
  },
  {
    slug: 'bird-paradise-singapore-insider-guide-2026',
    title: "Bird Paradise",
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30fc3b?w=1200',
    klookUrl: `https://www.klook.com/en-SG/activity/82436-bird-paradise-singapore-tickets/?aid=${PREM_ID}`,
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/bird-paradise-93665792/?allianceid=${T_AID}&sid=${T_SID}`
  },
  {
    slug: 'marina-bay-sands-insider-guide-2026',
    title: "Marina Bay Sands",
    imageUrl: 'https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1200',
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/marina-bay-sands-skypark-observation-deck-10758410/?allianceid=${T_AID}&sid=${T_SID}`,
    klookUrl: `https://www.klook.com/en-SG/activity/128-marina-bay-sands-skypark-singapore/?aid=${PREM_ID}`
  },
  {
    slug: 'gardens-by-the-bay-supertree-grove-guide',
    title: "Gardens by the Bay",
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200',
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/gardens-by-the-bay-10511100/?allianceid=${T_AID}&sid=${T_SID}`,
    klookUrl: `https://www.klook.com/en-SG/activity/127-gardens-by-the-bay-singapore/?aid=${PREM_ID}`
  },
  {
    slug: 'cloud-forest-insider-guide-singapore',
    title: "Cloud Forest",
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
    klookUrl: `https://www.klook.com/en-SG/activity/127-gardens-by-the-bay-singapore/?aid=${PREM_ID}`,
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/cloud-forest-12000216/?allianceid=${T_AID}&sid=${T_SID}`
  },
  {
    slug: 'universal-studios-singapore-guide-2026',
    title: "Universal Studios Singapore",
    imageUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=1200',
    klookUrl: `https://www.klook.com/en-SG/activity/117-universal-studios-singapore-tickets/?aid=${PREM_ID}`,
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/universal-studios-singapore-10511082/?allianceid=${T_AID}&sid=${T_SID}`
  },
  {
    slug: 'singapore-cable-car-sentosa-insider-guide-2026',
    title: "Sentosa Cable Car",
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    klookUrl: `https://www.klook.com/en-SG/activity/130-singapore-cable-car-skypass/?aid=${PREM_ID}`,
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/singapore-cable-car-10511105/?allianceid=${T_AID}&sid=${T_SID}`
  },
  {
    slug: 'adventure-cove-insider-guide-skip-lines',
    title: "Adventure Cove",
    imageUrl: 'https://images.unsplash.com/photo-1534694328634-4d1b4c1e3b38?w=1200',
    klookUrl: `https://www.klook.com/en-SG/activity/120-adventure-cove-waterpark-singapore/?aid=${PREM_ID}`,
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/adventure-cove-waterpark-10511090/?allianceid=${T_AID}&sid=${T_SID}`
  },
  {
    slug: 'madame-tussauds-singapore-insider-guide-2026',
    title: "Madame Tussauds",
    imageUrl: 'https://images.unsplash.com/photo-1578987328244-08ac8d1eb0c3?w=1200',
    klookUrl: `https://www.klook.com/en-SG/activity/124-madame-tussauds-singapore/?aid=${PREM_ID}`,
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/madame-tussauds-singapore-10511073/?allianceid=${T_AID}&sid=${T_SID}`
  },
  {
    slug: 'jewel-changi-wings-of-time-insider-guide-2026',
    title: "Jewel & Wings",
    imageUrl: 'https://images.unsplash.com/photo-1518495285542-c0baa5b26ffd?w=1200',
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/jewel-changi-airport-54129532/?allianceid=${T_AID}&sid=${T_SID}`,
    klookUrl: `https://www.klook.com/en-SG/activity/3557-wings-of-time-sentosa-singapore/?aid=${PREM_ID}`
  },
  {
    slug: 'trick-eye-museum-singapore-insider-guide-2026',
    title: "Trick Eye Museum",
    imageUrl: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=1200',
    klookUrl: `https://www.klook.com/en-SG/activity/118-trick-eye-museum-singapore/?aid=${PREM_ID}`,
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/trick-eye-museum-singapore-10511087/?allianceid=${T_AID}&sid=${T_SID}`
  },
  {
    slug: 'singapore-botanic-gardens-insider-guide-2026',
    title: "Botanic Gardens",
    imageUrl: 'https://images.unsplash.com/photo-1585518419759-66c30d55bb21?w=1200',
    klookUrl: `https://www.klook.com/en-SG/activity/135-national-orchid-garden-singapore/?aid=${PREM_ID}`,
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/singapore-botanic-gardens-10543666/?allianceid=${T_AID}&sid=${T_SID}`
  },
  {
    slug: 'jurong-lake-gardens-insider-guide-singapore',
    title: "Jurong Lake Gardens",
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/jurong-lake-gardens-56903251/?allianceid=${T_AID}&sid=${T_SID}`,
    klookUrl: `https://www.klook.com/en-SG/search/result/?query=Jurong%20Lake%20Gardens&aid=${PREM_ID}`
  },
  {
    slug: 'singapore-chinatown-little-india-kampong-glam-insider-guide-2026',
    title: "Cultural Trinity",
    imageUrl: 'https://images.unsplash.com/photo-1596448224772-5c237617c516?w=1200',
    klookUrl: `https://www.klook.com/en-SG/activity/3356-chinatown-food-walking-tour-singapore/?aid=${PREM_ID}`,
    tripUrl: `https://www.trip.com/travel-guide/attraction/singapore/chinatown-90403/?allianceid=${T_AID}&sid=${T_SID}`
  }
];

async function main() {
  console.log('🚀 Starting Deep-Link Asset Injection (14 Guides)...');
  
  for (const asset of ASSET_MAP) {
    try {
      const updated = await prisma.post.update({
        where: { slug: asset.slug },
        data: {
          imageUrl: asset.imageUrl,
          tripUrl: asset.tripUrl || null,
          klookUrl: asset.klookUrl || null,
          category: 'Evergreen' // Ensure category is correct
        }
      });
      console.log(`✅ [${asset.title}] Image & Deep Links injected into DB.`);
    } catch (e) {
      console.warn(`⚠️ [${asset.title}] Failed: ${e.message}`);
    }
  }
  
  console.log('\n✨ Asset Injection Complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
