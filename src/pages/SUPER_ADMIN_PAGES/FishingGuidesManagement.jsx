import { useState, useEffect } from "react";
import { Search, MoreHorizontal } from "lucide-react";

const guides = [
  { name: "Moahmed Elsayed", email: "mohamed@example.com", location: "Cabo San Lucas", trips: 34, rating: "4.9", status: "Active" },
  { name: "Ahmed Mohamed", email: "Ah88@example.com", location: "Osaka, Japan", trips: 21, rating: "4.8", status: "Active" },
  { name: "Mohamed Ahmed", email: "mo44@example.com", location: "Alexandria, Egypt", trips: 15, rating: "4.7", status: "Pending" },
  { name: "Ahmed Hafez", email: "AhHAfez@example.com", location: "Bergen, Norway", trips: 48, rating: "5.0", status: "Active" },
  { name: "Cristiano Ronaldo", email: "cr7@example.com", location: "Azores, Portugal", trips: 9, rating: "4.5", status: "Suspended" },
];

const statusStyles = {
  Active: "bg-sky-400/10 text-sky-400",
  Pending: "bg-yellow-400/10 text-yellow-400",
  Suspended: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",
};

const FishingGuidesManagement = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div 
        className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Fishing Guides</h1>
      </div>

      <div 
        className="relative max-w-sm transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
        <input
          className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 transition-colors shadow-sm"
          placeholder="Search guides..."
        />
      </div>

      {/* Desktop Table */}
      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-[#001526] border-b border-white/10">
            <tr>
              {["Guide", "Location", "Trips", "Rating", "Status", ""].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guides.map((g) => (
              <tr key={g.email} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group">
                <td className="px-6 py-4">
                  <p className="text-[#cee5ff] font-medium group-hover:text-white transition-colors">{g.name}</p>
                  <p className="text-[#a3cbf2]/40 text-xs">{g.email}</p>
                </td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{g.location}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{g.trips}</td>
                <td className="px-6 py-4 text-yellow-400 font-bold text-sm">⭐ {g.rating}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[g.status] ?? ""}`}>
                    {g.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#a3cbf2]/30 hover:text-[#cee5ff] transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div 
        className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        {guides.map((g) => (
          <div key={g.email} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[#cee5ff] font-semibold text-sm">{g.name}</p>
                <p className="text-[#a3cbf2]/40 text-xs">{g.email}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[g.status] ?? ""}`}>
                {g.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#a3cbf2]/40 mt-3 flex-wrap bg-[#001526] p-3 rounded-xl border border-white/5">
              <span>📍 {g.location}</span>
              <span>{g.trips} trips</span>
              <span className="text-yellow-400 font-bold">⭐ {g.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FishingGuidesManagement;