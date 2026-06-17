import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Map, Calendar } from "lucide-react";
import { createPortal } from "react-dom";

const LocationDetailsModal = ({ isOpen, onClose, location }) => {
  if (!location) return null;

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
                <MapPin size={18} className="text-sky-400" /> Location Details
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              <div>
                <h4 className="text-xl font-bold text-[#cee5ff]">{location.name}</h4>
                <span className={`mt-2 inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${location.isActive ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'}`}>
                  {location.isActive ? 'Active Restriction' : 'Inactive Restriction'}
                </span>
              </div>
              
              <div className="bg-[#001526] p-4 rounded-xl border border-white/5 space-y-3">
                <div>
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Reason for Ban</p>
                  <p className="text-[#cee5ff] text-sm">{location.reason}</p>
                </div>
                {location.description && (
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Detailed Description</p>
                    <p className="text-[#cee5ff]/80 text-sm leading-relaxed">{location.description}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#001526] p-3 rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Map size={12}/> Coordinates
                  </p>
                  <p className="text-[#cee5ff] font-mono text-sm">{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=$${location.latitude},${location.longitude}`} target="_blank" rel="noreferrer" className="text-sky-400 text-xs hover:underline mt-1 inline-block">
                    View on Maps ↗
                  </a>
                </div>
                <div className="bg-[#001526] p-3 rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar size={12}/> Duration
                  </p>
                  <p className="text-[#cee5ff] text-xs leading-relaxed">
                    From: {new Date(location.startDate).toLocaleDateString()}<br/>
                    To: {new Date(location.endDate).toLocaleDateString()}
                  </p>
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

export default LocationDetailsModal;