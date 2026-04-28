import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, DollarSign,
  Star, Settings, LogOut, X, Store,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  { to: "/seller", label: "Dashboard", icon: LayoutDashboard },
  { to: "/seller/products", label: "Products", icon: Package },
  { to: "/seller/orders", label: "Orders", icon: ShoppingCart },
  { to: "/seller/earnings", label: "Earnings", icon: DollarSign }, // REPLACED Analytics with Earnings
  { to: "/seller/reviews", label: "Reviews", icon: Star },
  { to: "/seller/settings", label: "Profile", icon: Settings }, // Changed from "Settings" to "Profile" to match requirements
];

const SellerSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully. See you soon!");
    navigate("/login", { replace: true });
    if (onClose) onClose();
  };

  return (
    <aside className="w-60 bg-[#002238] border-r border-white/5 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center">
            <Store className="text-sky-400" size={20} />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            Seller<span className="text-sky-400">Hub</span>
          </span>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/seller"}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sky-500/15 text-sky-400 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.15)]"
                  : "text-[#a3cbf2]/60 hover:bg-white/5 hover:text-[#cee5ff] hover:translate-x-0.5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                    isActive ? "bg-sky-400/15" : "bg-transparent group-hover:bg-white/5"
                  }`}
                >
                  <Icon size={17} className="shrink-0" />
                </span>
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5 space-y-1">
     
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#a3cbf2]/50 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 text-sm group"
        >
          <span className="w-8 h-8 flex items-center justify-center rounded-lg group-hover:bg-red-400/10 transition-all duration-200">
            <LogOut size={16} />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SellerSidebar;