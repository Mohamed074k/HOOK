// src/pages/ADMIN_PAGES/BoatsManagement.jsx
import { useState, useEffect } from "react";
import { Search, Eye, X, Loader2, Ship, User, Users } from "lucide-react";
import apiClient from "../../api/apiClient";
import { toast } from 'react-hot-toast';

const BoatsManagement = () => {
  const [boats, setBoats] = useState([]);
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchBoats();
    return () => clearTimeout(timer);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isDetailsVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDetailsVisible]);

  const fetchBoats = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/Boats/Admin/GetAll");
      setBoats(data);
    } catch (error) {
      console.error("Error fetching boats:", error);
      toast.error("Failed to load boats");
    } finally {
      setLoading(false);
    }
  };

  const fetchBoatDetails = async (id) => {
    try {
      const { data } = await apiClient.get(`/api/Boats/Admin-BoatOwner/${id}`);
      setSelectedBoat(data);
    } catch (error) {
      console.error("Error fetching boat details:", error);
      toast.error("Failed to load boat details");
    }
  };

  const openDetails = (boat) => {
    fetchBoatDetails(boat.id);
    setTimeout(() => setIsDetailsVisible(true), 10);
  };

  const closeDetails = () => {
    setIsDetailsVisible(false);
    setTimeout(() => setSelectedBoat(null), 300);
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `https://hook.runasp.net${url}`;
  };

  const filteredBoats = boats.filter(boat => 
    boat.name?.toLowerCase().includes(search.toLowerCase()) ||
    boat.ownerName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading boats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div 
        className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Boats Management</h1>
          <p className="text-[#a3cbf2]/50 text-sm mt-1">Manage and monitor all registered boats</p>
        </div>
        <div className="text-sm text-[#a3cbf2]/40 bg-[#002238] px-4 py-2 rounded-xl border border-white/5">
          Total: {filteredBoats.length} boats
        </div>
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

      {/* Desktop Table Block - Eye Icon */}
      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#001526] border-b border-white/10">
              <tr>
                {["Boat Name", "Owner", "Capacity", "Description", ""].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBoats.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#a3cbf2]/40">
                    No boats found
                  </td>
                </tr>
              ) : (
                filteredBoats.map((boat) => (
                  <tr key={boat.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {boat.mainImageUrl && (
                          <img 
                            src={getImageUrl(boat.mainImageUrl)} 
                            alt={boat.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <span className="text-[#cee5ff] font-medium group-hover:text-white transition-colors">
                          {boat.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#a3cbf2]/60">{boat.ownerName}</td>
                    <td className="px-6 py-4 text-[#a3cbf2]/60">{boat.capacity} persons</td>
                    <td className="px-6 py-4 text-[#a3cbf2]/60 max-w-xs truncate">
                      {boat.description || "No description"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openDetails(boat)} 
                        className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards - View Details Button */}
      <div 
        className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        {filteredBoats.length === 0 ? (
          <div className="bg-[#002238] border border-white/5 rounded-2xl p-8 text-center text-[#a3cbf2]/40">
            No boats found
          </div>
        ) : (
          filteredBoats.map((boat) => (
            <div key={boat.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
              <div className="flex items-start gap-3 mb-3">
                {boat.mainImageUrl && (
                  <img 
                    src={getImageUrl(boat.mainImageUrl)} 
                    alt={boat.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-[#cee5ff] font-semibold text-base">{boat.name}</p>
                  <p className="text-[#a3cbf2]/40 text-xs mt-1">by {boat.ownerName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs">
                  <Users size={12} className="text-sky-400" />
                  <span className="text-[#a3cbf2]/60">Capacity: {boat.capacity}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Ship size={12} className="text-sky-400" />
                  <span className="text-[#a3cbf2]/60">ID: {boat.id.slice(0, 8)}</span>
                </div>
              </div>
              
              {boat.description && (
                <div className="mt-2 p-2 bg-[#001526] rounded-lg border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs line-clamp-2">{boat.description}</p>
                </div>
              )}
              
              <div className="mt-3">
                <button 
                  onClick={() => openDetails(boat)} 
                  className="w-full py-2.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Eye size={14} />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Boat Details Modal */}
      {selectedBoat && (
        <div 
          className={`fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isDetailsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={closeDetails}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl max-w-2xl w-full shadow-2xl transition-all duration-300 transform ${isDetailsVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
              <h3 className="text-[#cee5ff] font-bold text-xl">Boat Details</h3>
              <button 
                onClick={closeDetails} 
                className="p-2 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Main Image */}
              {selectedBoat.mainImageUrl && (
                <div className="flex justify-center">
                  <img 
                    src={getImageUrl(selectedBoat.mainImageUrl)} 
                    alt={selectedBoat.name}
                    className="w-full max-w-md h-48 object-cover rounded-xl shadow-lg"
                  />
                </div>
              )}
              
              {/* Boat Info */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Ship size={16} className="text-sky-400" />
                      <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Boat Name</p>
                    </div>
                    <p className="text-[#cee5ff] font-medium text-lg">{selectedBoat.name}</p>
                  </div>
                  
                  <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={16} className="text-sky-400" />
                      <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Owner</p>
                    </div>
                    <p className="text-[#cee5ff] font-medium">{selectedBoat.ownerName}</p>
                  </div>
                  
                  <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-sky-400" />
                      <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Capacity</p>
                    </div>
                    <p className="text-[#cee5ff] font-medium">{selectedBoat.capacity} persons</p>
                  </div>
                  
                  <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Ship size={16} className="text-sky-400" />
                      <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Boat ID</p>
                    </div>
                    <p className="text-[#a3cbf2]/60 text-sm font-mono">{selectedBoat.id}</p>
                  </div>
                </div>
                
                {/* Description */}
                {selectedBoat.description && (
                  <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                    <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Description</p>
                    <p className="text-[#cee5ff] text-sm leading-relaxed">{selectedBoat.description}</p>
                  </div>
                )}
                
                {/* Additional Images */}
                {selectedBoat.images && selectedBoat.images.length > 1 && (
                  <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                    <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-3">Additional Images</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedBoat.images
                        .filter(img => !img.isMainImage)
                        .map((image, idx) => (
                          <img 
                            key={idx}
                            src={getImageUrl(image.imageUrl)} 
                            alt={`${selectedBoat.name} ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-white/5 hover:border-sky-400/40 transition-all"
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Close Button */}
            <div className="p-6 pt-0">
              <button 
                onClick={closeDetails} 
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoatsManagement;