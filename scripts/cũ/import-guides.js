require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const prisma = new PrismaClient();

// Hàm hút ảnh từ trang gốc
async function fetchMetaImage(url) {
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
    const $ = cheerio.load(data);
    return $('meta[property="og:image"]').attr('content') || null;
  } catch (e) { return null; }
}

async function run() {
  console.log('🚀 IMPORTING GUIDES WITH SMART IMAGES...');
  const rawData = fs.readFileSync('scripts/new_guides.json', 'utf8');
  let data = JSON.parse(rawData);
  if (!Array.isArray(data)) data = [data];

  for (const item of data) {
    // Nếu bài viết chưa có ảnh xịn, tự đi hút ảnh từ sourceUrl (nếu có)
    let finalImage = item.imageUrl;
    if ((!finalImage || finalImage.includes('unsplash')) && item.sourceUrl) {
       const fetched = await fetchMetaImage(item.sourceUrl);
       if (fetched) finalImage = fetched;
    }

    await prisma.post.upsert({
      where: { slug: item.slug },
      update: { content: item.content, imageUrl: finalImage, excerpt: item.excerpt },
      create: {
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        imageUrl: finalImage,
        category: item.category || "Expert Guide",
        status: "PUBLISHED"
      }
    });
    console.log(`✅ Done: ${item.title}`);
  }
}
run();