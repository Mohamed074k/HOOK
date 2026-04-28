import { Outlet } from "react-router-dom";
import { Anchor } from "lucide-react";
import Navbar from "../components/APP_COMPONENTS/Navbar";
import BackToTop from "../components/APP_COMPONENTS/BackToTop"; 

const AppLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#001526] text-[#cee5ff]">
    <Navbar />

    {/* Main Content */}
    <main className="flex-1 pt-[65px] md:pt-[69px]">
      <Outlet />
    </main>

    {/* Footer */}
    <footer className="border-t border-white/5 bg-[#000f1e] py-10 px-6 md:px-12 mt-auto">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xl font-black text-sky-100">
          <Anchor className="text-sky-400" size={20} />
          HOOK
        </div>
        <p className="text-slate-500 text-xs">© 2026 HOOK. All depths explored.</p>
        <div className="flex gap-6 text-xs text-slate-500">
          <a href="#" className="hover:text-sky-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-sky-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-sky-300 transition-colors">Contact</a>
        </div>
      </div>
    </footer>

    {/* Global Back To Top Button */}
    <BackToTop />
  </div>
);

export default AppLayout;