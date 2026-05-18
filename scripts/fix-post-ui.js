const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

async function fixPostUI() {
    const slug = "15-best-indoor-playgrounds-in-singapore";
    console.log(`🚀 [SG Events Hub] Refining UI for post: ${slug}`);

    try {
        const post = await prisma.post.findUnique({ where: { slug } });
        if (!post) {
            console.error("❌ Post not found");
            return;
        }

        let content = post.content;

        // 1. Fix the Table
        const tableData = [
            ["Pororo Park", "City Hall / Esplanade", "1–7", "From ~$38 (1 child + adult)", "Paid", "Toddlers & Pororo fans"],
            ["Amazonia", "Great World (TE15)", "3–12", "From ~$28 (child)", "Paid", "Younger kids, indoor adventure"],
            ["Curiosity Cove", "Mandai (bus/drive)", "3–12", "From $28 (child)", "Paid", "Nature-loving, curious kids"],
            ["Kiztopia", "Promenade / Marina Square", "1–10", "From ~$37.85 (1 child + adult, 2 hr)", "Paid", "Full-day family outing"],
            ["Jolly Jungle", "Yishun SAFRA", "3–8", "~$15–$20", "Paid", "Younger kids, North Singapore"],
            ["Waka Waka", "Outram Park (EW16)", "7 mths–12", "From $15 (weekday)", "Paid", "Safari play, great value"],
            ["Artground", "Mountbatten (CC7)", "0–9", "$5–$8 per pax", "Paid (very affordable)", "Creative kids, value seekers"],
            ["Kidodo", "Farrer Park (NE8)", "1–12", "Check Klook", "Paid", "City Square Mall families"],
            ["Happywiz", "Check Trip.com", "2–12", "Check Trip.com", "Paid", "Active, energetic kids"],
            ["Yishun SAFRA Playground", "Yishun (NS13)", "2–10", "Free (SAFRA members)", "Free (members)", "North families, SAFRA members"],
            ["City Square Mall Playground", "Farrer Park (NE8)", "2–10", "Free", "Free", "Quick mall play break"],
            ["T-Play", "Various outlets", "1–12", "From ~$12", "Paid", "Budget-friendly multi-region"],
            ["Polliwogs", "HarbourFront (CC29)", "0–12", "From ~$28.90 (1 adult + 1 child)", "Paid", "Mixed age groups"],
            ["SuperPark", "Esplanade / City Hall", "All ages", "$35 (weekday) / $48 (weekend)", "Paid", "Older kids & teens"],
            ["Tayo Station", "Pasir Ris (EW1)", "1–10", "From ~$27.90 (1 child + adult)", "Paid", "Bus-mad toddlers, East families"]
        ];

        const tableHeaders = ["Name", "Area / MRT", "Age Range", "Price (SGD)", "Free or Paid", "Best For"];

        let tableHtml = `
<div class="overflow-x-auto">
  <table class="w-full border-collapse border border-white/10 my-10 text-sm">
    <thead>
      <tr class="bg-white/5">
        ${tableHeaders.map(h => `<th class="border border-white/5 p-4 text-blue-400 font-black uppercase tracking-widest text-left">${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${tableData.map(row => `
      <tr>
        ${row.map(cell => `<td class="border border-white/5 p-4 text-gray-300">${cell}</td>`).join('')}
      </tr>`).join('')}
    </tbody>
  </table>
</div>`;

        // Replace the "Quick Comparison" messy text with the proper table
        // The messy text starts after the <h2> and ends before the next <h2> or Best Deal box
        // Based on previous view_file, it's roughly between lines 12 and 143.
        // I'll use a regex to find the section between the headers.
        content = content.replace(/<h2>Quick Comparison: Best Indoor Playgrounds in Singapore 2026<\/h2>[\s\S]*?<h2>Detailed Reviews:/gi, (match) => {
            return `<h2>Quick Comparison: Best Indoor Playgrounds in Singapore 2026</h2>\n${tableHtml}\n\n<h2>Detailed Reviews:`;
        });

        // 2. Fix the "Best Deal" Boxes
        const bestDealStyle = `style="background-color: #0a0a0a !important; border: 1px solid #FFC107; color: white; padding: 24px; margin: 32px 0; border-radius: 12px;"`;
        
        // Pattern 1: The one at the top (3 paragraphs)
        content = content.replace(/<p><strong>⭐ \[BEST DEAL\] Singapore Playgrounds Pass[\s\S]*?saves up to 30%\)<\/p>/gi, (match) => {
            return `<div ${bestDealStyle}>${match}</div>`;
        });
        
        // Pattern 2: The one at the bottom (2 paragraphs)
        content = content.replace(/<p><strong>⭐ \[BEST DEAL\] Save Up to 30%[\s\S]*?saves up to 30%\)<\/p>/gi, (match) => {
            return `<div ${bestDealStyle}>${match}</div>`;
        });

        // 3. Clean Content: Remove any remaining empty <p></p> tags
        content = content.replace(/<p>\s*<\/p>/gi, '');
        content = content.replace(/<p><\/p>/gi, '');

        // 4. Update the DB
        await prisma.post.update({
            where: { id: post.id },
            data: { content }
        });

        console.log("✅ Post UI refined and updated in DB.");

        // 5. Force Revalidate
        const secret = "BOSS2026";
        const revalidateUrl = `http://localhost:3000/api/revalidate?path=/guides/${slug}&secret=${secret}`;
        
        try {
            const response = await axios.get(revalidateUrl);
            console.log(`✅ Revalidation successful:`, response.data);
        } catch (revError) {
            console.warn(`⚠️ Revalidation failed (Server might not be running).`);
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

fixPostUI();
