const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

async function importSeventeen() {
    const slug = 'seventeen-world-tour-new-singapore-2026-insider-guide';
    const name = 'SEVENTEEN WORLD TOUR [NEW_] Singapore 2026: CARAT Survival Guide';
    const imageUrl = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=630&fit=crop';
    const KLOOK_URL = 'https://www.klook.com/en-SG/search/result/?query=SEVENTEEN+Singapore+concert&aid=105111';
    const TRIP_URL = 'https://sg.trip.com/hotels/singapore-hotel-detail-1/?allianceid=7367361&sid=278066643';

    const description = `
<p><strong>SEVENTEEN's [NEW_] World Tour hits Singapore's National Stadium on March 7, 2026, 6:30 PM</strong> — their first stadium show since Follow Again in 2024. Expect 55,000 CARATs, cinematic production, and that signature 13-member precision choreography. Doors open early for merch and lightstick pairing booths.</p>

<p>This isn't your average indoor stadium gig. National Stadium's 55,000 capacity + Kallang dispersal chaos means transport planning isn't optional — it's survival. Tickets sold out in minutes during presales; resale prices on Carousell are 2-3x face value with blacklist risks. Fan projects at Marina Bay Sands (March 2-8) add pre/post-concert hype.</p>

<h2>Ticket Prices: What You Actually Pay Now</h2>
<table style="width:100%;border-collapse:collapse;">
  <thead><tr style="background:#111;"><th style="padding:8px;border:1px solid #333;">Category</th><th style="padding:8px;border:1px solid #333;">Face Value</th><th style="padding:8px;border:1px solid #333;">Resale (Carousell, Feb 2026)</th><th style="padding:8px;border:1px solid #333;">VIP Perks</th></tr></thead>
  <tbody>
    <tr><td style="padding:8px;border:1px solid #333;">VIP</td><td style="padding:8px;border:1px solid #333;">$399</td><td style="padding:8px;border:1px solid #333;">$800–1200</td><td style="padding:8px;border:1px solid #333;">Soundcheck, laminate, exclusive merch booth lane</td></tr>
    <tr><td style="padding:8px;border:1px solid #333;">CAT 1</td><td style="padding:8px;border:1px solid #333;">$349</td><td style="padding:8px;border:1px solid #333;">$650–900</td><td style="padding:8px;border:1px solid #333;">Premium reserved seating</td></tr>
    <tr><td style="padding:8px;border:1px solid #333;">CAT 2</td><td style="padding:8px;border:1px solid #333;">$319</td><td style="padding:8px;border:1px solid #333;">$550–750</td><td style="padding:8px;border:1px solid #333;">Upper tier center</td></tr>
    <tr><td style="padding:8px;border:1px solid #333;">CAT 3</td><td style="padding:8px;border:1px solid #333;">$289</td><td style="padding:8px;border:1px solid #333;">$450–600</td><td style="padding:8px;border:1px solid #333;">Side sections</td></tr>
    <tr><td style="padding:8px;border:1px solid #333;">CAT 4</td><td style="padding:8px;border:1px solid #333;">$259</td><td style="padding:8px;border:1px solid #333;">$400–500</td><td style="padding:8px;border:1px solid #333;">Upper corners</td></tr>
    <tr><td style="padding:8px;border:1px solid #333;">CAT 5</td><td style="padding:8px;border:1px solid #333;">$229</td><td style="padding:8px;border:1px solid #333;">$350–450</td><td style="padding:8px;border:1px solid #333;">Upper rear</td></tr>
    <tr><td style="padding:8px;border:1px solid #333;">CAT 6</td><td style="padding:8px;border:1px solid #333;">$199</td><td style="padding:8px;border:1px solid #333;">$300–400</td><td style="padding:8px;border:1px solid #333;">General admission upper</td></tr>
  </tbody>
</table>
<p><em>Prices exclude booking fees. Resale data from Carousell listings Feb 25, 2026.</em></p>
<p>⚠️ <strong>Resale warning:</strong> Carousell/Viagogo tickets risk blacklist by Live Nation. Priority: CARAT presale → Trip.com presale → Ticketmaster general sale → verified resale only. <a href="${KLOOK_URL}" target="_blank" rel="noopener noreferrer">Check Klook for resale bundles →</a></p>
<p>💡 <strong>Pro tip:</strong> CAT 2/3 offer the best stage view without VIP premium. Avoid CAT 6 unless budget-constrained.</p>

<h2>Seat Map: Where to Sit</h2>
<table style="width:100%;border-collapse:collapse;">
  <thead><tr style="background:#111;"><th style="padding:8px;border:1px solid #333;">Section</th><th style="padding:8px;border:1px solid #333;">View Quality</th><th style="padding:8px;border:1px solid #333;">Pros</th><th style="padding:8px;border:1px solid #333;">Cons</th></tr></thead>
  <tbody>
    <tr><td style="padding:8px;border:1px solid #333;">VIP (Field A/B)</td><td style="padding:8px;border:1px solid #333;">10/10</td><td style="padding:8px;border:1px solid #333;">Closest to stage, soundcheck access</td><td style="padding:8px;border:1px solid #333;">$399+, standing fatigue</td></tr>
    <tr><td style="padding:8px;border:1px solid #333;">CAT 1 (Lower Center)</td><td style="padding:8px;border:1px solid #333;">9/10</td><td style="padding:8px;border:1px solid #333;">Perfect sightlines, full production view</td><td style="padding:8px;border:1px solid #333;">Sold out first</td></tr>
    <tr><td style="padding:8px;border:1px solid #333;">CAT 2 (Lower Sides)</td><td style="padding:8px;border:1px solid #333;">8.5/10</td><td style="padding:8px;border:1px solid #333;">Good angle on wings choreography</td><td style="padding:8px;border:1px solid #333;">Slight side view</td></tr>
    <tr><td style="padding:8px;border:1px solid #333;">CAT 3 (Mid Center)</td><td style="padding:8px;border:1px solid #333;">8/10</td><td style="padding:8px;border:1px solid #333;">Elevated overview, screens visible</td><td style="padding:8px;border:1px solid #333;">Distance from stage</td></tr>
    <tr><td style="padding:8px;border:1px solid #333;">CAT 4–5 (Mid Sides)</td><td style="padding:8px;border:1px solid #333;">7/10</td><td style="padding:8px;border:1px solid #333;">Full view with screens</td><td style="padding:8px;border:1px solid #333;">Choreo details smaller</td></tr>
    <tr><td style="padding:8px;border:1px solid #333;">CAT 6 (Upper Tier)</td><td style="padding:8px;border:1px solid #333;">5.5/10</td><td style="padding:8px;border:1px solid #333;">Big screens mandatory</td><td style="padding:8px;border:1px solid #333;">Echo, distance</td></tr>
  </tbody>
</table>
<p><em>Insider: CAT 1 Block 101–104 (front center) had the best Follow Again views — same applies for [NEW_].</em></p>

<h2>SEVENTEEN EXPERIENCE: Fan Projects & Pre-Concert Hype (Mar 2–8)</h2>
<p>Marina Bay Sands hosts <strong>SEVENTEEN EXPERIENCE (Mar 2–8)</strong> — member-designed pop-ups, Rose Quartz/Serenity lighting, themed dining at 6 F&B outlets, and Marquee party (Mar 6). MBS exterior lights up concert night (Mar 7).</p>
<ul>
  <li>Digital screens + playlists across MBS lobby/Shoppes</li>
  <li>Member coasters free at participating outlets</li>
  <li>Marquee pre-party (Mar 6, 10:30PM–11:30PM) — Rose Quartz cocktails, SVT hits</li>
  <li>MBS lighting (Mar 7) — full resort in official Rose Quartz/Serenity colors</li>
</ul>
<p>Fan project tips: Coordinate banners/lightstick waves via Weverse/caratsg Facebook. Caratbong v3 (≤40cm) permitted; pair via app 1–2 days prior. No gifts/balloons inside stadium.</p>
<p style="margin-top:12px;">
  <a href="${TRIP_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#003580;color:#fff;font-weight:700;font-size:15px;padding:12px 24px;border-radius:8px;text-decoration:none;">
    🏨 Stay Near MBS — Search Hotels on Trip.com →
  </a>
</p>

<h2>Caratbong Lightstick Policy & Pairing Guide</h2>
<p><strong>Official policy:</strong> SEVENTEEN Light Stick VER.3 (Caratbong v3 or 10th Anniv edition) only — v1/v2 unsupported.</p>
<p><strong>Pairing booths at National Stadium:</strong></p>
<ul>
  <li>North Plaza Sheltered Walkway: 12PM–6PM</li>
  <li>Gate 3: 4:30PM–7PM</li>
</ul>
<p><strong>Prep steps:</strong></p>
<ul>
  <li>Update app + lightstick firmware 1–2 days prior</li>
  <li>Use 3x new AAA alkaline batteries (old ones fail mid-show)</li>
  <li>Pair via Weverse → Official Light Stick app shortcut</li>
  <li>Lightstick stays paired even if batteries swapped</li>
</ul>

<h2>Transport: Surviving 55,000 CARATs at Kallang</h2>
<p>National Stadium post-concert dispersal is legendary chaos. MRT Kallang (Circle/EW lines) handles 55k but expect 45–60min waits. Here's the plan:</p>
<h3>Arrival (Pre-6PM)</h3>
<ul>
  <li><strong>MRT (Recommended):</strong> Stadium station (EW26/CC29) — 5min walk to gates. Exit B for East Gate, Exit A for West.</li>
  <li><strong>Grab/Taxi:</strong> Drop-off Stadium Walk/Nicoll Highway. SGD 15–25 from CBD, 20min.</li>
  <li><strong>Bus:</strong> 11, 14, 16 from CBD. Direct to stadium.</li>
</ul>
<h3>Departure (Post-10PM — The Real Test)</h3>
<ul>
  <li><strong>WaveBus/Private Charter:</strong> Book WaveBus.sg for groups — direct pickup Coach Bay Gate 15. Avoids MRT crush.</li>
  <li><strong>MRT Hack:</strong> Walk to Paya Lebar (10min) — less crowded than Stadium station.</li>
  <li><strong>Grab Surge:</strong> Expect 3–5x rates. Pre-book via WaveBus if group ≥4.</li>
</ul>
<p>💡 <strong>Pro tip:</strong> Gates open 4PM for merch/lightstick pairing. Arrive 3PM to beat queues.</p>

<h2>Practical Tips Most Guides Skip</h2>
<ul>
  <li><strong>Bag policy:</strong> Small sling bags OK. No large backpacks. Empty plastic bottles allowed (caps may be removed).</li>
  <li><strong>Powerbank:</strong> Permitted (under 20,000mAh).</li>
  <li><strong>Food/Drink:</strong> No outside food. Buy inside (expensive). Empty bottle hack works.</li>
  <li><strong>Lightstick batteries:</strong> 3x AAA alkaline. Bring extras — stadium heat drains them fast.</li>
  <li><strong>Weather:</strong> March = 85% humidity. Poncho + towel essential.</li>
  <li><strong>VIP soundcheck:</strong> 4–5PM. Arrive Gate 3 by 3PM.</li>
</ul>

<h2>Frequently Asked Questions</h2>
<h3>When is SEVENTEEN Singapore 2026?</h3>
<p>March 7, 2026, 6:30 PM at National Stadium. Doors ~4PM for merch/lightstick pairing.</p>
<h3>Are tickets still available?</h3>
<p>General sale sold out. Official resale via Ticketmaster. Carousell risky (blacklist).</p>
<h3>Caratbong lightstick allowed?</h3>
<p>Yes — VER.3 only. Pair via app at North Plaza (12–6PM) or Gate 3 (4:30–7PM). Batteries: 3x AAA alkaline.</p>
<h3>How to get to National Stadium?</h3>
<p>MRT Stadium station (5min walk). Post-show: WaveBus Coach Bay Gate 15 or walk to Paya Lebar.</p>
<h3>Fan projects at SEVENTEEN Singapore?</h3>
<p>Marina Bay Sands SEVENTEEN EXPERIENCE (Mar 2–8): lighting, pop-ups, Marquee party. Coordinate via Weverse.</p>
<h3>Bag policy National Stadium K-pop?</h3>
<p>Small sling bags OK. No large backpacks. Empty plastic bottles permitted.</p>
<h3>Post-concert transport chaos?</h3>
<p>55k fans = MRT 45–60min wait. Book WaveBus or Grab 30min pre-end.</p>

<h2>3 Takeaways for March 7</h2>
<ol>
  <li><strong>Pre-arrival:</strong> Pair Caratbong v3 app 1–2 days prior. New AAA batteries x2 sets. Book transport (WaveBus beats MRT crush).</li>
  <li><strong>On-site:</strong> Gates 4PM. Merch queue 2hrs pre-doors. CAT 1–3 best views.</li>
  <li><strong>Post-show:</strong> Exit via Gate 15 Coach Bay if WaveBus. Otherwise Paya Lebar walk.</li>
</ol>
<p>Ready for SEVENTEEN? <a href="${KLOOK_URL}" target="_blank" rel="noopener noreferrer">Check Klook for concert bundles →</a></p>
`;

    await prisma.event.upsert({
        where: { slug },
        update: {
            name,
            description,
            imageUrl,
            status: 'PUBLISHED',
            category: 'Event',
            venue: 'National Stadium',
            venueAddress: '1 Stadium Drive, Singapore 397629',
            startDate: new Date('2026-03-07T18:30:00+08:00'),
            price: 'SGD $199–$399',
            sourceUrl: 'https://www.klook.com/en-SG/search/result/?query=SEVENTEEN+Singapore+concert&aid=105111',
            authorId: 'author_1',
            updatedAt: new Date(),
        },
        create: {
            name,
            slug,
            description,
            imageUrl,
            status: 'PUBLISHED',
            category: 'Event',
            venue: 'National Stadium',
            venueAddress: '1 Stadium Drive, Singapore 397629',
            startDate: new Date('2026-03-07T18:30:00+08:00'),
            price: 'SGD $199–$399',
            sourceUrl: 'https://www.klook.com/en-SG/search/result/?query=SEVENTEEN+Singapore+concert&aid=105111',
            authorId: 'author_1',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    });

    console.log('✅ SEVENTEEN article imported successfully to DB!');
    console.log('   Slug:', slug);
    console.log('   URL: https://www.sgeventshub.com/events/' + slug);
}

importSeventeen()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
