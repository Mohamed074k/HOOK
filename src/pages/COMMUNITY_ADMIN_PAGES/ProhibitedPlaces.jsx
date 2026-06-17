import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Plus, FileJson, MapPin, Calendar, Trash2, Edit2, Loader2 } from "lucide-react";
import { useProhibitedLocations } from "../../context/COMMUNITY_ADMIN_CONTEXT/ProhibitedLocationsContext";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

// Import the extracted components
import LocationDetailsModal from "../../components/COMMUNITY_ADMIN_COMPONENTS/Modals/LocationDetailsModal";
import LocationFormModal from "../../components/COMMUNITY_ADMIN_COMPONENTS/Modals/LocationFormModal";

// --- Reusable Confirm Modal (Using Portal) ---
const ConfirmModal = ({ isOpen, title, text, onConfirm, onCancel, confirmText = "Confirm", isDanger = false }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-[#cee5ff] mb-2">{title}</h3>
            <p className="text-sm text-[#a3cbf2]/70 mb-6">{text}</p>
            <div className="flex gap-3">
              <motion.button onClick={onCancel} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] text-[#a3cbf2] hover:bg-white/[0.08] transition-colors">
                Cancel
              </motion.button>
              <motion.button onClick={onConfirm} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${isDanger ? 'bg-rose-400/15 text-rose-300 hover:bg-rose-400/25 border border-rose-400/30' : 'bg-sky-400 text-[#001526] hover:bg-sky-300'}`}>
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const ProhibitedPlaces = () => {
  const { locations, loading, actionLoading, fetchLocations, createLocation, editLocation, removeLocation, bulkUpload } = useProhibitedLocations();
  
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);

  // Modals state
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, title: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchLocations();
    return () => clearTimeout(timer);
  }, [fetchLocations]);

  useEffect(() => {
    if (isDetailsVisible || isFormVisible || isUploadVisible || confirmModal.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDetailsVisible, isFormVisible, isUploadVisible, confirmModal.isOpen]);

  const filteredLocations = locations.filter(loc => 
    loc.name?.toLowerCase().includes(search.toLowerCase()) ||
    loc.reason?.toLowerCase().includes(search.toLowerCase())
  );

  const openDetails = (location) => {
    setSelectedLocation(location);
    setIsDetailsVisible(true);
  };

  const openForm = (location = null) => {
    setSelectedLocation(location);
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (payload) => {
    const success = selectedLocation 
      ? await editLocation(selectedLocation.id, payload)
      : await createLocation(payload);

    if (success) setIsFormVisible(false);
  };

  const handleDelete = async () => {
    const success = await removeLocation(confirmModal.id);
    if (success) setConfirmModal({ isOpen: false, id: null, title: "" });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/json") {
      toast.error("Please upload a valid JSON file");
      return;
    }
    const success = await bulkUpload(file);
    if (success) setIsUploadVisible(false);
  };

  if (loading && locations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff] flex items-center gap-3">
            <MapPin className="text-sky-400" /> Prohibited Places
          </h1>
          <p className="text-[#a3cbf2]/50 text-sm mt-1">Manage areas where fishing is restricted</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsUploadVisible(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#002238] border border-white/5 text-[#a3cbf2] hover:text-[#cee5ff] hover:border-sky-400/30 transition-all text-sm font-medium"
          >
            <FileJson size={16} /> Bulk Upload
          </button>
          <button
            onClick={() => openForm()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 transition-all text-sm font-bold"
          >
            <Plus size={16} /> Add Location
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div 
        className="relative max-w-sm transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 shadow-sm transition-colors"
          placeholder="Search locations or reasons..."
        />
      </div>

      {/* Desktop Table View */}
      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#001526] border-b border-white/10">
              <tr>
                {["Location Name", "Reason", "Coordinates", "Duration", "Status", "Actions"].map((h) => (
                  <th key={h} className={`text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider ${h==='Actions' && 'text-right'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#a3cbf2]/40">No locations found</td>
                </tr>
              ) : (
                filteredLocations.map((loc) => (
                  <tr key={loc.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200">
                    <td className="px-6 py-4 text-[#cee5ff] font-medium">{loc.name}</td>
                    <td className="px-6 py-4 text-[#a3cbf2]/60 max-w-[200px] truncate" title={loc.reason}>{loc.reason}</td>
                    <td className="px-6 py-4 text-[#a3cbf2]/60 font-mono text-xs">
                      {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-[#a3cbf2]/60 whitespace-nowrap text-xs">
                      {new Date(loc.startDate).toLocaleDateString()} - <br/>
                      {new Date(loc.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${loc.isActive ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'}`}>
                        {loc.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openDetails(loc)} className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all" title="View Details">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openForm(loc)} className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setConfirmModal({ isOpen: true, id: loc.id, title: loc.name })} className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div 
        className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        {filteredLocations.map((loc) => (
          <div key={loc.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[#cee5ff] font-bold text-base pr-2">{loc.name}</h3>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${loc.isActive ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'}`}>
                {loc.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-[#a3cbf2]/60 text-xs mb-3 line-clamp-2">{loc.reason}</p>
            
            <div className="flex items-center gap-4 text-[#a3cbf2]/40 text-xs mb-4">
              <span className="flex items-center gap-1"><MapPin size={12}/> {loc.latitude.toFixed(2)}, {loc.longitude.toFixed(2)}</span>
              <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(loc.endDate).getFullYear()}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3">
              <button onClick={() => openDetails(loc)} className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-sky-500/10 text-sky-400 text-xs font-medium">
                <Eye size={14}/> View
              </button>
              <button onClick={() => openForm(loc)} className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-medium">
                <Edit2 size={14}/> Edit
              </button>
              <button onClick={() => setConfirmModal({ isOpen: true, id: loc.id, title: loc.name })} className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-medium">
                <Trash2 size={14}/> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Extracted Modals */}
      <LocationDetailsModal
        isOpen={isDetailsVisible}
        onClose={() => setIsDetailsVisible(false)}
        location={selectedLocation}
      />

      <LocationFormModal
        isOpen={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        locationToEdit={selectedLocation}
        onSubmit={handleFormSubmit}
        actionLoading={actionLoading}
      />

      {/* FIXED: Bulk Upload JSON Modal (Wrapped in createPortal) */}
      {createPortal(
        <AnimatePresence>
          {isUploadVisible && (
            <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#002238] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col"
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
                    <FileJson size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-[#cee5ff] mb-2">Upload Locations</h3>
                  <p className="text-sm text-[#a3cbf2]/60 mb-6">Upload a JSON file containing an array of location objects to import them in bulk.</p>
                  
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-[#001526] text-sky-400 rounded-xl border border-dashed border-sky-400/30 cursor-pointer hover:bg-sky-400/5 hover:border-sky-400/50 transition-all">
                    <span className="text-sm font-medium">Select JSON File</span>
                    <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} disabled={actionLoading} />
                  </label>
                </div>
                
                <div className="p-5 border-t border-white/10 shrink-0 flex gap-3">
                  <button onClick={() => setIsUploadVisible(false)} disabled={actionLoading} className="w-full py-2.5 rounded-xl text-sm font-bold text-[#a3cbf2] bg-white/[0.02] hover:bg-white/[0.05] transition-all">Cancel</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Location"
        text={`Are you sure you want to delete "${confirmModal.title}"? This will remove the restriction from the map.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: null, title: "" })}
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
};

export default ProhibitedPlaces;