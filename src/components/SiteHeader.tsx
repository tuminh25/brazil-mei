'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from 'react';
import { Search, X, Menu } from 'lucide-react';

const navigation = [
  { name: "Home", href: "/" },
  { name: "Guides", href: "/guides" },
  { name: "Tools", href: "/tools" },
  { name: "Neighborhoods", href: "/neighborhoods" },
  { name: "Latest", href: "/latest" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function SiteHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/guides?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setSearchQuery('');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-[var(--color-black)]/95 backdrop-blur-xl border-[var(--color-border)] shadow-[0_1px_0_rgba(255,255,255,0.03)]' 
          : 'bg-[var(--color-black)]/80 backdrop-blur-xl border-[var(--color-border)]'
      }`}
    >
      <div className="container-wide">
        <div className="h-16 flex items-center justify-between">
          {/* Logo - Editorial Identity */}
          <Link
            href="/"
            className="flex flex-col items-start gap-0 text-[var(--color-text-primary)] font-black tracking-tighter uppercase hover:text-[var(--color-blue-light)] transition-colors z-10"
            aria-label="SG Resident Intelligence Home"
          >
            <span className="text-2xl md:text-3xl leading-[0.9]">SG</span>
            <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--color-text-tertiary)] leading-none">Resident Intelligence</span>
          </Link>

          {/* Desktop Navigation - Centered, Reduced Spacing */}
          <nav className="hidden lg:flex items-center gap-0 text-[10px] font-medium uppercase tracking-[0.15em]" role="navigation" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 rounded-md text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-white)]/5 transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions - Search Icon Only */}
          <div className="flex items-center gap-2">
            {/* Search Icon Button */}
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-white)]/5 transition-all duration-200"
              aria-label="Open search"
              aria-expanded={isSearchOpen}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-white)]/5 transition-all duration-200"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden overflow-hidden bg-[var(--color-black)]/95 backdrop-blur-xl border-t border-[var(--color-border)]">
            <div className="px-6 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-3 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-white)]/5 transition-all duration-200 text-sm font-medium uppercase tracking-[0.1em]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-[var(--color-border)] flex items-center gap-3">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative glass-strong rounded-full px-4 py-2.5">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Search guides..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] text-sm w-full pl-10 pr-10"
                      autoComplete="off"
                      aria-label="Search guides"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
