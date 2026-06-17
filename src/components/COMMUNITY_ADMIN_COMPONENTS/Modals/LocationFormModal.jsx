import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, XCircle } from "lucide-react";
import { createPortal } from "react-dom";

const LocationFormModal = ({ isOpen, onClose, locationToEdit, onSubmit, actionLoading }) => {
  const [formData, setFormData] = useState({
    name: "", description: "", reason: "",
    latitude: "", longitude: "",
    startDate: "", endDate: "", isActive: true
  });

  useEffect(() => {
    if (isOpen) {
      if (locationToEdit) {
        const formatForInput = (dateString) => dateString ? new Date(dateString).toISOString().slice(0, 16) : "";
        setFormData({
          ...locationToEdit,
          startDate: formatForInput(locationToEdit.startDate),
          endDate: formatForInput(locationToEdit.endDate)
        });
      } else {
        setFormData({ name: "", description: "", reason: "", latitude: "", longitude: "", startDate: "", endDate: "", isActive: true });
      }
    }
  }, [isOpen, locationToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    };
    onSubmit(payload);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#002238] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <h3 className="text-lg font-bold text-[#cee5ff]">{locationToEdit ? "Edit Location" : "Add New Location"}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 custom-scrollbar">
              <div className="space-y-1">
                <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Location Name *</label>
                <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Latitude *</label>
                  <input type="number" step="any" required value={formData.latitude} onChange={e=>setFormData({...formData, latitude: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Longitude *</label>
                  <input type="number" step="any" required value={formData.longitude} onChange={e=>setFormData({...formData, longitude: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Start Date *</label>
                  <input type="datetime-local" required value={formData.startDate} onChange={e=>setFormData({...formData, startDate: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 [color-scheme:dark]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">End Date *</label>
                  <input type="datetime-local" required value={formData.endDate} onChange={e=>setFormData({...formData, endDate: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 [color-scheme:dark]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Reason *</label>
                <textarea required value={formData.reason} onChange={e=>setFormData({...formData, reason: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 h-20 resize-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Detailed Description</label>
                <textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 h-24 resize-none" />
              </div>

              {/* Enhanced Status Toggle */}
              <div className="space-y-2 pt-2">
                <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Enforcement Status</label>
                <div className="flex bg-[#001526] rounded-xl p-1.5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isActive: true})}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                      formData.isActive 
                        ? 'bg-emerald-500/15 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.2)]' 
                        : 'text-[#a3cbf2]/50 hover:text-[#cee5ff] hover:bg-white/5'
                    }`}
                  >
                    <CheckCircle size={16} /> Active Restriction
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isActive: false})}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                      !formData.isActive 
                        ? 'bg-rose-500/15 text-rose-400 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.2)]' 
                        : 'text-[#a3cbf2]/50 hover:text-[#cee5ff] hover:bg-white/5'
                    }`}
                  >
                    <XCircle size={16} /> Inactive
                  </button>
                </div>
                <p className="text-[#a3cbf2]/40 text-xs mt-1">Active locations will immediately be restricted on the user map.</p>
              </div>
            </form>

            <div className="p-5 border-t border-white/10 shrink-0 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#a3cbf2] bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={actionLoading} className="flex-1 py-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 text-sm font-bold transition-all disabled:opacity-50 flex justify-center items-center">
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : "Save Location"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LocationFormModal;