import { Outlet, NavLink, Link } from "react-router-dom";
import { Anchor, Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

const AppLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#001526] text-[#cee5ff]">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/5 shadow-lg">
        <div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-screen-2xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter text-sky-100">
            <Anchor className="text-sky-400" size={24} />
            HOOK
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/trips", label: "Trips" },
              { to: "/marketplace", label: "Marketplace" },
              { to: "/community", label: "Community" },
              { to: "/profile", label: "Profile" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "text-sky-300 border-b-2 border-sky-300 pb-0.5"
                    : "text-slate-400 hover:text-sky-100 transition-colors"
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-5">
            <Search className="text-slate-400 hover:text-sky-100 cursor-pointer transition-colors" size={20} />
            <ShoppingCart className="text-slate-400 hover:text-sky-100 cursor-pointer transition-colors" size={20} />
            <Link
              to="/login"
              className="bg-sky-400 text-[#003353] px-5 py-2 rounded-lg font-bold text-sm hover:bg-sky-300 transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-sky-100"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-950/95 border-t border-white/5 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/trips", label: "Trips" },
              { to: "/marketplace", label: "Marketplace" },
              { to: "/community", label: "Community" },
              { to: "/profile", label: "Profile" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? "text-sky-300" : "text-slate-400"
                }
              >
                {label}
              </NavLink>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sky-400 font-bold">
              Sign In
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-[73px]">
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
    </div>
  );
};

export default AppLayout;