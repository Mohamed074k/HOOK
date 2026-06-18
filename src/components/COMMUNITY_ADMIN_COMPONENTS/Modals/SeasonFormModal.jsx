import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";

const SeasonFormModal = ({ isOpen, onClose, seasonToEdit, onSubmit, actionLoading }) => {
  const [formData, setFormData] = useState({
    species: "", description: "", startDate: "", endDate: ""
  });

  useEffect(() => {
    if (isOpen) {
      if (seasonToEdit) {
        const formatForInput = (dateString) => dateString ? new Date(dateString).toISOString().slice(0, 16) : "";
        setFormData({
          species: seasonToEdit.species || "",
          description: seasonToEdit.description || "",
          startDate: formatForInput(seasonToEdit.startDate),
          endDate: formatForInput(seasonToEdit.endDate)
        });
      } else {
        setFormData({ species: "", description: "", startDate: "", endDate: "" });
      }
    }
  }, [isOpen, seasonToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#002238] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <h3 className="text-lg font-bold text-[#cee5ff]">{seasonToEdit ? "Edit Season" : "Add New Season"}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 custom-scrollbar">
              <div className="space-y-1">
                <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Species Name *</label>
                <input required value={formData.species} onChange={e=>setFormData({...formData, species: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50" placeholder="e.g., Red Sea Grouper" />
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
                <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Description</label>
                <textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 h-24 resize-none" placeholder="Provide context about why this season is restricted..." />
              </div>
            </form>

            <div className="p-5 border-t border-white/10 shrink-0 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#a3cbf2] bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={actionLoading} className="flex-1 py-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 text-sm font-bold transition-all disabled:opacity-50 flex justify-center items-center">
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : "Save Season"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SeasonFormModal;