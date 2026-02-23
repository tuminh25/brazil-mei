// src/components/AffiliateCTA.tsx
import { Playfair_Display, IBM_Plex_Mono } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: ['italic', 'normal'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });

interface AffiliateCTAProps {
  tripUrl?: string | null;
  klookUrl?: string | null;
  title?: string;
  description?: string;
  className?: string;
}

export default function AffiliateCTA({
  tripUrl,
  klookUrl,
  title = "Unlock Singapore",
  description = "Ready to explore? Book your experience through our partners to support SG Events Hub.",
  className = ""
}: AffiliateCTAProps) {


  const K_ID = "105111";
  const T_AID = "7367361";
  const T_SID = "278066643";

  const getFullUrl = (url: string | null | undefined, type: 'klook' | 'trip'): string => {
    let base = url?.trim();
    if (!base || base === "#") {
      base = type === 'klook' ? "https://www.klook.com/en-SG/city/6-singapore-things-to-do/" : "https://www.trip.com/";
    }

    try {
      const urlObj = new URL(base);
      if (type === 'klook' || urlObj.hostname.includes("klook.com")) {
        urlObj.searchParams.set("aid", K_ID);
        urlObj.searchParams.set("utm_medium", "affiliate-alwayson");
        urlObj.searchParams.set("utm_source", "non-network");
        urlObj.searchParams.set("utm_campaign", K_ID);
      } else if (type === 'trip' || urlObj.hostname.includes("trip.com")) {
        urlObj.searchParams.set("Allianceid", T_AID);
        urlObj.searchParams.set("SID", T_SID);
      }
      return urlObj.toString();
    } catch (e) {
      return base;
    }
  };

  const finalTripUrl = getFullUrl(tripUrl, 'trip');
  const finalKlookUrl = getFullUrl(klookUrl, 'klook');

  return (
    <div className={`relative group my-24 ${className}`}>
      {/* Outer Glow & Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative p-1 md:p-[2px] bg-gradient-to-br from-white/20 via-blue-500/20 to-transparent rounded-[3rem] overflow-hidden">
        <div className="relative bg-[#0a0a0f] rounded-[3rem] p-10 md:p-20 overflow-hidden">

          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10">
            {/* Header / Badge */}
            <div className="flex justify-center mb-10">
              <span className={`${mono.className} px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.2)]`}>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                Official Research Node
              </span>
            </div>

            <h3 className={`${playfair.className} text-5xl md:text-8xl font-black text-white mb-8 uppercase tracking-tighter leading-none italic`}>
              {title}
            </h3>

            <p className="text-gray-400 text-xl md:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <a
                href={finalTripUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="relative group/btn w-full sm:w-auto"
              >
                <div className="absolute -inset-1 bg-white opacity-0 group-hover/btn:opacity-20 blur rounded-2xl transition duration-300"></div>
                <div className="relative bg-white text-black px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-transform hover:scale-[1.05] active:scale-95 shadow-2xl">
                  <span>Stay on Trip.com</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </a>

              <a
                href={finalKlookUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="relative group/btn w-full sm:w-auto"
              >
                <div className="absolute -inset-1 bg-[#ff5b00] opacity-0 group-hover/btn:opacity-40 blur rounded-2xl transition duration-300"></div>
                <div className="relative bg-[#ff5b00] text-white px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-transform hover:scale-[1.05] active:scale-95 shadow-2xl border border-white/10">
                  <span>Book on Klook</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </div>
              </a>
            </div>

            <div className="mt-16 pt-10 border-t border-white/5 flex flex-col items-center gap-4">
              <p className={`${mono.className} text-[9px] text-gray-500 uppercase tracking-[0.4em]`}>
                DECODED BY SG EVENTS HUB • SYSTEM VERIFIED
              </p>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

