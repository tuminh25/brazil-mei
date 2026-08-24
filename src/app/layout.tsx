// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";


export const metadata: Metadata = {
  metadataBase: new URL('https://www.sgeventshub.com'),
  title: {
    default: "SG Events Hub | Singapore Resident Intelligence",
    template: "%s | SG Events Hub",
  },
  description: "Practical guides for living in Singapore — housing, transport, money, healthcare, food, and neighborhood intelligence.",
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  icons: {
    icon: [
      { url: '/icon.png?v=2' },
    ],
    apple: [
      { url: '/apple-icon.png?v=2' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: 'https://www.sgeventshub.com/',
    siteName: 'SG Events Hub',
    title: 'SG Events Hub | Singapore Resident Intelligence',
    description: 'Practical guides for living in Singapore — housing, transport, money, healthcare, food, and neighborhood intelligence.',
    images: [
      {
        url: '/icon.png?v=2',
        width: 512,
        height: 512,
        alt: 'SG Events Hub - Singapore Resident Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sgeventshub',
    creator: '@sgeventshub',
    title: 'SG Events Hub | Singapore Resident Intelligence',
    description: 'Practical guides for living in Singapore — housing, transport, money, healthcare, food, and neighborhood intelligence.',
    images: ['/icon.png?v=2'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'theme-color': '#000000',
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: 'device-width',
  initialScale: 1,
};

// Organization & WebSite JSON-LD for homepage identity
function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SG Events Hub",
    "url": "https://www.sgeventshub.com",
    "logo": "https://www.sgeventshub.com/icon.png",
    "sameAs": [
      "https://twitter.com/sgeventshub",
      "https://www.facebook.com/sgeventshub",
      "https://www.instagram.com/sgeventshub"
    ],
    "description": "Singapore Resident Intelligence — practical guides for housing, transport, money, healthcare, food, study, work, and neighborhood life.",
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SG Events Hub",
    "url": "https://www.sgeventshub.com",
    "description": "Practical guides for living in Singapore — housing, transport, money, healthcare, food, and neighborhood intelligence.",
    "publisher": {
      "@type": "Organization",
      "name": "SG Events Hub",
      "url": "https://www.sgeventshub.com"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.sgeventshub.com/guides?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <StructuredData />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        {/* Google AdSense Script - Chạy trực tiếp trong head (beforeInteractive) */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5206605273738031"
          crossOrigin="anonymous"
        ></script>
        
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        
        <Analytics />
        <GoogleAnalytics gaId="G-9FFS6DQMM0" />


      </body>
    </html>
  );
}