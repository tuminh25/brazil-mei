/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'ppl-ai-file-upload.s3.amazonaws.com' },
    ],
  },
  async redirects() {
    return [];
  },
  experimental: {
    // OpenNext adapter for Cloudflare
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;