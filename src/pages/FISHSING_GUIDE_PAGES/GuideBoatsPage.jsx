import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Users, Ship, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import BoatWizard from "../../components/FISHING_GUIDE_COMPONENTS/BoatWizard";
import BoatDetails from "../../components/FISHING_GUIDE_COMPONENTS/BoatDetails";

const INITIAL_BOATS = [
  {
    id: "1",
    name: "Sea Hunter",
    capacity: 6,
    description: "A powerful sport fishing vessel equipped with the latest technology. Perfect for deep sea adventures.",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    ],
    tripsCount: 3,
    status: "Active",
  },
  {
    id: "2",
    name: "Flat Master",
    capacity: 4,
    description: "Shallow draft boat ideal for coastal fly fishing and flats fishing.",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    ],
    tripsCount: 2,
    status: "Active",
  },
  {
    id: "3",
    name: "Sunset Dream",
    capacity: 8,
    description: "Spacious cruiser perfect for sunset charters and group excursions.",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    ],
    tripsCount: 1,
    status: "Active",
  },
  {
    id: "4",
    name: "North Star",
    capacity: 4,
    description: "Luxury boat for dolphin tours in Marsa Alam.",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    ],
    tripsCount: 4,
    status: "Draft",
  },
  {
    id: "5",
    name: "Coral Explorer",
    capacity: 10,
    description: "Large boat for snorkeling and coral reef exploration.",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    ],
    tripsCount: 5,
    status: "Active",
  },
];

const statusConfig = {
  Active: { label: "Active", bg: "bg-sky-400/10", text: "text-sky-400" },
  Draft: { label: "Draft", bg: "bg-[#a3cbf2]/10", text: "text-[#a3cbf2]/50" },
};

const GuideBoatsPage = () => {
  const [boats, setBoats] = useState(INITIAL_BOATS);
  const [view, setView] = useState("list");
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50); 
    return () => clearTimeout(timer);
  }, []);

  const openAdd = () => {
    setSelectedBoat(null);
    setView("wizard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (boat) => {
    setSelectedBoat(boat);
    setView("wizard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDetails = (boat) => {
    setSelectedBoat(boat);
    setView("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeWizard = () => {
    setView("list");
    setSelectedBoat(null);
  };

  const handleSave = (formData) => {
    if (selectedBoat) {
      setBoats(prev => prev.map(b => 
        b.id === selectedBoat.id 
          ? { ...b, ...formData, status: b.status }
          : b
      ));
    } else {
      const newBoat = {
        ...formData,
        id: String(Date.now()),
        tripsCount: 0,
        status: "Active",
      };
      setBoats(prev => [...prev, newBoat]);
    }
    closeWizard();
  };

  const toggleStatus = (id) => {
    setBoats(prev => prev.map(b =>
      b.id === id ? { ...b, status: b.status === "Active" ? "Draft" : "Active" } : b
    ));
  };

  const confirmDelete = (id) => setDeleteId(id);
  const doDelete = () => {
    setBoats(prev => prev.filter(b => b.id !== deleteId));
    setDeleteId(null);
  };

  if (view === "wizard") {
    return <BoatWizard boat={selectedBoat} onClose={closeWizard} onSave={handleSave} />;
  }

  if (view === "details" && selectedBoat) {
    return <BoatDetails boat={selectedBoat} onClose={closeWizard} onEdit={openEdit} animate={animate} />;
  }

  // Boats List View
  return (
    <div className="space-y-6">
      {/* Header with animation */}
      <div className={`transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">My Boats</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">
              {boats.length} boats total · {boats.filter(b => b.status === "Active").length} active
            </p>
          </div>
          <button
            onClick={openAdd}
            className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" /> 
              Add New Boat
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>

      {/* Boats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {boats.map((boat, idx) => {
          const sc = statusConfig[boat.status];
          return (
            <div
              key={boat.id}
              className={`group bg-[#002238] border border-white/5 rounded-2xl overflow-hidden hover:border-sky-400/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-400/5 ring-1 ring-transparent hover:ring-sky-400/10 transition-all duration-300 transform transition-all duration-700 ease-out`}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              {/* Image Gallery Preview */}
              <div className="h-40 bg-gradient-to-br from-sky-900 to-[#001526] relative overflow-hidden">
                {boat.images[0] ? (
                  <img src={boat.images[0]} alt={boat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Ship size={40} className="text-[#a3cbf2]/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#002238] via-transparent to-transparent opacity-60" />
                {/* Status badge */}
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${sc.bg} ${sc.text} backdrop-blur-sm z-10`}>
                  {sc.label}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-[#cee5ff] font-bold text-base group-hover:text-white transition-colors">
                  {boat.name}
                </h3>
                
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-[#a3cbf2]/50">
                  <span className="flex items-center gap-1"><Users size={11} /> {boat.capacity} persons</span>
                  <span className="flex items-center gap-1"><Ship size={11} /> {boat.tripsCount} trips</span>
                </div>

                {/* Actions - Like trips page */}
                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={() => toggleStatus(boat.id)}
                    title={`Mark as ${boat.status === "Active" ? "Draft" : "Active"}`}
                    className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all duration-200"
                  >
                    {boat.status === "Active" ? <ToggleRight size={18} className="text-sky-400" /> : <ToggleLeft size={18} />}
                  </button>
                  <button
                    onClick={() => openDetails(boat)}
                    className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all duration-200"
                    title="View Details"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => openEdit(boat)}
                    className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-[#cee5ff] hover:bg-white/5 transition-all duration-200"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => confirmDelete(boat.id)}
                    className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Card with matched styling from GuideTripsPage */}
        <button
          onClick={openAdd}
          className={`min-h-[280px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 text-[#a3cbf2]/30 hover:border-sky-400/30 hover:text-sky-400/60 hover:bg-sky-400/5 transition-all duration-300 group transform transition-all duration-700 ease-out`}
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(30px)",
            transitionDelay: `${boats.length * 100}ms`,
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-sky-400/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
          </div>
          <span className="text-sm font-medium">Create New Boat</span>
          <span className="text-xs text-[#a3cbf2]/20 group-hover:text-[#a3cbf2]/40 transition-colors">Click to start</span>
        </button>
      </div>

      {/* Empty State */}
      {boats.length === 0 && (
        <div className="col-span-full bg-[#002238] border border-white/5 rounded-2xl p-12 text-center">
          <Ship size={48} className="mx-auto text-[#a3cbf2]/20 mb-4" />
          <p className="text-[#a3cbf2]/30 text-sm mb-4">No boats yet</p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-400 transition-all"
          >
            <Plus size={16} /> Add Your First Boat
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[#cee5ff] font-bold text-lg mb-2">Delete Boat?</h3>
            <p className="text-[#a3cbf2]/60 text-sm mb-6">
              This will permanently remove the boat and all its data. Trips using this boat may be affected.
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

      {/* Add animation keyframes matched from GuideTripsPage */}
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

export default GuideBoatsPage;