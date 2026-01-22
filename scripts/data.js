// scripts/data.js
const KLOOK_AID = '105111';
const TRIP_ALLIANCE_ID = '7367361';
const TRIP_SID = '278066643';

module.exports = [
  // BÀI 1: SINGAPORE BOTANIC GARDENS
  {
    name: "The Botanic Gardens Insider: Beat the Crowds & Discover Hidden Gems",
    slug: "singapore-botanic-gardens-insider-guide-2026",
    aiSummary: "Skip the midday Instagram queues. Visit Tuesday-Thursday mornings before 8am to explore rainforests, canopy walks, and over 1000 orchid species without the chaos.",
    marketingPitch: "UNESCO World Heritage site with ancient rainforests. Skip crowded Gardens by the Bay—this is where locals truly reconnect with nature.",
    imageUrl: "https://images.unsplash.com/photo-1585518419759-66c30d55bb21?w=1200&h=630&fit=crop",
    category: "Expert Guide",
    startDate: "2026-01-22",
    venue: "Singapore Botanic Gardens",
    venueAddress: "1 Cluny Road, Singapore 259569",
    price: "Free (NOG: SGD $15)",
    sourceUrl: "https://www.klook.com/en-SG/activity/135-national-orchid-garden-singapore/",
    klookQuery: "Singapore Botanic Gardens National Orchid Garden",
    tripQuery: "Hotels near Botanic Gardens Singapore",
    authorId: "author_1", // Desmond Ho
    description: `
      <div class="article"><p class="lead"><strong>Most visitors spend 30 minutes at the National Orchid Garden photographing the same Instagram archway...</strong> [Sếp dán lại nội dung HTML dài loằng ngoằng vào giữa 2 dấu huyền này thoải mái] ... profound botanical silence.</p>
      <h2>Three Insider Hacks</h2>
      <p>Content bài viết...</p>
      </div>
    ` 
    // Sếp lưu ý: Dùng dấu huyền (`) để bao quanh nội dung. Bên trong có dấu ngoặc kép " " thoải mái không lỗi.
  },

  // BÀI 2: SINGAPORE CABLE CAR
  {
    name: "The Cable Car Playbook: Skip the Lines, Beat the Heat",
    slug: "singapore-cable-car-sentosa-insider-guide-2026",
    aiSummary: "Most visitors waste 2 hours queuing. This guide reveals exact MRT exits, optimal timing, and hidden money-saving hacks.",
    marketingPitch: "Stay at VivoCity-adjacent hotels: walk to HarbourFront MRT in 2 minutes, skip the transportation gamble entirely.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    category: "Expert Guide",
    startDate: "2026-01-22",
    venue: "Singapore Cable Car",
    venueAddress: "109 Mount Faber Road",
    price: "SGD 31.50",
    sourceUrl: "https://www.klook.com/en-SG/activity/130-singapore-cable-car-skypass/",
    klookQuery: "Singapore Cable Car Sky Pass",
    tripQuery: "Hotels near HarbourFront MRT",
    authorId: "author_1",
    description: `
      <div class="guide-container"><h1 class="guide-title">The Cable Car Playbook...</h1> ... </div>
    `
  },

  // BÀI 3: ADVENTURE COVE
  {
    name: "Beat The Crowds at Adventure Cove: The Insider's Playbook",
    slug: "adventure-cove-insider-guide-skip-lines",
    aiSummary: "The real reason Riptide Rocket queues explode at 2pm, and exactly how to dodge them.",
    marketingPitch: "Skip 2 hours of queues: stay at Resorts World Sentosa hotels—walk to Adventure Cove in 10 minutes.",
    imageUrl: "https://images.unsplash.com/photo-1534694328634-4d1b4c1e3b38?w=1200&h=600&fit=crop",
    category: "Expert Guide",
    startDate: "2026-01-23",
    venue: "Adventure Cove Waterpark",
    venueAddress: "8 Sentosa Gateway",
    price: "SGD 35-38",
    sourceUrl: "https://www.klook.com/activity/120-adventure-cove-waterpark-singapore/",
    klookQuery: "Adventure Cove Waterpark Singapore",
    tripQuery: "hotels near Adventure Cove Waterpark Sentosa",
    authorId: "author_2", // Sarah Tan (Vì là Waterpark)
    description: `
      <p class="lead"><strong>Most people think Adventure Cove is just another waterpark...</strong> ... </p>
    `
  },
  
  // BÀI 4: MADAME TUSSAUDS
  {
    name: "Madame Tussauds Singapore: The Insider's Real Deal",
    slug: "madame-tussauds-singapore-insider-guide-2026",
    aiSummary: "Skip the hype. Here's exactly when to visit Madame Tussauds and which tickets save money.",
    marketingPitch: "Stay at nearby RWS resorts to walk here in under 5 mins.",
    imageUrl: "https://images.unsplash.com/photo-1578987328244-08ac8d1eb0c3?w=1200&fit=crop",
    category: "Expert Guide",
    startDate: "2026-01-22",
    venue: "Madame Tussauds Singapore",
    venueAddress": "40 Imbiah Road",
    price: "SGD 31-58",
    sourceUrl: "https://www.klook.com/en-SG/activity/124-madame-tussauds-singapore/",
    klookQuery: "Madame Tussauds Singapore",
    tripQuery: "hotels near Madame Tussauds Sentosa",
    authorId: "author_1",
    description: `
       <div class="insider-guide"><h1>Madame Tussauds Singapore...</h1> ... </div>
    `
  },

  // BÀI 5: CLOUD FOREST
  {
    name: "Cloud Forest Mastery: Skip the Chaos, See Everything",
    slug: "cloud-forest-insider-guide-singapore",
    aiSummary: "A 25+ year Singapore veteran reveals why most visitors waste half their time at Cloud Forest.",
    marketingPitch: "Step into a 35-meter indoor waterfall just 11 mins from Bayfront MRT.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&fit=crop",
    category: "Expert Guide",
    startDate: "2026-01-22",
    venue": "Cloud Forest, Gardens by the Bay",
    venueAddress: "18 Marina Gardens Dr",
    price: "SGD 27",
    sourceUrl: "https://www.klook.com/activity/127-gardens-by-the-bay-singapore/",
    klookQuery: "Cloud Forest Gardens by the Bay",
    tripQuery: "Hotels near Gardens by the Bay",
    authorId: "author_1",
    description: `
      <article class="insider-guide"><h1>Cloud Forest Mastery...</h1> ... </article>
    `
  },
  
  // BÀI 6: JEWEL & WINGS
  {
    name: "Jewel & Wings: The Unfiltered Local's Playbook",
    slug: "jewel-changi-wings-of-time-insider-guide-2026",
    aiSummary: "Skip the tourist traps. Nail both Jewel's Rain Vortex and Wings of Time in one evening.",
    marketingPitch: "Stay at HarbourFront hotels to reach Wings in 5 min.",
    imageUrl: "https://images.unsplash.com/photo-1518495285542-c0baa5b26ffd?w=1200&fit=crop",
    category: "Expert Guide",
    startDate: "2026-01-22",
    venue: "Jewel Changi Airport",
    venueAddress: "78 Airport Boulevard",
    price: "Free / SGD 22",
    sourceUrl: "https://www.klook.com/en-SG/activity/3557-wings-of-time-sentosa-singapore/",
    klookQuery: "Jewel Changi Airport attractions",
    tripQuery: "hotels near Jewel Changi",
    authorId: "author_1",
    description: `
      <div class="article-container"><p class="lead"><strong>Here's what nobody tells you...</strong> ... </p>
    `
  },
  
  // BÀI 7: TRICK EYE MUSEUM
  {
    name: "Master Trick Eye Museum: Insider's 3D Art Guide",
    slug: "trick-eye-museum-singapore-insider-guide-2026",
    aiSummary: "Stop wasting angles. Here's how to nail the best photos at Trick Eye Museum.",
    marketingPitch: "Skip the Sentosa shuttle queues. Stay at Resorts World Festive Hotel.",
    imageUrl: "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=1200&fit=crop",
    category: "Expert Guide",
    startDate: "2026-01-22",
    venue: "Trick Eye Museum",
    venueAddress: "80 Siloso Road",
    price: "SGD 26",
    sourceUrl: "https://www.klook.com/en-SG/activity/118-trick-eye-museum-singapore/",
    klookQuery: "Trick Eye Museum Singapore",
    tripQuery: "Hotels near Trick Eye Museum",
    authorId: "author_2", // Sarah (Family)
    description: `
      <div class="article-container"><p class="lead"><strong>Real Talk:</strong> Most people get Trick Eye... </p>
    `
  },
  
  // BÀI 8: JURONG LAKE GARDENS
  {
    name: "Jurong Lake Gardens: Your Insider's Guide to Singapore's Largest Hidden Gem",
    slug: "jurong-lake-gardens-insider-guide-singapore",
    aiSummary: "Newly renovated Chinese & Japanese Gardens combined with Lakeside attractions—all FREE.",
    marketingPitch: "Skip the crowded downtown parks. Jurong Lake Gardens offers 24-hour lakefront access.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&fit=crop",
    category: "Expert Guide",
    startDate: "2025-01-22",
    venue: "Jurong Lake Gardens",
    venueAddress: "1 Chinese Garden Road",
    price: "Free",
    sourceUrl: "https://www.klook.com/en-SG/activity/10976-science-centre-singapore/", // Gần Science Centre
    klookQuery: "Jurong Lake Gardens tour",
    tripQuery: "Hotels near Jurong Lake Gardens",
    authorId: "author_1",
    description: `
      <div class="guide-container"><p class="lead"><strong>Most visitors waste three hours...</strong> ... </p>
    `
  },

  // BÀI 9: 3-4 DAY ITINERARY
  {
    name: "The Veteran's Multi-Day Itinerary Playbook: 3-4 Days Done Right",
    slug: "singapore-multi-attraction-itinerary-insider-guide-3-4-days",
    aiSummary: "Stop winging it. This insider playbook walks you through Singapore's top attractions.",
    marketingPitch: "Stop following tour guides. This is what 25+ years of navigating Singapore taught me.",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&fit=crop",
    category: "Expert Guide",
    startDate: "2026-01-25",
    venue: "Singapore",
    venueAddress: "Singapore",
    price: "Varies",
    sourceUrl: "https://www.klook.com/en-SG/activity/2855-sightseeing-pass-singapore/",
    klookQuery: "Singapore attractions pass",
    tripQuery: "Hotels in Singapore City Centre",
    authorId: "author_1",
    description: `
      <div class="insider-guide"><h1>The Veteran's Multi-Day Itinerary...</h1> ... </div>
    `
  },

  // BÀI 10: CHINATOWN / LITTLE INDIA / KAMPONG GLAM
  {
    name: "The Insider's Trinity: Chinatown, Little India & Kampong Glam Decoded",
    slug: "singapore-chinatown-little-india-kampong-glam-insider-guide-2026",
    aiSummary: "Skip the tourist traps. This 25-year insider's guide reveals exactly when to visit.",
    marketingPitch: "Stay at The Sultan (Kampong Glam) and walk Haji Lane in 5 mins.",
    imageUrl: "https://images.unsplash.com/photo-1596448224772-5c237617c516?w=1200&fit=crop",
    category: "Expert Guide",
    startDate: "2026-01-22",
    venue: "Cultural Districts",
    venueAddress: "Various",
    price: "Free",
    sourceUrl: "https://www.klook.com/en-SG/activity/3356-chinatown-food-walking-tour-singapore/",
    klookQuery: "Singapore cultural walking tour",
    tripQuery: "Hotels in Chinatown Singapore",
    authorId: "author_1",
    description: `
      <div class="sg-insider-guide"><p class="lead"><strong>Most people get this backwards...</strong> ... </p>
    `
  }
];