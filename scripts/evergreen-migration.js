/**
 * evergreen-migration.js
 * One-time migration: Set all Posts → category:'Evergreen', isNewsjack:false
 * and permanently delete all Event records.
 *
 * Run: node scripts/evergreen-migration.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Evergreen Migration...\n');

  // Step 1: Update all Posts to Evergreen
  const updatedPosts = await prisma.post.updateMany({
    data: {
      category: 'Evergreen',
      isNewsjack: false,
    },
  });
  console.log(`✅ Updated ${updatedPosts.count} Posts → category: 'Evergreen', isNewsjack: false`);

  // Step 2: Permanently delete all Event records
  const deletedEvents = await prisma.event.deleteMany({});
  console.log(`🗑️  Deleted ${deletedEvents.count} Event records permanently.`);

  // Step 3: Verify
  const postCount = await prisma.post.count({ where: { category: 'Evergreen' } });
  const eventCount = await prisma.event.count();
  console.log(`\n📊 Final State:`);
  console.log(`   Posts with category='Evergreen': ${postCount}`);
  console.log(`   Events remaining: ${eventCount}`);
  console.log('\n🎉 Migration complete!');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
