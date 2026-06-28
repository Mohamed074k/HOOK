 import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import UserAvatar from "../UserAvatar";

const FollowModal = ({ isOpen, onClose, title, list, isLoading }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.95, y: 10, opacity: 0 }} 
          animate={{ scale: 1, y: 0, opacity: 1 }} 
          exit={{ scale: 0.95, y: 10, opacity: 0 }} 
          transition={{ duration: 0.3 }}
          className="bg-[#002238] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col max-h-[80vh]"
        >
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 shrink-0">
            <h3 className="text-[#cee5ff] font-bold text-lg">{title}</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
              <X size={18} className="text-[#cee5ff]" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-sky-400">
                <Loader2 size={32} className="animate-spin mb-2" />
              </div>
            ) : list && list.length > 0 ? (
              list.map(user => (
                <Link 
                  to={`/community/profile/${user.userId}`} 
                  key={user.userId} 
                  onClick={onClose}
                  className="flex items-center gap-3 bg-[#001526] border border-white/5 rounded-xl p-3 hover:border-sky-400/30 transition-colors group"
                >
                  <UserAvatar url={user.profilePictureUrl} name={user.name} className="w-10 h-10 rounded-full border border-white/10 group-hover:border-sky-400/50" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#cee5ff] font-bold text-sm group-hover:text-sky-400 transition-colors truncate">{user.name}</h4>
                    {user.phoneNumber && <p className="text-xs text-[#a3cbf2]/60 truncate">{user.phoneNumber}</p>}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-[#a3cbf2]/50 py-8 text-sm">No users found.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FollowModal;