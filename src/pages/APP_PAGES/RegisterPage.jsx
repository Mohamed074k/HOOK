import { Anchor } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const egyptGovernorates = [
    "Alexandria", "Aswan", "Asyut", "Beheira", "Beni Suef", "Cairo",
    "Dakahlia", "Damietta", "Faiyum", "Gharbia", "Giza", "Ismailia",
    "Kafr El Sheikh", "Luxor", "Matrouh", "Minya", "Monufia", "New Valley",
    "North Sinai", "Port Said", "Qalyubia", "Qena", "Red Sea", "Sharqia",
    "Sohag", "South Sinai", "Suez"
  ];

  return (
    <div className="min-h-screen bg-[#001526] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-3xl font-black text-[#cee5ff]">
            <Anchor className="text-sky-400" size={28} />
            HOOK
          </div>
        </div>
        <div className="bg-[#002238] border border-white/5 rounded-3xl p-8">
          <h1 className="text-2xl font-black text-[#cee5ff] mb-1">Create account</h1>
          <p className="text-[#a3cbf2]/50 text-sm mb-7">Join the HOOK community</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5">First name</label>
                <input
                  type="text"
                  placeholder="Mohamed"
                  className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20 focus:outline-none focus:border-sky-400/40"
                />
              </div>
              <div>
                <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5">Last name</label>
                <input
                  type="text"
                  placeholder="Elsayed"
                  className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20 focus:outline-none focus:border-sky-400/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5">Email</label>
              <input
                type="email"
                placeholder="ms074@gmail.com"
                className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20 focus:outline-none focus:border-sky-400/40"
              />
            </div>
            <div>
              <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5">Governorate</label>
              <select className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 appearance-none">
                <option value="" disabled selected>Select your governorate</option>
                {egyptGovernorates.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20 focus:outline-none focus:border-sky-400/40"
              />
            </div>
            <div>
              <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5">Confirm password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20 focus:outline-none focus:border-sky-400/40"
              />
            </div>
            <button className="w-full bg-sky-400 text-[#003353] py-3 rounded-xl font-bold hover:bg-sky-300 transition-colors mt-2">
              Create account
            </button>
          </div>
          <p className="text-center text-[#a3cbf2]/40 text-xs mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-400 hover:underline">Sign in</Link>
          </p>
          <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-[#a3cbf2]/30">
            Quick test links:{" "}
            <Link to="/super-admin" className="text-red-400 hover:underline mx-1">SuperAdmin</Link>
            <Link to="/seller" className="text-emerald-400 hover:underline mx-1">Seller</Link>
            <Link to="/fishing-guide" className="text-sky-400 hover:underline mx-1">Guide</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;