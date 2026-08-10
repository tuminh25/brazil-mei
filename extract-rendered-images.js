const fs = require('fs');

const html = fs.readFileSync('.next/server/app/index.html', 'utf8');

// Find the __NEXT_DATA__ script which contains the serialized props
const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
if (nextDataMatch) {
  try {
    const data = JSON.parse(nextDataMatch[1]);
    const pageProps = data.props?.pageProps;
    
    if (pageProps?.todaysSingapore) {
      console.log('=== RENDERED IMAGE URLs FROM HOMEPAGE ===');
      pageProps.todaysSingapore.forEach((post, i) => {
        console.log(`${i+1}. ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   imageUrl: ${post.imageUrl}`);
        console.log('');
      });
    } else {
      console.log('todaysSingapore not found in pageProps');
      console.log('Available keys:', Object.keys(pageProps || {}));
    }
  } catch (e) {
    console.error('Error parsing __NEXT_DATA__:', e.message);
  }
} else {
  console.log('__NEXT_DATA__ script not found');
}

// Also check for the actual Image components in the HTML
// Look for the preload links which show what images are being loaded
const preloadMatches = html.match(/<link rel="preload" as="image" imageSrcSet="([^"]*)"/g);
if (preloadMatches) {
  console.log('\n=== PRELOAD IMAGE URLs ===');
  preloadMatches.forEach((match, i) => {
    const urlMatch = match.match(/url=([^&]+)/);
    if (urlMatch) {
      const decoded = decodeURIComponent(urlMatch[1]);
      console.log(`${i+1}. ${decoded}`);
    }
  });
}