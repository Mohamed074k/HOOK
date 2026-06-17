// src/pages/USER_PAGES/components/SettingsTab.jsx
import React, { useState, useEffect } from "react";
import { User, Camera, Lock, Eye, EyeOff, Anchor, Store, Clock, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';
import BoatOwnerApplicationModal from "./BoatOwnerApplicationModal"
import SellerApplicationModal  from "./SellerApplicationModal"
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

const SettingsTab = ({ profile, updateProfile, changePassword, boatOwnerStatus, sellerStatus, submitBoatOwnerApplication, submitSellerApplication }) => {  const [draft, setDraft] = useState({
    firstName: "", lastName: "", phoneNumber: "", governorate: "", bio: "", profilePicture: null, profilePicturePreview: null,
  });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 // Application modals state
  const [showBoatOwnerModal, setShowBoatOwnerModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);

  // Make the page always open at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (profile) {
      setDraft({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNumber: profile.phoneNumber || "",
        governorate: profile.governorate || "",
        bio: profile.bio || "",
        profilePicture: null,
        profilePicturePreview: profile.profilePictureUrl ? getImageUrl(profile.profilePictureUrl) : null,
      });
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraft(prev => ({ 
          ...prev, 
          profilePicture: reader.result,
          profilePicturePreview: reader.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ ...draft });
    } catch (error) {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return toast.error("New passwords do not match");
    if (passwords.new.length < 6) return toast.error("Password must be at least 6 characters");
    
    setLoading(true);
    try {
      await changePassword(passwords.current, passwords.new);
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
       // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all hover:border-white/10 placeholder:text-[#a3cbf2]/40";

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-[#cee5ff]">Settings</h2>
        <p className="text-sm text-[#a3cbf2]/60 mt-1">Manage your account preferences and security settings.</p>
      </div>

      {/* Personal Information Section - Full width */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.1 }}
        className="bg-[#002238] border border-white/5 rounded-2xl shadow-xl hover:border-white/10 transition-colors overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-[#cee5ff] flex items-center gap-2">
            <User size={18} className="text-sky-400" /> Personal Information
          </h3>
          <p className="text-xs text-[#a3cbf2]/60 mt-1">Update your profile details and contact information.</p>
        </div>
        
        <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
          {/* Avatar + Email row (Redesigned) */}
          <div className="flex items-center gap-6 pb-4">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-full bg-[#001526] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
                {draft.profilePicturePreview ? (
                  <img src={draft.profilePicturePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-sky-400/60" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-sky-400 text-[#001526] flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-sky-300 transition-all shadow-lg shadow-sky-400/30">
                <Camera size={16} />
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
            
            <div className="flex-1">
              <h4 className="text-xl font-bold text-[#cee5ff]">
                {draft.firstName || draft.lastName ? `${draft.firstName} ${draft.lastName}` : "Your Profile"}
              </h4>
              <p className="text-sm text-[#a3cbf2]/80 mt-1">
                {profile?.email || "No email provided"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">First Name</label>
              <input type="text" value={draft.firstName} onChange={(e) => setDraft({...draft, firstName: e.target.value})} className={inputClasses} placeholder="First name" />
            </div>
            <div>
              <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">Last Name</label>
              <input type="text" value={draft.lastName} onChange={(e) => setDraft({...draft, lastName: e.target.value})} className={inputClasses} placeholder="Last name" />
            </div>
          </div>

          {/* Phone and Location in one row on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">Phone Number</label>
              <input type="tel" value={draft.phoneNumber} onChange={(e) => setDraft({...draft, phoneNumber: e.target.value})} className={inputClasses} placeholder="+201287528540" />
            </div>
            <div>
              <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">Location (Governorate)</label>
              <input type="text" value={draft.governorate} onChange={(e) => setDraft({...draft, governorate: e.target.value})} className={inputClasses} placeholder="Cairo, Egypt" />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">Bio</label>
            <textarea value={draft.bio} onChange={(e) => setDraft({...draft, bio: e.target.value})} rows={3} className={`${inputClasses} resize-none`} placeholder="Tell us about yourself..." />
          </div>
        </form>
      </motion.div>

      {/* Security Section - Full width, stacked vertically like design */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.2 }}
        className="bg-[#002238] border border-white/5 rounded-2xl shadow-xl hover:border-white/10 transition-colors overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-[#cee5ff] flex items-center gap-2">
            <Lock size={18} className="text-rose-400" /> Security
          </h3>
          <p className="text-xs text-[#a3cbf2]/60 mt-1">Keep your account secure by managing your password and access.</p>
        </div>
        
        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? "text" : "password"} 
                value={passwords.current} 
                onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
                className={inputClasses} 
                placeholder="Enter current password"
                required 
              />
              <button 
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/60 hover:text-[#cee5ff] transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password and Confirm Password in one row on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">New Password</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  value={passwords.new} 
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                  className={inputClasses} 
                  placeholder="Enter new password"
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/60 hover:text-[#cee5ff] transition-colors"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#a3cbf2]/60 mb-1.5 block">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={passwords.confirm} 
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                  className={inputClasses} 
                  placeholder="Confirm new password"
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/60 hover:text-[#cee5ff] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Update Password Button */}
          <div className="pt-2">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              type="submit" 
              disabled={loading} 
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-[#a3cbf2] hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
            >
              Update Password
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          type="button"
          className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-[#a3cbf2] hover:bg-white/10 hover:text-white transition-colors"
          onClick={() => {
            if (profile) {
              setDraft({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                phoneNumber: profile.phoneNumber || "",
                governorate: profile.governorate || "",
                bio: profile.bio || "",
                profilePicture: null,
                profilePicturePreview: profile.profilePictureUrl ? getImageUrl(profile.profilePictureUrl) : null,
              });
              setPasswords({ current: "", new: "", confirm: "" });
              toast.success("Changes discarded");
            }
          }}
        >
          Discard Changes
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          type="submit"
          onClick={handleProfileSubmit}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-sky-400 text-[#001526] hover:bg-sky-300 transition-colors disabled:opacity-50 shadow-lg shadow-sky-400/20"
        >
          Save Changes
        </motion.button>
      </div>
      
      {/* Upgrade Account Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.25 }}
        className="bg-[#002238] border border-white/5 rounded-2xl shadow-xl hover:border-white/10 transition-colors overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-[#cee5ff] flex items-center gap-2">
            <Anchor size={18} className="text-sky-400" /> Upgrade Account
          </h3>
          <p className="text-xs text-[#a3cbf2]/60 mt-1">Expand your opportunities by becoming a boat owner or seller.</p>
        </div>
        
        <div className="p-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Boat Owner Card */}
            <div className="bg-[#001526]/50 rounded-xl p-5 border border-white/5 hover:border-sky-400/30 transition-all group flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-sky-400/10 flex items-center justify-center border border-sky-400/20 group-hover:scale-110 transition-transform">
                  <Anchor size={24} className="text-sky-400" />
                </div>
                {profile?.boatOwnerStatus === 1 ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                    <Clock size={12} className="text-amber-400" />
                    <span className="text-xs font-medium text-amber-400">Pending</span>
                  </div>
                ) : profile?.boatOwnerStatus === 2 ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                    <CheckCircle size={12} className="text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">Approved</span>
                  </div>
                ) : profile?.boatOwnerStatus === 3 ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-rose-400/10 border border-rose-400/20">
                    <XCircle size={12} className="text-rose-400" />
                    <span className="text-xs font-medium text-rose-400">Rejected</span>
                  </div>
                ) : null}
              </div>
              
              <h4 className="text-lg font-bold text-[#cee5ff] mb-2">Boat Owner</h4>
              <p className="text-sm text-[#a3cbf2]/70 mb-4 leading-relaxed">
                List your boats, manage trips, and connect with adventurers. Start earning by offering unforgettable sea experiences.
              </p>
              
              {/* Added mt-auto here to push the button to the bottom */}
              <div className="mt-auto w-full">
                {!profile?.boatOwnerStatus || profile?.boatOwnerStatus === 3 ? (
                  <motion.button
                    onClick={() => setShowBoatOwnerModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-sky-400/10 text-sky-400 border border-sky-400/20 hover:bg-sky-400/20 transition-all"
                  >
                    Apply Now
                  </motion.button>
                ) : profile?.boatOwnerStatus === 1 ? (
                  <button disabled className="w-full py-2.5 rounded-xl text-sm font-semibold bg-amber-400/5 text-amber-400/50 border border-amber-400/10 cursor-not-allowed">
                    Application Under Review
                  </button>
                ) : profile?.boatOwnerStatus === 2 ? (
                  <button disabled className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-400/5 text-emerald-400/50 border border-emerald-400/10 cursor-not-allowed">
                    Already a Boat Owner
                  </button>
                ) : null}
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-[#001526]/50 rounded-xl p-5 border border-white/5 hover:border-emerald-400/30 transition-all group flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20 group-hover:scale-110 transition-transform">
                  <Store size={24} className="text-emerald-400" />
                </div>
                {profile?.sellerStatus === 1 ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                    <Clock size={12} className="text-amber-400" />
                    <span className="text-xs font-medium text-amber-400">Pending</span>
                  </div>
                ) : profile?.sellerStatus === 2 ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                    <CheckCircle size={12} className="text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">Approved</span>
                  </div>
                ) : profile?.sellerStatus === 3 ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-rose-400/10 border border-rose-400/20">
                    <XCircle size={12} className="text-rose-400" />
                    <span className="text-xs font-medium text-rose-400">Rejected</span>
                  </div>
                ) : null}
              </div>
              
              <h4 className="text-lg font-bold text-[#cee5ff] mb-2">Seller</h4>
              <p className="text-sm text-[#a3cbf2]/70 mb-4 leading-relaxed">
                Sell fishing gear, equipment, and accessories. Reach thousands of passionate anglers in our marketplace.
              </p>
              
              {/* Added mt-auto here to push the button to the bottom */}
              <div className="mt-auto w-full">
                {!profile?.sellerStatus || profile?.sellerStatus === 3 ? (
                  <motion.button
                    onClick={() => setShowSellerModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/20 transition-all"
                  >
                    Apply Now
                  </motion.button>
                ) : profile?.sellerStatus === 1 ? (
                  <button disabled className="w-full py-2.5 rounded-xl text-sm font-semibold bg-amber-400/5 text-amber-400/50 border border-amber-400/10 cursor-not-allowed">
                    Application Under Review
                  </button>
                ) : profile?.sellerStatus === 2 ? (
                  <button disabled className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-400/5 text-emerald-400/50 border border-emerald-400/10 cursor-not-allowed">
                    Already a Seller
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

 

            {/* Boat Owner Application Modal */}
      <BoatOwnerApplicationModal
        isOpen={showBoatOwnerModal}
        onClose={() => setShowBoatOwnerModal(false)}
        onSubmit={submitBoatOwnerApplication}
      />

      {/* Seller Application Modal */}
      <SellerApplicationModal
        isOpen={showSellerModal}
        onClose={() => setShowSellerModal(false)}
        onSubmit={submitSellerApplication}
      />
    </div>
  );
};

export default SettingsTab;