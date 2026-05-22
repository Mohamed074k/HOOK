import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Clock, Truck, CheckCircle, Ban } from "lucide-react";

// Helper functions exported so the main page can use them for the badges
export const getStatusIcon = (statusValue, size = 16) => {
  switch (statusValue) {
    case 1: return <Clock size={size} />;
    case 2: return <Truck size={size} />;
    case 3: return <CheckCircle size={size} />;
    case 4: return <Ban size={size} />;
    default: return <Clock size={size} />;
  }
};

export const getStatusLabel = (statusValue) => {
  switch (statusValue) {
    case 1: return "Pending";
    case 2: return "Out for Delivery";
    case 3: return "Delivered";
    case 4: return "Cancelled";
    default: return "Unknown";
  }
};

const UpdateStatusModal = ({ isOpen, onClose, currentStatus, onUpdate, isUpdating }) => {
  const [render, setRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${animate ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-sm bg-[#001526] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${animate ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-lg font-bold text-[#cee5ff]">Update Order Status</h3>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="text-[#a3cbf2]/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-5 space-y-3">
          {currentStatus === 1 ? (
            <>
              {/* Only allow changing to Out for Delivery */}
              <button
                onClick={() => onUpdate(2)}
                disabled={isUpdating}
                className="w-full text-left px-4 py-3 rounded-xl border border-white/5 bg-[#002238] hover:bg-white/5 hover:border-sky-400/30 transition-all text-[#cee5ff] font-medium flex items-center gap-3 disabled:opacity-50"
              >
                <span className="text-sky-400">{getStatusIcon(2)}</span>
                Out for Delivery
                {isUpdating && <Loader2 size={16} className="animate-spin ml-auto text-sky-400" />}
              </button>

              {/* Cancel Order */}
              <button
                onClick={() => onUpdate(4)}
                disabled={isUpdating}
                className="w-full text-left px-4 py-3 rounded-xl border border-rose-400/20 bg-rose-400/5 hover:bg-rose-400/10 transition-all text-rose-400 font-medium flex items-center gap-3 disabled:opacity-50"
              >
                <Ban size={16} />
                Cancel Order
                {isUpdating && <Loader2 size={16} className="animate-spin ml-auto" />}
              </button>
            </>
          ) : (
            <p className="text-center text-[#a3cbf2]/50 text-sm py-2">
              No further manual updates available for this status.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UpdateStatusModal;