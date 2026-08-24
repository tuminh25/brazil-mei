import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/submit', '/api/revalidate'],
    },
    sitemap: 'https://www.sgeventshub.com/sitemap.xml',
    host: 'https://www.sgeventshub.com',
  };
}