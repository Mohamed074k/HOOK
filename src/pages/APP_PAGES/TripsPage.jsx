import { MapPin, Clock, Users } from "lucide-react";

const trips = [
  { title: "Midnight Marlin Pursuit", location: "Cabo San Lucas, MX", duration: "3 Days", crew: 6, price: "$1,200" },
  { title: "Keys Fly-Fishing Charter", location: "Islamorada, Florida", duration: "1 Day", crew: 4, price: "$800" },
  { title: "North Sea Challenge", location: "Bergen, Norway", duration: "5 Days", crew: 8, price: "$2,850" },
  { title: "Pacific Blue Water Run", location: "Honolulu, Hawaii", duration: "2 Days", crew: 6, price: "$1,500" },
];

const TripsPage = () => (
  <div className="px-6 md:px-12 py-12 max-w-screen-xl mx-auto">
    <h1 className="text-4xl font-black text-[#cee5ff] mb-2">Active Expeditions</h1>
    <p className="text-[#a3cbf2]/60 mb-10">Curated voyages verified by our nautical archive.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {trips.map((t) => (
        <div key={t.title} className="bg-[#002238] border border-white/5 rounded-2xl p-6 hover:border-sky-400/20 transition-all group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#cee5ff] group-hover:text-white">{t.title}</h3>
              <div className="flex items-center gap-1 text-[#a3cbf2]/60 text-sm mt-1">
                <MapPin size={13} /> {t.location}
              </div>
            </div>
            <span className="text-sky-400 font-bold text-lg">{t.price}<span className="text-xs text-[#a3cbf2]/40 font-normal"> /trip</span></span>
          </div>
          <div className="flex gap-6 text-sm text-[#a3cbf2]/60">
            <span className="flex items-center gap-1"><Clock size={13} /> {t.duration}</span>
            <span className="flex items-center gap-1"><Users size={13} /> Up to {t.crew}</span>
          </div>
          <button className="mt-4 w-full py-2.5 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400 text-sm font-semibold hover:bg-sky-400/20 transition-colors">
            Book Now
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default TripsPage;
