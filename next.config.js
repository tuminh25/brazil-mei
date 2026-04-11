/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.singaporeartmuseum.sg' }, // Lỗi Sếp vừa gặp
      { protocol: 'https', hostname: '**.gov.sg' },               // Mọi trang chính phủ
      { protocol: 'https', hostname: 'offloadmedia.feverup.com' },
      { protocol: 'https', hostname: '**.sistic.com.sg' },
      { protocol: 'http', hostname: '**.sistic.com.sg' },
      { protocol: 'https', hostname: '**.evbuc.com' },           // Eventbrite
      { protocol: 'https', hostname: '**.eventbrite.sg' },
      { protocol: 'https', hostname: '**.klook.com' },
      { protocol: 'https', hostname: '**.trip.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: '**.static-access.com' },
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },       // Ảnh từ Perplexity/AWS
      { protocol: 'https', hostname: '**.timeout.com' },
      { protocol: 'https', hostname: '**.honeycombers.com' },
      { protocol: 'https', hostname: '**.sassymamasg.com' },
      { protocol: 'https', hostname: '**.littlestepsasia.com' },
      { protocol: 'https', hostname: '**.glueup.com' },
      { protocol: 'https', hostname: 'api.time.com' },

      // Nguồn Affiliate & AI
      { protocol: 'https', hostname: '**.klook.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.eventfinda.sg' },
      { protocol: 'https', hostname: 'ppl-ai-file-upload.s3.amazonaws.com' },
      { protocol: 'https', hostname: '**.static-access.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/attractions',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/attractions/:slug*',
        destination: '/guides/:slug*',
        permanent: true,
      },
      {
        source: '/events',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/events/:slug*',
        destination: '/guides/:slug*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
