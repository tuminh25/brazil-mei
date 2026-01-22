// src/components/TripBanner.tsx
export default function TripBanner() {
  return (
    <div className="my-12 w-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl flex justify-center bg-white">
      <iframe 
        id="S10451968"
        src="https://www.trip.com/partners/ad/S10451968?Allianceid=7367361&SID=278066643&trip_sub1=" 
        style={{ 
          width: '100%', 
          maxWidth: '900px', 
          height: '200px', 
          border: 'none' 
        }}
        frameBorder="0" 
        scrolling="no"
        title="Trip.com Affiliate Banner"
      ></iframe>
    </div>
  );
}