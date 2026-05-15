// src/pages/SELLER_PAGES/SellerSettingsPage.js
import { useState, useEffect, useRef } from "react";
import { Camera, Store, Phone, Mail, MapPin, User, Save, Loader2, Eye, Trash2 } from "lucide-react";
import apiClient from "../../api/apiClient";
import { toast } from 'react-hot-toast';

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

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

const SellerSettingsPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  
  const [form, setForm] = useState({
    sellerName: "",
    phoneNumber: "",
    governorate: "",
    city: "",
    address: "",
  });
  
  const avatarRef = useRef(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchSellerProfile();
    return () => clearTimeout(timer);
  }, []);
  
  const fetchSellerProfile = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/Seller/admin-user-seller/profile");
      setProfile(data);
      // Initialize form with profile data
      setForm({
        sellerName: data.sellerName || "",
        phoneNumber: data.phoneNumber || "",
        governorate: data.governorate || "",
        city: data.city || "",
        address: data.address || "",
      });
      if (data.storeImageUrl) {
        setAvatarPreview(getImageUrl(data.storeImageUrl));
      }
    } catch (error) {
      console.error("Error fetching seller profile:", error);
      toast.error("Failed to load seller profile");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or WebP images are allowed");
      return;
    }
    
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };
  
 
  const setFormField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    
    setSaving(true);
    try {
      const formData = new FormData();
      
      // Add form fields
      if (form.sellerName) formData.append("SellerName", form.sellerName);
      if (form.phoneNumber) formData.append("PhoneNumber", form.phoneNumber);
      if (form.governorate) formData.append("Governorate", form.governorate);
      if (form.city) formData.append("City", form.city);
      if (form.address) formData.append("Address", form.address);
      
      // Add store image if changed
      if (avatarFile) {
        formData.append("StoreImage", avatarFile);
      }
      
      const { data } = await apiClient.put("/api/Seller/update-profile", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update profile with new data
      setProfile(prev => ({
        ...prev,
        ...data,
        sellerName: form.sellerName,
        phoneNumber: form.phoneNumber,
        governorate: form.governorate,
        city: form.city,
        address: form.address,
        storeImageUrl: data.storeImageUrl || prev?.storeImageUrl,
      }));
      
      toast.success("Profile updated successfully!");
      
      // Clear avatar file after successful upload
      setAvatarFile(null);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading your store profile...</p>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[#a3cbf2]/50">Failed to load profile data</p>
          <button
            onClick={fetchSellerProfile}
            className="mt-4 px-4 py-2 rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl pb-12 px-3 sm:px-0">
      {/* Header */}
      <div 
        className="transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Store Profile</h1>
        <p className="text-[#a3cbf2]/50 text-sm mt-1">Manage your store information and account settings</p>
      </div>
      
      {/* Profile Image */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-4 sm:p-6 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <h2 className="text-xs sm:text-sm font-bold text-[#cee5ff] mb-4 sm:mb-5">Store Logo</h2>
        <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
          <div className="relative group cursor-pointer" onClick={() => avatarRef.current?.click()}>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-sky-500/20 bg-sky-500/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              {avatarPreview ? (
                <img src={avatarPreview} alt="store" className="w-full h-full object-cover" />
              ) : (
                <Store size={32} className="sm:w-10 sm:h-10 text-sky-400" />
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
              <Camera size={18} className="sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-400/5 text-xs sm:text-sm font-medium transition-all duration-300"
              >
                <Camera size={14} className="sm:w-[15px] sm:h-[15px]" /> Upload Logo
              </button>
         
            </div>
            <p className="text-[#a3cbf2]/30 text-[10px] sm:text-xs mt-2">JPG, PNG or WebP. Max 5MB.</p>
          </div>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
      </div>
      
      {/* Store Information */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-4 sm:p-6 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <h2 className="text-xs sm:text-sm font-bold text-[#cee5ff] mb-4 sm:mb-5">Store Information</h2>
        <div className="space-y-4">
          <div>
            <Label>Store Name</Label>
            <Input 
              icon={Store} 
              placeholder="Store Name" 
              value={form.sellerName} 
              onChange={e => setFormField("sellerName", e.target.value)} 
              required
            />
          </div>
          
          <div>
            <Label>Phone Number</Label>
            <Input 
              icon={Phone} 
              type="tel" 
              placeholder="+1 555 0000" 
              value={form.phoneNumber} 
              onChange={e => setFormField("phoneNumber", e.target.value)} 
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Governorate</Label>
              <Input 
                icon={MapPin} 
                placeholder="Governorate" 
                value={form.governorate} 
                onChange={e => setFormField("governorate", e.target.value)} 
                required
              />
            </div>
            
            <div>
              <Label>City</Label>
              <Input 
                icon={MapPin} 
                placeholder="City" 
                value={form.city} 
                onChange={e => setFormField("city", e.target.value)} 
                required
              />
            </div>
          </div>
          
          <div>
            <Label>Address</Label>
            <Input 
              icon={User} 
              placeholder="Store Address" 
              value={form.address} 
              onChange={e => setFormField("address", e.target.value)} 
              required
            />
          </div>
        </div>
      </div>
      
      {/* Read-only Information */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-4 sm:p-6 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "300ms" }}
      >
        <h2 className="text-xs sm:text-sm font-bold text-[#cee5ff] mb-4 sm:mb-5">Account Information</h2>
        <div className="space-y-3">
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center py-2 border-b border-white/5 px-2 rounded-lg gap-1 xs:gap-0">
            <span className="text-[#a3cbf2]/50 text-xs sm:text-sm">Full Name</span>
            <span className="text-[#cee5ff] font-medium text-sm sm:text-base">{profile.fullName}</span>
          </div>
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center py-2 border-b border-white/5 px-2 rounded-lg gap-1 xs:gap-0">
            <span className="text-[#a3cbf2]/50 text-xs sm:text-sm">Email Address</span>
            <span className="text-[#cee5ff] font-medium text-sm sm:text-base">{profile.email}</span>
          </div>
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center py-2 border-b border-white/5 px-2 rounded-lg gap-1 xs:gap-0">
            <span className="text-[#a3cbf2]/50 text-xs sm:text-sm">Member Since</span>
            <span className="text-[#cee5ff] font-medium text-sm sm:text-base">
              {new Date(profile.createdOn).toLocaleDateString()}
            </span>
          </div>
     
        </div>
      </div>
      
      {/* Rejection Reason (if rejected) */}
      {profile.status === 3 && profile.adminRejectionReason && (
        <div 
          className="bg-rose-400/10 border border-rose-400/20 rounded-2xl p-4 sm:p-6 transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "400ms" }}
        >
          <h2 className="text-xs sm:text-sm font-bold text-rose-400 mb-2 sm:mb-3">Rejection Reason</h2>
          <p className="text-[#cee5ff] text-xs sm:text-sm">{profile.adminRejectionReason}</p>
          <p className="text-[#a3cbf2]/40 text-[10px] sm:text-xs mt-2 sm:mt-3">
            Please contact support to resolve this issue and reapply.
          </p>
        </div>
      )}
      
      {/* Save Button */}
      <div 
        className="flex items-center justify-end gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "500ms" }}
      >
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm sm:text-base"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={16} /> Save Profile
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SellerSettingsPage;