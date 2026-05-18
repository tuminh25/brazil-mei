// scripts/restore-homepage-v2.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Homepage Restoration Mission V2...");

  // 1. Fix Data Mismatch
  console.log("Step 1: Ensuring all non-newsjack PUBLISHED articles are 'Evergreen'...");
  const updateResult = await prisma.post.updateMany({
    where: {
      status: 'PUBLISHED',
      isNewsjack: false
    },
    data: {
      category: 'Evergreen'
    }
  });
  console.log(`✓ Updated ${updateResult.count} posts to 'Evergreen'.`);

  // 2. Fix "Indoor Playgrounds" Title
  console.log("Step 2: Cleaning 'Indoor Playgrounds' title...");
  const allPosts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED'
    }
  });

  for (const post of allPosts) {
    if (post.title.includes('</title>') || post.title.includes('<title>')) {
      const cleanTitle = post.title.replace(/<\/title>/g, '').replace(/<title>/g, '').trim();
      await prisma.post.update({
        where: { id: post.id },
        data: { title: cleanTitle }
      });
      console.log(`✓ Cleaned title for ID ${post.id}: "${post.title}" -> "${cleanTitle}"`);
    }
  }

  // Double check the specific one if it has other weird tags
  const indoorPost = allPosts.find(p => p.title.toLowerCase().includes('indoor playground'));
  if (indoorPost) {
     console.log(`Current title for Indoor Playgrounds: "${indoorPost.title}"`);
     // Check for any HTML tags
     if (/<[^>]*>/.test(indoorPost.title)) {
        const cleanTitle = indoorPost.title.replace(/<[^>]*>/g, '').trim();
        await prisma.post.update({
          where: { id: indoorPost.id },
          data: { title: cleanTitle }
        });
        console.log(`✓ Forced clean title for ID ${indoorPost.id}: "${cleanTitle}"`);
     }
  }

  // 3. Trigger Revalidation
  console.log("Step 3: Triggering revalidation for '/' and '/guides'...");
  const urlsToHit = [
    'https://sgeventshub.com/api/revalidate?path=/&secret=BOSS2026',
    'https://sgeventshub.com/api/revalidate?path=/guides&secret=BOSS2026'
  ];

  for (const url of urlsToHit) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
        console.log(`✓ Revalidated: ${url}`);
      } else {
        console.log(`x Revalidation failed for ${url}: ${res.status}`);
      }
    } catch (e) {
      console.log(`- Error revalidating ${url}: ${e.message}`);
    }
  }

  console.log("\n🏁 Mission Accomplished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
