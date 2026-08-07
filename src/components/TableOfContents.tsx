'use client';

// src/components/TableOfContents.tsx
// Dynamic Table of Contents generated from article H2 headings

import { IBM_Plex_Mono } from 'next/font/google';
import { extractHeadings } from '@/lib/content-utils';

const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  // Extract H2 headings from HTML content
  const headings = extractHeadings(content);
  
  if (headings.length === 0) return null;
  
  return (
    <aside className="lg:col-span-3 hidden lg:block" data-animate>
      <div className="sticky top-32 p-8 md:p-10 glass-strong rounded-[var(--radius-3xl)] border border-[var(--color-border)]">
        <p className={`${mono.className} text-[10px] text-[var(--color-blue-light)] font-black uppercase tracking-[0.3em] mb-8`}>Contents</p>
        <div className="space-y-5 text-xs font-black text-[var(--color-text-tertiary)] uppercase tracking-widest">
          {headings.map((heading, i) => (
            <p 
              key={heading.id}
              className="hover:text-[var(--color-cyan-light)] cursor-pointer transition flex items-center gap-3 group"
              onClick={() => {
                const element = document.getElementById(heading.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              <span className="w-1.5 h-1.5 bg-[var(--color-cyan)]/40 rounded-full group-hover:bg-[var(--color-cyan)] transition-colors" />
              <span id={`toc-${heading.id}`}>
                {String(i + 1).padStart(2, '0')} {heading.text}
              </span>
            </p>
          ))}
        </div>
      </div>
    </aside>
  );
}
