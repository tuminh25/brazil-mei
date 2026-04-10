// scripts/force-evergreen.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Executing force-evergreen script...");
  console.log("Updating all PUBLISHED posts...");

  const result = await prisma.post.updateMany({
    where: {
      status: 'PUBLISHED'
    },
    data: {
      category: 'Evergreen',
      isNewsjack: false
    }
  });

  console.log(`Success: Forced ${result.count} posts to category 'Evergreen' (isNewsjack=false).`);
  
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

  console.log("\nDone! Please refresh sgeventshub.com / localhost:3000 to see the populated homepage.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
