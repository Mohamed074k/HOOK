import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Fish, MapPin, AlertTriangle, PenTool } from "lucide-react";
import { createPortal } from "react-dom";

const getSeasonStatus = (start, end) => {
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);
  if (now < s) return { text: "Upcoming", class: "bg-sky-400/10 text-sky-400" };
  if (now >= s && now <= e) return { text: "Active Now", class: "bg-rose-400/10 text-rose-400" };
  return { text: "Expired", class: "bg-white/10 text-[#a3cbf2]/40" };
};

const SeasonDetailsModal = ({ isOpen, onClose, season }) => {
  if (!season) return null;

  const status = getSeasonStatus(season.start_date, season.end_date);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#002238] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <h3 className="text-lg font-bold text-[#cee5ff] flex items-center gap-2">
                <CalendarDays size={18} className="text-sky-400" /> Season Details
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar">
              <div>
                <h4 className="text-xl font-bold text-[#cee5ff]">{season.season_name}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.class}`}>
                    {status.text}
                  </span>
                  {season.is_strictly_enforced && (
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Strictly Enforced
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#001526] p-4 rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Start Date</p>
                  <p className="text-[#cee5ff] font-medium">{new Date(season.start_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-[#001526] p-4 rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">End Date</p>
                  <p className="text-[#cee5ff] font-medium">{new Date(season.end_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-sky-500/5 p-4 rounded-xl border border-sky-500/10 space-y-1">
                <p className="text-sky-400/60 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin size={12}/> Region
                </p>
                <p className="text-sky-200 text-sm">{season.region || "Not specified"}</p>
              </div>

              {season.reason && (
                <div className="bg-[#001526] p-4 rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle size={12}/> Reason
                  </p>
                  <p className="text-[#cee5ff]/80 text-sm leading-relaxed">{season.reason}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#001526] p-4 rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Fish size={12} /> Restricted Species
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {season.restricted_fish_species?.length > 0 ? (
                      season.restricted_fish_species.map((species, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 text-[#cee5ff] text-xs rounded-md border border-white/10">{species}</span>
                      ))
                    ) : (
                      <span className="text-[#a3cbf2]/50 text-xs">None specified</span>
                    )}
                  </div>
                </div>

                <div className="bg-[#001526] p-4 rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                    <PenTool size={12} /> Banned Tools
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {season.banned_tools?.length > 0 ? (
                      season.banned_tools.map((tool, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 text-[#cee5ff] text-xs rounded-md border border-white/10">{tool}</span>
                      ))
                    ) : (
                      <span className="text-[#a3cbf2]/50 text-xs">None specified</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-5 border-t border-white/10 shrink-0">
              <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg transition-all">
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SeasonDetailsModal;