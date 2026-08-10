const fs = require('fs');

const html = fs.readFileSync('.next/server/app/index.html', 'utf8');

// Find all occurrences of the 6 specific image URLs in the HTML body
const targetImages = [
  'photo-1560518883-ce09059eeffa',  // BTO vs Resale - HOUSING
  'photo-1554224155-6726b3ff858f',  // CDC Vouchers - MONEY
  'photo-1576091160399-112ba8d25d1d', // CHAS - HEALTHCARE
  'photo-1544620347-c4fd4a3d5957',  // Travel Card - TRANSPORT
  'photo-1521791136064-7986c2920216', // SkillsFuture - WORK
  'photo-1529156069898-49953e39b3ac'  // Neighbourhood - FOOD
];

console.log('=== SEARCHING FOR 6 ARTICLE IMAGES IN RENDERED HTML ===\n');

targetImages.forEach((img, i) => {
  const regex = new RegExp(img, 'g');
  const matches = html.match(regex);
  if (matches) {
    console.log(`${i+1}. ${img}: FOUND ${matches.length} time(s)`);
  } else {
    console.log(`${i+1}. ${img}: NOT FOUND`);
  }
});

// Also check for the actual Image component src attributes in the article cards
// Look for the pattern in the body where article cards are rendered
const bodyStart = html.indexOf('<body');
const bodyEnd = html.indexOf('</body>');
if (bodyStart !== -1 && bodyEnd !== -1) {
  const body = html.substring(bodyStart, bodyEnd);
  
  console.log('\n=== CHECKING ARTICLE CARD IMAGE SOURCES IN BODY ===\n');
  
  // Find all Next.js Image src attributes
  const srcMatches = body.match(/src="\/_next\/image\?url=https%3A%2F%2Fimages\.unsplash\.com%2Fphoto-[^"]+"/g);
  if (srcMatches) {
    console.log(`\nFound ${srcMatches.length} Next.js Image src attributes in article cards:`);
    srcMatches.forEach((src, i) => {
      // Extract the actual image URL
      const urlMatch = src.match(/url=([^&]+)/);
      if (urlMatch) {
        const decoded = decodeURIComponent(urlMatch[1]);
        console.log(`  ${i+1}. ${decoded}`);
      }
    });
  } else {
    console.log('No Next.js Image src attributes found in body');
  }
  
  // Also check for regular img tags
  const imgMatches = body.match(/<img[^>]+src="([^"]*unsplash[^"]*)"[^>]*>/g);
  if (imgMatches) {
    console.log(`\nFound ${imgMatches.length} regular <img> tags with unsplash:`);
    imgMatches.forEach((img, i) => {
      const srcMatch = img.match(/src="([^"]+)"/);
      if (srcMatch) {
        console.log(`  ${i+1}. ${srcMatch[1]}`);
      }
    });
  }
}