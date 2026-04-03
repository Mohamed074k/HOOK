import { useState, useEffect } from "react";
import { Search, Eye, Trash2, X } from "lucide-react";

const initialBoats = [
  { id: "1", name: "Sea Hunter", owner: "Mohamed Elsayed", capacity: 6, tripsCount: 34 },
  { id: "2", name: "Flat Master", owner: "Ahmed Hafez", capacity: 4, tripsCount: 21 },
  { id: "3", name: "Sunset Dream", owner: "Omar Elzun", capacity: 8, tripsCount: 15 },
  { id: "4", name: "North Star", owner: "Ahmed Mohamed", capacity: 4, tripsCount: 48 },
];

const BoatsManagement = () => {
  const [boats, setBoats] = useState(initialBoats);
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);

  // Modal Animation States
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Prevent scrolling when ANY modal is open
  useEffect(() => {
    if (isDetailsVisible || isDeleteVisible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isDetailsVisible, isDeleteVisible]);

  const filteredBoats = boats.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.owner.toLowerCase().includes(search.toLowerCase())
  );

  const openDetails = (boat) => {
    setSelectedBoat(boat);
    setTimeout(() => setIsDetailsVisible(true), 10);
  };
  const closeDetails = () => {
    setIsDetailsVisible(false);
    setTimeout(() => setSelectedBoat(null), 300);
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setTimeout(() => setIsDeleteVisible(true), 10);
  };
  const closeDelete = () => {
    setIsDeleteVisible(false);
    setTimeout(() => setDeleteId(null), 300);
  };

  const doDelete = () => {
    setBoats(boats.filter(b => b.id !== deleteId));
    closeDelete();
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div 
        className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Boats Management</h1>
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
          placeholder="Search boats by name or owner..."
        />
      </div>

      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-[#001526] border-b border-white/10">
            <tr>
              {["Boat Name", "Owner (Trip Manager)", "Capacity", "Trips Count", ""].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBoats.map((boat) => (
              <tr key={boat.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group">
                <td className="px-6 py-4 text-[#cee5ff] font-medium group-hover:text-white transition-colors">{boat.name}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{boat.owner}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{boat.capacity} persons</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{boat.tripsCount} trips</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openDetails(boat)} className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => openDelete(boat.id)} className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div 
        className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        {filteredBoats.map((boat) => (
          <div key={boat.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[#cee5ff] font-semibold text-sm">{boat.name}</p>
              <span className="text-[#a3cbf2]/60 text-xs">{boat.capacity} persons</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#a3cbf2]/40 mt-3 bg-[#001526] p-3 rounded-xl border border-white/5">
              <span className="font-medium text-[#cee5ff]">{boat.owner}</span>
              <span>• {boat.tripsCount} trips</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => openDetails(boat)} className="flex-1 flex justify-center p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all border border-white/5">
                <Eye size={14} />
              </button>
              <button onClick={() => openDelete(boat.id)} className="flex-1 flex justify-center p-2 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all border border-white/5">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Boat Details Modal */}
      {selectedBoat && (
        <div 
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isDetailsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={closeDetails}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl transition-all duration-300 transform ${isDetailsVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#cee5ff] font-bold text-lg">Boat Details</h3>
              <button onClick={closeDetails} className="text-[#a3cbf2]/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 bg-[#001526] p-5 rounded-xl border border-white/5">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Boat Name</span>
                <span className="text-[#cee5ff] font-medium">{selectedBoat.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Owner</span>
                <span className="text-[#cee5ff] font-medium">{selectedBoat.owner}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Capacity</span>
                <span className="text-[#cee5ff] font-medium">{selectedBoat.capacity} persons</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Total Trips</span>
                <span className="text-sky-400 font-bold">{selectedBoat.tripsCount} trips</span>
              </div>
            </div>
            <button onClick={closeDetails} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300">
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div 
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isDeleteVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={closeDelete}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transition-all duration-300 transform ${isDeleteVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#cee5ff] font-bold text-lg mb-2">Delete Boat?</h3>
            <p className="text-[#a3cbf2]/60 text-sm mb-6">This action cannot be undone. Trips using this boat will be affected.</p>
            <div className="flex gap-3">
              <button onClick={closeDelete} className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Cancel</button>
              <button onClick={doDelete} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoatsManagement;