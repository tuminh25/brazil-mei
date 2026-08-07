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
  title = "Premium Intelligence",
  description = "Access vetted booking channels for guaranteed entry and elite stay options.",
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
    <div className={`relative group my-24 ${className}`} data-animate>
      {/* Outer Glow & Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-purple)] rounded-[var(--radius-3xl)] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative p-1 md:p-[2px] bg-gradient-to-br from-[var(--color-white)]/20 via-[var(--color-blue)]/20 to-transparent rounded-[var(--radius-3xl)] overflow-hidden">
        <div className="relative card-elevated rounded-[var(--radius-3xl)] p-10 md:p-20 overflow-hidden">

          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-blue)]/10 blur-[120px] rounded-full -mr-48 -mt-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-purple)]/10 blur-[120px] rounded-full -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10">
            {/* Header / Badge */}
            <div className="flex justify-center mb-10">
              <span className={`${mono.className} px-4 py-2 bg-[var(--color-blue)]/10 border border-[var(--color-blue)]/30 rounded-full text-[10px] text-[var(--color-blue-light)] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)]`}>
                <span className="w-2 h-2 bg-[var(--color-blue)] rounded-full animate-ping"></span>
                Official Research Node
              </span>
            </div>

            <h3 className={`${playfair.className} text-5xl md:text-8xl font-black text-[var(--color-text-primary)] mb-8 uppercase tracking-tighter leading-none italic`}>
              {title}
            </h3>

            <p className="text-[var(--color-text-secondary)] text-xl md:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <a
                href={finalTripUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="btn btn-primary btn-lg w-full sm:w-auto"
              >
                View on Trip.com
              </a>

              <a
                href={finalKlookUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="btn btn-orange btn-lg w-full sm:w-auto"
              >
                View on Klook
              </a>
            </div>

            <div className="mt-16 pt-10 border-t border-[var(--color-border)] flex flex-col items-center gap-4">
              <p className={`${mono.className} text-[9px] text-[var(--color-text-tertiary)] uppercase tracking-[0.4em]`}>
                DECODED BY SG EVENTS HUB • SYSTEM VERIFIED
              </p>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-blue)]/30 to-transparent"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
