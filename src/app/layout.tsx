// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";


export const metadata: Metadata = {
  metadataBase: new URL('https://www.sgeventshub.com'),
  title: "SG Events Hub | Singapore Planning Guides",
  description: "The definitive collection of in-depth planning guides to Singapore’s greatest attractions.",
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
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-black text-white antialiased">
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