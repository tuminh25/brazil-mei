import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-20 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">SG Events Hub</h2>
          <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
            The definitive guide to Singapore's cultural pulse. Curated by locals, trusted by travelers. We help you experience the city, not just visit it.
          </p>
        </div>
        <div>
          <h4 className="text-blue-500 font-bold uppercase tracking-[0.2em] mb-6 text-[10px]">Explore</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-medium">
            <li><Link href="/trending" className="hover:text-white transition">Trending Updates</Link></li>
            <li><Link href="/guides" className="hover:text-white transition">Insider Masterpieces</Link></li>
            <li><Link href="/guides" className="hover:text-white transition">Things to Do</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-blue-500 font-bold uppercase tracking-[0.2em] mb-6 text-[10px]">Connect</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-medium">
            <li><Link href="/contact" className="hover:text-white transition">Contact Editorial</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Partnerships</Link></li>
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