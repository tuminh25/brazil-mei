import { prisma } from "@/lib/prisma";
import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';
import HomePageClient from './HomePageClient';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const revalidate = 3600;

const IMAGE_FALLBACK = "https://images.unsplash.com/photo-1525625239513-39bc131f9979?q=80&w=1600&auto=format&fit=crop";

const topicCategories = [
  { value: 'HOUSING', label: 'Housing', icon: 'housing', href: '/guides?category=HOUSING' },
  { value: 'TRANSPORT', label: 'Transport', icon: 'transport', href: '/guides?category=TRANSPORT' },
  { value: 'MONEY', label: 'Money', icon: 'money', href: '/guides?category=MONEY' },
  { value: 'FOOD', label: 'Food', icon: 'food', href: '/guides?category=FOOD' },
  { value: 'HEALTHCARE', label: 'Healthcare', icon: 'healthcare', href: '/guides?category=HEALTHCARE' },
  { value: 'STUDY', label: 'Study', icon: 'study', href: '/guides?category=STUDY' },
  { value: 'LIFESTYLE', label: 'Lifestyle', icon: 'lifestyle', href: '/guides?category=LIFESTYLE' },
  { value: 'WORK', label: 'Work', icon: 'work', href: '/guides?category=WORK' },
];

const neighborhoodData = [
  { slug: 'woodlands', name: 'Woodlands', tag: 'North', color: 'blue' },
  { slug: 'tengah', name: 'Tengah', tag: 'West', color: 'green' },
  { slug: 'jurong', name: 'Jurong', tag: 'West', color: 'orange' },
  { slug: 'punggol', name: 'Punggol', tag: 'North-East', color: 'cyan' },
  { slug: 'tampines', name: 'Tampines', tag: 'East', color: 'purple' },
];

const tools = [
  { name: 'HDB Affordability Calculator', category: 'Housing', icon: 'calculator', status: 'Coming Soon' },
  { name: 'CPF Retirement Planner', category: 'Money', icon: 'planner', status: 'Coming Soon' },
  { name: 'Transport Cost Calculator', category: 'Transport', icon: 'transportCost', status: 'Coming Soon' },
  { name: 'School Distance Checker', category: 'Study', icon: 'school', status: 'Coming Soon' },
  { name: 'Hawker Price Tracker', category: 'Food', icon: 'hawker', status: 'Coming Soon' },
  { name: 'Clinic & Hospital Finder', category: 'Healthcare', icon: 'clinic', status: 'Coming Soon' },
  { name: 'Salary Benchmark Tool', category: 'Work', icon: 'salary', status: 'Coming Soon' },
  { name: 'Neighborhood Comparison', category: 'Neighborhood', icon: 'map', status: 'Coming Soon' },
];

export default async function HomePage() {
  // 1. TODAY'S SINGAPORE: 8 newest resident articles (non-travel, non-newsjack)
  let todaysSingapore: any[] = [];
  try {
    todaysSingapore = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        isNewsjack: false,
        category: { not: 'TRAVEL_GUIDE' as any },
      },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error("HomePage DB Error (todaysSingapore):", error);
  }

  // 2. NEIGHBORHOODS: with article counts
  let neighborhoodsWithCounts: any[] = [];
  try {
    neighborhoodsWithCounts = await Promise.all(
      neighborhoodData.map(async (n) => {
        const count = await prisma.post.count({
          where: { neighborhood: n.name, status: 'PUBLISHED' },
        });
        return { ...n, articleCount: count };
      })
    );
  } catch (error) {
    console.error("HomePage DB Error (neighborhoods):", error);
    neighborhoodsWithCounts = neighborhoodData.map(n => ({ ...n, articleCount: 0 }));
  }

  // 3. TOPIC CATEGORIES: with article counts
  let topicsWithCounts: any[] = [];
  try {
    const categoryCounts = await prisma.post.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED', category: { not: 'TRAVEL_GUIDE' as any } },
      _count: { category: true },
    });
    const countsMap = new Map(categoryCounts.map(c => [c.category, c._count.category]));
    topicsWithCounts = topicCategories.map(t => ({ ...t, count: countsMap.get(t.value as any) || 0 }));
  } catch (error) {
    console.error("HomePage DB Error (topics):", error);
    topicsWithCounts = topicCategories.map(t => ({ ...t, count: 0 }));
  }

  // 4. FEATURED GUIDES: High-quality evergreen (non-newsjack, non-travel, with insider data)
  let featuredGuides: any[] = [];
  try {
    featuredGuides = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        isNewsjack: false,
        category: { not: 'TRAVEL_GUIDE' },
        OR: [
          { insiderPrice: { not: null } },
          { bestTime: { not: null } },
          { secretTip: { not: null } },
        ],
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error("HomePage DB Error (featured):", error);
  }

  // 5. LATEST UPDATES: Newsjacked or travel guides only (3 items)
  let latestUpdates: any[] = [];
  try {
    latestUpdates = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { isNewsjack: true },
          { category: 'TRAVEL_GUIDE' },
        ],
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error("HomePage DB Error (latestUpdates):", error);
  }

  return (
    <HomePageClient
      playfairClass={playfair.className}
      monoClass={mono.className}
      interClass={inter.className}
      IMAGE_FALLBACK={IMAGE_FALLBACK}
      topicCategories={topicCategories}
      neighborhoodData={neighborhoodData}
      tools={tools}
      todaysSingapore={todaysSingapore}
      neighborhoodsWithCounts={neighborhoodsWithCounts}
      topicsWithCounts={topicsWithCounts}
      featuredGuides={featuredGuides}
      latestUpdates={latestUpdates}
    />
  );
}