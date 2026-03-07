const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateLaoJiu() {
    const KLOOK_LINK = "https://www.klook.com/en-HK/event-detail/101030509-2026-lao-jiu-the-musical/?aid=105111";
    const TRIP_LINK = "https://www.trip.com/travel-guide/attraction/singapore/singapore-lao-jiu-the-musical-153982808/?allianceid=7367361&sid=278066643";
    const IMAGE_URL = "https://res.klook.com/image/upload/fl_lossy.progressive,w_1200,h_630,c_fill,q_85/v1767751047/events_admin/ikmw3wqfa9wfxer7i5gf.jpg";

    const description = `
<h2>What Is Lao Jiu: The Musical?</h2>
<p>"Lao Jiu" literally means the ninth child — the youngest in a large family, often overlooked yet quietly central to everything. Originally staged in 1997 by The Theatre Practice, the production has been revived multiple times because it keeps hitting a nerve with Singapore audiences. The 2026 run marks its latest reimagination, with updated staging that reportedly speaks to post-pandemic family dynamics in Singapore.</p>

<p>The show performs primarily in Mandarin with English surtitles projected above the stage. If your Mandarin is rusty, don't let that stop you. The surtitles at Drama Centre are well-positioned and easy to follow even from the upper tiers. That said, Mandarin speakers catch layers of Hokkien and Cantonese dialect humour that don't fully translate — worth knowing before you walk in.</p>

<p>Every performance is more than just a musical; it's a deeply emotional experience. <strong>Secure your tickets today via <a href="${KLOOK_LINK}" target="_blank">Klook</a> or <a href="${TRIP_LINK}" target="_blank">Trip.com</a>.</strong></p>

<h2>Dates, Venue & Schedule</h2>
<p>The run spans 18 days across three weekends, plus weeknight performances at the <strong>Drama Centre Theatre, National Library Building</strong> (100 Victoria Street, Singapore 188064).</p>

<ul>
  <li><strong>Opening Night:</strong> Thursday, 2 April 2026</li>
  <li><strong>Closing Night:</strong> Sunday, 19 April 2026</li>
  <li><strong>Venue:</strong> Drama Centre Theatre</li>
  <li><strong>Seating Capacity:</strong> ~614 seats</li>
  <li><strong>Language:</strong> Mandarin (with English surtitles)</li>
  <li><strong>Estimated Duration:</strong> ~2 hours including 1 interval</li>
</ul>

<p>One thing most guides skip: Weeknight shows (Tuesday–Thursday) tend to have better seat availability and a noticeably different crowd—fewer large school groups, more engaged theatre-goers. Sunday matinees skew older and more family-oriented, which is genuinely ideal if you're bringing grandparents.</p>

<h2>Ticket Prices & Where to Buy</h2>
<p>Tickets are available on BookMyShow SG, Klook, and SISTIC. Pricing is tiered by category:</p>

<ul>
  <li><strong>CAT 1 — Premium:</strong> ~$120–$130 (Front orchestra centre)</li>
  <li><strong>CAT 2:</strong> ~$95–$105 (Mid orchestra)</li>
  <li><strong>CAT 3:</strong> ~$75–$85 (Rear orchestra / front circle)</li>
  <li><strong>CAT 4 — Value:</strong> ~$55–$65 (Upper dress circle)</li>
  <li><strong>Family Bundle (4 pax):</strong> Available for selected shows on Klook</li>
</ul>

<p><strong>Honest take:</strong> CAT 3 is the sweet spot. You're in the rear orchestra or front dress circle — close enough to read facial expressions, far enough back to take in the full stage picture. <strong>Pro Tip:</strong> SAFRA members and UOL cardholders should check for additional discounts.</p>

<h2>Getting There: Transport & Parking</h2>
<p>Drama Centre sits inside the National Library Building at Bugis/Bras Basah. Getting here is easy via public transport:</p>

<ul>
  <li><strong>Bugis MRT:</strong> Exit B, walk ~5 min south along Victoria Street. (Fastest)</li>
  <li><strong>City Hall MRT:</strong> ~10 min via Bras Basah Road.</li>
  <li><strong>Bras Basah MRT:</strong> ~6 min walk via Bras Basah Complex.</li>
</ul>

<p><strong>Parking:</strong> The National Library basement fills up fast on Friday evenings. If driving, arrive by 7pm for an 8pm show, or park at Bugis Junction/Bugis+ (7-min walk).</p>

<h2>Is Lao Jiu Family-Friendly?</h2>
<ul>
  <li><strong>Ages 10+:</strong> Recommended. They will follow the story comfortably.</li>
  <li><strong>Ages 6–9:</strong> Manageable, but the 2-hour run and heavy themes may need a post-show debrief.</li>
  <li><strong>Under 6:</strong> Not recommended due to run-time and complex themes.</li>
  <li><strong>Grandparents:</strong> This show was practically made for them; Sunday matinees are particularly popular with the 60+ crowd.</li>
</ul>

<h2>Seat Map & Viewing Tips</h2>
<p>The <strong>Front Dress Circle</strong> (Circle Rows A–C) is a significantly underrated value. You get an elevated, centred view where choreography and set composition read far better than from a low orchestra seat. Several experienced theatre-goers in Singapore specifically request Circle Row A centre when booking.</p>

<h2>Frequently Asked Questions</h2>
<p><strong>Is the show entirely in Mandarin?</strong><br/>
Yes, but with English surtitles. Context keeps the occasional Hokkien/Cantonese expressions followable.</p>

<p><strong>Where can I buy tickets?</strong><br/>
You can book tickets on <strong><a href="${KLOOK_LINK}" target="_blank">Klook</a></strong> or via standard ticketing platforms.</p>

<p><strong>What time should I arrive?</strong><br/>
Aim for at least 30 minutes before curtain. The box office gets busy 20–25 minutes before showtime.</p>
  `;

    await prisma.event.update({
        where: { slug: 'lao-jiu-the-musical-singapore-2026' },
        data: {
            imageUrl: IMAGE_URL,
            sourceUrl: KLOOK_LINK, // Primary affiliate link
            enrichedContent: {
                klookUrl: KLOOK_LINK,
                tripUrl: TRIP_LINK
            },
            description: description,
            updatedAt: new Date()
        }
    });

    console.log("✅ Lao Jiu event updated successfully.");
    await prisma.$disconnect();
}

updateLaoJiu().catch(e => {
    console.error(e);
    process.exit(1);
});
