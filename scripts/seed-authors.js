// scripts/seed-authors.js
// Seed script for Singapore Resident Hub editorial team profiles
// Run with: node scripts/seed-authors.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const AUTHORS = [
  // Editorial Teams (category-specific)
  {
    id: 'author_housing',
    name: 'Housing Editorial Team',
    email: 'housing@sgrhub.com',
    role: 'Housing Editorial Team',
    bio: 'The Housing Editorial Team covers HDB policies, BTO launches, resale procedures, CPF housing grants, and property market analysis. We track every policy change so you don\'t have to.',
    avatarUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
    socialLinks: { twitter: 'sgrhub_housing' }
  },
  {
    id: 'author_money',
    name: 'Money Editorial Team',
    email: 'money@sgrhub.com',
    role: 'Money Editorial Team',
    bio: 'The Money Editorial Team covers CPF changes, retirement planning, insurance, investments, and cost-of-living support schemes. We translate complex financial policies into actionable guidance for Singapore residents.',
    avatarUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    socialLinks: { twitter: 'sgrhub_money' }
  },
  {
    id: 'author_healthcare',
    name: 'Healthcare Editorial Team',
    email: 'healthcare@sgrhub.com',
    role: 'Healthcare Editorial Team',
    bio: 'The Healthcare Editorial Team covers MediSave, MediShield Life, CHAS subsidies, CareShield Life, and hospital financing. We help you navigate Singapore\'s multi-layered healthcare system with confidence.',
    avatarUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    socialLinks: { twitter: 'sgrhub_healthcare' }
  },
  {
    id: 'author_transport',
    name: 'Transport Editorial Team',
    email: 'transport@sgrhub.com',
    role: 'Transport Editorial Team',
    bio: 'The Transport Editorial Team tracks MRT/bus fare changes, ERP 2.0, COE trends, EV adoption, and parking policies. We help you make smarter commuting and vehicle ownership decisions.',
    avatarUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
    socialLinks: { twitter: 'sgrhub_transport' }
  },
  {
    id: 'author_work',
    name: 'Work & Skills Editorial Team',
    email: 'work@sgrhub.com',
    role: 'Work & Skills Editorial Team',
    bio: 'The Work & Skills Editorial Team focuses on SkillsFuture, Workfare, career transition programmes, workplace rights, and employment trends. We help mid-career Singaporeans navigate upskilling and job mobility.',
    avatarUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400',
    socialLinks: { twitter: 'sgrhub_work' }
  },
  {
    id: 'author_food',
    name: 'Community Editorial Team',
    email: 'community@sgrhub.com',
    role: 'Community Editorial Team',
    bio: 'The Community Editorial Team covers CDC vouchers, U-Save rebates, hawker culture, neighbourhood amenities, and community support schemes. We help you make the most of heartland living.',
    avatarUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
    socialLinks: { twitter: 'sgrhub_community' }
  },
  
  // General editorial teams
  {
    id: 'author_editorial',
    name: 'Singapore Resident Hub Editorial Team',
    email: 'editorial@sgrhub.com',
    role: 'Editorial Team',
    bio: 'The Singapore Resident Hub editorial team brings together decades of local expertise across housing, finance, healthcare, transport, and community living. We research, verify, and publish practical guides for Singapore residents.',
    avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    socialLinks: { twitter: 'sgrhub', linkedin: 'singapore-resident-hub' }
  },
  {
    id: 'author_research',
    name: 'Singapore Resident Hub Research Desk',
    email: 'research@sgrhub.com',
    role: 'Research Desk',
    bio: 'Our research desk conducts deep-dive analysis on policy changes, government schemes, and cost-of-living data to ensure every guide is accurate and up-to-date.',
    avatarUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    socialLinks: { twitter: 'sgrhub_research' }
  }
];

async function seedAuthors() {
  console.log('🌱 Seeding editorial team profiles...');
  
  for (const author of AUTHORS) {
    await prisma.author.upsert({
      where: { id: author.id },
      update: author,
      create: author
    });
    console.log(`  ✅ ${author.name} (${author.role})`);
  }
  
  console.log('\n🎉 All editorial team profiles seeded successfully!');
  await prisma.$disconnect();
}

seedAuthors().catch(async (e) => {
  console.error('❌ Seed failed:', e);
  await prisma.$disconnect();
  process.exit(1);
});