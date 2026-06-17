import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Users, Loader2, Edit2 } from "lucide-react";
import { updatePost } from "../../../services/communityService";
import { toast } from "react-hot-toast";

const EditPostModal = ({ isOpen, onClose, post, onSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [editFormData, setEditFormData] = useState({
    content: "",
    location: "",
    eventDate: "",
    maxParticipants: ""
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setEditFormData({
        content: post?.content || "",
        location: post?.locationName || post?.governorate || "",
        eventDate: post?.eventDetails?.eventDate ? post.eventDetails.eventDate.substring(0, 16) : "",
        maxParticipants: post?.eventDetails?.maxParticipants || ""
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, post]);

  const handleEditSubmit = async () => {
    if (!editFormData.content.trim()) return;
    setIsEditing(true);
    try {
      const payload = {
        content: editFormData.content,
        location: editFormData.location || null,
        eventDate: post.category === 2 && editFormData.eventDate ? new Date(editFormData.eventDate).toISOString() : null,
        maxParticipants: post.category === 2 ? parseInt(editFormData.maxParticipants) : null
      };

      await updatePost(post.id, payload);
      toast.success("Post updated successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update post");
    } finally {
      setIsEditing(false);
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
            className="relative bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4 shrink-0">
              <h3 className="text-[#cee5ff] font-bold text-lg flex items-center gap-2">
                <Edit2 className="text-sky-400" size={18}/> Edit Post
              </h3>
              <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                <X size={18} className="text-[#cee5ff]" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6 overflow-y-auto custom-scrollbar pr-2 flex-1">
              <div className="space-y-1.5">
                <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Content</label>
                <textarea 
                  value={editFormData.content} onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                  className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/40 resize-none h-32"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" />
                  <input 
                    type="text" value={editFormData.location} onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                    placeholder="e.g. Hurghada" 
                    className="w-full bg-[#001526] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/40 transition-all"
                  />
                </div>
              </div>

              {post.category === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Event Date</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" />
                      <input 
                        type="datetime-local" value={editFormData.eventDate} onChange={(e) => setEditFormData({...editFormData, eventDate: e.target.value})}
                        className="w-full bg-[#001526] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/40"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Max Participants</label>
                    <div className="relative">
                      <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" />
                      <input 
                        type="number" value={editFormData.maxParticipants} onChange={(e) => setEditFormData({...editFormData, maxParticipants: e.target.value})}
                        className="w-full bg-[#001526] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/40"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 shrink-0">
              <button onClick={onClose} disabled={isEditing} className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all disabled:opacity-50">Cancel</button>
              <button onClick={handleEditSubmit} disabled={!editFormData.content.trim() || isEditing} className="flex-1 py-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/20 hover:bg-sky-500/30 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {isEditing && <Loader2 size={16} className="animate-spin" />}
                {isEditing ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default EditPostModal;