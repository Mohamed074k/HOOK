import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Camera, Store, MapPin, Phone, User, FileText } from "lucide-react";
import { toast } from 'react-hot-toast';

const GOVERNORATES = [
  "Cairo", "Alexandria", "Giza", "Dakahlia", "Red Sea", "Beheira",
  "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qaliubiya",
  "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said",
  "Damietta", "Sharkia", "South Sinai", "Kafr El Sheikh", "Matrouh",
  "Luxor", "Qena", "North Sinai", "Sohag",
];

const SellerApplicationModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    sellerName: "",
    phoneNumber: "",
    governorate: "",
    city: "",
    address: "",
    nationalIdImage: null,
    nationalIdPreview: null,
    storeImage: null,
    storePreview: null
  });
  
  const [loading, setLoading] = useState(false);
  
  const nationalIdInputRef = useRef(null);
  const storeImageInputRef = useRef(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
       document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleFileChange = (field, fileField, previewField) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          [fileField]: reader.result,
          [previewField]: reader.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.sellerName.trim()) {
      toast.error("Please enter your store/seller name");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.governorate) {
      toast.error("Please select your governorate");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your address");
      return;
    }
    if (!formData.nationalIdImage) {
      toast.error("Please upload your National ID image");
      return;
    }
    if (!formData.storeImage) {
      toast.error("Please upload your store image");
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit({
        sellerName: formData.sellerName,
        phoneNumber: formData.phoneNumber,
        governorate: formData.governorate,
        city: formData.city,
        address: formData.address,
        nationalIdImage: formData.nationalIdImage,
        storeImage: formData.storeImage
      });
      onClose();
      // Reset form
      setFormData({
        sellerName: "",
        phoneNumber: "",
        governorate: "",
        city: "",
        address: "",
        nationalIdImage: null,
        nationalIdPreview: null,
        storeImage: null,
        storePreview: null
      });
    } catch (error) {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all placeholder:text-[#a3cbf2]/40";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl bg-[#002238] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-start justify-between shrink-0 bg-[#001526]/30">
              <div>
                <h3 className="text-xl font-bold text-[#cee5ff] flex items-center gap-2">
                  <Store size={20} className="text-sky-400" />
                  Become a Seller
                </h3>
                <p className="text-sm text-[#a3cbf2]/60 mt-1">Start selling products on Hook Marketplace</p>
              </div>
              <motion.button 
                onClick={onClose} 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/5 rounded-full text-[#a3cbf2]/60 hover:text-white hover:bg-rose-500/20 transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Scrollable Body */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              
              {/* Store Information */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#cee5ff] flex items-center gap-2">
                  <Store size={16} className="text-sky-400" />
                  Store Information
                </label>
                
                <div>
                  <input
                    type="text"
                    value={formData.sellerName}
                    onChange={(e) => setFormData({...formData, sellerName: e.target.value})}
                    className={inputClasses}
                    placeholder="Store / Seller Name"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="text-sm font-semibold text-[#cee5ff] flex items-center gap-2">
                  <Phone size={16} className="text-emerald-400" />
                  Contact Information
                </label>
                
                <div>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className={inputClasses}
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="text-sm font-semibold text-[#cee5ff] flex items-center gap-2">
                  <MapPin size={16} className="text-amber-400" />
                  Location Information
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">Governorate</label>
                    <select
                      value={formData.governorate}
                      onChange={(e) => setFormData({...formData, governorate: e.target.value})}
                      className={inputClasses}
                    >
                      <option value="" disabled>Select governorate</option>
                      {GOVERNORATES.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className={inputClasses}
                      placeholder="City"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={2}
                    className={`${inputClasses} resize-none`}
                    placeholder="Full address"
                  />
                </div>
              </div>

              {/* Documents Section */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="text-sm font-semibold text-[#cee5ff] flex items-center gap-2">
                  <FileText size={16} className="text-rose-400" />
                  Required Documents
                </label>
                
                {/* National ID Image */}
                <div>
                  <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">National ID Image</label>
                  <div 
                    onClick={() => nationalIdInputRef.current?.click()}
                    className="relative border-2 border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-sky-400/50 transition-all bg-[#001526]/30"
                  >
                    {formData.nationalIdPreview ? (
                      <div className="relative">
                        <img src={formData.nationalIdPreview} alt="National ID" className="max-h-32 mx-auto rounded-lg" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({...formData, nationalIdImage: null, nationalIdPreview: null});
                          }}
                          className="absolute top-1 right-1 p-1 bg-rose-500/80 rounded-full text-white hover:bg-rose-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={32} className="text-[#a3cbf2]/40" />
                        <p className="text-sm text-[#a3cbf2]/60">Click to upload National ID image</p>
                        <p className="text-xs text-[#a3cbf2]/40">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                    <input
                      ref={nationalIdInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange('nationalIdImage', 'nationalIdImage', 'nationalIdPreview')}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Store Image */}
                <div>
                  <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">Store Image</label>
                  <div 
                    onClick={() => storeImageInputRef.current?.click()}
                    className="relative border-2 border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-sky-400/50 transition-all bg-[#001526]/30"
                  >
                    {formData.storePreview ? (
                      <div className="relative">
                        <img src={formData.storePreview} alt="Store" className="max-h-32 mx-auto rounded-lg" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({...formData, storeImage: null, storePreview: null});
                          }}
                          className="absolute top-1 right-1 p-1 bg-rose-500/80 rounded-full text-white hover:bg-rose-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Camera size={32} className="text-[#a3cbf2]/40" />
                        <p className="text-sm text-[#a3cbf2]/60">Click to upload Store image</p>
                        <p className="text-xs text-[#a3cbf2]/40">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                    <input
                      ref={storeImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange('storeImage', 'storeImage', 'storePreview')}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button 
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-[#a3cbf2] hover:bg-white/10 hover:text-white transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button 
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-50 shadow-lg shadow-emerald-400/20"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    "Submit Application"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SellerApplicationModal;