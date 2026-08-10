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
          contentType: res.headers['content-type'],
          bodyText: buffer.toString('utf8', 0, Math.min(500, buffer.length))
        });
      });
    }).on('error', reject);
  });
}

function extractAllImagePatterns(html) {
  const patterns = {
    nextImageSrc: [],
    nextImageSrcset: [],
    imgSrc: [],
    pictureSourceSrcset: [],
    dataSrc: [],
  };
  
  // Next.js Image src
  let match;
  const srcRegex = /src="(\/_next\/image\?url=[^"]+)"/g;
  while ((match = srcRegex.exec(html)) !== null) {
    try {
      const decoded = decodeURIComponent(match[1].replace(/&/g, '&'));
      if (decoded.includes('unsplash.com/photo-')) {
        patterns.nextImageSrc.push({ encoded: match[1], decoded });
      }
    } catch (e) {}
  }
  
  // Next.js Image srcset
  const srcsetRegex = /srcset="([^"]*\/_next\/image\?url=[^"]*)"/g;
  while ((match = srcsetRegex.exec(html)) !== null) {
    const srcset = match[1];
    const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
    urls.forEach(u => {
      try {
        const decoded = decodeURIComponent(u.replace(/&/g, '&'));
        if (decoded.includes('unsplash.com/photo-')) {
          patterns.nextImageSrcset.push({ encoded: u, decoded });
        }
      } catch (e) {}
    });
  }
  
  // Regular img src
  const imgRegex = /<img[^>]+src="([^"]*unsplash[^"]*)"[^>]*>/g;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1].replace(/&/g, '&');
    if (src.includes('unsplash.com/photo-')) {
      patterns.imgSrc.push(src);
    }
  }
  
  // picture source srcset
  const pictureRegex = /<source[^>]+srcset="([^"]*unsplash[^"]*)"[^>]*>/g;
  while ((match = pictureRegex.exec(html)) !== null) {
    const srcset = match[1].replace(/&/g, '&');
    patterns.pictureSourceSrcset.push(srcset);
  }
  
  // data-src (lazy loading)
  const dataSrcRegex = /data-src="([^"]*unsplash[^"]*)"/g;
  while ((match = dataSrcRegex.exec(html)) !== null) {
    const src = match[1].replace(/&/g, '&');
    if (src.includes('unsplash.com/photo-')) {
      patterns.dataSrc.push(src);
    }
  }
  
  return patterns;
}

async function testImageUrl(url, label) {
  console.log(`\n  📥 Testing: ${url}`);
  try {
    const result = await fetchBinary(url);
    console.log(`     Status: ${result.status}`);
    console.log(`     Content-Type: ${result.contentType}`);
    console.log(`     Size: ${result.size} bytes`);
    console.log(`     SHA256: ${result.hash}`);
    console.log(`     Cache-Control: ${result.headers['cache-control'] || 'none'}`);
    console.log(`     X-Vercel-Cache: ${result.headers['x-vercel-cache'] || 'none'}`);
    console.log(`     CF-Cache-Status: ${result.headers['cf-cache-status'] || 'none'}`);
    if (result.status !== 200) {
      console.log(`     Response body: ${result.bodyText}`);
    }
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
  
  const patterns = extractAllImagePatterns(homeResponse.html);
  console.log(`\nNext.js Image src: ${patterns.nextImageSrc.length}`);
  console.log(`Next.js Image srcset: ${patterns.nextImageSrcset.length}`);
  console.log(`Regular img src: ${patterns.imgSrc.length}`);
  console.log(`Picture source srcset: ${patterns.pictureSourceSrcset.length}`);
  console.log(`data-src: ${patterns.dataSrc.length}`);
  
  // Test a few Next.js image URLs with different width parameters
  console.log('\n=== TESTING NEXT.JS IMAGE OPTIMIZATION ENDPOINT ===');
  
  const testCases = [
    // From homepage - these had 400
    'https://www.sgeventshub.com/_next/image?url=https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&w=3840&q=75',
    'https://www.sgeventshub.com/_next/image?url=https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&w=3840&q=75',
    // Try with different width params
    'https://www.sgeventshub.com/_next/image?url=https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&w=1200&q=75',
    'https://www.sgeventshub.com/_next/image?url=https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&w=800&q=75',
    'https://www.sgeventshub.com/_next/image?url=https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=75',
    // Try without the source w=1200 param
    'https://www.sgeventshub.com/_next/image?url=https://images.unsplash.com/photo-1560518883-ce09059eeffa&q=75&w=1200',
  ];
  
  for (const url of testCases) {
    await testImageUrl(url, 'test');
  }
  
  return homeResponse.html;
}

async function auditArticlePage(slug) {
  const info = EXPECTED_IMAGES[slug];
  if (!info) return;
  
  console.log(`\n=== FETCHING ARTICLE PAGE: ${info.title} ===`);
  const response = await fetchUrl(`https://www.sgeventshub.com/guides/${slug}`);
  console.log(`Status: ${response.status}`);
  
  if (response.status !== 200) return;
  
  const patterns = extractAllImagePatterns(response.html);
  console.log(`Next.js Image src: ${patterns.nextImageSrc.length}`);
  console.log(`Next.js Image srcset: ${patterns.nextImageSrcset.length}`);
  console.log(`Regular img src: ${patterns.imgSrc.length}`);
  console.log(`Picture source srcset: ${patterns.pictureSourceSrcset.length}`);
  console.log(`data-src: ${patterns.dataSrc.length}`);
  
  // Print all found patterns
  if (patterns.nextImageSrc.length > 0) {
    console.log('\nNext.js Image src:');
    patterns.nextImageSrc.forEach((u, i) => console.log(`  ${i+1}. ${u.decoded}`));
  }
  if (patterns.nextImageSrcset.length > 0) {
    console.log('\nNext.js Image srcset:');
    patterns.nextImageSrcset.forEach((u, i) => console.log(`  ${i+1}. ${u.decoded}`));
  }
  if (patterns.imgSrc.length > 0) {
    console.log('\nRegular img src:');
    patterns.imgSrc.forEach((u, i) => console.log(`  ${i+1}. ${u}`));
  }
  if (patterns.pictureSourceSrcset.length > 0) {
    console.log('\nPicture source srcset:');
    patterns.pictureSourceSrcset.forEach((u, i) => console.log(`  ${i+1}. ${u}`));
  }
  if (patterns.dataSrc.length > 0) {
    console.log('\ndata-src:');
    patterns.dataSrc.forEach((u, i) => console.log(`  ${i+1}. ${u}`));
  }
  
  // Test first Next.js image URL if found
  if (patterns.nextImageSrc.length > 0) {
    const testUrl = `https://www.sgeventshub.com${patterns.nextImageSrc[0].encoded}`;
    await testImageUrl(testUrl, 'article-hero');
  } else if (patterns.nextImageSrcset.length > 0) {
    const testUrl = `https://www.sgeventshub.com${patterns.nextImageSrcset[0].encoded}`;
    await testImageUrl(testUrl, 'article-hero');
  } else if (patterns.imgSrc.length > 0) {
    await testImageUrl(patterns.imgSrc[0], 'article-hero');
  }
  
  return response.html;
}

async function main() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  PRODUCTION IMAGE DEEP AUDIT v2 - BATCH 002');
  console.log('══════════════════════════════════════════════════════════════\n');
  
  await auditHomepage();
  await auditArticlePage('bto-vs-resale-young-couples-2026');
  await auditArticlePage('cdc-vouchers-2026-complete-guide');
  
  console.log('\n\n══════════════════════════════════════════════════════════════');
  console.log('  AUDIT COMPLETE');
  console.log('══════════════════════════════════════════════════════════════');
}

main().catch(console.error);