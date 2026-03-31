// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.sgeventshub.com";

  // 1. Lấy tất cả sự kiện từ Database
  const events = await prisma.event.findMany({
    select: { slug: true, updatedAt: true },
  });

  // 2. Lấy tất cả bài Guides từ Database
  const posts = await prisma.post.findMany({
    select: { slug: true, updatedAt: true },
  });

  // 3. Tạo danh sách các trang cố định
  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/events`, lastModified: new Date() },
    { url: `${baseUrl}/guides`, lastModified: new Date() },
    { url: `${baseUrl}/events/free`, lastModified: new Date() },
  ];

  // 4. Biến các sự kiện thành link sitemap
  const eventUrls = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updatedAt,
  }));

  // 5. Biến các bài blog thành link sitemap
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/guides/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [...staticPages, ...eventUrls, ...postUrls];
}