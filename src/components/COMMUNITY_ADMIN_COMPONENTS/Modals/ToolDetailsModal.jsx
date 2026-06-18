import { motion, AnimatePresence } from "framer-motion";
import { X, PenTool, Scale, AlertTriangle } from "lucide-react";
import { createPortal } from "react-dom";

const ToolDetailsModal = ({ isOpen, onClose, tool }) => {
  if (!tool) return null;

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
                <PenTool size={18} className="text-sky-400" /> Tool Details
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 space-y-5">
              <div>
                <h4 className="text-xl font-bold text-[#cee5ff]">{tool.toolName}</h4>
                <span className={`mt-2 inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tool.isActive ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'}`}>
                  {tool.isActive ? 'Active Restriction' : 'Inactive Restriction'}
                </span>
              </div>
              
              <div className="bg-[#001526] p-4 rounded-xl border border-white/5 space-y-3">
                <div>
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertTriangle size={12} /> Reason for Ban
                  </p>
                  <p className="text-[#cee5ff] text-sm">{tool.reason}</p>
                </div>
                {tool.description && (
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Detailed Description</p>
                    <p className="text-[#cee5ff]/80 text-sm leading-relaxed">{tool.description}</p>
                  </div>
                )}
              </div>

              <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10">
                <p className="text-rose-400/60 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Scale size={12}/> Legal Penalty
                </p>
                <p className="text-rose-200 text-sm">{tool.penalty || "No penalty specified"}</p>
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

export default ToolDetailsModal;