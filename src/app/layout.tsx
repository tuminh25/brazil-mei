// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.brazilmei.com'),
  title: {
    default: "Brazil MEI | Microempreendedor Individual Intelligence",
    template: "%s | Brazil MEI",
  },
  description: "Practical guides for MEIs in Brazil — registration, taxes, invoicing, benefits, and compliance.",
  alternates: {
    canonical: '/',
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
    locale: 'pt_BR',
    url: 'https://www.brazilmei.com/',
    siteName: 'Brazil MEI',
    title: 'Brazil MEI | Microempreendedor Individual Intelligence',
    description: 'Practical guides for MEIs in Brazil — registration, taxes, invoicing, benefits, and compliance.',
    images: [
      {
        url: '/icon.png?v=2',
        width: 512,
        height: 512,
        alt: 'Brazil MEI - Microempreendedor Individual Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@brazilmei',
    creator: '@brazilmei',
    title: 'Brazil MEI | Microempreendedor Individual Intelligence',
    description: 'Practical guides for MEIs in Brazil — registration, taxes, invoicing, benefits, and compliance.',
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
    "name": "Brazil MEI",
    "url": "https://www.brazilmei.com",
    "logo": "https://www.brazilmei.com/icon.png",
    "sameAs": [
      "https://twitter.com/brazilmei",
      "https://www.facebook.com/brazilmei",
      "https://www.instagram.com/brazilmei"
    ],
    "description": "Brazil MEI Intelligence — practical guides for registration, taxes, invoicing, benefits, and compliance.",
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Brazil MEI",
    "url": "https://www.brazilmei.com",
    "description": "Practical guides for MEIs in Brazil — registration, taxes, invoicing, benefits, and compliance.",
    "publisher": {
      "@type": "Organization",
      "name": "Brazil MEI",
      "url": "https://www.brazilmei.com"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.brazilmei.com/guides?search={search_term_string}"
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
    <html lang="pt-BR" className="dark scroll-smooth">
      <head>
        <StructuredData />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        
        <Analytics />
      </body>
    </html>
  );
}