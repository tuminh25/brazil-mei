const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

async function runAgent(mode) {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  console.log(`🚀 [SG Events Hub] Đang chạy chế độ: ${mode}`);

  const masterPrompt = `
    TASK: Write a 1,500-word HTML Insider Guide about: a TOP bookable attraction on Klook/Trip.com Singapore.
    
    # STRICT RULES:
    1. AFFILIATE ONLY: The "sourceUrl" MUST be from Klook or Trip.com. NEVER use official .gov or .com sites. 
       - Append Klook ID: ?aid=105111&utm_medium=affiliate-alwayson&utm_source=non-network&utm_campaign=105111
       - Append Trip ID: ?Allianceid=7367361&SID=278066643
    2. IMAGE: Use this format exactly: https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200
    3. HTML FORMATTING: Use <h2>, <p>, <strong>. Every paragraph starts with ✦.
    4. NO MARKDOWN: No ** stars.

    RETURN JSON: { "title", "slug", "content", "excerpt", "imageUrl", "sourceUrl", "venue", "price" }
  `;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [{ role: "system", content: "You are a robotic JSON API. You only provide Klook/Trip links." }, { role: "user", content: masterPrompt }],
        temperature: 0.1
      })
    });

    const resData = await response.json();
    let rawText = resData.choices[0].message.content;
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}') + 1;
    let cleanJson = rawText.substring(jsonStart, jsonEnd).replace(/\[\d+\]/g, "").replace(/\*\*/g, "").replace(/\(Word count:.*\)/gi, "");

    const data = JSON.parse(cleanJson);
    
    // HẬU KIỂM LINK: Nếu không phải Klook/Trip thì hủy bài ngay để đỡ tốn tiền
    if (!data.sourceUrl.includes("klook") && !data.sourceUrl.includes("trip.com")) {
       throw new Error("AI cãi lệnh, dám dùng link official. Hủy bài!");
    }

    const author = await prisma.author.findFirst({ where: { name: { contains: "Desmond" } } });

    if (mode === "money") {
      await prisma.event.create({
        data: {
          name: data.title,
          slug: `${data.slug}-${Date.now()}`,
          description: data.content,
          startDate: new Date(),
          venue: data.venue || "Singapore",
          price: data.price || "Check website",
          sourceUrl: data.sourceUrl,
          imageUrl: data.imageUrl,
          category: 'Event',
          status: 'PUBLISHED',
          author: { connect: { id: author?.id || "cl_default" } }
        }
      });
      console.log(`✅ Đã chốt đơn bài Affiliate XỊN: ${data.title}`);
    } else {
      // Logic Post tương tự...
    }
  } catch (error) { console.error("❌ LỖI:", error.message); }
}

const args = process.argv.slice(2);
runAgent(args[0] === 'money' ? 'money' : 'trend');