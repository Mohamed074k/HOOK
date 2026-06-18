import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, XCircle } from "lucide-react";
import { createPortal } from "react-dom";

// Helper to format ISO strings for date inputs
const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  // Keeps the date and time format "YYYY-MM-DDTHH:mm" for datetime-local
  return isoString.includes('T') ? isoString.substring(0, 16) : isoString; 
};

const SeasonFormModal = ({ isOpen, onClose, seasonToEdit, onSubmit, actionLoading }) => {
  const [formData, setFormData] = useState({
    seasonName: "",
    startDate: "",
    endDate: "",
    region: "",
    reason: "",
    restrictedFishSpecies: "",
    bannedTools: "",
    isStrictlyEnforced: true
  });

  useEffect(() => {
    if (isOpen) {
      if (seasonToEdit) {
        // Map from backend GET (snake_case) to form state (camelCase)
        setFormData({
          seasonName: seasonToEdit.season_name || "",
          startDate: formatDateForInput(seasonToEdit.start_date),
          endDate: formatDateForInput(seasonToEdit.end_date),
          region: seasonToEdit.region || "",
          reason: seasonToEdit.reason || "",
          restrictedFishSpecies: Array.isArray(seasonToEdit.restricted_fish_species) 
            ? seasonToEdit.restricted_fish_species.join(", ") 
            : "",
          bannedTools: Array.isArray(seasonToEdit.banned_tools) 
            ? seasonToEdit.banned_tools.join(", ") 
            : "",
          isStrictlyEnforced: seasonToEdit.is_strictly_enforced !== undefined 
            ? seasonToEdit.is_strictly_enforced 
            : true
        });
      } else {
        // Reset to empty for Add New
        setFormData({
          seasonName: "", startDate: "", endDate: "", region: "", reason: "", 
          restrictedFishSpecies: "", bannedTools: "", isStrictlyEnforced: true
        });
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
            className="bg-[#002238] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <h3 className="text-lg font-bold text-[#cee5ff]">{seasonToEdit ? "Edit Season" : "Add New Season"}</h3>
              <button onClick={onClose} type="button" className="p-1.5 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 custom-scrollbar">
              
              <div className="space-y-1">
                <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Season Name *</label>
                <input required value={formData.seasonName} onChange={e=>setFormData({...formData, seasonName: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Start Date *</label>
                  <input type="datetime-local" required value={formData.startDate} onChange={e=>setFormData({...formData, startDate: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50" style={{ colorScheme: "dark" }} />
                </div>
                <div className="space-y-1">
                  <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">End Date *</label>
                  <input type="datetime-local" required value={formData.endDate} onChange={e=>setFormData({...formData, endDate: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50" style={{ colorScheme: "dark" }} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Region</label>
                <input value={formData.region} onChange={e=>setFormData({...formData, region: e.target.value})} placeholder="e.g. البحر الأحمر" className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Reason</label>
                <textarea value={formData.reason} onChange={e=>setFormData({...formData, reason: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 h-20 resize-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Restricted Species</label>
                  <input value={formData.restrictedFishSpecies} onChange={e=>setFormData({...formData, restrictedFishSpecies: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 placeholder:text-[#a3cbf2]/30" placeholder="Comma separated..." />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Banned Tools</label>
                  <input value={formData.bannedTools} onChange={e=>setFormData({...formData, bannedTools: e.target.value})} className="w-full bg-[#001526] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 placeholder:text-[#a3cbf2]/30" placeholder="Comma separated..." />
                </div>
              </div>

              {/* Enforcement Toggle */}
              <div className="space-y-2 pt-2">
                <label className="text-[#a3cbf2]/60 text-xs uppercase tracking-wider">Strictly Enforced?</label>
                <div className="flex bg-[#001526] rounded-xl p-1.5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isStrictlyEnforced: true})}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                      formData.isStrictlyEnforced 
                        ? 'bg-rose-500/15 text-rose-400 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.2)]' 
                        : 'text-[#a3cbf2]/50 hover:text-[#cee5ff] hover:bg-white/5'
                    }`}
                  >
                    <CheckCircle size={16} /> Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isStrictlyEnforced: false})}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                      !formData.isStrictlyEnforced 
                        ? 'bg-emerald-500/15 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.2)]' 
                        : 'text-[#a3cbf2]/50 hover:text-[#cee5ff] hover:bg-white/5'
                    }`}
                  >
                    <XCircle size={16} /> No
                  </button>
                </div>
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