import { useState, useRef, useEffect } from "react";
import { Camera, Store, Phone, Mail, Lock, User, Save } from "lucide-react";

const SellerSettingsPage = () => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  const [form, setForm] = useState({
    storeName: "The Bait Shop",
    email: "store@baitshop.com",
    phone: "+1 555 0121",
    address: "123 Marina Blvd, Miami, FL",
    description: "Premium fishing gear and tackle for anglers of all levels.",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const avatarRef = useRef(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  
  const handlePasswordChange = () => {
    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Password change logic here
    alert("Password changed successfully");
    setForm({ ...form, currentPassword: "", newPassword: "", confirmPassword: "" });
  };
  
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
  
  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl pb-12">
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
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <h2 className="text-sm font-bold text-[#cee5ff] mb-5">Profile Image</h2>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="relative group cursor-pointer" onClick={() => avatarRef.current?.click()}>
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-sky-500/20 bg-sky-500/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              {avatarPreview ? (
                <img src={avatarPreview} alt="store" className="w-full h-full object-cover" />
              ) : (
                <Store size={40} className="text-sky-400" />
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 scale-105 group-hover:scale-100">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-400/5 text-sm font-medium transition-all duration-300"
            >
              <Camera size={15} /> Upload Photo
            </button>
            <p className="text-[#a3cbf2]/30 text-xs mt-2">JPG, PNG or WebP. Max 5MB.</p>
          </div>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        </div>
      </div>
      
      {/* Store Information */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <h2 className="text-sm font-bold text-[#cee5ff] mb-5">Store Information</h2>
        <div className="space-y-4">
          <div>
            <Label>Store Name</Label>
            <Input icon={Store} placeholder="Store Name" value={form.storeName} onChange={e => set("storeName", e.target.value)} />
          </div>
          <div>
            <Label>Email Address</Label>
            <Input icon={Mail} type="email" placeholder="your@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input icon={Phone} type="tel" placeholder="+1 555 0000" value={form.phone} onChange={e => set("phone", e.target.value)} />
          </div>
          <div>
            <Label>Address</Label>
            <Input icon={User} placeholder="Store Address" value={form.address} onChange={e => set("address", e.target.value)} />
          </div>
          <div>
            <Label>Store Description</Label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200 resize-none"
            />
          </div>
        </div>
      </div>
      
      {/* Change Password */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "300ms" }}
      >
        <h2 className="text-sm font-bold text-[#cee5ff] mb-5">Change Password</h2>
        <div className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input icon={Lock} type="password" placeholder="Enter current password" value={form.currentPassword} onChange={e => set("currentPassword", e.target.value)} />
          </div>
          <div>
            <Label>New Password</Label>
            <Input icon={Lock} type="password" placeholder="Enter new password" value={form.newPassword} onChange={e => set("newPassword", e.target.value)} />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input icon={Lock} type="password" placeholder="Confirm new password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} />
          </div>
          <button
            type="button"
            onClick={handlePasswordChange}
            className="text-sky-400 text-sm font-medium hover:text-sky-300 transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>
      
      {/* Save Button */}
      <div 
        className="flex items-center justify-end gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "400ms" }}
      >
        {saved && (
          <span className="text-teal-400 text-sm font-medium animate-[fadeUp_0.3s_ease-out]">
            ✓ Profile saved!
          </span>
        )}
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          <Save size={16} /> Save Profile
        </button>
      </div>
    </form>
  );
};

export default SellerSettingsPage;