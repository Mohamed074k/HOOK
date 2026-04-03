import { useState, useEffect } from "react";
import { Search, MoreHorizontal } from "lucide-react";

const sellers = [
  { name: "The Bait Shop", owner: "Marcus Lee", email: "marcus@baitshop.com", products: 42, status: "Approved", joined: "Jan 2024" },
  { name: "Ocean Gear Co.", owner: "Sara Kim", email: "sara@oceangear.com", products: 87, status: "Approved", joined: "Feb 2024" },
  { name: "Deep Blue Tackle", owner: "Tony Russo", email: "tony@deepblue.com", products: 19, status: "Pending", joined: "Mar 2024" },
  { name: "Reel Masters", owner: "Lisa Park", email: "lisa@reelmasters.com", products: 64, status: "Approved", joined: "Apr 2024" },
  { name: "AquaSports Gear", owner: "James Tan", email: "james@aquasports.com", products: 7, status: "Suspended", joined: "May 2024" },
];

const statusStyles = {
  Approved: "bg-sky-400/10 text-sky-400",
  Pending: "bg-yellow-400/10 text-yellow-400",
  Suspended: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",
};

const SellersManagement = () => {
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
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Sellers Management</h1>
      </div>

      <div 
        className="relative max-w-sm transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
        <input
          className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 shadow-sm transition-colors"
          placeholder="Search sellers..."
        />
      </div>

      {/* Desktop Table Wrapper */}
      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-[#001526] border-b border-white/10">
            <tr>
              {["Store Name", "Owner", "Products", "Status", "Joined", ""].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s.email} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group">
                <td className="px-6 py-4">
                  <p className="text-[#cee5ff] font-medium group-hover:text-white transition-colors">{s.name}</p>
                  <p className="text-[#a3cbf2]/40 text-xs">{s.email}</p>
                </td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{s.owner}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{s.products} items</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[s.status] ?? ""}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#a3cbf2]/40">{s.joined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards Wrapper */}
      <div 
        className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        {sellers.map((s) => (
          <div key={s.email} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[#cee5ff] font-semibold text-sm">{s.name}</p>
                <p className="text-[#a3cbf2]/40 text-xs mt-0.5">{s.email}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[s.status] ?? ""}`}>
                {s.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#a3cbf2]/40 mt-4 bg-[#001526] p-3 rounded-xl border border-white/5">
              <span className="font-medium text-[#cee5ff]">{s.owner}</span>
              <span>• {s.products} items</span>
              <span>• {s.joined}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellersManagement;