// src/pages/ADMIN_PAGES/UsersManagement.jsx
import { useState, useEffect } from "react";
import { Search, MoreHorizontal, CheckCircle, XCircle, Shield, User, Loader2 } from "lucide-react";
import apiClient from "../../api/apiClient";
import { toast } from 'react-hot-toast';

const roleStyles = {
  Admin: "bg-purple-400/10 text-purple-400",
  BoatOwner: "bg-sky-400/10 text-sky-400",
  User: "bg-emerald-400/10 text-emerald-400",
};

const statusStyles = {
  Active: "bg-emerald-400/10 text-emerald-400",
  Suspended: "bg-red-400/10 text-red-400",
};

const UsersManagement = () => {
  const [animate, setAnimate] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchUsers();
    return () => clearTimeout(timer);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showActionsModal && !modalClosing) {
        closeActionsModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showActionsModal, modalClosing]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showActionsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showActionsModal]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/Users/admin/GetAll");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    setTogglingStatus(true);
    try {
      await apiClient.patch(`/api/Users/admin/toggle-status/${userId}`);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, isDisabled: !currentStatus }
            : user
        )
      );
      
      const newStatus = !currentStatus;
      toast.success(`User ${newStatus ? 'suspended' : 'activated'} successfully`);
      closeActionsModal();
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setTogglingStatus(false);
    }
  };

  const openActionsModal = (user) => {
    setSelectedUser(user);
    setShowActionsModal(true);
    setModalClosing(false);
  };

  const closeActionsModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowActionsModal(false);
      setSelectedUser(null);
      setModalClosing(false);
    }, 200);
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget && !modalClosing) {
      closeActionsModal();
    }
  };

  const getFullName = (user) => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
  };

  const getInitials = (user) => {
    const firstName = user.firstName?.charAt(0) || '';
    const lastName = user.lastName?.charAt(0) || '';
    return `${firstName}${lastName}`.toUpperCase() || 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = getFullName(user).toLowerCase();
    const email = (user.email || '').toLowerCase();
    const roles = (user.roles || []).join(' ').toLowerCase();
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) || 
           roles.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Users Management</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">Manage and monitor all platform users</p>
          </div>
          <div className="text-sm text-[#a3cbf2]/40 bg-[#002238] px-4 py-2 rounded-xl border border-white/5">
            Total: {filteredUsers.length} users
          </div>
        </div>

        {/* Search Bar */}
        <div 
          className="relative max-w-sm transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 transition-colors shadow-sm"
            placeholder="Search by name, email, or role..."
          />
        </div>

        {/* Desktop Table */}
        <div 
          className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#001526] border-b border-white/10">
                <tr>
                  {["User", "Email", "Role", "Status", "Governorate", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-[#a3cbf2]/40">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 text-xs font-bold shrink-0">
                            {getInitials(user)}
                          </div>
                          <span className="text-[#cee5ff] font-medium group-hover:text-white transition-colors">
                            {getFullName(user)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#a3cbf2]/60">{user.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map((role, idx) => (
                            <span 
                              key={idx} 
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleStyles[role] || roleStyles.User}`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.isDisabled ? statusStyles.Suspended : statusStyles.Active}`}>
                          {user.isDisabled ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#a3cbf2]/40">{user.governorate || "N/A"}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => openActionsModal(user)}
                          className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-colors"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div 
          className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
        >
          {filteredUsers.length === 0 ? (
            <div className="bg-[#002238] border border-white/5 rounded-2xl p-8 text-center text-[#a3cbf2]/40">
              No users found
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-sm shrink-0">
                      {getInitials(user)}
                    </div>
                    <div>
                      <p className="text-[#cee5ff] font-semibold text-sm">{getFullName(user)}</p>
                      <p className="text-[#a3cbf2]/40 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => openActionsModal(user)}
                    className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <div className="flex flex-wrap gap-1">
                    {user.roles?.map((role, idx) => (
                      <span 
                        key={idx} 
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${roleStyles[role] || roleStyles.User}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${user.isDisabled ? statusStyles.Suspended : statusStyles.Active}`}>
                    {user.isDisabled ? "Suspended" : "Active"}
                  </span>
                  {user.governorate && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/5 text-[#a3cbf2]/60">
                      {user.governorate}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Actions Modal */}
      {showActionsModal && selectedUser && (
        <div 
          className={`fixed inset-0 z-[9999] transition-all duration-200 ${
            modalClosing ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundColor: modalClosing ? 'transparent' : 'rgba(0, 0, 0, 0.8)' }}
          onClick={handleModalBackdropClick}
        >
          <div 
            className={`flex items-center justify-center min-h-screen p-4 transition-all duration-300 ${
              modalClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            <div 
              className="bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#cee5ff] font-bold text-lg">User Actions</h3>
                <button
                  onClick={closeActionsModal}
                  className="p-1 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#001526] rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold">
                    {getInitials(selectedUser)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#cee5ff] font-medium text-sm">{getFullName(selectedUser)}</p>
                    <p className="text-[#a3cbf2]/40 text-xs">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => toggleUserStatus(selectedUser.id, selectedUser.isDisabled)}
                    disabled={togglingStatus}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#001526] border border-white/5 text-[#cee5ff] hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedUser.isDisabled ? (
                      <>
                        <CheckCircle size={18} className="text-emerald-400" />
                        <span>Activate User</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={18} className="text-red-400" />
                        <span>Suspend User</span>
                      </>
                    )}
                    {togglingStatus && <Loader2 size={16} className="animate-spin ml-auto" />}
                  </button>
                  
                  <div className="text-xs text-[#a3cbf2]/30 p-3 text-center border-t border-white/5 mt-2">
                    <p>Role: {selectedUser.roles?.join(', ') || 'No role'}</p>
                    {selectedUser.governorate && <p>Governorate: {selectedUser.governorate}</p>}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeActionsModal}
                  className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersManagement;