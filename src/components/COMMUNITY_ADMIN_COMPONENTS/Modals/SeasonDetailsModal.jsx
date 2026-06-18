import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Fish, CalendarRange } from "lucide-react";
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

  const status = getSeasonStatus(season.startDate, season.endDate);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#002238] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold text-[#cee5ff] flex items-center gap-2">
                <CalendarDays size={18} className="text-sky-400" /> Season Details
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              <div>
                <h4 className="text-xl font-bold text-[#cee5ff] flex items-center gap-2">
                  <Fish size={20} className="text-[#a3cbf2]/60"/> {season.species}
                </h4>
                <span className={`mt-2 inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.class}`}>
                  {status.text}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#001526] p-4 rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Start Date</p>
                  <p className="text-[#cee5ff] font-medium">{new Date(season.startDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-[#001526] p-4 rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">End Date</p>
                  <p className="text-[#cee5ff] font-medium">{new Date(season.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              {season.description && (
                <div className="bg-[#001526] p-4 rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Description</p>
                  <p className="text-[#cee5ff]/80 text-sm leading-relaxed">{season.description}</p>
                </div>
              )}
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