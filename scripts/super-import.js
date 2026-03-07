const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
require('dotenv').config();

async function superImportHtmlEvents() {
  console.log("🚀 [SG Events Hub] Starting Universal Importer V3.1 (Refined Affiliate Logic)...");

  try {
    const filePath = 'scripts/new_events.txt';
    if (!fs.existsSync(filePath)) throw new Error("File new_events.txt not found!");

    let rawContent = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');

    // Support both === separators and single-file processing
    let rawEvents = rawContent.split(/===+.*?===+/);
    if (rawEvents.length <= 1 && rawContent.trim().length > 100) {
      rawEvents = [rawContent];
    }

    for (let rawEvent of rawEvents) {
      const trimmedEvent = rawEvent.trim();
      if (trimmedEvent.length < 50) continue;

      const lines = trimmedEvent.split('\n').map(l => l.trim());

      // Strategy 1: Square bracket tags (Legacy)
      const extractTag = (tag) => {
        const tagLower = tag.toLowerCase();
        const startRegex = new RegExp(`\\[\\s*${tagLower}\\s*\\]`, 'i');
        const startMatch = rawEvent.match(startRegex);
        if (!startMatch) return null;
        const contentStart = startMatch.index + startMatch[0].length;
        const endRegex = new RegExp(`\\[\\s*/\\s*${tagLower}\\s*\\]`, 'i');
        const endMatch = rawEvent.match(endRegex);
        if (!endMatch) return null;
        return rawEvent.substring(contentStart, endMatch.index).trim();
      };

      // Strategy 2: Line-based prefixes (Modern)
      const extractLine = (prefix) => {
        const found = lines.find(l => l.toLowerCase().startsWith(prefix.toLowerCase()));
        if (!found) return null;
        return found.split(':').slice(1).join(':').trim();
      };

      const name = extractLine("Title tag:") || extractLine("TITLE:") || extractTag("NAME") || extractTag("TITLE");
      const slugRaw = extractLine("URL slug:") || extractTag("SLUG");
      const slug = slugRaw ? slugRaw.replace(/^\//, '').trim() : null;

      let rawDescription = extractTag("DESCRIPTION") || extractTag("CONTENT");

      // Auto-extract content if no tags are found
      if (!rawDescription) {
        rawDescription = lines.filter(l => {
          const up = l.toUpperCase();
          return !up.startsWith("META") &&
            !up.startsWith("TITLE TAG:") &&
            !up.startsWith("URL SLUG:") &&
            !up.startsWith("META DESCRIPTION:") &&
            !up.startsWith("BY ") &&
            !up.startsWith("LAST UPDATED:") &&
            !up.includes("AFFILIATE DISCLOSURE");
        }).join('\n').trim();
      }

      const venue = extractLine("Venue:") || extractTag("VENUE");
      const price = extractLine("Price:") || extractTag("PRICE");
      const sourceUrl = extractTag("SOURCEURL");
      const imageUrl = extractTag("IMAGEURL");

      const missingTags = [];
      if (!slug) missingTags.push("SLUG");
      if (!name) missingTags.push("NAME/TITLE");
      if (!rawDescription) missingTags.push("DESCRIPTION/CONTENT");

      if (missingTags.length > 0) {
        console.log(`⚠️ Skipping block due to missing data: ${missingTags.join(', ')}`);
        // console.log("Sample content:", trimmedEvent.substring(0, 100));
        continue;
      }

      console.log(`🧹 Cleaning content for: ${name}...`);

      // Remove text metadata artifacts
      let cleanDescription = rawDescription
        .replace(/\[\d+\]/g, '') // Remove citations like [1]
        .replace(/\[(NARRATIVE|TABLE|LIST|FAQ)\]/gi, '') // Remove format markers
        .replace(/Images are illustrative.*?\./g, '')
        .replace(/Verify at.*?\./gi, '')
        .replace(/<em>Images are illustrative.*?<\/em>/gi, '')
        .replace(/<p>Images are illustrative.*?<\/p>/gi, '')
        .trim();

      // --- [NEW] ROBUST HTML PARSING LOGIC ---
      let htmlBlocks = [];
      let currentList = [];
      let inTable = false;
      let tableRows = [];

      const cleanLines = cleanDescription.split('\n');

      for (let i = 0; i < cleanLines.length; i++) {
        let line = cleanLines[i].trim();
        if (!line) {
          // Empty line: close any open list
          if (currentList.length > 0) {
            htmlBlocks.push(`<ul>`);
            htmlBlocks.push(...currentList);
            htmlBlocks.push(`</ul>`);
            currentList = [];
          }
          continue;
        }

        // --- Tables ---
        if (line.includes('\t')) {
          if (!inTable) {
            // End any open list
            if (currentList.length > 0) {
              htmlBlocks.push(`<ul>`);
              htmlBlocks.push(...currentList);
              htmlBlocks.push(`</ul>`);
              currentList = [];
            }
            inTable = true;
            htmlBlocks.push(`<table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem;">`);

            // Assume first row is header
            const cells = line.split('\t').map(c => `<th style="padding:8px;border:1px solid #333;background:#111;text-align:left;">${c.trim()}</th>`);
            htmlBlocks.push(`  <thead><tr>${cells.join('')}</tr></thead>`);
            htmlBlocks.push(`  <tbody>`);
            continue;
          } else {
            const cells = line.split('\t').map(c => `<td style="padding:8px;border:1px solid #333;">${c.trim()}</td>`);
            htmlBlocks.push(`    <tr>${cells.join('')}</tr>`);
            continue;
          }
        } else if (inTable) {
          // Not a tabbed line, close the table
          htmlBlocks.push(`  </tbody>`);
          htmlBlocks.push(`</table>`);
          inTable = false;
        }

        // --- Headers ---
        let hText = line;
        const headerMatch = line.match(/^(.*?)\s*\[(NARRATIVE|TABLE|LIST|FAQ|PROCESS)\]$/i);
        if (headerMatch) hText = headerMatch[1].trim();

        const isKnownHeader = line.match(/^(3 Things|Quick Facts|Getting There|Frequently Asked Questions|Seat Map|Ticket Prices|What Makes This|Show Dates|Ticket Categories|Sands Theatre Seat Guide|Cast Update|How to Stack|Getting There|The Full Evening|Is It Worth Watching|Important:)/i);
        const isDynamicHeader = !line.includes('.') && !line.includes('?') && line.length < 90 && line.length > 5 && !line.startsWith('<') && Object.is(line[0], line[0].toUpperCase()) && !line.includes('— Singapore-based');

        if (headerMatch || isKnownHeader || (htmlBlocks.length > 0 && htmlBlocks[htmlBlocks.length - 1].includes('Frequently Asked Questions') && (line.endsWith('?') || line.startsWith('Q:')))) {

          if (currentList.length > 0) {
            htmlBlocks.push(`<ul>`);
            htmlBlocks.push(...currentList);
            htmlBlocks.push(`</ul>`);
            currentList = [];
          }

          // If it's a question under FAQ, make it h3
          let isH3 = false;
          if (line.endsWith('?') || line.startsWith('Q:')) {
            const recentBlocks = htmlBlocks.slice(-10).join('');
            if (recentBlocks.includes('Frequently Asked Questions')) {
              isH3 = true;
            }
          }

          if (isH3) {
            htmlBlocks.push(`<h3>${hText}</h3>`);
          } else {
            htmlBlocks.push(`<h2>${hText}</h2>`);
          }
          continue;
        }

        // --- Lists ---
        if (line.match(/^[-*]\s+/)) {
          currentList.push(`  <li>${line.replace(/^[-*]\s+/, '').trim()}</li>`);
          continue;
        } else {
          if (currentList.length > 0) {
            htmlBlocks.push(`<ul>`);
            htmlBlocks.push(...currentList);
            htmlBlocks.push(`</ul>`);
            currentList = [];
          }
        }

        // --- Paragraphs ---
        if (!line.startsWith('<') || line.startsWith('<a')) {
          htmlBlocks.push(`<p>${line}</p>`);
        } else {
          // It might already be some HTML tag
          htmlBlocks.push(line);
        }
      }

      // Cleanup at EOF
      if (currentList.length > 0) {
        htmlBlocks.push(`<ul>`);
        htmlBlocks.push(...currentList);
        htmlBlocks.push(`</ul>`);
      }
      if (inTable) {
        htmlBlocks.push(`  </tbody>`);
        htmlBlocks.push(`</table>`);
      }

      cleanDescription = htmlBlocks.join('\n');

      // --- REFINED AFFILIATE INJECTION LOGIC ---
      const KLOOK_SEARCH = "https://www.klook.com/en-SG/search/result/?query=singapore&aid=105111";
      const TRIP_SEARCH = "https://sg.trip.com/?allianceid=7367361&sid=278066643";

      // Enhanced Klook injection: Preserve deep links
      cleanDescription = cleanDescription.replace(/<a\s+([^>]*href=["']([^"']*)["'][^>]*)>([^<]*Book Now[^<]*)<\/a>/gi, (match, attrs, url, text) => {
        if (url.includes("klook.com") && (url.includes("/activity/") || url.includes("/event/"))) {
          try {
            const urlObj = new URL(url);
            urlObj.searchParams.set("aid", "105111");
            return `<a ${attrs.replace(url, urlObj.toString())}>${text}</a>`;
          } catch (e) { return match; }
        }
        return `<a href="${KLOOK_SEARCH}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      });

      // Enhanced Trip.com injection: Casing fix and deep link preservation
      cleanDescription = cleanDescription.replace(/<a\s+([^>]*href=["']([^"']*)["'][^>]*)>([^<]*Search Hotels[^<]*)<\/a>/gi, (match, attrs, url, text) => {
        if (url.includes("trip.com")) {
          try {
            const urlObj = new URL(url);
            urlObj.searchParams.set("allianceid", "7367361");
            urlObj.searchParams.set("sid", "278066643");
            return `<a ${attrs.replace(url, urlObj.toString())}>${text}</a>`;
          } catch (e) { return match; }
        }
        return `<a href="${TRIP_SEARCH}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      });

      // Default author if none detected
      let authorId = "author_jamie";

      const updateData = {
        name,
        description: cleanDescription,
        venue,
        price,
        status: 'PUBLISHED',
        category: 'Event',
        authorId: authorId,
        updatedAt: new Date(),
      };
      if (sourceUrl) updateData.sourceUrl = sourceUrl;
      if (imageUrl) updateData.imageUrl = imageUrl;

      // --- [NEW] ROBUST DATE PARSING ---
      let startDate = new Date();
      let endDate = null;

      const dateLine = extractLine("Run dates:") || extractLine("Show Dates:");
      if (dateLine) {
        // Simple parser for "24 Mar – 10 May 2026" or similar
        const parts = dateLine.split(/[–-]/);
        if (parts.length >= 2) {
          const startStr = parts[0].trim();
          const endStr = parts[1].trim();

          // Try to extract year if only present in second part
          const yearMatch = endStr.match(/\d{4}/);
          const year = yearMatch ? yearMatch[0] : new Date().getFullYear();

          startDate = new Date(`${startStr} ${year}`);
          endDate = new Date(`${endStr}${endStr.includes(year) ? '' : ' ' + year}`);

          if (isNaN(startDate.getTime())) startDate = new Date();
          if (isNaN(endDate.getTime())) endDate = null;
        }
      }

      await prisma.event.upsert({
        where: { slug: slug },
        update: {
          ...updateData,
          startDate,
          endDate
        },
        create: {
          name,
          slug,
          description: cleanDescription,
          venue,
          price,
          sourceUrl,
          imageUrl,
          status: 'PUBLISHED',
          category: 'Event',
          authorId: authorId,
          startDate,
          endDate,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      console.log(`✅ Processed: ${name}`);
    }
  } catch (error) {
    console.error("❌ Import Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

superImportHtmlEvents();
