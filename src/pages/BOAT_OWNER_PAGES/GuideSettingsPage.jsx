// src/pages/BOAT_OWNER_PAGES/GuideSettingsPage.js
import { useState, useRef, useEffect } from "react";
import { Camera, MapPin, Phone, Mail, Lock, User, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "../../context/ProfileContext";
import { toast } from 'react-hot-toast';

const SPECIALTIES = ["Deep Sea", "Fly Fishing", "Coastal", "Ice Fishing", "Freshwater", "Offshore", "Inshore", "Saltwater"];

// Components moved OUTSIDE the main component to prevent losing focus
const Label = ({ children }) => (
  <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">{children}</label>
);

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/30 pointer-events-none" />}
    <input
      {...props}
      className={`w-full bg-[#001526] border border-white/5 rounded-xl py-2.5 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20
        focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200
        ${Icon ? "pl-9 pr-4" : "px-4"}`}
    />
  </div>
);

const GuideSettingsPage = () => {
  const { profile, loading: profileLoading, updateProfile, changePassword } = useProfile();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    governorate: "",
    bio: "",
    specialties: ["Deep Sea", "Fly Fishing"],
    website: "",
    certifications: "",
    profilePicture: null
  });

  const avatarRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Lock Body Scroll when Modal is open
  useEffect(() => {
    if (showPasswordModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showPasswordModal]);

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        governorate: profile.governorate || "",
        bio: profile.bio || "",
        specialties: profile.specialties || ["Deep Sea", "Fly Fishing"],
        website: profile.website || "",
        certifications: profile.certifications || "",
        profilePicture: profile.profilePictureUrl || null
      });
      
      if (profile.profilePictureUrl) {
        const getImageUrl = (url) => {
          if (!url) return null;
          if (url.startsWith('http') || url.startsWith('data:')) return url;
          return `https://hook.runasp.net${url}`;
        };
        setAvatarPreview(getImageUrl(profile.profilePictureUrl));
      }
    }
  }, [profile]);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = ev => {
      setAvatarPreview(ev.target.result);
      set("profilePicture", ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const toggleSpecialty = (name) => {
    set("specialties", form.specialties.includes(name)
      ? form.specialties.filter(s => s !== name)
      : [...form.specialties, name]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.firstName || !form.lastName) {
      toast.error("First name and last name are required");
      return;
    }
    
    setSaving(true);
    try {
      const updateData = {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber || "",
        governorate: form.governorate || "",
        bio: form.bio || "",
      };
      
      // ✅ THE FIX: Only send the profile picture if it's a newly uploaded base64 string
      if (form.profilePicture && form.profilePicture.startsWith("data:image")) {
        updateData.profilePicture = form.profilePicture;
      }
      
      await updateProfile(updateData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validate passwords
    if (!passwordForm.currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (!passwordForm.newPassword) {
      toast.error("New password is required");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    setChangingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Password change error:", error);
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = () => {
    if (form.firstName && form.lastName) {
      return `${form.firstName[0]}${form.lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <div className={`transform transition-all duration-700 ease-out ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">My Profile</h1>
              <p className="text-[#a3cbf2]/50 text-sm mt-1">Manage your personal information and preferences</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 hover:border-white/10 text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              <Lock size={15} /> Change Password
            </button>
          </div>
        </div>

        {/* Profile Picture */}
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "100ms",
          }}
        >
          <h2 className="text-sm font-bold text-[#cee5ff] mb-5">Profile Picture</h2>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-sky-500/20 bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-black text-3xl">{getInitials()}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
              >
                <Camera size={20} className="text-white" />
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 hover:border-white/10 text-sm font-medium transition-all duration-200 cursor-pointer"
              >
                <Camera size={15} /> Upload Photo
              </button>
              <p className="text-[#a3cbf2]/30 text-xs mt-2">JPG, PNG or WebP. Max 5MB. Square crop recommended.</p>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
        </div>

        {/* Personal Info */}
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "200ms",
          }}
        >
          <h2 className="text-sm font-bold text-[#cee5ff] mb-5">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>First Name *</Label>
              <Input 
                icon={User}
                placeholder="First Name" 
                value={form.firstName} 
                onChange={e => set("firstName", e.target.value)} 
                required
              />
            </div>
            <div>
              <Label>Last Name *</Label>
              <Input 
                icon={User}
                placeholder="Last Name" 
                value={form.lastName} 
                onChange={e => set("lastName", e.target.value)} 
                required
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input 
                icon={Mail} 
                type="email" 
                placeholder="your@email.com" 
                value={form.email} 
                disabled
                className="opacity-60 cursor-not-allowed"
              />
              <p className="text-[#a3cbf2]/20 text-xs mt-1">Email cannot be changed</p>
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input 
                icon={Phone} 
                type="tel" 
                placeholder="+20 100 0000" 
                value={form.phoneNumber} 
                onChange={e => set("phoneNumber", e.target.value)} 
              />
            </div>
            <div>
              <Label>Governorate / City</Label>
              <Input 
                icon={MapPin} 
                placeholder="e.g. Cairo, Alexandria" 
                value={form.governorate} 
                onChange={e => set("governorate", e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "300ms",
          }}
        >
          <h2 className="text-sm font-bold text-[#cee5ff] mb-1">Professional Bio</h2>
          <p className="text-[#a3cbf2]/40 text-xs mb-4">Tell customers about your passion and experience</p>
          <textarea
            rows={5}
            value={form.bio}
            onChange={e => set("bio", e.target.value)}
            placeholder="Tell customers about your passion for fishing, your experience, and what makes your trips special..."
            className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20
              focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200 resize-none"
            maxLength={500}
          />
          <p className="text-[#a3cbf2]/20 text-xs mt-1.5 text-right">{form.bio?.length || 0} / 500 chars</p>
        </div>

        {/* Save Button */}
        <div 
          className="flex items-center justify-end gap-3 transform transition-all duration-700 ease-out"
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "400ms",
          }}
        >
          {saved && (
            <span className="text-teal-400 text-sm font-medium animate-[fadeUp_0.3s_ease-out]">
              ✓ Profile saved!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !changingPassword && setShowPasswordModal(false)}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#cee5ff] font-bold text-lg">Change Password</h3>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={changingPassword}
                  className="p-1 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Current Password</Label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 transition-all"
                  />
                </div>
                
                <div>
                  <Label>New Password</Label>
                  <input
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 transition-all"
                  />
                </div>
                
                <div>
                  <Label>Confirm New Password</Label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 transition-all"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={changingPassword}
                  className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={changingPassword}
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-bold hover:bg-sky-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {changingPassword ? <Loader2 size={16} className="animate-spin" /> : null}
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default GuideSettingsPage;