const child_process = require('child_process');
require('dotenv').config();

async function main() {
  console.log('🚀 [SG Events Hub] Starting REBORN Recovery Process...');

  try {
    // 1. Force Generate
    console.log('\n🛠️  Step 1: Forcing prisma generate...');
    child_process.execSync('npx prisma generate', { stdio: 'inherit' });

    // NOW we can import the generated client
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // 2. Force Sync
    console.log('\n🔥 Step 2: Forcing database reset and push...');
    child_process.execSync('npx prisma db push --force-reset', { stdio: 'inherit' });

    // 3. Seed Authors
    console.log('\n👥 Step 3: Seeding essential authors...');
    const authors = [
      { 
        id: 'author_1', 
        name: 'Desmond', 
        email: 'desmond@sgeventshub.com', 
        role: 'Head of Editorial', 
        bio: 'Senior editor with 10+ years experience in SG events.',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
      },
      { 
        id: 'author_2', 
        name: 'Sarah', 
        email: 'sarah@sgeventshub.com', 
        role: 'Lifestyle Writer', 
        bio: 'Expert in Singapore nightlife and dining scene.',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
      },
      { 
        id: 'author_3', 
        name: 'Jax', 
        email: 'jax@sgeventshub.com', 
        role: 'Tech & Gaming Expert', 
        bio: 'Covering the latest in SG tech events and conventions.',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
      },
    ];

    for (const author of authors) {
      await prisma.author.upsert({
        where: { id: author.id },
        update: author,
        create: author,
      });
      console.log(`✅ Author verified: ${author.name} (${author.id})`);
    }

    // 4. Trigger Import
    console.log('\n📚 Step 4: Restoring guide content...');
    
    // Disconnect our current client before running another script that uses Prisma
    await prisma.$disconnect();

    console.log('Executing import-guides.js logic...');
    require('./import-guides.js');

    console.log('\n✨ Database REBORN successful!');
  } catch (error) {
    console.error('\n❌ REBORN FAILED!');
    console.error(error.message);
    process.exit(1);
  }
}

main();
