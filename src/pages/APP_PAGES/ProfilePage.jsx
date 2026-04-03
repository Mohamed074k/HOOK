import { User, MapPin, Mail, Phone } from "lucide-react";

const ProfilePage = () => (
  <div className="px-6 md:px-12 py-12 max-w-screen-lg mx-auto">
    <div className="bg-[#002238] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start mb-8">
      <div className="w-24 h-24 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 text-4xl font-black shrink-0">
        JD
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-black text-[#cee5ff]">John Doe</h1>
        <p className="text-[#a3cbf2]/60 mt-1">Fishing Enthusiast · Member since 2023</p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-[#a3cbf2]/60">
          <span className="flex items-center gap-1"><Mail size={14} /> john@example.com</span>
          <span className="flex items-center gap-1"><Phone size={14} /> +1 555 0100</span>
          <span className="flex items-center gap-1"><MapPin size={14} /> Miami, Florida</span>
        </div>
      </div>
      <button className="border border-sky-400/30 text-sky-400 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-sky-400/10 transition-colors">
        Edit Profile
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: "Trips Booked", value: "14" },
        { label: "Catches Logged", value: "87" },
        { label: "Community Posts", value: "32" },
      ].map(({ label, value }) => (
        <div key={label} className="bg-[#002238] border border-white/5 rounded-2xl p-6 text-center">
          <p className="text-4xl font-black text-[#cee5ff]">{value}</p>
          <p className="text-[#a3cbf2]/60 text-sm mt-1">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ProfilePage;
