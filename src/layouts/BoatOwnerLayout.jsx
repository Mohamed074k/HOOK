import { Outlet, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import GuideSidebar from "../components/BOAT_OWNER_COMPONENTS/GuideSidebar";

const BoatOwnerLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex bg-[#001526] text-[#cee5ff]">

       <div className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-[60]">
        <GuideSidebar onClose={null} />
      </div>

       {mobileOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

       <div
        className={`fixed inset-y-0 left-0 z-[80] flex flex-col w-60 md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <GuideSidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col md:ml-60">

        {/* Top Bar */}
        <header className="sticky top-0 z-[60] bg-[#001526]/80 backdrop-blur border-b border-white/5 flex items-center justify-between px-4 md:px-6 py-3.5">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm text-[#a3cbf2]/60 font-medium hidden sm:block">
              HOOK Fishing Guide Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Profile */}
            <div className="flex items-center gap-2 cursor-pointer group px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xs ring-2 ring-sky-500/20 group-hover:ring-sky-400/30 transition-all">
                FG
              </div>
              <span className="text-sm text-[#cee5ff]/80 group-hover:text-white transition-colors hidden sm:block">
                My Profile
              </span>
              <ChevronDown size={14} className="text-[#a3cbf2]/40 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BoatOwnerLayout;