import { Anchor } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => (
  <div className="min-h-screen bg-[#001526] flex items-center justify-center p-6">
    <div className="w-full max-w-sm">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 text-3xl font-black text-[#cee5ff]">
          <Anchor className="text-sky-400" size={28} />
          HOOK
        </div>
      </div>
      <div className="bg-[#002238] border border-white/5 rounded-3xl p-8">
        <h1 className="text-2xl font-black text-[#cee5ff] mb-1">Welcome back</h1>
        <p className="text-[#a3cbf2]/50 text-sm mb-7">Sign in to your HOOK account</p>
        <div className="space-y-4">
          <div>
            <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20 focus:outline-none focus:border-sky-400/40"
            />
          </div>
          <div>
            <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-[#cee5ff] text-sm placeholder:text-[#a3cbf2]/20 focus:outline-none focus:border-sky-400/40"
            />
          </div>
          <button className="w-full bg-sky-400 text-[#003353] py-3 rounded-xl font-bold hover:bg-sky-300 transition-colors mt-2">
            Sign In
          </button>
        </div>
        <p className="text-center text-[#a3cbf2]/40 text-xs mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-sky-400 hover:underline">Register</Link>
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

export default LoginPage;
