const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const guidesData = {
  1: {
    title: "Science Centre Singapore",
    imageUrl: "https://ak-d.tripcdn.com/target/10041f000001gronfA95E_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/science-centre-singapore-10515152/?allianceid=7367361&sid=278066643"
  },
  11: {
    title: "Trick Eye Museum",
    imageUrl: "https://ak-d.tripcdn.com/target/100i1f000001guisvB3B2_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/trick-eye-museum-11531627/?allianceid=7367361&sid=278066643"
  },
  3: {
    title: "Adventure Cove",
    imageUrl: "https://ak-d.tripcdn.com/target/100u1f000001guitrE0D1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/adventure-cove-waterpark-10515155/?allianceid=7367361&sid=278066643"
  },
  4: {
    title: "Botanic Gardens",
    imageUrl: "https://ak-d.tripcdn.com/target/100b1f000001guivfA4B1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/singapore-botanic-gardens-75586/?allianceid=7367361&sid=278066643"
  },
  5: {
    title: "Bird Paradise",
    imageUrl: "https://ak-d.tripcdn.com/target/0101p12000aj6v6b0C3B7_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/bird-paradise-141979407/?allianceid=7367361&sid=278066643"
  },
  6: {
    title: "Marina Bay Sands",
    imageUrl: "https://ak-d.tripcdn.com/target/100o1f000001guixvE0A1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/marina-bay-sands-skypark-10515150/?allianceid=7367361&sid=278066643"
  },
  8: {
    title: "Insider's Trinity",
    imageUrl: "https://ak-d.tripcdn.com/target/10021f000001guizfD3B1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/chinatown-75591/?allianceid=7367361&sid=278066643"
  },
  9: {
    title: "River Wonders",
    imageUrl: "https://ak-d.tripcdn.com/target/100m1f000001guj1fA4D1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/river-wonders-11529124/?allianceid=7367361&sid=278066643"
  },
  10: {
    title: "Jurong Lake Gardens",
    imageUrl: "https://ak-d.tripcdn.com/target/100g1f000001guj3fB3A1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/hotels/singapore-hotel-detail-687556/?allianceid=7367361&sid=278066643"
  },
  12: {
    title: "Jewel Changi & Wings",
    imageUrl: "https://ak-d.tripcdn.com/target/100s1f000001guj5fC4B1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/jewel-changi-airport-54157143/?allianceid=7367361&sid=278066643"
  },
  13: {
    title: "Cloud Forest",
    imageUrl: "https://ak-d.tripcdn.com/target/100n1f000001guj7fD3A1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/cloud-forest-18545934/?allianceid=7367361&sid=278066643"
  },
  2: {
    title: "Multi-Day Itinerary",
    imageUrl: "https://ak-d.tripcdn.com/target/100w1f000001guj9fA4D1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/go-city-singapore-pass-51886134/?allianceid=7367361&sid=278066643"
  },
  7: {
    title: "Skyline Luge",
    imageUrl: "https://ak-d.tripcdn.com/target/100k1f000001gujbfB3B1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/skyline-luge-sentosa-10515154/?allianceid=7367361&sid=278066643"
  },
  14: {
    title: "Madame Tussauds",
    imageUrl: "https://ak-d.tripcdn.com/target/100a1f000001gujdfC4A1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/madame-tussauds-singapore-10515156/?allianceid=7367361&sid=278066643"
  },
  15: {
    title: "Cable Car",
    imageUrl: "https://ak-d.tripcdn.com/target/100t1f000001gujffD3B1_C_1160_650.jpg",
    affiliateUrl: "https://www.trip.com/travel-guide/attraction/singapore/singapore-cable-car-10515157/?allianceid=7367361&sid=278066643"
  }
};

const getCTABox = (url) => `
<div class="premium-cta-box" style="margin-top: 6rem; padding: 4rem; background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%); border-radius: 3rem; color: white; text-align: center; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7); position: relative; overflow: hidden; font-family: sans-serif;">
  <div style="position: absolute; top: 0; left: 0; right: 0; height: 100%; background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%); pointer-events: none;"></div>
  <p style="text-transform: uppercase; letter-spacing: 0.5em; font-size: 0.75rem; color: #60a5fa; margin-bottom: 2rem; font-weight: 900;">// TRAVEL INTELLIGENCE</p>
  <h3 style="color: white !important; margin-top: 0; font-size: 3rem; font-weight: 900; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1.5rem;">Ready for the Ultimate Singapore Experience?</h3>
  <p style="color: #bfdbfe !important; font-size: 1.25rem; margin-bottom: 3rem; text-align: center !important; line-height: 1.6; max-width: 800px; margin-left: auto; margin-right: auto; font-style: italic; opacity: 0.9;">Secure your entry through our official partner portal. Verified best rates, instant confirmation, and elite access protocols.</p>
  <a href="${url}" target="_blank" rel="nofollow noopener noreferrer" style="display: inline-block; background: white; color: #1e3a8a; padding: 1.5rem 3.5rem; border-radius: 1.5rem; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.85rem; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-origin: center; box-shadow: 0 15px 30px rgba(0,0,0,0.3);" onmouseover="this.style.transform='scale(1.05) translateY(-5px)'; this.style.boxShadow='0 25px 50px rgba(0,0,0,0.4)';" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='0 15px 30px rgba(0,0,0,0.3)';">
    ⚡ ACCESS BOOKING TERMINAL
  </a>
  <div style="margin-top: 3rem; display: flex; justify-content: center; gap: 2rem; opacity: 0.5; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase;">
    <span>✦ BEST PRICE SYNC</span>
    <span>✦ SECURE ENCRYPTION</span>
    <span>✦ TRIP.COM OFFICIAL</span>
  </div>
</div>
`;

async function main() {
  console.log('--- STARTING DATABASE PURGE & ENRICHMENT ---');

  // 1. Purge Events
  const deletedEvents = await prisma.event.deleteMany();
  console.log(`Successfully purged ${deletedEvents.count} fake events.`);

  // 2. Enrich Posts
  const postIds = Object.keys(guidesData);
  for (const idStr of postIds) {
    const id = parseInt(idStr);
    const data = guidesData[id];
    
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      console.warn(`Post ID ${id} not found, skipping.`);
      continue;
    }

    // Clean old CTA if exists (assuming it was added by a similar script before)
    let newContent = post.content;
    if (newContent.includes('premium-cta-box')) {
        // Simple regex to remove the existing box if it exists to avoid duplication
        newContent = newContent.replace(/<div class="premium-cta-box"[\s\S]*?<\/div>/g, '');
    }
    
    // Append new CTA
    newContent = newContent.trim() + '\n' + getCTABox(data.affiliateUrl);

    await prisma.post.update({
      where: { id },
      data: {
        imageUrl: data.imageUrl,
        content: newContent
      }
    });
    console.log(`Updated Guide [${id}]: ${data.title}`);
  }

  console.log('--- PURGE & ENRICHMENT COMPLETE ---');
}

main()
  .catch(e => {
    console.error('Error during execution:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
