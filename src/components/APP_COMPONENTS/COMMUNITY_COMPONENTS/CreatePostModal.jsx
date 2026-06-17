import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, MapPin, Calendar, Users, ChevronDown, UploadCloud, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { POST_CATEGORIES, createPost } from "../../../services/communityService";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";
import UserAvatar from "./UserAvatar";

const GOVERNORATES = [
  "Cairo", "Alexandria", "Giza", "Port Said", "Suez", "Luxor", "Aswan", "Asyut", "Beheira", 
  "Beni Suef", "Dakahlia", "Damietta", "Faiyum", "Gharbia", "Ismailia", "Kafr El Sheikh", 
  "Matrouh", "Minya", "Monufia", "New Valley", "North Sinai", "Qalyubia", "Qena", "Red Sea", 
  "Sharqia", "Sohag", "South Sinai"
];

const CustomAnimatedDropdown = ({ label, icon: Icon, options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative space-y-1.5">
      <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#001526] border border-white/5 rounded-xl pl-9 pr-10 py-2.5 text-sm text-[#cee5ff] cursor-pointer flex items-center justify-between relative transition-all hover:border-sky-400/30"
      >
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" />
        <span className={value ? "text-[#cee5ff]" : "text-[#a3cbf2]/40"}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }} 
            animate={{ opacity: 1, height: "auto", y: 0 }} 
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#002238] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-48 overflow-y-auto custom-scrollbar"
          >
            {options.map((opt) => (
              <div 
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-sky-400/10 hover:text-sky-400 transition-colors ${value === opt.value ? 'bg-sky-400/20 text-sky-400' : 'text-[#cee5ff]'}`}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CreatePostModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    content: "", category: "1", governorate: "", eventDate: "", maxParticipants: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setFormData({ content: "", category: "1", governorate: "", eventDate: "", maxParticipants: "" });
      setImageFile(null); setImagePreview(null);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = new FormData();
      
      data.append("Content", formData.content);
      data.append("Category", formData.category);
      
      if (formData.governorate) {
        data.append("Location", formData.governorate); 
      }
      
      if (formData.category === "2") {
        if (formData.eventDate) data.append("EventDate", formData.eventDate);
        if (formData.maxParticipants) data.append("MaxParticipants", formData.maxParticipants);
      }
      
      if (imageFile) {
        data.append("Images", imageFile); 
      }

      await createPost(data);
      toast.success("Post published!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    onClose();
    navigate(`/community/profile/${user.id}`);
  };

  const isEvent = parseInt(formData.category) === 2;
  const categoryOptions = Object.entries(POST_CATEGORIES).map(([key, { label }]) => ({ value: key, label }));
  const governorateOptions = GOVERNORATES.map(g => ({ value: g, label: g }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ y: 50, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }} className="bg-[#002238] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-[#cee5ff]">Create Post</h3>
              <button onClick={onClose} disabled={isSubmitting} className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"><X size={20} className="text-[#a3cbf2]" /></button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex gap-4">
                <div onClick={handleAvatarClick} className="cursor-pointer hover:opacity-80 transition-opacity shrink-0">
                  <UserAvatar url={user?.profilePictureUrl} name={`${user?.firstName} ${user?.lastName}`} className="w-10 h-10 rounded-full border border-sky-400/30" />
                </div>
                <div className="flex-1">
                  <p 
                    onClick={handleAvatarClick}
                    className="font-bold text-[#cee5ff] mb-2 cursor-pointer hover:text-sky-400 transition-colors w-fit"
                  >
                    {user?.firstName} {user?.lastName}
                  </p>
                  <textarea 
                    value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Share a tip, event, or warning..." 
                    className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/40 focus:outline-none focus:border-sky-400/40 transition-all resize-none min-h-[100px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-5 relative z-10">
                <CustomAnimatedDropdown label="Category" icon={ImageIcon} options={categoryOptions} value={categoryOptions.find(o => o.value === formData.category)?.label} onChange={(val) => setFormData({...formData, category: val})} />
                <CustomAnimatedDropdown label="Governorate" icon={MapPin} options={governorateOptions} value={formData.governorate} placeholder="Select Location" onChange={(val) => setFormData({...formData, governorate: val})} />

                <AnimatePresence>
                  {isEvent && (
                    <>
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                        <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Event Date</label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" />
                          <input type="datetime-local" value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} className="w-full bg-[#001526] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/40" />
                        </div>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                        <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Max Participants</label>
                        <div className="relative">
                          <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" />
                          <input type="number" min="1" value={formData.maxParticipants} onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})} placeholder="e.g. 10" className="w-full bg-[#001526] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/40" />
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4">
                {!imagePreview ? (
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} 
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }} 
                    onDrop={handleDrop}
                    className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${isDragging ? 'border-sky-400 bg-sky-400/10' : 'border-white/10 hover:border-sky-400/50 bg-[#001526]'}`}
                  >
                    <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <UploadCloud size={32} className="text-[#a3cbf2]/40 mb-2" />
                    <p className="text-sm text-[#cee5ff] font-medium">Drag & drop an image</p>
                  </div>
                ) : (
                  <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#001526]">
                    <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-48 object-contain" />
                    <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-500 rounded-full text-white transition-colors"><X size={16} /></button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3 border-t border-white/5 bg-transparent flex items-center justify-end shrink-0">
              <button 
                onClick={handleSubmit} 
                disabled={!formData.content.trim() || isSubmitting} 
                className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-bold text-sm tracking-wide disabled:opacity-50 hover:shadow-[0_0_15px_rgba(83,214,251,0.3)] transition-all min-w-[120px]"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;