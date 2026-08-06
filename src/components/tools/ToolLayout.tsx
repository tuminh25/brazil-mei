import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

export default function ToolLayout({
  icon,
  category,
  title,
  description,
  children,
  sources,
  disclaimer,
}: {
  icon: string;
  category: string;
  title: string;
  description: string;
  children: React.ReactNode;
  sources: { label: string; url: string }[];
  disclaimer?: string;
}) {
  return (
    <main className={`${inter.className} min-h-screen bg-[#050505] text-white py-20 px-6`}>
      <div className="max-w-5xl mx-auto">
        <span className="text-6xl block mb-6">{icon}</span>
        <span className={`${mono.className} text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] block mb-4`}>
          {category}
        </span>
        <h1 className={`${playfair.className} text-5xl md:text-7xl font-black mb-6 tracking-tighter italic`}>
          {title}
        </h1>
        <p className="text-gray-500 max-w-2xl text-lg mb-12">{description}</p>

        {children}

        <div className="mt-16 pt-8 border-t border-white/10 space-y-4">
          <div>
            <h3 className={`${mono.className} text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2`}>
              Official Sources
            </h3>
            <ul className="list-disc pl-5 text-sm text-gray-500 space-y-1">
              {sources.map(s => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 underline underline-offset-2">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {disclaimer && (
            <p className={`${mono.className} text-[10px] text-gray-600 italic uppercase tracking-[0.2em]`}>
              {disclaimer}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}