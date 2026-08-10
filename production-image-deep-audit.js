const https = require('https');
const crypto = require('crypto');

const EXPECTED_IMAGES = {
  'bto-vs-resale-young-couples-2026': {
    title: 'BTO vs Resale: Which Is Better for Young Couples in 2026?',
    expectedUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
    photoId: 'photo-1560518883-ce09059eeffa'
  },
  'cdc-vouchers-2026-complete-guide': {
    title: 'Complete Guide to CDC Vouchers 2026: Claiming, Spending and Maximising Value',
    expectedUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
    photoId: 'photo-1554224155-6726b3ff858f'
  },
  'chas-card-eligibility-subsidies-green-orange-blue': {
    title: 'CHAS Card Eligibility and Subsidies: Green vs Orange vs Blue Explained',
    expectedUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
    photoId: 'photo-1576091160399-112ba8d25d1d'
  },
  'adult-monthly-travel-card-worth-it': {
    title: 'Is the Adult Monthly Travel Card Worth It for Your Commute?',
    expectedUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200',
    photoId: 'photo-1544620347-c4fd4a3d5957'
  },
  'how-to-use-skillsfuture-credit-career-upgrades': {
    title: 'How to Use Your SkillsFuture Credit for Real Career Upgrades',
    expectedUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200',
    photoId: 'photo-1521791136064-7986c2920216'
  },
  'neighbourhood-guide-essential-services-hdb-estate': {
    title: 'Neighbourhood Guide: Essential Services Around Your HDB Estate',
    expectedUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
    photoId: 'photo-1529156069898-49953e39b3ac'
  },
};

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    };
    https.get(url, { headers: { ...defaultHeaders, ...headers } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        status: res.statusCode, 
        html: data, 
        headers: res.headers 
      }));
    }).on('error', reject);
  });
}

function fetchBinary(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    };
    https.get(url, { headers: { ...defaultHeaders, ...headers } }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const hash = crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16);
        resolve({ 
          status: res.statusCode, 
          buffer, 
          size: buffer.length,
          hash,
          headers: res.headers,
          contentType: res.headers['content-type']
        });
      });
    }).on('error', reject);
  });
}

function extractNextImageUrls(html) {
  const urls = [];
  const srcRegex = /src="(\/_next\/image\?url=[^"]+)"/g;
  let match;
  while ((match = srcRegex.exec(html)) !== null) {
    const encodedUrl = match[1];
    try {
      const decoded = decodeURIComponent(encodedUrl.replace(/&/g, '&'));
      if (decoded.includes('unsplash.com/photo-')) {
        urls.push({ encoded: encodedUrl, decoded });
      }
    } catch (e) {}
  }
  return [...new Map(urls.map(u => [u.decoded, u])).values()];
}

function extractCssBackgroundImages(html) {
  const urls = [];
  // style="background-image: url(...)"
  const styleRegex = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    if (match[1].includes('unsplash.com/photo-')) {
      urls.push(match[1]);
    }
  }
  // <style> blocks
  const styleBlockRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  while ((match = styleBlockRegex.exec(html)) !== null) {
    const styleContent = match[1];
    const urlRegex = /url\(["']?([^"')]+unsplash[^"')]+)["']?\)/gi;
    let urlMatch;
    while ((urlMatch = urlRegex.exec(styleContent)) !== null) {
      urls.push(urlMatch[1]);
    }
  }
  return [...new Set(urls)];
}

function findArticleContext(html, title, photoId) {
  const titleIndex = html.indexOf(title);
  if (titleIndex === -1) return null;
  
  // Look 10000 chars after title for image URLs
  const context = html.substring(titleIndex, titleIndex + 10000);
  
  // Find Next.js image URLs in context
  const srcRegex = /src="(\/_next\/image\?url=[^"]+)"/g;
  const urls = [];
  let match;
  while ((match = srcRegex.exec(context)) !== null) {
    try {
      const decoded = decodeURIComponent(match[1].replace(/&/g, '&'));
      if (decoded.includes('unsplash.com/photo-')) {
        urls.push(decoded);
      }
    } catch (e) {}
  }
  
  // Check if expected photoId is in context
  const hasExpectedPhoto = photoId ? context.includes(photoId) : false;
  
  return { urls: [...new Set(urls)], hasExpectedPhoto };
}

async function auditImageUrl(imageUrl, label) {
  console.log(`\n  📥 Fetching optimized image: ${imageUrl}`);
  try {
    const result = await fetchBinary(imageUrl);
    console.log(`     Status: ${result.status}`);
    console.log(`     Content-Type: ${result.contentType}`);
    console.log(`     Size: ${result.size} bytes`);
    console.log(`     SHA256 (first 16): ${result.hash}`);
    console.log(`     Cache-Control: ${result.headers['cache-control'] || 'none'}`);
    console.log(`     Age: ${result.headers['age'] || 'none'}`);
    console.log(`     X-Vercel-Cache: ${result.headers['x-vercel-cache'] || 'none'}`);
    console.log(`     CF-Cache-Status: ${result.headers['cf-cache-status'] || 'none'}`);
    return result;
  } catch (e) {
    console.log(`     ERROR: ${e.message}`);
    return null;
  }
}

async function auditHomepage() {
  console.log('=== FETCHING PRODUCTION HOMEPAGE ===');
  const homeResponse = await fetchUrl('https://www.sgeventshub.com/');
  console.log(`Status: ${homeResponse.status}`);
  console.log(`HTML Size: ${homeResponse.html.length} chars`);
  
  // Extract all Next.js optimized image URLs
  const nextImageUrls = extractNextImageUrls(homeResponse.html);
  console.log(`\nFound ${nextImageUrls.length} Next.js optimized image URLs in homepage`);
  
  // Extract CSS background images
  const cssBgImages = extractCssBackgroundImages(homeResponse.html);
  console.log(`Found ${cssBgImages.length} CSS background images with unsplash`);
  if (cssBgImages.length > 0) {
    cssBgImages.forEach((url, i) => console.log(`  ${i+1}. ${url}`));
  }
  
  // Check each article
  console.log('\n=== ARTICLE-BY-ARTICLE ANALYSIS ===');
  
  for (const [slug, info] of Object.entries(EXPECTED_IMAGES)) {
    console.log(`\n--- ${info.title} ---`);
    console.log(`Expected source: ${info.expectedUrl}`);
    
    const context = findArticleContext(homeResponse.html, info.title, info.photoId);
    
    if (!context) {
      console.log('  ❌ Article title NOT FOUND in homepage HTML');
      continue;
    }
    
    console.log(`  Article found in HTML: YES`);
    console.log(`  Expected photoId in context: ${context.hasExpectedPhoto ? 'YES' : 'NO'}`);
    console.log(`  Next.js image URLs near article: ${context.urls.length}`);
    
    context.urls.forEach((url, i) => {
      console.log(`    ${i+1}. ${url}`);
    });
    
    // Test the first image URL found near this article
    if (context.urls.length > 0) {
      const testUrl = `https://www.sgeventshub.com${context.urls[0]}`;
      await auditImageUrl(testUrl, slug);
    }
  }
  
  return homeResponse.html;
}

async function auditArticlePage(slug) {
  const info = EXPECTED_IMAGES[slug];
  if (!info) return;
  
  console.log(`\n=== FETCHING ARTICLE PAGE: ${info.title} ===`);
  const response = await fetchUrl(`https://www.sgeventshub.com/guides/${slug}`);
  console.log(`Status: ${response.status}`);
  
  if (response.status !== 200) {
    console.log('  ❌ Failed to fetch article page');
    return;
  }
  
  // Extract Next.js image URLs
  const nextImageUrls = extractNextImageUrls(response.html);
  console.log(`Next.js optimized image URLs: ${nextImageUrls.length}`);
  
  // Extract CSS background images
  const cssBgImages = extractCssBackgroundImages(response.html);
  console.log(`CSS background images: ${cssBgImages.length}`);
  if (cssBgImages.length > 0) {
    cssBgImages.forEach((url, i) => console.log(`  ${i+1}. ${url}`));
  }
  
  // Find hero image (usually first large image)
  const heroCandidates = nextImageUrls.filter(u => 
    u.decoded.includes('w=1200') || u.decoded.includes('w=1600') || u.decoded.includes('w=2400')
  );
  
  if (heroCandidates.length > 0) {
    const heroUrl = `https://www.sgeventshub.com${heroCandidates[0].encoded}`;
    console.log(`\n  Hero candidate: ${heroCandidates[0].decoded}`);
    await auditImageUrl(heroUrl, slug + '-hero');
  }
  
  // Also check for the expected photoId in HTML
  const hasExpectedPhoto = response.html.includes(info.photoId);
  console.log(`  Expected photoId in HTML: ${hasExpectedPhoto ? 'YES' : 'NO'}`);
  
  return response.html;
}

async function fetchExpectedSourceImage(url, label) {
  console.log(`\n  📥 Fetching EXPECTED source image: ${url}`);
  try {
    const result = await fetchBinary(url);
    console.log(`     Status: ${result.status}`);
    console.log(`     Content-Type: ${result.contentType}`);
    console.log(`     Size: ${result.size} bytes`);
    console.log(`     SHA256 (first 16): ${result.hash}`);
    return result;
  } catch (e) {
    console.log(`     ERROR: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  PRODUCTION IMAGE DEEP AUDIT - BATCH 002');
  console.log('══════════════════════════════════════════════════════════════\n');
  
  // 1. Audit homepage
  await auditHomepage();
  
  // 2. Audit individual article pages (2 samples)
  await auditArticlePage('bto-vs-resale-young-couples-2026');
  await auditArticlePage('cdc-vouchers-2026-complete-guide');
  
  // 3. Fetch expected source images for comparison
  console.log('\n\n=== FETCHING EXPECTED SOURCE IMAGES (for comparison) ===');
  for (const [slug, info] of Object.entries(EXPECTED_IMAGES)) {
    await fetchExpectedSourceImage(info.expectedUrl, slug);
  }
  
  console.log('\n\n══════════════════════════════════════════════════════════════');
  console.log('  AUDIT COMPLETE');
  console.log('══════════════════════════════════════════════════════════════');
}

main().catch(console.error);