import { NavLink, useNavigate } from "react-router-dom";
import { ShieldAlert, LogOut, X, MessageSquareWarning, MapPin, PenTool, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  { to: "/community-admin", label: "Complaints", icon: MessageSquareWarning },
  { to: "/community-admin/prohibited-places", label: "Prohibited Places", icon: MapPin },
  { to: "/community-admin/prohibited-tools", label: "Prohibited Tools", icon: PenTool },
  { to: "/community-admin/prohibited-seasons", label: "Prohibited Seasons", icon: Calendar },
];

const CommunityAdminSidebar = ({ onClose }) => {
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
            <ShieldAlert className="text-sky-400" size={20} />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            Comm<span className="text-sky-400">Admin</span>
          </span>
        </div>
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
      <nav className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#a3cbf2]/10 hover:[&::-webkit-scrollbar-thumb]:bg-[#a3cbf2]/20 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/community-admin"}
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
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400/80 bg-rose-400/5 hover:text-rose-400 transition-colors border border-rose-400/10 hover:border-rose-400/30"
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

export default CommunityAdminSidebar;