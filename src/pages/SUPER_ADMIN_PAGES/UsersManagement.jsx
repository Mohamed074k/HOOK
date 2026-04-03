import { useState, useEffect } from "react";
import { Search, MoreHorizontal } from "lucide-react";

const users = [
  { name: "Moahmed Elsayed", email: "mohamed@example.com", role: "User", status: "Active", joined: "Jan 2024" },
  { name: "Ahmed Mohamed", email: "Ah88@example.com", role: "User", status: "Active", joined: "Feb 2024" },
  { name: "Mohamed Ahmed", email: "mo44@example.com", role: "User", status: "Suspended", joined: "Mar 2024" },
  { name: "Ahmed Hafez", email: "AhHAfez@example.com", role: "User", status: "Active", joined: "Apr 2024" },
  { name: "Cristiano Ronaldo", email: "cr7@example.com", role: "User", status: "Pending", joined: "May 2024" },
];

const statusStyles = {
  Active: "bg-sky-400/10 text-sky-400",
  Suspended: "bg-[#a3cbf2]/10 text-[#a3cbf2]/60",
  Pending: "bg-yellow-400/10 text-yellow-400",
};

const UsersManagement = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div 
        className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Users Management</h1>
      </div>

      <div 
        className="relative max-w-sm transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
        <input
          className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 transition-colors shadow-sm"
          placeholder="Search users..."
        />
      </div>

      {/* Desktop Table Container - Animated as one block */}
      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-[#001526] border-b border-white/10">
            <tr>
              {["Name", "Email", "Role", "Status", "Joined", ""].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 text-xs font-bold shrink-0">
                      {u.name[0]}
                    </div>
                    <span className="text-[#cee5ff] font-medium group-hover:text-white transition-colors">{u.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{u.email}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{u.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[u.status] ?? ""}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#a3cbf2]/40">{u.joined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Animated as one block */}
      <div 
        className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        {users.map((u) => (
          <div key={u.email} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-xs shrink-0">
                  {u.name[0]}
                </div>
                <div>
                  <p className="text-[#cee5ff] font-semibold text-sm">{u.name}</p>
                  <p className="text-[#a3cbf2]/40 text-xs">{u.email}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[u.status] ?? ""}`}>
                {u.status}
              </span>
            </div>
            <div className="pl-12 flex items-center gap-4 text-xs text-[#a3cbf2]/40 mt-3">
              <span className="font-medium bg-white/5 px-2 py-0.5 rounded">{u.role}</span>
              <span>Joined {u.joined}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersManagement;