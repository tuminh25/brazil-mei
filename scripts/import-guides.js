const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
require('dotenv').config();

function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
}

async function importHtmlGuides() {
  console.log("🚀 [SG Events Hub] Starting CLEAN-SWEEP Import Processor...");

  try {
    const filePath = 'scripts/new_guides.txt';
    if (!fs.existsSync(filePath)) throw new Error("Missing scripts/new_guides.txt");
    
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const rawArticles = rawContent.split(/===+.*?===+/);

    for (let rawArticle of rawArticles) {
      let text = rawArticle.trim();
      if (text.length < 50) continue;

      console.log("🔍 Cleaning and processing content...");

      let lines = text.split('\n').map(l => l.trim());
      
      let title = "";
      let contentLines = [];

      // --- [BƯỚC 1] PHÂN TÁCH TITLE VÀ LỌC BỎ METADATA ---
      for (let line of lines) {
        if (!line) continue;
        const upperLine = line.toUpperCase();
        
        // Bỏ qua các dòng metadata và các dòng chỉ chứa ký tự đặc biệt
        if (upperLine.startsWith("META DESCRIPTION:") || 
            upperLine.startsWith("URL SLUG:") || 
            upperLine.startsWith("BY ") ||
            upperLine.startsWith("SOURCE:") ||
            upperLine.startsWith("LAST UPDATED:") ||
            upperLine.startsWith("AFFILIATE DISCLOSURE:") ||
            line === "✦" || line === "•" || line === "*") {
          continue;
        }

        if (!title && (upperLine.startsWith("TITLE TAG:") || upperLine.startsWith("TITLE:"))) {
          title = line.replace(/TITLE TAG:|TITLE:/i, "").trim();
          continue;
        }
        if (!title) { title = line; continue; }

        contentLines.push(line);
      }

      if (!title) continue;

      // --- [BƯỚC 2] ĐỊNH DANH SLUG ---
      let slug = slugify(title);
      if (title.toLowerCase().includes('science centre')) {
        slug = 'science-centre-singapore-guide';
      }

      // --- [BƯỚC 3] LÀM SẠCH VĂN BẢN (XỬ LÝ TRIỆT ĐỂ KÝ TỰ RÁC) ---
      let processedLines = contentLines.map(line => {
        return line
          .replace(/\[(Klook|Trip\.com) affiliate:.*?\]/gi, "")
          .replace(/Verify Tickets on Klook/gi, "")
          .replace(/Check Deals on Trip\.com/gi, "")
          .replace(/Planning your visit\? Compare Science Centre ticket options on Klook/gi, "")
          .replace(/or check Trip\.com for current combo deals/gi, "")
          .replace(/✦/g, "") // Xóa dấu kim cương trong text
          .replace(/\*\*/g, "")
          .trim();
      }).filter(l => l.length > 2); // Chỉ giữ lại dòng có trên 2 ký tự (loại bỏ dòng rác)

      // --- [BƯỚC 4] CHUYỂN ĐỔI SANG HTML ---
      let htmlBlocks = [];
      let currentList = [];

      for (let line of processedLines) {
        // Nhận diện Header
        if (line.startsWith("### ") || line.includes("FAQ") || line.startsWith("3 Things") || line.includes("difference between")) {
          if (currentList.length > 0) {
            htmlBlocks.push(`<ul class="list-disc pl-6 space-y-4 mb-8 text-gray-300 font-sans text-lg">${currentList.join('')}</ul>`);
            currentList = [];
          }
          const hText = line.replace(/^###\s*/, "");
          htmlBlocks.push(`<h2 class="text-3xl font-black mt-16 mb-8 text-white uppercase border-l-4 border-blue-600 pl-6 tracking-tighter">${hText}</h2>`);
          continue;
        }

        // Nhận diện Danh sách
        if (line.startsWith("- ") || line.startsWith("* ")) {
          currentList.push(`<li class="leading-relaxed">${line.replace(/^[-*]\s*/, "").trim()}</li>`);
          continue;
        } else if (currentList.length > 0) {
          htmlBlocks.push(`<ul class="list-disc pl-6 space-y-4 mb-8 text-gray-300 font-sans text-lg">${currentList.join('')}</ul>`);
          currentList = [];
        }

        // Nhận diện Box thông tin (Quick Facts)
        if (line.toLowerCase().startsWith("quick facts") || line.includes("Address:") || line.includes("Opening hours:")) {
          htmlBlocks.push(`
            <div class="my-12 p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <h3 class="text-blue-400 font-black uppercase tracking-widest text-[10px] mb-6 underline decoration-blue-500/50 underline-offset-8">Intelligence Report</h3>
              <p class="text-sm leading-loose text-gray-400 font-mono italic">${line.replace(/\n/g, '<br/>')}</p>
            </div>
          `);
          continue;
        }

        // Đoạn văn bình thường (Không bao giờ tạo thẻ trống)
        htmlBlocks.push(`<p class="mb-8 text-xl leading-relaxed text-gray-400 text-justify font-sans">${line}</p>`);
      }
      
      if (currentList.length > 0) {
        htmlBlocks.push(`<ul class="list-disc pl-6 space-y-4 mb-8 text-gray-300 font-sans text-lg">${currentList.join('')}</ul>`);
      }

      let finalHtml = htmlBlocks.join('\n');

      // --- [BƯỚC 5] CHÈN Ô PREMIUM CHO SCIENCE CENTRE ---
      if (slug === 'science-centre-singapore-guide') {
        const affiliateUrl = `https://us.trip.com/travel-guide/attraction/singapore/science-centre-singapore-13086709/?locale=en-XX&curr=USD&_gl=1*5kz0m6*_gcl_aw*R0NMLjE3NjY0NTg4NjguQ2p3S0NBaUE5YVBLQmhCaEVpd0F5ejgySjY0MG1xT1Z4Nzd6andja0RuekllZXQ3aThXRmNFSFFrcGpGeXJ2aDVockFtaTF6NzRRaUN4b0NlcWdRQXZEX0J3RQ..*_gcl_au*MjEzOTI2NDkwOS4xNzY0MTM3NDk2`;
        
        finalHtml += `
        <div class="mt-20 p-12 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div class="relative z-10">
            <h3 class="text-3xl md:text-5xl font-black mb-6 text-white uppercase tracking-tighter">Ready to Explore?</h3>
            <p class="text-blue-100 mb-10 text-lg opacity-80 max-w-xl mx-auto">Get instant mobile tickets and skip the queue at Science Centre Singapore via Trip.com.</p>
            <a href="${affiliateUrl}" target="_blank" class="inline-block bg-white text-blue-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
               BOOK ON TRIP.COM
            </a>
          </div>
        </div>`;
      }

      // --- [BƯỚC 6] LƯU VÀO DB ---
      const post = await prisma.post.upsert({
        where: { slug: slug },
        update: {
          title: title,
          content: finalHtml,
          excerpt: title,
          status: 'PUBLISHED',
          imageUrl: slug.includes('science-centre') ? "https://www.science.edu.sg/images/default-source/navigation-bar-2023/scs-evening-(blue-lighting)-(1)344fff417e0a428e92b8823579137e0c.jpg" : "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200",
          updatedAt: new Date()
        },
        create: {
          title: title,
          slug: slug,
          content: finalHtml,
          excerpt: title,
          status: 'PUBLISHED',
          authorId: "author_1",
          imageUrl: slug.includes('science-centre') ? "https://www.science.edu.sg/images/default-source/navigation-bar-2023/scs-evening-(blue-lighting)-(1)344fff417e0a428e92b8823579137e0c.jpg" : "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1200",
        }
      });

      console.log(`✅ CLEANED & UPDATED: ${post.title}`);
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importHtmlGuides();