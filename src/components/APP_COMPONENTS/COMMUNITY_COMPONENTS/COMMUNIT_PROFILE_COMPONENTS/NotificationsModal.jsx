import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Loader2, CheckCircle2 } from "lucide-react";
import { getNotifications, markNotificationAsRead } from "../../../../services/communityProfileService";
import UserAvatar from "../../COMMUNITY_COMPONENTS/UserAvatar";
import { toast } from "react-hot-toast";

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const NotificationsModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const fetchNotifs = async () => {
        setIsLoading(true);
        try {
          const data = await getNotifications(1, 50);
          setNotifications(data || []);
        } catch (error) {
          toast.error("Failed to load notifications");
        } finally {
          setIsLoading(false);
        }
      };
      fetchNotifs();
    } else {
      document.body.style.overflow = '';
      setNotifications([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      toast.error("Failed to mark as read");
      console.error("Failed to mark as read", error);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 w-full h-full bg-black/70 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.95, y: 16, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.95, y: 16, opacity: 0 }} 
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-[#002238] border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 shrink-0">
              <h3 className="text-[#cee5ff] font-bold text-lg flex items-center gap-2">
                <Bell size={18} className="text-sky-400" /> Notifications
              </h3>
              <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                <X size={18} className="text-[#cee5ff]" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-sky-400">
                  <Loader2 size={32} className="animate-spin mb-2" />
                </div>
              ) : notifications.length > 0 ? (
                notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`flex items-start gap-3 rounded-xl p-3 transition-colors border ${notif.isRead ? 'bg-[#001526] border-white/5' : 'bg-sky-400/5 border-sky-400/20'}`}
                  >
                    <UserAvatar url={notif.actorProfilePictureUrl} name={notif.actorName || "User"} className="w-10 h-10 rounded-full border border-white/10 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug mb-2 ${notif.isRead ? 'text-[#cee5ff]' : 'text-white font-medium'}`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-[#a3cbf2]/50">{formatDate(notif.createdOn)}</span>
                        
                        {/* "Mark as read" Button */}
                        {!notif.isRead && (
                          <button 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold text-sky-400 bg-sky-400/10 hover:bg-sky-400 hover:text-[#001526] border border-sky-400/30 transition-colors"
                          >
                            <CheckCircle2 size={12} />
                            Mark as read
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Bell size={48} className="mx-auto text-white/5 mb-4" />
                  <p className="text-[#a3cbf2]/50 text-sm">No notifications yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default NotificationsModal;