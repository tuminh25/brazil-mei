import SiteHeader from "@/components/SiteHeader";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-black mb-8">Get in Touch</h1>
        <p className="text-xl text-gray-400 mb-12">
          SG Events Hub is Singapore's independent authority on local culture and events. We verify every listing manually.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-8 bg-[#111] rounded-3xl border border-white/10">
            <h3 className="text-blue-500 font-bold uppercase tracking-widest mb-4">Editorial</h3>
            <p className="text-gray-300 mb-4">Have an insider tip or event submission? Reach our editors directly.</p>
            <a href="mailto:editor@sgeventshub.com" className="text-white font-bold underline decoration-blue-500">editor@sgeventshub.com</a>
          </div>
          <div className="p-8 bg-[#111] rounded-3xl border border-white/10">
            <h3 className="text-blue-500 font-bold uppercase tracking-widest mb-4">Partnerships</h3>
            <p className="text-gray-300 mb-4">For advertising and collaboration inquiries.</p>
            <a href="mailto:partner@sgeventshub.com" className="text-white font-bold underline decoration-blue-500">partner@sgeventshub.com</a>
          </div>
        </div>
      </div>
    </main>
  );
}