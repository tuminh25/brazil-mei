// scripts/enrichEvents.js
require('dotenv').config(); 
const { PrismaClient, EventStatus } = require('@prisma/client');
const axios = require('axios');
const { setTimeout } = require('timers/promises');

const prisma = new PrismaClient();

const AI_API_CONFIG = {
  baseURL: process.env.AI_API_BASE_URL || 'https://api.deepseek.com/v1',
  apiKey: process.env.AI_API_KEY,
  model: process.env.AI_MODEL || 'deepseek-chat',
  delayBetweenRequests: 1500, 
};

/**
 * Generate Affiliate Links with BOSS's REAL IDs
 */
function generateAffiliateLinks(keywords) {
  const KLOOK_AID = '105111'; 
  const TRIP_ALLIANCE_ID = '7367361';
  const TRIP_SID = '278066643';
  
  const klookKeywords = keywords?.klook_query || '';
  const tripKeywords = keywords?.trip_hotel_query || '';
  
  return {
    klook: klookKeywords ? 
      `https://www.klook.com/en-SG/search/result/?query=${encodeURIComponent(klookKeywords)}&aid=${KLOOK_AID}` : 
      `https://www.klook.com/en-SG/?aid=${KLOOK_AID}`,
    trip: tripKeywords ?
      `https://www.trip.com/hotels/list?city=65&searchTerm=${encodeURIComponent(tripKeywords)}&allianceid=${TRIP_ALLIANCE_ID}&sid=${TRIP_SID}` :
      `https://www.trip.com/?allianceid=${TRIP_ALLIANCE_ID}&sid=${TRIP_SID}`
  };
}

async function callAIEnrichmentAPI(eventData) {
  const prompt = `
You are a Singapore Travel Expert. Analyze this event and return a JSON object.
STRICT RULE: Use ONLY ENGLISH. DO NOT use Vietnamese.

EVENT: ${eventData.name} at ${eventData.venue}.

JSON STRUCTURE:
{
  "aiSummary": "Catchy 2-sentence English summary",
  "aiFaq": [
    {"question": "English question", "answer": "English answer"}
  ],
  "marketingPitch": "English persuasive text (no links) recommending a nearby hotel or tour.",
  "affiliateSearchKeywords": {
    "klook_query": "Keywords for Klook search",
    "trip_hotel_query": "Keywords for Trip.com hotel search"
  },
  "nearbyAttractions": [
    {"name": "Place Name", "description": "Info", "type": "Sightseeing"}
  ],
  "aiBestFor": "Audience type",
  "aiVibe": "Event vibe",
  "aiDurationHint": "Estimated time"
}
`;

  try {
    const response = await axios.post(
      `${AI_API_CONFIG.baseURL}/chat/completions`,
      {
        model: AI_API_CONFIG.model,
        messages: [
          { role: "system", content: "You are a professional Singapore Travel Expert. You respond strictly in English JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      },
      { headers: { 'Authorization': `Bearer ${AI_API_CONFIG.apiKey}` }, timeout: 45000 }
    );
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) { throw error; }
}

async function enrichSingleEvent(event) {
  console.log(`\n--- 📝 Processing: ${event.name} ---`);
  try {
    const aiResult = await callAIEnrichmentAPI(event);
    const links = generateAffiliateLinks(aiResult.affiliateSearchKeywords);
    
    // Pitch stays clean, links go into the DB structure if needed, 
    // but here we combine for the marketingPitch field.
    const finalPitch = `${aiResult.marketingPitch}\n\n🔗 Activities: ${links.klook}\n🛌 Hotels: ${links.trip}`;

    await prisma.event.update({
      where: { id: event.id },
      data: {
        status: EventStatus.PUBLISHED,
        aiSummary: aiResult.aiSummary,
        aiFaq: aiResult.aiFaq,
        aiBestFor: aiResult.aiBestFor,
        aiVibe: aiResult.aiVibe,
        aiDurationHint: aiResult.aiDurationHint,
        marketingPitch: finalPitch,
        affiliateSearchKeywords: aiResult.affiliateSearchKeywords,
        nearbyAttractions: aiResult.nearbyAttractions,
        updatedAt: new Date()
      }
    });
    console.log(`✅ Done!`);
  } catch (error) { console.error(`❌ Error:`, error.message); }
}

async function main() {
  const drafts = await prisma.event.findMany({ where: { status: EventStatus.DRAFT } });
  for (const e of drafts) {
    await enrichSingleEvent(e);
    await setTimeout(AI_API_CONFIG.delayBetweenRequests);
  }
}
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database disconnected.");
  });