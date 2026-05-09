import { Playfair_Display, IBM_Plex_Mono, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700', '900'], style: 'italic' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata = {
  title: "Privacy Policy | SG Events Hub",
  description: "Comprehensive Privacy Policy for SG Events Hub, compliant with PDPA, GDPR, and Google AdSense requirements.",
};

export default function PrivacyPolicy() {
  const lastUpdated = "May 09, 2026";

  return (
    <main className={`${inter.className} min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden pt-20`}>
      <section className="max-w-4xl mx-auto px-6 py-32">
        <div className="mb-24 text-center">
          <p className={`${mono.className} text-blue-500 text-[10px] uppercase tracking-[0.5em] mb-8 font-black`}>
            Compliance & Legal
          </p>
          <h1 className={`${playfair.className} text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 italic`}>
            Privacy Policy
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[9px] border-y border-white/5 inline-block py-2">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-invert prose-blue max-w-none space-y-16 text-gray-400 leading-relaxed">
          {/* INTRODUCTION */}
          <section>
            <h2 className="text-white font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-blue-600 pl-6">1. Introduction</h2>
            <p>
              Welcome to SG Events Hub ("we", "our", or "us"). We are committed to protecting your personal data and your privacy in accordance with the <strong>Personal Data Protection Act (PDPA)</strong> of Singapore and the <strong>General Data Protection Regulation (GDPR)</strong>. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>
          </section>

          {/* INFORMATION COLLECTION */}
          <section>
            <h2 className="text-white font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-blue-600 pl-6">2. Information Collection</h2>
            <p className="mb-6">
              We collect information that you voluntarily provide to us, such as when you contact us via email or subscribe to our updates. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-4 marker:text-blue-500">
              <li>Name and contact information (Email address).</li>
              <li>Communication preferences.</li>
              <li>Any information provided through contact forms or direct inquiries.</li>
            </ul>
            <p className="mt-6">
              We also automatically collect technical data, including IP addresses, browser types, and usage patterns, through cookies and similar technologies.
            </p>
          </section>

          {/* COOKIES & ADVERTISING */}
          <section className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[2rem]">
            <h2 className="text-white font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-cyan-500 pl-6">3. Cookies & Third-Party Advertising</h2>
            <p className="mb-6">
              We use cookies to enhance your experience, analyze traffic, and serve personalized content. 
            </p>
            <div className="space-y-6">
              <h3 className="text-white font-bold text-lg uppercase tracking-tight">Google AdSense & DoubleClick Cookie</h3>
              <p>
                Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the <strong>DoubleClick DART cookie</strong> enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
              </p>
              <p>
                Users may opt out of the use of the DART cookie by visiting the <a href="https://policies.google.com/technologies/ads" className="text-blue-400 hover:underline">Google Ad and Content Network privacy policy</a>.
              </p>
              <h3 className="text-white font-bold text-lg uppercase tracking-tight">Third-Party Partners</h3>
              <p>
                We may work with third-party advertising companies (such as Google AdSense) that use cookies to collect information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
              </p>
            </div>
          </section>

          {/* USE OF DATA */}
          <section>
            <h2 className="text-white font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-blue-600 pl-6">4. Use of Your Data</h2>
            <p className="mb-6">Your data is used to:</p>
            <ul className="list-disc pl-6 space-y-4 marker:text-blue-500">
              <li>Provide and maintain our services and content.</li>
              <li>Optimize website performance and user experience.</li>
              <li>Communicate with you regarding updates or inquiries.</li>
              <li>Ensure compliance with legal obligations in Singapore and internationally.</li>
            </ul>
          </section>

          {/* DATA SECURITY */}
          <section>
            <h2 className="text-white font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-blue-600 pl-6">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, or destruction. However, please note that no method of electronic transmission is 100% secure.
            </p>
          </section>

          {/* YOUR RIGHTS */}
          <section>
            <h2 className="text-white font-black uppercase tracking-tight text-2xl mb-8 border-l-4 border-blue-600 pl-6">6. Your Rights (GDPR & PDPA)</h2>
            <p>
              Depending on your location, you have rights regarding your personal data, including the right to access, correct, or delete your information, and the right to object to or restrict certain processing activities. To exercise these rights, please contact us at the email address provided below.
            </p>
          </section>

          {/* CONTACT INFO */}
          <section className="pt-16 border-t border-white/10">
            <h2 className="text-white font-black uppercase tracking-tight text-2xl mb-8">7. Contact Us</h2>
            <p className="mb-8">
              If you have any questions regarding this Privacy Policy, please contact our Data Protection Officer:
            </p>
            <div className="p-12 bg-gradient-to-br from-[#0a0a0a] to-[#111] rounded-[3rem] border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
               <p className="text-white text-xl font-black mb-2 uppercase">SG Events Hub Legal Team</p>
               <p className="text-blue-400 font-bold mb-4 italic">info@sgeventshub.com</p>
               <p className="text-xs text-gray-600 uppercase tracking-widest font-black">Attention: Data Protection Officer</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
