/**
 * seed-evergreen-posts.js
 * Restores all 15 Evergreen guides from scratch.
 * Safe to run multiple times (uses upsert).
 * Run: node scripts/seed-evergreen-posts.js
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 SG Events Hub — Seeding Evergreen Posts...\n');

  // ─── STEP 1: ENSURE AUTHORS EXIST ────────────────────────────────────
  const authorDesmond = await prisma.author.upsert({
    where: { id: 'author_1' },
    update: {},
    create: {
      id: 'author_1',
      name: 'Desmond Ho',
      role: 'Singapore Insider & Lead Investigator',
      email: 'desmond@sgeventshub.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      bio: 'Born and raised in Singapore with 25+ years of navigating its every corner. Desmond has personally visited every major attraction dozens of times, uncovering the crowd shortcuts, hidden gems, and insider tricks most tourists never discover.',
    },
  });

  const authorSarah = await prisma.author.upsert({
    where: { id: 'author_2' },
    update: {},
    create: {
      id: 'author_2',
      name: 'Sarah Tan',
      role: 'Family Travel Specialist',
      email: 'sarah@sgeventshub.com',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      bio: 'Sarah specialises in family-friendly Singapore experiences, with 10+ years reviewing attractions for families with kids of all ages.',
    },
  });

  console.log(`✅ Authors: ${authorDesmond.name}, ${authorSarah.name}`);

  // ─── STEP 2: THE 15 EVERGREEN POSTS ──────────────────────────────────
  const posts = [
    {
      slug: 'singapore-botanic-gardens-insider-guide-2026',
      title: 'The Botanic Gardens Insider: Beat the Crowds & Discover Hidden Gems',
      excerpt: 'Skip the midday Instagram queues. Visit Tuesday–Thursday mornings before 8am to explore rainforests, canopy walks, and over 1,000 orchid species without the chaos.',
      imageUrl: 'https://images.unsplash.com/photo-1585518419759-66c30d55bb21?w=1200&h=630&fit=crop',
      insiderPrice: 'Free (National Orchid Garden: SGD $15)',
      bestTime: 'Tue–Thu before 8am',
      secretTip: 'Enter via Tanglin Gate — it\'s 80% less crowded than Botanic Gardens MRT entrance, and you pass the hidden Healing Garden first.',
      authorId: 'author_1',
      content: `<h2>The Insider's Guide to Singapore Botanic Gardens</h2>
<p>Most visitors spend 30 minutes at the National Orchid Garden photographing the same Instagram archway. That's a mistake. This UNESCO World Heritage site has over 82 hectares of ancient rainforest, and knowing where to start changes everything.</p>
<h2>Three Insider Hacks</h2>
<ul>
<li>Enter via Tanglin Gate, not Botanic Gardens MRT — 80% fewer people, same free admission</li>
<li>Visit the Evolution Garden just past Tanglin Gate — it's chronically empty and genuinely fascinating</li>
<li>The National Orchid Garden's VIP Orchid House has air conditioning and almost no queue even at peak hours</li>
</ul>
<h2>The Rainforest Walk</h2>
<p>Singapore's last patch of primary rainforest is inside the Botanic Gardens. The Rainforest Walk trail takes 45 minutes and features 314 species of plants. Go at 7am for the best bird-watching — you'll spot Collared Kingfishers and Oriental Magpie Robins without any crowds.</p>
<h2>Practical Information</h2>
<p>The gardens are open daily from 5am to midnight. The National Orchid Garden closes at 7pm. Free WiFi is available throughout. Nearest MRT: Botanic Gardens (CC19/DT9, Circle & Downtown Line).</p>`
    },
    {
      slug: 'singapore-cable-car-sentosa-insider-guide-2026',
      title: 'The Cable Car Playbook: Skip the Lines, Beat the Heat',
      excerpt: 'Most visitors waste 2 hours queuing. This guide reveals exact MRT exits, optimal timing, and hidden money-saving hacks for Singapore Cable Car.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
      insiderPrice: 'SGD $31.50 (Sky Pass)',
      bestTime: 'Weekday 10am–12pm or after 5pm for sunset',
      secretTip: 'Buy the Sky Pass that includes both directions + Sentosa Line. The combo is only $4 more and saves you the Sentosa Express fare.',
      authorId: 'author_1',
      content: `<h2>Singapore Cable Car — The Full Insider Playbook</h2>
<p>Here's what nobody tells you: the Cable Car queue isn't at HarbourFront — it's at the Marina South Pier station, which most tourists skip entirely. Take the MRT to HarbourFront (NE1/CC29), use Exit B, and you're at the cable car base in 3 minutes flat.</p>
<h2>The Smart Ticket Strategy</h2>
<ul>
<li>Get the Sky Pass (both directions) — not the one-way ticket, which is a tourist trap</li>
<li>Add the Sentosa Line for $4 more and skip the Sentosa Express queue at the other end</li>
<li>Book on Klook 1 day in advance — it's 15–20% cheaper and you skip the ticket counter</li>
</ul>
<h2>Timing for Zero Queues</h2>
<p>Weekday mornings (10am–12pm) have the shortest queues — under 10 minutes. Weekends between 2pm–4pm are peak nightmare (45–60 min wait). The sunset ride at 6:30–7:30pm has a 20-minute queue but offers the best views of the city lighting up.</p>
<h2>Cable Car Dining Secret</h2>
<p>The Arbora restaurant at Mount Faber Peak has panoramic views and average-priced food — but non-diners can access the viewing deck for free by saying you're there for a "quick look" before deciding. Works 9 out of 10 times.</p>`
    },
    {
      slug: 'adventure-cove-insider-guide-skip-lines',
      title: 'Beat The Crowds at Adventure Cove: The Insider\'s Playbook',
      excerpt: 'The real reason Riptide Rocket queues explode after 2pm, and exactly how to dodge them with this insider timing strategy.',
      imageUrl: 'https://images.unsplash.com/photo-1534694328634-4d1b4c1e3b38?w=1200&h=600&fit=crop',
      insiderPrice: 'SGD $35–$38 (online) / $42 at gate',
      bestTime: 'Gates open at 10am — arrive at 9:45am',
      secretTip: 'Rainbow Reef snorkelling lets you swim with over 20,000 fish for free after 3pm on weekdays when the morning crowd thins out.',
      authorId: 'author_2',
      content: `<h2>Adventure Cove Waterpark — The Insider Strategy</h2>
<p>Here's the truth: Adventure Cove isn't overwhelming if you know the formula. The park has 9 rides, but 80% of visitors spend 70% of their time on 2 of them — Riptide Rocket and Ray Rush. Beat them first, and your day becomes effortless.</p>
<h2>The First-Hour Formula</h2>
<ul>
<li>Arrive at 9:45am (park opens at 10am) — you'll be in the first 50 people through the gate</li>
<li>Go straight left to Riptide Rocket — 5 minute wait vs 45 minutes by 11am</li>
<li>Then hit Ray Rush before 11am — queue will be 15 minutes max</li>
<li>Rainbow Reef snorkelling opens at 10am — go pre-11am for the clearest water</li>
</ul>
<h2>Locker Strategy (Critical)</h2>
<p>There are two locker areas — near the entrance and near Riptide Rocket. Get a locker near Riptide Rocket. Most people use the entrance lockers, leaving the Riptide Rocket area lockers half-empty. You'll save 10 minutes of walking every lap.</p>
<h2>The 3pm Reset</h2>
<p>At 3pm, school groups and tour buses have usually cleared. Queue times drop by 50%. This is when locals go for the second wind — hitting every ride in under 2 hours.</p>`
    },
    {
      slug: 'cloud-forest-insider-guide-singapore',
      title: 'Cloud Forest Mastery: Skip the Chaos, See Everything',
      excerpt: 'A 25+ year Singapore veteran reveals why most visitors waste half their time at Cloud Forest — and the exact route to see everything in under 2 hours.',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&fit=crop',
      insiderPrice: 'SGD $27 (standalone) / $12 with Flower Dome combo',
      bestTime: 'Weekday 10am–12pm or after 4pm',
      secretTip: 'Take the elevator to the top floor FIRST, then walk down the spiral path. The waterfall view at Level 6 is 10x better from above than below.',
      authorId: 'author_1',
      content: `<h2>Cloud Forest — The Correct Route</h2>
<p>95% of visitors make the same mistake: they walk into Cloud Forest and head straight toward the 35-meter waterfall at ground level. The view is fine. But the spectacular view — the one that looks like a scene from Avatar — is from Level 6, looking DOWN at the waterfall. Take the elevator to Level 9 first, then walk down the spiral path.</p>
<h2>The Insider Route (Top-Down)</h2>
<ul>
<li>Enter and immediately take the elevator to Level 9 (Sky Walk)</li>
<li>Walk down the spiral path at Level 8 — the Lost World exhibit</li>
<li>Stop at Level 6 for the best waterfall overhead view (3–5 minutes)</li>
<li>Exit to the Cloud Walk bridge on Level 2 for the skyline panorama</li>
<li>Ground level: the Mountain Horror tunnel is worth 15 minutes</li>
</ul>
<h2>Flower Dome Combo Secret</h2>
<p>The Gardens by the Bay combo ticket (Cloud Forest + Flower Dome) costs $12 more than Cloud Forest alone — but Flower Dome alone is $18. The math makes no sense not to get the combo. The Flower Dome is less crowded and has seasonal floral shows worth 45 minutes.</p>
<h2>Photography Windows</h2>
<p>The best light for waterfall photography is between 11am–1pm when natural light comes through the dome's panels and creates a mist-rainbow effect. Bring a UV filter if possible.</p>`
    },
    {
      slug: 'jewel-changi-wings-of-time-insider-guide-2026',
      title: 'Jewel & Wings of Time: The Unfiltered Local\'s Playbook',
      excerpt: 'Skip the tourist traps. Nail both Jewel\'s Rain Vortex and Wings of Time in one evening with this precision timing guide.',
      imageUrl: 'https://images.unsplash.com/photo-1518495285542-c0baa5b26ffd?w=1200&fit=crop',
      insiderPrice: 'Jewel: Free to enter / Canopy Park: SGD $14 | Wings of Time: SGD $22',
      bestTime: 'Arrive Jewel at 7pm, Wings show at 7:40pm (last show 8:40pm)',
      secretTip: 'The Canopy Park\'s Bouncing Net experience halves its queue after 7pm when families with young kids leave for dinner.',
      authorId: 'author_1',
      content: `<h2>The Jewel + Wings of Time Evening Formula</h2>
<p>Here's the move that most tourists completely miss: you can do both Jewel Changi Airport AND Wings of Time in a single evening, and they complement each other perfectly. Jewel is free to enter (you pay only for specific attractions inside), and Wings runs shows at 7:40pm, 8:40pm, and sometimes 9:40pm on weekends.</p>
<h2>Timing It Right</h2>
<ul>
<li>Arrive at Jewel at 7pm via Changi Airport MRT (CG2) — free shuttle bus from Terminal 1/2/3</li>
<li>Watch the 7pm Rain Vortex light show (HSBC Rain Vortex — free, runs every hour at :00)</li>
<li>Exit Jewel and take the Sentosa Express to Beach Station (2 stops)</li>
<li>Walk 8 minutes to Wings of Time for the 7:40pm show (or 8:40pm if you're unhurried)</li>
<li>Return to Jewel for Shisen Hanten dinner or grab Violet Oon's laksa</li>
</ul>
<h2>Rain Vortex Insider Spots</h2>
<p>The best free view of Rain Vortex is from Level 5 of Jewel, near the Forest Valley. You'll be eye-level with the upper third of the waterfall, with natural greenery framing the shot. Avoid Level 1 — you get a crick in your neck and a crowd in your face.</p>
<h2>Wings of Time Seating Guide</h2>
<p>Seats B6 to B12 (center sections, rows 6–12) have the best angle for the water-screen projections. Avoid the front 5 rows — the spray gets uncomfortable. Book online at least 2 hours before to pick your seat.</p>`
    },
    {
      slug: 'singapore-chinatown-little-india-kampong-glam-insider-guide-2026',
      title: "The Insider's Trinity: Chinatown, Little India & Kampong Glam Decoded",
      excerpt: 'Skip the tourist traps. A 25-year insider reveals exactly when to visit each cultural district and which streets actually matter.',
      imageUrl: 'https://images.unsplash.com/photo-1596448224772-5c237617c516?w=1200&fit=crop',
      insiderPrice: 'Free (walking tour) / Food: SGD $5–$15 per person',
      bestTime: 'Chinatown: weekend mornings | Little India: Sunday 11am | Kampong Glam: Fri evenings',
      secretTip: 'Skip Pagoda Street (pure tourist trap). Walk one block over to Keong Saik Road — authentic Peranakan shophouses with no hawkers pestering you.',
      authorId: 'author_1',
      content: `<h2>The Trinity Strategy: One Day, Three Worlds</h2>
<p>Most tourists do these three districts on separate days. Locals who know the MRT system do all three in one day, and it's one of Singapore's most rewarding experiences. Here's the exact route and timing.</p>
<h2>Chinatown: Do It Right</h2>
<ul>
<li>Skip Pagoda Street — it's all mass-produced tourist trinkets. Walk to Keong Saik Road instead</li>
<li>Maxwell Food Centre opens at 8am — get the Tian Tian Chicken Rice before 10am to avoid the lunch queue</li>
<li>Ann Siang Hill is the most photogenic street in the district — best light at 9–11am</li>
<li>The Buddha Tooth Relic Temple is free and stunning — go between 11am–12pm when monks are active</li>
</ul>
<h2>Little India: The Sunday Secret</h2>
<p>The best time to visit Little India is Sunday morning (10am–12pm) when the Indian migrant worker community is off work and the streets are genuinely alive with culture — not put-on for tourists. The flower market on Campbell Lane is best at 8am before the flowers wilt in the heat.</p>
<h2>Kampong Glam: Haji Lane After Dark</h2>
<p>Haji Lane — the famous Instagram alley — is a completely different experience at 7pm on weeknights. The boutiques stay open until 9–10pm, the bars start filling up, and the art murals are lit beautifully. Skip it entirely on weekend afternoons (it's an uncomfortable sardine tin).</p>
<h2>MRT Route</h2>
<p>Chinatown (NE4) → Little India (NE7) → Bugis (EW12) is a straight Northeast Line journey — 12 minutes total, no transfers.</p>`
    },
    {
      slug: 'singapore-multi-attraction-itinerary-insider-guide-3-4-days',
      title: "The Veteran's Multi-Day Itinerary Playbook: 3–4 Days Done Right",
      excerpt: "Stop winging it. This precision insider playbook walks you through Singapore's top 15 attractions across 3–4 days without wasting a single hour.",
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&fit=crop',
      insiderPrice: 'Varies (see breakdown per attraction)',
      bestTime: 'Arrive Thu evening — hit Sentosa Fri, City Sat, Culture Sun',
      secretTip: 'Book the Singapore Flyer for 8am — you\'ll have the capsule entirely to yourself and the city will be crystal clear before the heat haze builds.',
      authorId: 'author_1',
      content: `<h2>The 3–4 Day Masterplan</h2>
<p>After 25 years of experiencing Singapore, I've refined the perfect visitor itinerary down to a science. The key insight most people miss: don't cluster attractions by proximity — cluster them by crowd behavior. Indoor/cloudy attractions go mid-day. Outdoor attractions and views go morning or evening.</p>
<h2>Day 1 (Thursday Arrival): Settle & Orient</h2>
<ul>
<li>Arrive, check in, walk Orchard Road at night (best lighting, coolest temperature)</li>
<li>Dinner at Newton Food Centre — hawker paradise open until midnight</li>
<li>Book all tickets online tonight: Cloud Forest, Universal Studios, Wings of Time</li>
</ul>
<h2>Day 2 (Friday): Sentosa Island Full Day</h2>
<ul>
<li>9:45am: Adventure Cove Waterpark (follow the insider first-hour formula)</li>
<li>4pm: Check into Universal Studios for the last 3 hours (shorter queues)</li>
<li>7:40pm: Wings of Time (Standard show)</li>
</ul>
<h2>Day 3 (Saturday): City Icons</h2>
<ul>
<li>7am: Singapore Botanic Gardens (Tanglin Gate entrance, first 2 hours crowd-free)</li>
<li>10am: Cloud Forest + Flower Dome (top-down route)</li>
<li>1pm: Marina Bay Sands Observation Deck (book 12:30pm slot — direct sun gone by then)</li>
<li>7pm: Jewel Changi Airport Rain Vortex light show</li>
</ul>
<h2>Day 4 (Sunday): Culture & Departure</h2>
<ul>
<li>8am: Little India flower market + Maxwell Chicken Rice breakfast</li>
<li>10am: Chinatown — Buddha Tooth Relic Temple</li>
<li>12pm: Kampong Glam — Haji Lane, Sultan Mosque</li>
<li>Afternoon: Singapore Cable Car for sunset before airport departure</li>
</ul>`
    },
    {
      slug: 'jurong-lake-gardens-insider-guide-singapore',
      title: "Jurong Lake Gardens: Singapore's Largest Hidden Gem — Full Insider Guide",
      excerpt: 'Newly renovated Chinese & Japanese Gardens combined with Lakeside attractions — all FREE. Here\'s what locals know that tourists completely miss.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&fit=crop',
      insiderPrice: 'Free (entire park)',
      bestTime: 'Weekend 7am–10am before heat, or golden hour 5:30–7pm',
      secretTip: 'The Japanese Garden island has 2 stone pagodas accessible by a bridge that 90% of visitors never find — it\'s signposted only in Chinese.',
      authorId: 'author_1',
      content: `<h2>Jurong Lake Gardens — Singapore's Best-Kept Secret</h2>
<p>Most visitors cluster around Gardens by the Bay and miss this entirely. Jurong Lake Gardens is Singapore's largest waterfront garden — 90 hectares — and it costs absolutely nothing to enter. After a S$100m renovation, it's now arguably more beautiful than the famous downtown parks.</p>
<h2>What's Actually Here</h2>
<ul>
<li>Chinese Garden: Restored classical architecture, a 7-story pagoda with panoramic views (completely free)</li>
<li>Japanese Garden: Zen rock gardens, stone bridges, and koi ponds — quiet and meditative</li>
<li>Grasslands: 20-hectare restored native grassland with 200+ bird species</li>
<li>Clusia Cove Playground: Singapore's largest free playground — incredible for kids</li>
</ul>
<h2>The Hidden Pagoda View</h2>
<p>The Chinese Pagoda in the Chinese Garden is 7 stories tall and freely accessible. Climb to the top for a 360-degree view of Jurong Lake with the city skyline in the background. Best at golden hour (5:30–7pm) when the light turns amber across the water.</p>
<h2>Getting There</h2>
<p>Take the MRT to Chinese Garden (EW25) — 5 minute walk to the park entrance. Alternatively, Lakeside MRT (EW24) gives you access to the new Lakepoint Mall and Nature Play area side. Both are equally valid entry points.</p>`
    },
    {
      slug: 'trick-eye-museum-singapore-insider-guide-2026',
      title: "Master Trick Eye Museum: The Insider's 3D Photo Guide",
      excerpt: "Stop wasting angles. Here's exactly how to nail the best photos at every installation in Trick Eye Museum — from the perfect phone position to the right timing.",
      imageUrl: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=1200&fit=crop',
      insiderPrice: 'SGD $26 (online) / $32 at gate — always book online',
      bestTime: 'Weekday opening (10am) — first 30 min you have the museum to yourself',
      secretTip: 'The polar bear installation on Level 2 works best when you lie flat on the floor — most people stand and get mediocre shots. Lying flat = viral photo.',
      authorId: 'author_2',
      content: `<h2>Trick Eye Museum — The Photography Insider Guide</h2>
<p>Real Talk: Most people get Trick Eye Museum completely wrong. They rush through trying to photograph everything, end up with 50 mediocre shots, and leave feeling underwhelmed. The secret: choose 10 installations, nail the angle on each, and you'll leave with gallery-worthy shots.</p>
<h2>The 10 Must-Do Installations</h2>
<ul>
<li><strong>Polar Bear</strong> (Level 2): Lie flat on floor, hands covering face in mock fear. Best shot in the museum.</li>
<li><strong>Giant Wave</strong> (Level 1): Crouch low with arms spread — you'll look like you're surfing a 10-meter wave</li>
<li><strong>Dragon</strong> (Level 2): Stand at the red X marking — it's the exact focal point the artist designed for</li>
<li><strong>Hot Air Balloon</strong>: Lean forward over the edge — NOT backward — counter-intuitive but it works</li>
<li><strong>Lava Floor</strong>: Jump in the air and get someone to shoot burst mode — you'll get a perfect levitation shot</li>
</ul>
<h2>Technical Tips</h2>
<p>Use your phone's rear camera, not the selfie camera — rear camera has far better distortion-free wide angle. Most installations have small red X marks on the floor showing where to stand — this is where the 3D effect is calibrated. Don't ignore them.</p>
<h2>Small Groups Only</h2>
<p>Trick Eye is best experienced in groups of 2–3 people max. Larger groups can't coordinate the angles properly. Each person should take turns being the "photographer" and "subject" for maximum shot quality.</p>`
    },
    {
      slug: 'madame-tussauds-singapore-insider-guide-2026',
      title: "Madame Tussauds Singapore: The Insider's Real Deal",
      excerpt: 'Skip the hype and the overpriced ticket counter. Here\'s exactly which ticket bundle to buy, when to go, and which figures are actually worth your time.',
      imageUrl: 'https://images.unsplash.com/photo-1578987328244-08ac8d1eb0c3?w=1200&fit=crop',
      insiderPrice: 'SGD $31 (online basic) to $58 (Ultimate Experience bundle)',
      bestTime: 'Weekday 10am–12pm for near-empty rooms',
      secretTip: 'The "Marvel 4D Experience" add-on is genuinely worth it — it\'s a secret cinema experience that most visitors skip because it\'s not included in standard tickets.',
      authorId: 'author_1',
      content: `<h2>Madame Tussauds Singapore — What's Actually Worth It</h2>
<p>Skip the hype. Here's exactly what Madame Tussauds delivers and what it doesn't. The wax figures themselves are legitimately impressive up close — you genuinely forget they're not real for a moment. The experience falls apart when the crowds arrive and it becomes a jostling photo-taking conveyor belt.</p>
<h2>Which Ticket to Buy</h2>
<ul>
<li><strong>Basic (SGD $31)</strong>: Wax figures only. Sufficient for 60–75 minutes. Good value on weekdays.</li>
<li><strong>Star Bundle (SGD $42)</strong>: Adds Spirit of Singapore boat ride. Worth it — the boat experience is unique.</li>
<li><strong>Ultimate (SGD $58)</strong>: Adds Images of Singapore LIVE and 4D Movies. Best for first-time visitors to Singapore.</li>
</ul>
<h2>The Hidden Marvel 4D Zone</h2>
<p>The Marvel 4D Experience is tucked behind the Hollywood wing and poorly signposted. It's a 10-minute 4D film experience with motion seats, water effects, and wind — legitimately good entertainment that most people walk past. Always worth the 15-minute detour.</p>
<h2>Best Photo Figures</h2>
<p>The Leonardo DiCaprio, Cristiano Ronaldo, and Lady Gaga figures are photographically the most convincing. The political figures (Barack Obama, Lee Kuan Yew) have the most historical weight. Avoid the aging pop figures — they've been touched by millions of hands and show it.</p>`
    },
    {
      slug: 'gardens-by-the-bay-supertree-grove-guide',
      title: "Gardens by the Bay: The Supertree Grove Insider's Playbook",
      excerpt: 'The Gardens by the Bay most tourists see is just 10% of what\'s actually there. This guide covers the free sections, the Supertree timing hack, and the views nobody photographs.',
      imageUrl: 'https://images.unsplash.com/photo-1525625239513-39bc131f9979?w=1600&q=80',
      insiderPrice: 'Gardens (outdoor): Free | Cloud Forest: SGD $27 | Supertree OCBC Skyway: SGD $14',
      bestTime: 'Evening 6:30–9pm for Garden Rhapsody light show (free, twice nightly)',
      secretTip: 'The Dragon Fly Lake area is 20 minutes from the Supertrees and almost always empty — giant dragonfly sculptures, waterways, and zero tourist crowds.',
      authorId: 'author_1',
      content: `<h2>Gardens by the Bay — Beyond the Instagram Shot</h2>
<p>Most people visit Gardens by the Bay, photograph the Supertrees, and leave. They miss 90% of what makes this place extraordinary. The outdoor sections — all free — are genuinely world-class and far less crowded than the Supertree Grove.</p>
<h2>The Free Outdoor Section (Most People Skip This)</h2>
<ul>
<li>Dragonfly Lake: Peaceful waterway with dragonfly sculptures, always quiet</li>
<li>Kingfisher Wetlands: Active bird-watching area — 50+ species spotted here regularly</li>
<li>Heritage Garden: Malay, Chinese, Indian, and Colonial garden sections — beautifully done</li>
<li>Children's Garden (FREE): Best playground in Singapore for under-10s</li>
</ul>
<h2>Garden Rhapsody — The Unmissable Freebie</h2>
<p>The Garden Rhapsody light show happens every night at 7:45pm and 8:45pm. It's completely free. Find a spot on the bridge between the two dome conservatories — you'll be surrounded by the Supertrees lighting up in all directions simultaneously. Far better than paying for the OCBC Skyway.</p>
<h2>Supertree OCBC Skyway: Is It Worth SGD $14?</h2>
<p>Honestly: only if you're afraid of heights (it will conquer the fear) or you're a photography enthusiast (the aerial garden compositions are unique). For most visitors, the free ground-level view during Garden Rhapsody is more spectacular for less effort and zero cost.</p>`
    },
    {
      slug: 'universal-studios-singapore-guide-2026',
      title: "Universal Studios Singapore: The Zero-Queue Insider Strategy",
      excerpt: 'The difference between a 3-hour wait day and a no-queue day at Universal Studios is pure strategy. Here\'s the exact 90-minute formula local passes holders use.',
      imageUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=1200&fit=crop',
      insiderPrice: 'SGD $83 (adult online) / $53 (child) — never buy at the gate',
      bestTime: 'Weekday (Mon–Wed) doors open. Best months: Feb–Mar and Sep.',
      secretTip: 'Battlestar Galactica (the biggest rollercoaster) has two sides — Human and Cylon. Human side has consistently 40% shorter queues. Always go Human first.',
      authorId: 'author_2',
      content: `<h2>Universal Studios Singapore — The Local's Zero-Queue Formula</h2>
<p>Singapore locals with Annual Passes crack USS in 90 minutes on weekdays, hitting every major ride before the tourist crowds arrive. Here's the exact sequence — walk through it once and it becomes automatic.</p>
<h2>The 90-Minute Formula (Open to Close)</h2>
<ul>
<li><strong>9:55am</strong>: Stand at the gate. Be in the first 30 people at the turnstile.</li>
<li><strong>10:00am</strong>: Go immediately LEFT to Sci-Fi City — Battlestar Galactica Human side first, then Cylon. 5-minute queues each at open.</li>
<li><strong>10:30am</strong>: Walk counter-clockwise to Ancient Egypt — Revenge of the Mummy. 10 minutes max.</li>
<li><strong>10:50am</strong>: Madagascar — Madagascar: A Crate Adventure. Zero queue at this point.</li>
<li><strong>11:15am</strong>: Far Far Away — Shrek 4D. By now crowd is 40% of peak.</li>
<li><strong>11:45am</strong>: Hollywood — The Walking Dead, WaterWorld show (check timetable)</li>
</ul>
<h2>What to Skip</h2>
<p>Puss in Boots' Giant Journey is the most underrated ride in the park (no queue ever, genuinely fun). The Jurassic Park Rapids Adventure has random 60-minute queues — never worth it unless you're there to get wet intentionally.</p>
<h2>Express Pass: Worth It?</h2>
<p>Only on weekends or public holidays. On weekdays, your natural timing strategy beats even the Express Pass. The Express Pass adds nothing if you follow the formula above.</p>`
    },
    {
      slug: 'marina-bay-sands-insider-guide-2026',
      title: "Marina Bay Sands: The Complete Insider's Guide Beyond the Infinity Pool",
      excerpt: 'MBS is far more than one famous pool. Here\'s what the hotel website won\'t tell you — free observation access, casino tactics, and dinner that won\'t bankrupt you.',
      imageUrl: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=1200&fit=crop',
      insiderPrice: 'SkyPark Observation Deck: SGD $32 | Casino: Free entry (Singapore residents: SGD $150 levy)',
      bestTime: 'Observation Deck: 9:30am slot (earliest) for clearest views before haze',
      secretTip: 'Non-hotel guests can access the Level 57 SkyPark restaurant and bar area without paying the observation deck fee — order one drink and you\'re legitimately there for 90 minutes.',
      authorId: 'author_1',
      content: `<h2>Marina Bay Sands — What Non-Hotel Guests Actually Get Access To</h2>
<p>Here's the breakdown most people don't know: You don't need to stay at MBS to experience 80% of what makes it special. The observation deck, casino, shopping mall, dining, and the arts museum are all fully accessible to non-hotel guests.</p>
<h2>The Free Entry Points</h2>
<ul>
<li>The Casino is free for tourists (levy applies for Singapore citizens/PRs)</li>
<li>The shopping mall is free, air-conditioned, and spectacular</li>
<li>The Art-Science Museum lobby is free — only the exhibitions cost money</li>
<li>The Event Plaza outdoor area has free public access and great skyline views</li>
</ul>
<h2>SkyPark Observation Deck vs. Level 57 Restaurant</h2>
<p>The Observation Deck is SGD $32. Alternatively: go to CÉ LA VI restaurant on Level 57 (directly above the infinity pool) for dinner or drinks. A craft beer is SGD $18–22 and you're sitting on the iconic deck with the same view. Financially, dinner for two works out to the same as two observation deck tickets — but you get a meal.</p>
<h2>The Infinity Pool: The Reality</h2>
<p>The pool is for MBS hotel guests only — no exceptions, ever. But the walkway on the outer edge of Level 57 is semi-public on weekend evenings when the bar crowd spills out. You can get within 10 meters of the pool edge without paying for a room. That's the honest answer.</p>`
    },
    {
      slug: 'singapore-hawker-food-guide-must-eat',
      title: "Singapore Hawker Food: The Ultimate Insider's Eating Guide",
      excerpt: 'Forget the Michelin-starred hawkers with 90-minute queues. A 25-year local reveals the 12 dishes that define Singapore — and exactly where to get the best version of each.',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&fit=crop',
      insiderPrice: 'SGD $3–$8 per plate at any hawker centre',
      bestTime: 'Hawker centres: 7am (breakfast run) or 11:30am (before lunch rush)',
      secretTip: 'The best Chicken Rice in Singapore is NOT Tian Tian — it\'s Ah Tai (same stall, different owner) directly across from it at Maxwell. The queue is always shorter and most locals prefer it.',
      authorId: 'author_1',
      content: `<h2>The 12 Dishes Every Singapore Visitor Must Eat</h2>
<p>Singapore's hawker food culture is UNESCO-listed for a reason. Here are the 12 non-negotiable dishes with the exact stalls locals actually use — not the Michelin-starred queues that every tourist guidebook sends you to.</p>
<h2>The Non-Negotiable 12</h2>
<ul>
<li><strong>Hainanese Chicken Rice</strong>: Ah Tai at Maxwell Food Centre — consistently better than the famous Tian Tian next door, 40% shorter queue</li>
<li><strong>Laksa</strong>: 328 Katong Laksa (East Coast Road) — the original thick gravy, cut noodles you eat with a spoon</li>
<li><strong>Char Kway Teow</strong>: Hill Street Tai Hwa Pork Noodle (Crawford Lane) — Michelin Star but still affordable at SGD $6</li>
<li><strong>Hokkien Mee</strong>: Nam Sing Hokkien Fried Mee (Old Airport Road Hawker Centre) — lard-fried properly</li>
<li><strong>Chilli Crab</strong>: No Signboard Seafood (Geylang) — 30% cheaper than tourist traps on Clarke Quay</li>
<li><strong>Satay</strong>: Lau Pa Sat (Raffles Quay) — late night street satay starting at 7pm nightly</li>
</ul>
<h2>Hawker Centre Rankings for Tourists</h2>
<p>Lau Pa Sat (central, open 24hrs), Maxwell Food Centre (best variety, tourist-friendly), Old Airport Road (hardcore local, 60+ years old), and Chinatown Complex (chaos but incredible food) are the four must-visit centres — each has its own specialty strengths.</p>`
    },
    {
      slug: 'sentosa-island-complete-guide-singapore',
      title: "Sentosa Island: The Complete Insider's Playbook (Beyond Universal Studios)",
      excerpt: 'Most visitors only see Universal Studios and Siloso Beach. The other 70% of Sentosa — its hidden coves, secret bars, and free attractions — remains largely undiscovered.',
      imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&fit=crop',
      insiderPrice: 'Island levy: SGD $4 (by car) | By foot/MRT: Free',
      bestTime: 'Weekday 9am–12pm for beaches | Evening 6–9pm for Palawan Beachfront bars',
      secretTip: 'Palawan Beach has a suspension bridge to the Southernmost Point of Continental Asia — technically a continent\'s southernmost tip — and almost nobody visits it. Free, zero queue, and a genuinely cool fact.',
      authorId: 'author_1',
      content: `<h2>Sentosa: The 70% That Tourists Never See</h2>
<p>Sentosa Island is 5 square kilometers of curated leisure, and the vast majority of it is free to explore. Most visitors funnel straight to Universal Studios and miss the beaches, bars, hidden trails, and genuinely unusual attractions that make Sentosa worth a full day even without theme parks.</p>
<h2>The Three Beaches (Ranked)</h2>
<ul>
<li><strong>Palawan Beach</strong>: Best for families — calm shallow water, suspension bridge to the Southernmost Point, reasonably uncrowded</li>
<li><strong>Siloso Beach</strong>: Best for activities — volleyball courts, kayak rental, beach bars, constant events/concerts</li>
<li><strong>Tanjong Beach</strong>: Best for relaxing — smallest, quietest, most "resort" feel. Tanjong Beach Club is the best beach bar in Singapore</li>
</ul>
<h2>Free Attractions Nobody Talks About</h2>
<ul>
<li><strong>Fort Siloso</strong>: British WWII fort, partially preserved, free entry, genuinely historically significant</li>
<li><strong>Sentosa Nature Walk</strong>: 1.6km of secondary rainforest, free, often empty, monitor lizards guaranteed</li>
<li><strong>Mega Adventure Park views</strong>: The MegaZip landing platform's surrounding area has stunning sea views — free to access without doing the zip line</li>
</ul>
<h2>Getting Around Without Paying</h2>
<p>The Sentosa Bus (lines A, B, C) is free and runs every 5–10 minutes. Beach Tram (beachfront connector) is also free. The only thing you pay for is Sentosa Express MRT if arriving from VivoCity — opt to walk the Boardwalk from HarbourFront instead to avoid the $4 fee (15-minute walk with great views).</p>`
    },
  ];

  // ─── STEP 3: UPSERT ALL POSTS ─────────────────────────────────────────
  let successCount = 0;
  let errorCount = 0;

  for (const post of posts) {
    try {
      const result = await prisma.post.upsert({
        where: { slug: post.slug },
        update: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          imageUrl: post.imageUrl,
          category: 'Evergreen',
          status: 'PUBLISHED',
          isNewsjack: false,
          insiderPrice: post.insiderPrice || null,
          bestTime: post.bestTime || null,
          secretTip: post.secretTip || null,
          authorId: post.authorId,
        },
        create: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          imageUrl: post.imageUrl,
          category: 'Evergreen',
          status: 'PUBLISHED',
          isNewsjack: false,
          insiderPrice: post.insiderPrice || null,
          bestTime: post.bestTime || null,
          secretTip: post.secretTip || null,
          authorId: post.authorId,
        },
      });
      console.log(`✅ [${result.id}] ${result.title}`);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed: ${post.slug} — ${err.message}`);
      errorCount++;
    }
  }

  // ─── STEP 4: FINAL VERIFICATION ──────────────────────────────────────
  const finalCount = await prisma.post.count({
    where: { status: 'PUBLISHED', category: 'Evergreen' },
  });

  console.log('\n══════════════════════════════════');
  console.log('✅ Seeded:', successCount, '/ Errors:', errorCount);
  console.log('📊 Posts matching homepage query (PUBLISHED + Evergreen):', finalCount);
  console.log('══════════════════════════════════');
  console.log('🎉 Database ready. Deploy and verify the homepage!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
