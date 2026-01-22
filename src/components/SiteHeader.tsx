import Link from "next/link";
import SearchInput from "./SearchInput";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white italic uppercase hover:text-blue-500 transition">
            SG Events Hub
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.15em]">
            <Link href="/events" className="text-gray-300 hover:text-white transition">All Events</Link>
            <Link href="/guides" className="text-gray-300 hover:text-blue-400 transition">Insider Guides</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <SearchInput />
          <Link href="/contact" className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-black uppercase hover:bg-blue-600 hover:text-white transition-all shadow-lg">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}