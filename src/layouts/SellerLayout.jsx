import { Outlet, useNavigate } from "react-router-dom";
import { ChevronDown, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import SellerSidebar from "../components/SELLER_COMPONENTS/SellerSidebar";

const SellerLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex bg-[#001526] text-[#cee5ff]">

      {/* Desktop Sidebar (always visible ≥ md) */}
      <div className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-40">
        <SellerSidebar onClose={null} />
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar (slide in) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-60 md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SellerSidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col md:ml-60">

        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#001526]/80 backdrop-blur border-b border-white/5 flex items-center justify-between px-4 md:px-6 py-3.5">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm text-[#a3cbf2]/60 font-medium hidden sm:block">
              HOOK Seller Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
       

            <div className="flex items-center gap-2 cursor-pointer group px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold text-xs ring-2 ring-sky-500/20 group-hover:ring-sky-400/30 transition-all">
                SE
              </div>
              <span className="text-sm text-[#cee5ff]/80 group-hover:text-white transition-colors hidden sm:block">
                My Store
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

export default SellerLayout;
