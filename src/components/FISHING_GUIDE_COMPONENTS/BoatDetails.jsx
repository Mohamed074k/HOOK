// components/FISHING_GUIDE_COMPONENTS/BoatDetails.jsx
import { Pencil, Eye, X, Ship, Users } from "lucide-react";

const statusConfig = {
  Active: { label: "Active", bg: "bg-sky-400/10", text: "text-sky-400" },
  Draft: { label: "Draft", bg: "bg-[#a3cbf2]/10", text: "text-[#a3cbf2]/50" },
};

const BoatDetails = ({ boat, onClose, onEdit, animate }) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className={`transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">{boat.name}</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">Boat Details</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(boat)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <Pencil size={15} /> Edit
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className={`bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <h2 className="text-sm font-bold text-[#cee5ff] mb-4">Gallery</h2>
        <div className="grid grid-cols-3 gap-3">
          {boat.images.map((img, idx) => (
            <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-[#001526]">
              {img ? (
                <img src={img} alt={`${boat.name} ${idx + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Ship size={24} className="text-[#a3cbf2]/20" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Boat Info */}
      <div className={`bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 delay-100 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
        <h2 className="text-sm font-bold text-[#cee5ff] mb-4">Specifications</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-[#a3cbf2]/50 text-sm">Boat Name</span>
            <span className="text-[#cee5ff] font-medium">{boat.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-[#a3cbf2]/50 text-sm">Capacity</span>
            <span className="text-[#cee5ff] font-medium">{boat.capacity} persons</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-[#a3cbf2]/50 text-sm">Status</span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusConfig[boat.status]?.bg} ${statusConfig[boat.status]?.text}`}>
              {statusConfig[boat.status]?.label}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-[#a3cbf2]/50 text-sm">Total Trips</span>
            <span className="text-[#cee5ff] font-medium">{boat.tripsCount} trips</span>
          </div>
          {boat.description && (
            <div className="py-2">
              <span className="text-[#a3cbf2]/50 text-sm block mb-2">Description</span>
              <p className="text-[#cee5ff]/70 text-sm leading-relaxed">{boat.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoatDetails;