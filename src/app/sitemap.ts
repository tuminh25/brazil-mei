// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.sgeventshub.com";

  // 1. Get all Masterpiece Guides from Database
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.error("Sitemap DB Error:", error);
  }

  // 2. Get neighborhood data for sitemap
  const neighborhoods = ['woodlands', 'jurong', 'tengah', 'punggol', 'tampines'];

  // 3. Tool slugs for sitemap
  const toolSlugs = [
    'hdb-affordability-calculator',
    'cpf-retirement-planner',
    'transport-cost-calculator',
    'school-distance-checker',
    'hawker-price-tracker',
    'clinic-hospital-finder',
    'salary-benchmark-tool',
    'neighborhood-comparison',
  ];

  // 4. Define static routes
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/neighborhoods`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/latest`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ];

  // 5. Neighborhood hub pages
  const neighborhoodPages = neighborhoods.map((slug) => ({
    url: `${baseUrl}/neighborhoods/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 6. Tool pages
  const toolPages = toolSlugs.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // 7. Category filter pages for guides
  const categories = ['HOUSING', 'MONEY', 'TRANSPORT', 'STUDY', 'FOOD', 'HEALTHCARE', 'WORK', 'LIFESTYLE', 'NEIGHBORHOOD', 'TOOLS', 'TRAVEL_GUIDE'];
  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/guides?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  })) as MetadataRoute.Sitemap;

  // 8. Convert posts to sitemap links
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/guides/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...neighborhoodPages, ...toolPages, ...categoryPages, ...postUrls];
}
