const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

// Helper to slugify text
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}

// User-requested Meta Image Fetcher
async function fetchMetaImage(url) {
  if (!url || !url.startsWith('http')) return null;
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
    const $ = cheerio.load(data);
    return $('meta[property="og:image"]').attr('content') || null;
  } catch (e) { return null; }
}

async function importHtmlGuides() {
  console.log("🚀 [SG Events Hub] Starting ULTIMATE Premium Import Processor...");

  try {
    const filePath = 'scripts/new_guides.txt';
    if (!fs.existsSync(filePath)) {
      throw new Error("Missing scripts/new_guides.txt");
    }
    const rawContent = fs.readFileSync(filePath, 'utf8');

    // Split multiple articles
    const rawArticles = rawContent.split(/===.*===/);

    for (let rawArticle of rawArticles) {
      if (rawArticle.trim().length < 50) continue;

      const extract = (tag) => {
        const startTagLower = `[${tag.toLowerCase()}]`;
        const endTagLower = `[/${tag.toLowerCase()}]`;
        const rawLower = rawArticle.toLowerCase();

        let startIndex = rawLower.indexOf(startTagLower);
        if (startIndex !== -1) {
          let contentStart = startIndex + startTagLower.length;
          let endIndex = rawLower.indexOf(endTagLower, contentStart);
          if (endIndex !== -1) {
            return rawArticle.substring(contentStart, endIndex).trim();
          }
        }

        const labelsMap = {
          "TITLE": ["TITLE TAG:", "TITLE:"],
          "SLUG": ["URL SLUG:", "SLUG:"],
          "EXCERPT": ["META DESCRIPTION:", "EXCERPT:"],
          "IMAGEURL": ["IMAGE URL:", "IMAGEURL:"],
          "SOURCE": ["SOURCE:", "URL:"]
        };

        const labels = labelsMap[tag.toUpperCase()] || [`${tag.toUpperCase()}:`];
        for (let label of labels) {
          const labelIndex = rawLower.indexOf(label.toLowerCase());
          if (labelIndex !== -1) {
            const lineStart = labelIndex + label.length;
            const lineEnd = rawArticle.indexOf("\n", lineStart);
            const value = rawArticle.substring(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();
            if (value) return value;
          }
        }
        return null;
      };

      let title = extract("TITLE");
      let slug = extract("SLUG");
      let content = extract("CONTENT");
      let excerpt = extract("EXCERPT");
      let imageUrl = extract("IMAGEURL");
      const sourceUrl = extract("SOURCE");

      // Fallback content extraction
      if (!content && title) {
        const lines = rawArticle.split("\n");
        let metadataEndIdx = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes("TITLE TAG:") || lines[i].includes("META DESCRIPTION:") || lines[i].includes("URL SLUG:")) {
            metadataEndIdx = i + 1;
          }
          if (lines[i].includes("By ") && i < 10) metadataEndIdx = i + 1;
        }
        content = lines.slice(metadataEndIdx).join("\n").trim();
      }

      if (!content || content.length < 100) continue;

      if (!title) {
        const h1Match = content.match(/<h1>(.*?)<\/h1>/i);
        if (h1Match) title = h1Match[1].trim();
      }

      if (!slug && title) {
        slug = slugify(title);
      } else if (slug) {
        slug = slug.replace(/^\/|\/$/g, '');
      }

      // 3. CLEANING & PREMIUM FORMATTING
      let cleanContent = content
        .replace(/✦/g, "")
        .replace(/\[\d+\]/g, "")
        .replace(/\[[web:\d\s,]+\]/gi, "")
        .trim();

      // Affiliate BIG Cards
      const AFFILIATE_DATA = {
        KLOOK: {
          name: "Verify Tickets on Klook",
          desc: "Compare combo packages and instant mobile entry options.",
          url: "https://www.klook.com/en-SG/city/6-singapore-things-to-do/?aid=105111&utm_medium=affiliate-alwayson&utm_source=non-network&utm_campaign=105111",
          class: "klook",
          icon: "⚡"
        },
        TRIP: {
          name: "Check Deals on Trip.com",
          desc: "Browse current hotel + attraction bundles and guest reviews.",
          url: "https://www.trip.com/?Allianceid=7367361&SID=278066643",
          class: "trip",
          icon: "🌍"
        }
      };

      cleanContent = cleanContent.replace(/\[Klook affiliate:.*?\]/gi, () => {
        const d = AFFILIATE_DATA.KLOOK;
        return `\n\n<div class="premium-cta-card ${d.class}">
          <div class="cta-icon">${d.icon}</div>
          <div class="cta-content">
            <h4>${d.name}</h4>
            <p>${d.desc}</p>
          </div>
          <a href="${d.url}" target="_blank" rel="nofollow" class="cta-link">GO TO KLOOK</a>
        </div>\n\n`;
      });
      cleanContent = cleanContent.replace(/\[Trip\.com affiliate:.*?\]/gi, () => {
        const d = AFFILIATE_DATA.TRIP;
        return `\n\n<div class="premium-cta-card ${d.class}">
          <div class="cta-icon">${d.icon}</div>
          <div class="cta-content">
            <h4>${d.name}</h4>
            <p>${d.desc}</p>
          </div>
          <a href="${d.url}" target="_blank" rel="nofollow" class="cta-link">GO TO TRIP.COM</a>
        </div>\n\n`;
      });

      // 3. CLEANING & SEMANTIC BLOCK CONVERSION
      let contentBlocks = cleanContent.split(/\n\s*\n/);

      cleanContent = contentBlocks.map(block => {
        let b = block.trim();
        if (!b) return "";

        // If it's already a premium card, return as is
        if (b.startsWith("<div class=\"premium-cta-card\"")) return b;
        // If it's already got block tags, return as is
        if (b.startsWith("<p>") || b.startsWith("<h") || b.startsWith("<div") || b.startsWith("<ul")) return b;

        // Detect "Quick Facts" block
        if (b.toLowerCase().startsWith("quick facts") || b.includes("Address:") || b.includes("Opening hours:")) {
          const lines = b.split("\n").filter(l => l.trim().length > 0);
          const blockTitle = lines[0];
          const listItems = lines.slice(1).map(l => {
            const [key, ...val] = l.split(":");
            if (val.length > 0) return `<li><span class="key">${key.trim()}</span><span class="val">${val.join(":").trim()}</span></li>`;
            return `<li>${l.trim()}</li>`;
          }).join("");
          return `<div class="data-grid-box"><h3>${blockTitle}</h3><ul>${listItems}</ul></div>`;
        }

        // Detect Pricing / Tickets
        if (b.toLowerCase().startsWith("tickets") || b.includes("SGD")) {
          return `<div class="pricing-box">${b.split("\n").map(l => `<p>${l.trim()}</p>`).join("")}</div>`;
        }

        // Headers
        if (b.startsWith("### ")) return `<h3>${b.substring(4).trim()}</h3>`;
        if (b.startsWith("## ")) return `<h2>${b.substring(3).trim()}</h2>`;
        if (b.startsWith("# ")) return `<h1>${b.substring(2).trim()}</h1>`;

        // Lists
        if (b.startsWith("- ") || b.startsWith("* ")) {
          const items = b.split("\n").map(line => `<li>${line.replace(/^[-*]\s*/, "").trim()}</li>`).join("");
          return `<ul>${items}</ul>`;
        }

        // Standard Paragraph
        return `<p>${b.replace(/\n/g, " ")}</p>`;
      }).join("\n\n");


      cleanContent = cleanContent.replace(/\*\*/g, "");

      if (!excerpt) {
        excerpt = cleanContent.replace(/<[^>]*>/g, "").substring(0, 160).trim() + "...";
      }

      // Guest Author Logic
      let guestAuthor = null;
      let authorBio = "";
      const authorLineMatch = rawArticle.match(/By (.*?) — (.*)/);
      if (authorLineMatch) {
        guestAuthor = authorLineMatch[1].trim();
        authorBio = authorLineMatch[2].trim();
      }

      if (guestAuthor && cleanContent.includes(guestAuthor)) {
        cleanContent = cleanContent.replace(/<p>(Sarah has visited.*?)<\/p>/, (match, p1) => {
          return `<div class="author-intro-box">
               <div class="intro-badge">Guest Insight</div>
               <p>${p1}</p>
               <div class="intro-footer">— ${guestAuthor}, ${authorBio}</div>
             </div>`;
        });
      }

      if (guestAuthor) {
        cleanContent = `<div class="guest-author-byline">Written by ${guestAuthor}</div>\n` + cleanContent;
      }

      // Image Fetching
      if ((!imageUrl || imageUrl.includes('unsplash')) && sourceUrl) {
        const fetched = await fetchMetaImage(sourceUrl);
        if (fetched) imageUrl = fetched;
      }

      const DESMOND_ID = "author_1";

      const post = await prisma.post.upsert({
        where: { slug: slug },
        update: {
          title: title,
          content: cleanContent,
          excerpt: excerpt,
          status: 'PUBLISHED',
          category: 'Expert Guide',
          authorId: DESMOND_ID,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200",
          updatedAt: new Date()
        },
        create: {
          title: title,
          slug: slug,
          content: cleanContent,
          excerpt: excerpt,
          status: 'PUBLISHED',
          category: 'Expert Guide',
          authorId: DESMOND_ID,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      console.log(`✅ IMPORTED: ${post.title} (Slug: ${post.slug})`);
    }

    console.log("🎉 SUCCESS: All premium guides processed!");

  } catch (error) {
    console.error("❌ ERROR:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importHtmlGuides();
