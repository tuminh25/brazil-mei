import Link from "next/link";

const footerNavigation = {
  "Resident Guides": [
    { name: "Housing", href: "/guides?category=HOUSING" },
    { name: "Money", href: "/guides?category=MONEY" },
    { name: "Transport", href: "/guides?category=TRANSPORT" },
    { name: "Study", href: "/guides?category=STUDY" },
    { name: "Food", href: "/guides?category=FOOD" },
    { name: "Healthcare", href: "/guides?category=HEALTHCARE" },
    { name: "Work", href: "/guides?category=WORK" },
    { name: "Lifestyle", href: "/guides?category=LIFESTYLE" },
    { name: "Neighborhoods", href: "/guides?category=NEIGHBORHOOD" },
    { name: "Tools", href: "/guides?category=TOOLS" },
  ],
  "Explore": [
    { name: "Neighborhoods Hub", href: "/neighborhoods" },
    { name: "Latest Updates", href: "/latest" },
    { name: "All Guides", href: "/guides" },
    { name: "Tools", href: "/tools" },
  ],
  "Legal & Info": [
    { name: "About Us", href: "/about" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Contact Us", href: "/contact" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-20 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">SG Events Hub</h2>
          <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
            Singapore Resident Intelligence. Built for people living in Singapore — housing, transport, money, healthcare, food, and neighborhood guides.
          </p>
        </div>
        <div>
          <h4 className="text-blue-500 font-bold uppercase tracking-[0.2em] mb-6 text-[10px]">Resident Guides</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-medium">
            {footerNavigation["Resident Guides"].map((item) => (
              <li key={item.name}><Link href={item.href} className="hover:text-white transition">{item.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-blue-500 font-bold uppercase tracking-[0.2em] mb-6 text-[10px]">Explore</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-medium">
            {footerNavigation["Explore"].map((item) => (
              <li key={item.name}><Link href={item.href} className="hover:text-white transition">{item.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-blue-500 font-bold uppercase tracking-[0.2em] mb-6 text-[10px]">Legal & Info</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-medium">
            {footerNavigation["Legal & Info"].map((item) => (
              <li key={item.name}><Link href={item.href} className="hover:text-white transition">{item.name}</Link></li>
            ))}
            <li className="text-xs pt-4 opacity-30">© 2026 SG Events Hub.</li>
          </ul>
        </div>
      </div>
      
      {/* IDENTITY SHIELD DISCLAIMER */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
          SG Events Hub is an independent digital media platform. We are not affiliated with any physical event planning agencies in Singapore.
        </p>
      </div>
    </footer>
  );
}
