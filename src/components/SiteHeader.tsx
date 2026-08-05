import Link from "next/link";
import SearchInput from "./SearchInput";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Neighborhoods", href: "/neighborhoods" },
  { name: "Housing", href: "/guides?category=HOUSING" },
  { name: "Money", href: "/guides?category=MONEY" },
  { name: "Transport", href: "/guides?category=TRANSPORT" },
  { name: "Study", href: "/guides?category=STUDY" },
  { name: "Food", href: "/guides?category=FOOD" },
  { name: "Healthcare", href: "/guides?category=HEALTHCARE" },
  { name: "Tools", href: "/tools" },
  { name: "Latest", href: "/latest" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white italic uppercase hover:text-blue-500 transition">
            SG Events Hub
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-[0.15em]">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-blue-400 transition"
              >
                {item.name}
              </Link>
            ))}
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
