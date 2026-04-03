import { useState, useEffect } from "react";
import { Search, Eye, Power, Trash2, X } from "lucide-react";

const initialTrips = [
  { id: "1", name: "Deep Sea Adventure", manager: "Carlos Rivera", boat: "Sea Hunter", location: "Gulf of Mexico", price: 450, status: "Active" },
  { id: "2", name: "Coastal Fly Fishing", manager: "Yuki Tanaka", boat: "Flat Master", location: "Key Biscayne", price: 220, status: "Active" },
  { id: "3", name: "Sunset Charter", manager: "Omar Hassan", boat: "Sunset Dream", location: "Miami Beach", price: 180, status: "Disabled" },
  { id: "4", name: "North Shore Expedition", manager: "Freya Johansson", boat: "North Star", location: "Montauk", price: 900, status: "Active" },
];

const statusStyles = {
  Active: "bg-sky-400/10 text-sky-400",
  Disabled: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",
};

const TripsManagement = () => {
  const [trips, setTrips] = useState(initialTrips);
  const [search, setSearch] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const filteredTrips = trips.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.manager.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setTrips(trips.map(t => 
      t.id === id ? { ...t, status: t.status === "Active" ? "Disabled" : "Active" } : t
    ));
  };

  const confirmDelete = (id) => setDeleteId(id);
  const doDelete = () => {
    setTrips(trips.filter(t => t.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div 
        className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Trips Management</h1>
      </div>

      <div 
        className="relative max-w-sm transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 shadow-sm transition-colors"
          placeholder="Search trips by name or manager..."
        />
      </div>

      {/* Desktop Table Block */}
      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-[#001526] border-b border-white/10">
            <tr>
              {["Trip Name", "Trip Manager", "Boat Name", "Location", "Price", "Status", ""].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((trip) => (
              <tr key={trip.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                <td className="px-6 py-4 text-[#cee5ff] font-medium">{trip.name}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{trip.manager}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{trip.boat}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{trip.location}</td>
                <td className="px-6 py-4 text-sky-400 font-bold">${trip.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[trip.status]}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setSelectedTrip(trip)} className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => toggleStatus(trip.id)} className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all">
                      <Power size={16} />
                    </button>
                    <button onClick={() => confirmDelete(trip.id)} className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trip Details Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#cee5ff] font-bold text-lg">Trip Details</h3>
              <button onClick={() => setSelectedTrip(null)} className="text-[#a3cbf2]/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1 font-medium">Trip Name</p>
                  <p className="text-[#cee5ff] font-medium">{selectedTrip.name}</p>
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1 font-medium">Trip Manager</p>
                  <p className="text-[#cee5ff] font-medium">{selectedTrip.manager}</p>
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1 font-medium">Boat Name</p>
                  <p className="text-[#cee5ff] font-medium">{selectedTrip.boat}</p>
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1 font-medium">Location</p>
                  <p className="text-[#cee5ff] font-medium">{selectedTrip.location}</p>
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1 font-medium">Price per person</p>
                  <p className="text-sky-400 font-bold text-lg">${selectedTrip.price}</p>
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2 font-medium">Status</p>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusStyles[selectedTrip.status]}`}>
                    {selectedTrip.status}
                  </span>
                </div>
              </div>
            </div>
            
            <button onClick={() => setSelectedTrip(null)} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <h3 className="text-[#cee5ff] font-bold text-lg mb-2">Delete Trip?</h3>
            <p className="text-[#a3cbf2]/60 text-sm mb-6">This action cannot be undone. All associated bookings will be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">Cancel</button>
              <button onClick={doDelete} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsManagement;