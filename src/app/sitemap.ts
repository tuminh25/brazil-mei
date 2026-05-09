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

  // 2. Define static routes
  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/guides`, lastModified: new Date() },
    { url: `${baseUrl}/trending`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];

  // 3. Convert posts to sitemap links
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/guides/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [...staticPages, ...postUrls];
}