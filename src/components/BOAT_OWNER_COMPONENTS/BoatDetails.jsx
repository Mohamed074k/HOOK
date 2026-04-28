import { Pencil, X, Ship, Users, Info } from "lucide-react";

const BoatDetails = ({ boat, onClose, onEdit, animate }) => {
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `https://hook.runasp.net${url}`;
  };

  const allImages = boat.images || [];

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
          {allImages.length > 0 ? (
            allImages.map((img) => (
              <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-[#001526] relative">
                <img 
                  src={getImageUrl(img.imageUrl)} 
                  alt={boat.name} 
                  className="w-full h-full object-cover"
                />
                {img.isMainImage && (
                  <span className="absolute bottom-2 left-2 bg-sky-500/90 text-white text-[10px] px-2 py-0.5 rounded shadow uppercase font-bold tracking-wider">
                    Main Image
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 aspect-square rounded-xl bg-[#001526] flex items-center justify-center">
              <Ship size={48} className="text-[#a3cbf2]/20" />
            </div>
          )}
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
            <span className="text-[#cee5ff] font-medium flex items-center gap-2">
              <Users size={14} /> {boat.capacity} persons
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-[#a3cbf2]/50 text-sm">Owner</span>
            <span className="text-[#cee5ff] font-medium">{boat.ownerName || "You"}</span>
          </div>
          {boat.description && (
            <div className="py-2">
              <span className="text-[#a3cbf2]/50 text-sm block mb-2 flex items-center gap-2">
                <Info size={14} /> Description
              </span>
              <p className="text-[#cee5ff]/70 text-sm leading-relaxed">{boat.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoatDetails;