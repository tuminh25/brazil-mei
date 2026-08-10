const https = require('https');

const EXPECTED_IMAGES = {
  'bto-vs-resale-young-couples-2026': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
  'cdc-vouchers-2026-complete-guide': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
  'chas-card-eligibility-subsidies-green-orange-blue': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
  'adult-monthly-travel-card-worth-it': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200',
  'how-to-use-skillsfuture-credit-career-upgrades': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200',
  'neighbourhood-guide-essential-services-hdb-estate': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
};

const ARTICLE_TITLES = {
  'bto-vs-resale-young-couples-2026': 'BTO vs Resale: Which Is Better for Young Couples in 2026?',
  'cdc-vouchers-2026-complete-guide': 'Complete Guide to CDC Vouchers 2026: Claiming, Spending and Maximising Value',
  'chas-card-eligibility-subsidies-green-orange-blue': 'CHAS Card Eligibility and Subsidies: Green vs Orange vs Blue Explained',
  'adult-monthly-travel-card-worth-it': 'Is the Adult Monthly Travel Card Worth It for Your Commute?',
  'how-to-use-skillsfuture-credit-career-upgrades': 'How to Use Your SkillsFuture Credit for Real Career Upgrades',
  'neighbourhood-guide-essential-services-hdb-estate': 'Neighbourhood Guide: Essential Services Around Your HDB Estate',
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    }).on('error', reject);
  });
}

function extractImageUrls(html, slug) {
  const results = [];
  
  // Look for Next.js Image src attributes containing the slug or expected image
  const expectedImage = EXPECTED_IMAGES[slug];
  const expectedPhotoId = expectedImage.match(/photo-([^?]+)/)?.[1];
  
  // Find all Next.js Image src patterns
  const srcRegex = /src="\/_next\/image\?url=([^"]+)"/g;
  let match;
  while ((match = srcRegex.exec(html)) !== null) {
    const encodedUrl = match[1];
    try {
      const decoded = decodeURIComponent(encodedUrl);
      if (decoded.includes('unsplash.com/photo-')) {
        results.push(decoded);
      }
    } catch (e) {}
  }
  
  // Also find regular img tags with unsplash
  const imgRegex = /<img[^>]+src="([^"]*unsplash[^"]*)"[^>]*>/g;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src.includes('unsplash.com/photo-')) {
      // Clean up HTML entities
      const cleaned = src.replace(/&/g, '&');
      results.push(cleaned);
    }
  }
  
  // Also check for the specific expected photo ID in the HTML
  const hasExpectedPhoto = expectedPhotoId ? html.includes(expectedPhotoId) : false;
  
  return { urls: [...new Set(results)], hasExpectedPhoto, expectedPhotoId };
}

async function auditProduction() {
  console.log('=== PRODUCTION HOMEPAGE AUDIT ===\n');
  
  // 1. Fetch production homepage
  console.log('Fetching https://www.sgeventshub.com/ ...');
  const homeResponse = await fetchUrl('https://www.sgeventshub.com/');
  console.log(`Status: ${homeResponse.status}`);
  
  if (homeResponse.status !== 200) {
    console.error('Failed to fetch homepage');
    return;
  }
  
  const homeHtml = homeResponse.html;
  
  // 2. Check each article
  console.log('\n=== HOMEPAGE ARTICLE IMAGE CHECK ===\n');
  
  for (const [slug, expectedUrl] of Object.entries(EXPECTED_IMAGES)) {
    const title = ARTICLE_TITLES[slug];
    const expectedPhotoId = expectedUrl.match(/photo-([^?]+)/)?.[1];
    
    // Check if article exists in HTML (by title or slug)
    const articleExists = homeHtml.includes(title) || homeHtml.includes(slug);
    
    // Extract image URLs
    const { urls, hasExpectedPhoto } = extractImageUrls(homeHtml, slug);
    
    // Find the image URL that matches this article (by proximity to title/slug)
    let productionImageUrl = 'NOT FOUND';
    let match = 'MISMATCH';
    
    if (hasExpectedPhoto) {
      productionImageUrl = expectedUrl;
      match = 'MATCH';
    } else if (urls.length > 0) {
      // Try to find which URL belongs to this article
      // Look for the URL that appears near the article title in HTML
      const titleIndex = homeHtml.indexOf(title);
      if (titleIndex !== -1) {
        // Search for image URLs within 5000 chars after title
        const context = homeHtml.substring(titleIndex, titleIndex + 5000);
        for (const url of urls) {
          if (context.includes(url.split('?')[0].split('/').pop())) {
            productionImageUrl = url;
            match = url === expectedUrl ? 'MATCH' : 'MISMATCH';
            break;
          }
        }
      }
      if (productionImageUrl === 'NOT FOUND') {
        productionImageUrl = urls[0];
        match = productionImageUrl === expectedUrl ? 'MATCH' : 'MISMATCH';
      }
    }
    
    console.log(`--- ${title} ---`);
    console.log(`  Article exists: ${articleExists ? 'YES' : 'NO'}`);
    console.log(`  Expected: ${expectedUrl}`);
    console.log(`  Production: ${productionImageUrl}`);
    console.log(`  Result: ${match}`);
    console.log('');
  }
  
  // 3. Fetch individual article pages
  console.log('\n=== INDIVIDUAL ARTICLE PAGES ===\n');
  
  const testSlugs = [
    'bto-vs-resale-young-couples-2026',
    'cdc-vouchers-2026-complete-guide'
  ];
  
  for (const slug of testSlugs) {
    console.log(`Fetching https://www.sgeventshub.com/guides/${slug} ...`);
    const articleResponse = await fetchUrl(`https://www.sgeventshub.com/guides/${slug}`);
    console.log(`Status: ${articleResponse.status}`);
    
    if (articleResponse.status === 200) {
      const articleHtml = articleResponse.html;
      const expectedUrl = EXPECTED_IMAGES[slug];
      const expectedPhotoId = expectedUrl.match(/photo-([^?]+)/)?.[1];
      
      // Check for hero image in article page
      const hasExpectedPhoto = expectedPhotoId ? articleHtml.includes(expectedPhotoId) : false;
      
      // Extract all unsplash images
      const { urls } = extractImageUrls(articleHtml, slug);
      
      // Look for the hero image (usually first large unsplash image)
      let heroImage = 'NOT FOUND';
      for (const url of urls) {
        if (url.includes('w=1200') || url.includes('w=1600') || url.includes('w=2400')) {
          heroImage = url;
          break;
        }
      }
      if (heroImage === 'NOT FOUND' && urls.length > 0) {
        heroImage = urls[0];
      }
      
      console.log(`  Expected: ${expectedUrl}`);
      console.log(`  Hero image: ${heroImage}`);
      console.log(`  Has expected photo ID: ${hasExpectedPhoto ? 'YES' : 'NO'}`);
      console.log(`  All unsplash URLs found: ${urls.length}`);
      console.log('');
    } else {
      console.log(`  ERROR: Article page returned ${articleResponse.status}`);
      console.log('');
    }
  }
  
  // 4. Summary
  console.log('=== CONCLUSION ===');
}

auditProduction().catch(console.error);