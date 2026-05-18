// scripts/restore-homepage.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Homepage Restoration Mission...");

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
  const indoorPost = await prisma.post.findFirst({
    where: {
      title: { contains: 'Indoor Playgrounds' }
    }
  });

  if (indoorPost) {
    const cleanTitle = indoorPost.title.replace(/<\/title>/g, '').trim();
    if (cleanTitle !== indoorPost.title) {
      await prisma.post.update({
        where: { id: indoorPost.id },
        data: { title: cleanTitle }
      });
      console.log(`✓ Cleaned title for: "${indoorPost.title}" -> "${cleanTitle}"`);
    } else {
      console.log(`- Title for "${indoorPost.title}" was already clean.`);
    }
  } else {
    console.log("x 'Indoor Playgrounds' post not found.");
  }

  // 3. Trigger Revalidation
  console.log("Step 3: Triggering revalidation for '/' and '/guides'...");
  const urlsToHit = [
    'http://localhost:3000/api/revalidate?path=/&secret=BOSS2026',
    'http://localhost:3000/api/revalidate?path=/guides&secret=BOSS2026',
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
      console.log(`- Skipping ${url} (unreachable)`);
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
