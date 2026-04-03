import { useState, useEffect } from "react";
import { Plus, MapPin, Clock, Users, ToggleLeft, ToggleRight, Pencil, Trash2, Compass, Fish, Waves, Umbrella } from "lucide-react";
import TripWizard from "../../components/FISHING_GUIDE_COMPONENTS/TripWizard";

const INITIAL_TRIPS = [
  {
    id: "1",
    title: "Alexandria Deep Sea Expedition",
    locationName: "Alexandria Eastern Harbor",
    price: 450,
    boatName: "Sea Hunter",
    capacity: 6,
    status: "Active",
    coverPreview: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop",
    options: ["guided", "equipment"],
  },
  {
    id: "2",
    title: "Red Sea Coral Reef Adventure",
    locationName: "Hurghada Marina",
    price: 220,
    boatName: "Flat Master",
    capacity: 4,
    status: "Active",
    coverPreview: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop",
    options: ["equipment", "snorkeling"],
  },
  {
    id: "3",
    title: "Nile Sunset Fishing Trip",
    locationName: "Luxor West Bank",
    price: 180,
    boatName: "Sunset Dream",
    capacity: 8,
    status: "Active",
    coverPreview: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop",
    options: ["guided"],
  },
  {
    id: "4",
    title: "Marsa Alam Dolphin Tour",
    locationName: "Marsa Alam Port",
    price: 900,
    boatName: "North Star",
    capacity: 4,
    status: "Draft",
    coverPreview: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop",
    options: ["guided", "equipment"],
  },
  {
    id: "5",
    title: "Sharm El Sheikh Snorkeling Safari",
    locationName: "Naama Bay",
    price: 350,
    boatName: "Coral Explorer",
    capacity: 10,
    status: "Active",
    coverPreview: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop",
    options: ["equipment", "snorkeling"],
  },
  {
    id: "6",
    title: "Dahab Blue Hole Experience",
    locationName: "Dahab Lagoon",
    price: 280,
    boatName: "Blue Magic",
    capacity: 6,
    status: "Active",
    coverPreview: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop",
    options: ["guided", "equipment", "snorkeling"],
  },
];

const statusConfig = {
  Active: { label: "Active", bg: "bg-sky-400/10", text: "text-sky-400" },
  Draft: { label: "Draft", bg: "bg-[#a3cbf2]/10", text: "text-[#a3cbf2]/50" },
};

const optionIcons = {
  guided: { icon: Compass, label: "Guided" },
  equipment: { icon: Fish, label: "Equipment" },
  snorkeling: { icon: Waves, label: "Snorkeling" },
};

const GuideTripsPage = () => {
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [view, setView] = useState("list");
  const [editingTrip, setEditingTrip] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const openCreate = () => { 
    setEditingTrip(null); 
    setView("wizard");
    window.scrollTo(0, 0);
  };
  
  const openEdit = (trip) => { 
    setEditingTrip(trip); 
    setView("wizard");
    window.scrollTo(0, 0);
  };
  
  const closeWizard = () => { 
    setView("list"); 
    setEditingTrip(null);
    window.scrollTo(0, 0);
  };

  const handleSave = (formData) => {
    if (editingTrip) {
      setTrips(prev => prev.map(t => t.id === editingTrip.id ? { ...t, ...formData } : t));
    } else {
      const newTrip = {
        ...formData,
        id: String(Date.now()),
        status: formData.status || "Active",
      };
      setTrips(prev => [...prev, newTrip]);
    }
    closeWizard();
  };

  const toggleStatus = (id) => {
    setTrips(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === "Active" ? "Draft" : "Active" } : t
    ));
  };

  const confirmDelete = (id) => { setDeleteId(id); };
  const doDelete = () => { setTrips(prev => prev.filter(t => t.id !== deleteId)); setDeleteId(null); };

  if (view === "wizard") {
    return <TripWizard trip={editingTrip} onClose={closeWizard} onSave={handleSave} />;
  }

  return (
    <div className="space-y-6">
      {/* Header with animation - same as dashboard */}
      <div className={`transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">My Trips</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">
              {trips.length} trips total · {trips.filter(t => t.status === "Active").length} active
            </p>
          </div>
          <button
            onClick={openCreate}
            className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" /> 
              Add New Trip
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>

      {/* Trip Grid with staggered animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {trips.map((t, idx) => {
          const sc = statusConfig[t.status];
          return (
            <div
              key={t.id}
              className={`group bg-[#002238] border border-white/5 rounded-2xl overflow-hidden hover:border-sky-400/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-400/5 ring-1 ring-transparent hover:ring-sky-400/10 transition-all duration-300 transform transition-all duration-700 ease-out`}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              {/* Cover */}
              <div className="h-32 relative overflow-hidden bg-gradient-to-br from-sky-900 to-[#001526]">
                <img 
                  src={t.coverPreview} 
                  alt={t.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002238] via-transparent to-transparent opacity-60" />
                {/* Status badge */}
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${sc.bg} ${sc.text} backdrop-blur-sm z-10`}>
                  {sc.label}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-[#cee5ff] font-bold text-base group-hover:text-white transition-colors line-clamp-1">
                  {t.title}
                </h3>
                
                {/* Location Name */}
                <p className="text-[#a3cbf2]/40 text-xs mt-0.5 flex items-center gap-1">
                  <MapPin size={10} /> {t.locationName || "Location not set"}
                </p>

                {/* Options Icons */}
                {t.options && t.options.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {t.options.map(opt => {
                      const OptIcon = optionIcons[opt]?.icon;
                      return OptIcon ? (
                        <span key={opt} className="text-[#a3cbf2]/30 hover:text-sky-400 transition-colors" title={optionIcons[opt]?.label}>
                          <OptIcon size={12} />
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-3 text-xs text-[#a3cbf2]/50">
                  <span className="flex items-center gap-1"><Users size={11} /> {t.capacity} max</span>
                  <span className="flex items-center gap-1"><Compass size={11} /> {t.boatName || "No boat"}</span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <div>
                    <span className="text-sky-400 font-black text-lg">${t.price}</span>
                    <span className="text-[#a3cbf2]/30 text-xs font-normal">/person</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStatus(t.id)}
                      title={`Mark as ${t.status === "Active" ? "Draft" : "Active"}`}
                      className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all duration-200"
                    >
                      {t.status === "Active" ? <ToggleRight size={18} className="text-sky-400" /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => openEdit(t)}
                      className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-[#cee5ff] hover:bg-white/5 transition-all duration-200"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => confirmDelete(t.id)}
                      className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Card with animation */}
        <button
          onClick={openCreate}
          className={`min-h-[280px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 text-[#a3cbf2]/30 hover:border-sky-400/30 hover:text-sky-400/60 hover:bg-sky-400/5 transition-all duration-300 group transform transition-all duration-700 ease-out`}
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(30px)",
            transitionDelay: `${trips.length * 100}ms`,
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-sky-400/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
          </div>
          <span className="text-sm font-medium">Create New Trip</span>
          <span className="text-xs text-[#a3cbf2]/20 group-hover:text-[#a3cbf2]/40 transition-colors">Click to start</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[#cee5ff] font-bold text-lg mb-2">Delete Trip?</h3>
            <p className="text-[#a3cbf2]/60 text-sm mb-6">
              This will permanently remove the trip and all its data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add animation keyframes for slideIn effect */}
      <style>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default GuideTripsPage;