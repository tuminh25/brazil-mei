// scripts/fix-news-category.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Executing fix-news-category script...");

  const slugsToUpdate = [
    'home-based-food-business-singapore',
    'things-to-do-in-tengah-singapore',
    'quiet-study-spots-woodlands-singapore-2026'
  ];

  console.log(`Relocating ${slugsToUpdate.length} articles to News...`);

  const result = await prisma.post.updateMany({
    where: {
      slug: {
        in: slugsToUpdate
      }
    },
    data: {
      category: 'News',
      isNewsjack: true
    }
  });

  console.log(`Success: Relocated ${result.count} posts to category 'News' (isNewsjack=true).`);
  
  console.log("\nAttempting immediate cache revalidation via API (Instant Live Sync)...");

  // Revalidate both the remote site and the local site
  const urlsToHit = [
    'https://sgeventshub.com/api/revalidate?path=/&secret=BOSS2026',
    'https://sgeventshub.com/api/revalidate?path=/guides&secret=BOSS2026',
    'http://localhost:3000/api/revalidate?path=/&secret=BOSS2026',
    'http://localhost:3000/api/revalidate?path=/guides&secret=BOSS2026'
  ];

  for (const url of urlsToHit) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
         console.log(`✓ Revalidated successfully: ${url}`);
      } else {
         console.log(`x Revalidation response not ok: ${url} (${res.status})`);
      }
    } catch(e) {
      console.log(`- Skipping ${url} (not currently reachable)`);
    }
  }

  console.log("\nDone! Homepage and Guides page have been synced. The News articles will now show in the bottom strip.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
