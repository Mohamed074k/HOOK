import { useState, useEffect } from "react";
import { Search, Eye, X, Loader2, CheckCircle, XCircle, Trash2, FileText, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSellers } from "../../context/SUPER_ADMIN_CONTEXT/SellersContext";
import { toast } from 'react-hot-toast';

// Helper function for image URLs
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `https://hook.runasp.net${url}`;
};

// Confirm Modal Component
const ConfirmModal = ({ isOpen, title, text, onConfirm, onCancel, confirmText = "Confirm", isDanger = false }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-sm bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <h3 className="text-lg font-bold text-[#cee5ff] mb-2">{title}</h3>
          <p className="text-sm text-[#a3cbf2]/70 mb-6">{text}</p>
          <div className="flex gap-3">
            <button 
              onClick={onCancel} 
              className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm} 
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${isDanger ? 'bg-rose-400/15 text-rose-300 hover:bg-rose-400/25 border border-rose-400/30' : 'bg-sky-400 text-[#001526] hover:bg-sky-300'}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Reject Modal with Reason
const RejectModal = ({ isOpen, sellerName, onConfirm, onCancel, isProcessing }) => {
  const [rejectionReason, setRejectionReason] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-[#cee5ff] mb-2">Reject Seller</h3>
            <p className="text-sm text-[#a3cbf2]/70 mb-4">
              Please provide a reason for rejecting <span className="text-rose-400">{sellerName}</span>
            </p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full bg-[#001526] border border-white/10 rounded-xl p-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-rose-400/50 resize-none h-28 mb-4"
              autoFocus
            />
            
            <div className="flex gap-3">
              <button 
                onClick={onCancel} 
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => onConfirm(rejectionReason)} 
                disabled={isProcessing || !rejectionReason.trim()}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-rose-400/15 text-rose-300 hover:bg-rose-400/25 border border-rose-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : null}
                Confirm Rejection
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Seller Details Modal
const SellerDetailsModal = ({ seller, isOpen, onClose }) => {
  if (!seller) return null;

  const statusText = {
    1: "Pending",
    2: "Approved",
    3: "Rejected"
  }[seller.status] || "Unknown";

  const statusColor = {
    1: "text-yellow-400",
    2: "text-sky-400",
    3: "text-rose-400"
  }[seller.status] || "text-[#a3cbf2]/50";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl bg-[#002238] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-[#cee5ff]">Seller Details</h3>
              <button onClick={onClose} className="p-2 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Store Name</p>
                  <p className="text-[#cee5ff] font-medium text-lg">{seller.sellerName}</p>
                </div>
                
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Owner</p>
                  <p className="text-[#cee5ff] font-medium">{seller.fullName}</p>
                </div>
                
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Email</p>
                  <p className="text-[#cee5ff] font-medium text-sm break-all">{seller.email}</p>
                </div>
                
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Phone</p>
                  <p className="text-[#cee5ff] font-medium">{seller.phoneNumber || "N/A"}</p>
                </div>
                
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Governorate</p>
                  <p className="text-[#cee5ff] font-medium">{seller.governorate || "N/A"}</p>
                </div>
                
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">City</p>
                  <p className="text-[#cee5ff] font-medium">{seller.city || "N/A"}</p>
                </div>
                
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5 md:col-span-2">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Address</p>
                  <p className="text-[#cee5ff] font-medium">{seller.address || "N/A"}</p>
                </div>
                
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Status</p>
                  <p className={`font-medium ${statusColor}`}>{statusText}</p>
                </div>
                
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Joined On</p>
                  <p className="text-[#cee5ff] font-medium">{new Date(seller.createdOn).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* National ID Photo */}
              {seller.nationalIdPhotoUrl && (
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-3">National ID Photo</p>
                  <button
                    onClick={() => window.open(getImageUrl(seller.nationalIdPhotoUrl), '_blank')}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 rounded-xl bg-sky-400/10 text-sky-400 border border-sky-400/20 hover:bg-sky-400/20 transition-all text-sm font-medium"
                  >
                    <FileText size={16} />
                    View ID Document
                  </button>
                </div>
              )}
              
              {/* Rejection Reason */}
              {seller.adminRejectionReason && (
                <div className="p-4 bg-rose-400/10 rounded-xl border border-rose-400/20">
                  <p className="text-rose-400 text-xs uppercase tracking-wider mb-2">Rejection Reason</p>
                  <p className="text-[#cee5ff] text-sm">{seller.adminRejectionReason}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 pt-0">
              <button 
                onClick={onClose} 
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SellersManagement = () => {
  const { 
    sellers, 
    loading, 
    stats, 
    searchTerm,
    setSearchTerm,
    showDeleted,
    setShowDeleted,
    updateSellerStatus,
    deleteSeller,
    getStatusText,
    getStatusStyle,
    isAdmin
  } = useSellers();
  
  const [animate, setAnimate] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Confirm modals
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'approve', 'delete'
    sellerId: null,
    sellerName: ""
  });
  
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    sellerId: null,
    sellerName: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const openDetailsModal = (seller) => {
    setSelectedSeller(seller);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setTimeout(() => setSelectedSeller(null), 300);
  };

  const handleApprove = (seller) => {
    setConfirmModal({
      isOpen: true,
      type: 'approve',
      sellerId: seller.id,
      sellerName: seller.sellerName
    });
  };

  const handleReject = (seller) => {
    setRejectModal({
      isOpen: true,
      sellerId: seller.id,
      sellerName: seller.sellerName
    });
  };

  const handleDelete = (seller) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      sellerId: seller.id,
      sellerName: seller.sellerName
    });
  };

  const confirmApprove = async () => {
    setActionLoading(confirmModal.sellerId);
    try {
      await updateSellerStatus(confirmModal.sellerId, true);
    } finally {
      setActionLoading(null);
      setConfirmModal({ isOpen: false, type: null, sellerId: null, sellerName: "" });
    }
  };

  const confirmReject = async (rejectionReason) => {
    setActionLoading(rejectModal.sellerId);
    try {
      await updateSellerStatus(rejectModal.sellerId, false, rejectionReason);
    } finally {
      setActionLoading(null);
      setRejectModal({ isOpen: false, sellerId: null, sellerName: "" });
    }
  };

  const confirmDelete = async () => {
    setActionLoading(confirmModal.sellerId);
    try {
      await deleteSeller(confirmModal.sellerId);
    } finally {
      setActionLoading(null);
      setConfirmModal({ isOpen: false, type: null, sellerId: null, sellerName: "" });
    }
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === 'approve') {
      confirmApprove();
    } else if (confirmModal.type === 'delete') {
      confirmDelete();
    }
  };

  // Summary cards data
  const summaryCards = [
    { label: "Total Sellers", value: stats?.totalSellers || 0, color: "text-sky-400" },
    { label: "Pending", value: stats?.pendingSellers || 0, color: "text-yellow-400" },
    { label: "Approved", value: stats?.approvedSellers || 0, color: "text-teal-400" },
    { label: "Rejected", value: stats?.rejectedSellers || 0, color: "text-rose-400" },
  ];

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle size={48} className="text-rose-400 mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  if (loading && sellers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading sellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Sellers Management</h1>
          <p className="text-[#a3cbf2]/50 text-sm mt-1">Manage marketplace sellers and their stores</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleted(false)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!showDeleted ? 'bg-sky-500/20 text-sky-400 border border-sky-400/30' : 'bg-[#002238] text-[#a3cbf2]/60 border border-white/5 hover:text-[#cee5ff]'}`}
          >
            Active Sellers
          </button>
          <button
            onClick={() => setShowDeleted(true)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showDeleted ? 'bg-rose-500/20 text-rose-400 border border-rose-400/30' : 'bg-[#002238] text-[#a3cbf2]/60 border border-white/5 hover:text-[#cee5ff]'}`}
          >
            Deleted Sellers
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryCards.map((card, idx) => (
          <div 
            key={card.label}
            className="bg-[#002238] border border-white/5 rounded-xl p-4 transform transition-all duration-500 ease-out"
            style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: `${idx * 100}ms` }}
          >
            <p className="text-[#a3cbf2]/40 text-xs">{card.label}</p>
            <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
       <div>
        <div 
        className="relative max-w-md transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
        >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 shadow-sm transition-colors"
          placeholder="Search sellers by store, owner, email, or location..."
        />
        </div>
        <p className="text-[#a3cbf2]/30 text-xs mt-2 ml-1">
          Total: {sellers.length} {showDeleted ? 'deleted' : 'active'} sellers
        </p>
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
                {["Store Name", "Owner", "Contact", "Location", "Status", "Joined", ""].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sellers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#a3cbf2]/40">
                    No {showDeleted ? 'deleted' : 'active'} sellers found
                  </td>
                </tr>
              ) : (
                sellers.map((seller) => {
                  const statusText = getStatusText(seller.status);
                  const statusStyle = getStatusStyle(seller.status);
                  return (
                    <tr key={seller.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group">
                      <td className="px-6 py-4">
                        <p className="text-[#cee5ff] font-medium group-hover:text-white transition-colors">{seller.sellerName}</p>
                        <p className="text-[#a3cbf2]/40 text-xs">{seller.fullName}</p>
                      </td>
                      <td className="px-6 py-4 text-[#a3cbf2]/60">{seller.fullName}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="text-[#a3cbf2]/60 text-xs">{seller.email}</p>
                          <p className="text-[#a3cbf2]/40 text-xs">{seller.phoneNumber || "No phone"}</p>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <p className="text-[#a3cbf2]/60 text-xs">{seller.governorate || "N/A"}</p>
                        <p className="text-[#a3cbf2]/40 text-xs">{seller.city || ""}</p>
                       </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle}`}>
                          {statusText}
                        </span>
                       </td>
                      <td className="px-6 py-4 text-[#a3cbf2]/40 text-xs">
                        {new Date(seller.createdOn).toLocaleDateString()}
                       </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetailsModal(seller)}
                            className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          
                          {!showDeleted && seller.status === 1 && (
                            <>
                              <button
                                onClick={() => handleApprove(seller)}
                                disabled={actionLoading === seller.id}
                                className="p-2 rounded-lg text-emerald-400/30 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"
                                title="Approve Seller"
                              >
                                {actionLoading === seller.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                              </button>
                              <button
                                onClick={() => handleReject(seller)}
                                disabled={actionLoading === seller.id}
                                className="p-2 rounded-lg text-rose-400/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                                title="Reject Seller"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          
                          {!showDeleted && seller.status !== 1 && (
                            <button
                              onClick={() => handleDelete(seller)}
                              disabled={actionLoading === seller.id}
                              className="p-2 rounded-lg text-rose-400/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                              title="Delete Seller"
                            >
                              {actionLoading === seller.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                          )}
                        </div>
                       </td>
                    </tr>
                  );
                })
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
        {sellers.length === 0 ? (
          <div className="bg-[#002238] border border-white/5 rounded-2xl p-8 text-center text-[#a3cbf2]/40">
            No {showDeleted ? 'deleted' : 'active'} sellers found
          </div>
        ) : (
          sellers.map((seller) => {
            const statusText = getStatusText(seller.status);
            const statusStyle = getStatusStyle(seller.status);
            return (
              <div key={seller.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-[#cee5ff] font-semibold text-sm">{seller.sellerName}</p>
                    <p className="text-[#a3cbf2]/40 text-xs mt-0.5">{seller.fullName}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle}`}>
                    {statusText}
                  </span>
                </div>
                
                <div className="space-y-2 bg-[#001526] p-3 rounded-xl border border-white/5 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a3cbf2]/40">Email:</span>
                    <span className="text-[#cee5ff] font-medium truncate max-w-[200px]">{seller.email}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a3cbf2]/40">Phone:</span>
                    <span className="text-[#cee5ff] font-medium">{seller.phoneNumber || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a3cbf2]/40">Location:</span>
                    <span className="text-[#cee5ff] font-medium">{seller.governorate || "N/A"}{seller.city ? `, ${seller.city}` : ""}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a3cbf2]/40">Joined:</span>
                    <span className="text-[#cee5ff] font-medium">{new Date(seller.createdOn).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openDetailsModal(seller)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-sm font-medium transition-all"
                  >
                    <Eye size={14} /> View Details
                  </button>
                  
                  {!showDeleted && seller.status === 1 && (
                    <>
                      <button
                        onClick={() => handleApprove(seller)}
                        className="flex items-center justify-center px-3 py-2 rounded-xl bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-all"
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button
                        onClick={() => handleReject(seller)}
                        className="flex items-center justify-center px-3 py-2 rounded-xl bg-rose-400/10 text-rose-400 hover:bg-rose-400/20 transition-all"
                      >
                        <XCircle size={14} />
                      </button>
                    </>
                  )}
                  
                  {!showDeleted && seller.status !== 1 && (
                    <button
                      onClick={() => handleDelete(seller)}
                      className="flex items-center justify-center px-3 py-2 rounded-xl bg-rose-400/10 text-rose-400 hover:bg-rose-400/20 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Seller Details Modal */}
      <SellerDetailsModal 
        seller={selectedSeller}
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
      />

      {/* Confirm Modal (Approve/Delete) */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.type === 'approve' ? "Approve Seller" : "Delete Seller"}
        text={
          confirmModal.type === 'approve' 
            ? `Are you sure you want to approve "${confirmModal.sellerName}"? They will be able to list products on the marketplace.`
            : `Are you sure you want to delete "${confirmModal.sellerName}"? This action cannot be undone.`
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: null, sellerId: null, sellerName: "" })}
        confirmText={confirmModal.type === 'approve' ? "Approve" : "Delete"}
        isDanger={confirmModal.type === 'delete'}
      />

      {/* Reject Modal with Reason */}
      <RejectModal
        isOpen={rejectModal.isOpen}
        sellerName={rejectModal.sellerName}
        onConfirm={confirmReject}
        onCancel={() => setRejectModal({ isOpen: false, sellerId: null, sellerName: "" })}
        isProcessing={actionLoading === rejectModal.sellerId}
      />
    </div>
  );
};

export default SellersManagement;