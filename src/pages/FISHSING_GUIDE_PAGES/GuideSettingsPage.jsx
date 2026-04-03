import { useState, useRef, useEffect } from "react";
import { Camera, MapPin, Phone, Mail, Globe, Award, Fish } from "lucide-react";

const SPECIALTIES = ["Deep Sea", "Fly Fishing", "Coastal", "Ice Fishing", "Freshwater", "Offshore", "Inshore", "Saltwater"];

const GuideSettingsPage = () => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  const [form, setForm] = useState({
    firstName: "Tarek",
    lastName: "Hassan",
    email: "tarek@guide.com",
    phone: "+20 100 555 0199",
    location: "Hurghada, Egypt",
    website: "",
    experience: "12",
    bio: "With over 12 years on the open water, I specialize in deep-sea charters and fly fishing expeditions across the Red Sea. My passion is sharing the thrill of the perfect catch with clients of all skill levels.",
    specialties: ["Deep Sea", "Fly Fishing", "Offshore"],
    instagram: "",
    certifications: "USCG Licensed Captain · CPR & First Aid Certified",
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

  const toggleSpecialty = (name) => {
    set("specialties", form.specialties.includes(name)
      ? form.specialties.filter(s => s !== name)
      : [...form.specialties, name]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div className={`transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Guide Profile</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">Your public-facing persona seen by customers</p>
          </div>
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
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-sky-500/20 bg-sky-500/10 flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sky-400 font-black text-3xl">TH</span>
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 hover:border-white/10 text-sm font-medium transition-all duration-200"
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
            <Label>First Name</Label>
            <Input placeholder="First Name" value={form.firstName} onChange={e => set("firstName", e.target.value)} />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input placeholder="Last Name" value={form.lastName} onChange={e => set("lastName", e.target.value)} />
          </div>
          <div>
            <Label>Email Address</Label>
            <Input icon={Mail} type="email" placeholder="your@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input icon={Phone} type="tel" placeholder="+20 100 0000" value={form.phone} onChange={e => set("phone", e.target.value)} />
          </div>
          <div>
            <Label>Location / City</Label>
            <Input icon={MapPin} placeholder="e.g. Hurghada, Egypt" value={form.location} onChange={e => set("location", e.target.value)} />
          </div>
          <div>
            <Label>Years of Experience</Label>
            <Input icon={Award} type="number" min="0" placeholder="12" value={form.experience} onChange={e => set("experience", e.target.value)} />
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
        <p className="text-[#a3cbf2]/40 text-xs mb-4">This is the first thing customers read. Make it compelling.</p>
        <textarea
          rows={5}
          value={form.bio}
          onChange={e => set("bio", e.target.value)}
          placeholder="Tell customers about your passion for fishing, your experience, and what makes your trips special..."
          className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20
            focus:outline-none focus:border-sky-400/40 focus:ring-1 focus:ring-sky-400/10 transition-all duration-200 resize-none"
        />
        <p className="text-[#a3cbf2]/20 text-xs mt-1.5 text-right">{form.bio.length} / 500 chars</p>
      </div>

      {/* Specialties */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
        style={{
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "400ms",
        }}
      >
        <h2 className="text-sm font-bold text-[#cee5ff] mb-1">Fishing Specialties</h2>
        <p className="text-[#a3cbf2]/40 text-xs mb-4">Select all that apply. Shown as tags on your public profile.</p>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map(s => {
            const active = form.specialties.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSpecialty(s)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-sky-500/15 text-sky-400 border border-sky-400/20 hover:bg-sky-500/20"
                    : "bg-[#001526] text-[#a3cbf2]/40 border border-white/5 hover:border-white/10 hover:text-[#a3cbf2]/70"
                }`}
              >
                <Fish size={11} />
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Links & Certs */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
        style={{
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "500ms",
        }}
      >
        <h2 className="text-sm font-bold text-[#cee5ff] mb-5">Links & Certifications</h2>
        <div className="space-y-4">
          <div>
            <Label>Website</Label>
            <Input icon={Globe} type="url" placeholder="https://yoursite.com" value={form.website} onChange={e => set("website", e.target.value)} />
          </div>
          <div>
            <Label>Certifications & Licenses</Label>
            <Input icon={Award} placeholder="e.g. USCG Captain License · CPR Certified" value={form.certifications} onChange={e => set("certifications", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div 
        className="flex items-center justify-end gap-3 transform transition-all duration-700 ease-out"
        style={{
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "600ms",
        }}
      >
        {saved && (
          <span className="text-teal-400 text-sm font-medium animate-[fadeUp_0.3s_ease-out]">
            ✓ Profile saved!
          </span>
        )}
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/20 transition-all duration-200"
        >
          Save Profile
        </button>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </form>
  );
};

export default GuideSettingsPage;