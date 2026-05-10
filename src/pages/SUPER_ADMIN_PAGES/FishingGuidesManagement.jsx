import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, MoreHorizontal, Eye, CheckCircle, XCircle, Trash2, Loader2, RefreshCw, UserCheck, UserX, FileText } from "lucide-react";
import apiClient from "../../api/apiClient";
import { toast } from 'react-hot-toast';

// Custom Confirm Modal Component
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
            <motion.button 
              onClick={onCancel} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button 
              onClick={onConfirm} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${isDanger ? 'bg-rose-400/15 text-rose-300 hover:bg-rose-400/25 border border-rose-400/30' : 'bg-sky-400 text-[#001526] hover:bg-sky-300'}`}
            >
              {confirmText}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Status mapping for API values (1 = Pending, 2 = Approved, 3 = Rejected, 4 = Suspended)
const getStatusText = (status) => {
  const statusMap = {
    1: "Pending",
    2: "Active",
    3: "Rejected",
    4: "Suspended",
  };
  return statusMap[status] || "Unknown";
};

const getStatusStyle = (status) => {
  const styleMap = {
    1: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",      // Pending
    2: "bg-sky-400/10 text-sky-400 border-sky-400/20",               // Active/Approved
    3: "bg-rose-400/10 text-rose-400 border-rose-400/20",            // Rejected
    4: "bg-red-400/10 text-red-400 border-red-400/20",               // Suspended
  };
  return styleMap[status] || "bg-[#a3cbf2]/10 text-[#a3cbf2]/50 border-white/10";
};

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

const FishingGuidesManagement = () => {
  const [guides, setGuides] = useState([]);
  const [deletedGuides, setDeletedGuides] = useState([]);
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  
  // Modal states
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Confirm modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'approve', 'reject', 'suspend', 'delete', 'restore'
    guideId: null,
    guideName: "",
    rejectionReason: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchGuides();
    fetchDeletedGuides();
    return () => clearTimeout(timer);
  }, []);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/BoatOwner/admin/GetAll");
      setGuides(data);
    } catch (error) {
      console.error("Error fetching guides:", error);
      toast.error("Failed to load guides");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedGuides = async () => {
    try {
      const { data } = await apiClient.get("/api/BoatOwner/admin/deleted/GetAll");
      setDeletedGuides(data);
    } catch (error) {
      console.error("Error fetching deleted guides:", error);
    }
  };

  const updateGuideStatus = async (profileId, isApproved, rejectionReason = null) => {
    setActionLoading(profileId);
    try {
      await apiClient.post("/api/BoatOwner/admin/update-status", {
        profileId,
        isApproved,
        rejectionReason
      });
      toast.success(`Guide ${isApproved ? 'approved' : 'rejected'} successfully`);
      fetchGuides();
      fetchDeletedGuides();
    } catch (error) {
      console.error("Error updating guide status:", error);
      toast.error("Failed to update guide status");
    } finally {
      setActionLoading(null);
      setConfirmModal({ isOpen: false, type: null, guideId: null, guideName: "", rejectionReason: "" });
    }
  };

  const deleteGuide = async (id) => {
    setActionLoading(id);
    try {
      await apiClient.delete(`/api/BoatOwner/admin/delete/${id}`);
      toast.success("Guide deleted successfully");
      fetchGuides();
      fetchDeletedGuides();
    } catch (error) {
      console.error("Error deleting guide:", error);
      toast.error("Failed to delete guide");
    } finally {
      setActionLoading(null);
      setConfirmModal({ isOpen: false, type: null, guideId: null, guideName: "", rejectionReason: "" });
    }
  };

  const openConfirmModal = (type, guide) => {
    setConfirmModal({
      isOpen: true,
      type,
      guideId: guide.id,
      guideName: guide.fullName,
      rejectionReason: ""
    });
  };

  const handleConfirmAction = () => {
    const { type, guideId, rejectionReason } = confirmModal;
    switch (type) {
      case 'approve':
        updateGuideStatus(guideId, true);
        break;
      case 'reject':
        updateGuideStatus(guideId, false, rejectionReason);
        break;
      case 'delete':
        deleteGuide(guideId);
        break;
    }
  };

  const openDetailsModal = (guide) => {
    setSelectedGuide(guide);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setTimeout(() => setSelectedGuide(null), 300);
  };

  const filteredGuides = (showDeleted ? deletedGuides : guides).filter(guide =>
    guide.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    guide.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && guides.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading guides...</p>
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
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Fishing Guides Management</h1>
          <p className="text-[#a3cbf2]/50 text-sm mt-1">Manage boat owners and fishing guides</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleted(false)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!showDeleted ? 'bg-sky-500/20 text-sky-400 border border-sky-400/30' : 'bg-[#002238] text-[#a3cbf2]/60 border border-white/5 hover:text-[#cee5ff]'}`}
          >
            Active Guides
          </button>
          <button
            onClick={() => { setShowDeleted(true); fetchDeletedGuides(); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showDeleted ? 'bg-rose-500/20 text-rose-400 border border-rose-400/30' : 'bg-[#002238] text-[#a3cbf2]/60 border border-white/5 hover:text-[#cee5ff]'}`}
          >
            Deleted Guides
          </button>
        </div>
      </div>

      {/* Adjusted Search Bar matching the image */}
      <div 
        className="w-full max-w-2xl transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3a5a78]" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#001526] border border-[#002b4d] rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#4a7298] focus:outline-none focus:border-sky-500/50 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
            placeholder="Search guides by name or email..."
          />
        </div>
        <div className="text-sm text-[#4a7298] mt-2 ml-1">
          Total: {filteredGuides.length} {showDeleted ? 'Deleted' : 'Active'} Boat Owners
        </div>
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
                {["Guide", "Contact", "Documents", "Status", "Joined", ""].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredGuides.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#a3cbf2]/40">
                    No {showDeleted ? 'deleted' : 'active'} guides found
                  </td>
                </tr>
              ) : (
                filteredGuides.map((guide) => {
                  const statusText = getStatusText(guide.status);
                  const statusStyle = getStatusStyle(guide.status);
                  return (
                    <tr key={guide.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[#cee5ff] font-medium group-hover:text-white transition-colors">{guide.fullName}</p>
                          <p className="text-[#a3cbf2]/40 text-xs">{guide.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {guide.instaPayNumber && (
                            <p className="text-[#a3cbf2]/60 text-xs">InstaPay: <span className="text-[#cee5ff]">{guide.instaPayNumber}</span></p>
                          )}
                          {guide.vodafoneCashNumber && (
                            <p className="text-[#a3cbf2]/60 text-xs">Vodafone: <span className="text-[#cee5ff]">{guide.vodafoneCashNumber}</span></p>
                          )}
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {guide.nationalIdPhotoUrl && (
                            <button
                              onClick={() => window.open(getImageUrl(guide.nationalIdPhotoUrl), '_blank')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-lg text-xs font-medium text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/40 transition-all shadow-sm"
                            >
                              <FileText size={12} /> National ID
                            </button>
                          )}
                          {guide.boatLicensePhotoUrl && (
                            <button
                              onClick={() => window.open(getImageUrl(guide.boatLicensePhotoUrl), '_blank')}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-medium text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all shadow-sm"
                            >
                              <FileText size={12} /> License
                            </button>
                          )}
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle}`}>
                          {statusText}
                        </span>
                       </td>
                      <td className="px-6 py-4 text-[#a3cbf2]/60 text-xs">
                        {new Date(guide.createdOn).toLocaleDateString()}
                       </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetailsModal(guide)}
                            className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          
                          {!showDeleted && guide.status === 1 && (
                            <>
                              <button
                                onClick={() => openConfirmModal('approve', guide)}
                                disabled={actionLoading === guide.id}
                                className="p-2 rounded-lg text-emerald-400/30 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"
                                title="Approve Guide"
                              >
                                {actionLoading === guide.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                              </button>
                              <button
                                onClick={() => openConfirmModal('reject', guide)}
                                disabled={actionLoading === guide.id}
                                className="p-2 rounded-lg text-rose-400/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                                title="Reject Guide"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          
                          {!showDeleted && guide.status === 2 && (
                            <button
                              onClick={() => openConfirmModal('delete', guide)}
                              disabled={actionLoading === guide.id}
                              className="p-2 rounded-lg text-rose-400/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                              title="Delete Guide"
                            >
                              {actionLoading === guide.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
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
        {filteredGuides.length === 0 ? (
          <div className="bg-[#002238] border border-white/5 rounded-2xl p-8 text-center text-[#a3cbf2]/40">
            No {showDeleted ? 'deleted' : 'active'} guides found
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const statusText = getStatusText(guide.status);
            const statusStyle = getStatusStyle(guide.status);
            return (
              <div key={guide.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-[#cee5ff] font-semibold text-sm">{guide.fullName}</p>
                    <p className="text-[#a3cbf2]/40 text-xs">{guide.email}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle}`}>
                    {statusText}
                  </span>
                </div>
                
                <div className="space-y-2 bg-[#001526] p-3 rounded-xl border border-white/5 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a3cbf2]/40">InstaPay:</span>
                    <span className="text-[#cee5ff] font-medium">{guide.instaPayNumber || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a3cbf2]/40">Vodafone:</span>
                    <span className="text-[#cee5ff] font-medium">{guide.vodafoneCashNumber || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#a3cbf2]/40">Joined:</span>
                    <span className="text-[#cee5ff] font-medium">{new Date(guide.createdOn).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Mobile Documents Styled Buttons */}
                <div className="flex gap-2 mb-3">
                   {guide.nationalIdPhotoUrl && (
                     <button
                       onClick={() => window.open(getImageUrl(guide.nationalIdPhotoUrl), '_blank')}
                       className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-sky-500/10 border border-sky-500/20 rounded-xl text-xs font-medium text-sky-400 hover:bg-sky-500/20 transition-all"
                     >
                       <FileText size={12} /> National ID
                     </button>
                   )}
                   {guide.boatLicensePhotoUrl && (
                     <button
                       onClick={() => window.open(getImageUrl(guide.boatLicensePhotoUrl), '_blank')}
                       className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs font-medium text-indigo-400 hover:bg-indigo-500/20 transition-all"
                     >
                       <FileText size={12} /> License
                     </button>
                   )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openDetailsModal(guide)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-white/5 text-[#cee5ff] hover:bg-white/10 text-sm font-medium transition-all"
                  >
                    <Eye size={14} /> View Details
                  </button>
                  
                  {!showDeleted && guide.status === 1 && (
                    <>
                      <button
                        onClick={() => openConfirmModal('approve', guide)}
                        className="flex items-center justify-center px-3 py-2 rounded-xl bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-all"
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button
                        onClick={() => openConfirmModal('reject', guide)}
                        className="flex items-center justify-center px-3 py-2 rounded-xl bg-rose-400/10 text-rose-400 hover:bg-rose-400/20 transition-all"
                      >
                        <XCircle size={14} />
                      </button>
                    </>
                  )}
                  
                  {!showDeleted && guide.status === 2 && (
                    <button
                      onClick={() => openConfirmModal('delete', guide)}
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

      {/* Guide Details Modal */}
      {selectedGuide && (
        <div 
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isDetailsModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={closeDetailsModal}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl max-w-2xl w-full shadow-2xl transition-all duration-300 transform ${isDetailsModalOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
              <h3 className="text-[#cee5ff] font-bold text-xl">Guide Details</h3>
              <button onClick={closeDetailsModal} className="p-2 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Full Name</p>
                  <p className="text-[#cee5ff] font-medium">{selectedGuide.fullName}</p>
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Email</p>
                  <p className="text-[#cee5ff] font-medium">{selectedGuide.email}</p>
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5 flex flex-col items-start">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">National ID</p>
                  <p className="text-[#cee5ff] font-medium mb-3">{selectedGuide.nationalIdNumber}</p>
                  {selectedGuide.nationalIdPhotoUrl && (
                    <button
                      onClick={() => window.open(getImageUrl(selectedGuide.nationalIdPhotoUrl), '_blank')}
                      className="mt-auto flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-lg text-xs font-medium text-sky-400 hover:bg-sky-500/20 transition-all"
                    >
                      <Eye size={12} /> View ID Photo
                    </button>
                  )}
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5 flex flex-col items-start">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Boat License</p>
                  <p className="text-[#cee5ff] font-medium mb-3">{selectedGuide.boatLicenseNumber}</p>
                  {selectedGuide.boatLicensePhotoUrl && (
                    <button
                      onClick={() => window.open(getImageUrl(selectedGuide.boatLicensePhotoUrl), '_blank')}
                      className="mt-auto flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-medium text-indigo-400 hover:bg-indigo-500/20 transition-all"
                    >
                      <Eye size={12} /> View License Photo
                    </button>
                  )}
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">InstaPay Number</p>
                  <p className="text-[#cee5ff] font-medium">{selectedGuide.instaPayNumber || "N/A"}</p>
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Vodafone Cash</p>
                  <p className="text-[#cee5ff] font-medium">{selectedGuide.vodafoneCashNumber || "N/A"}</p>
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Status</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${getStatusStyle(selectedGuide.status)}`}>
                    {getStatusText(selectedGuide.status)}
                  </span>
                </div>
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Joined On</p>
                  <p className="text-[#cee5ff] font-medium">{new Date(selectedGuide.createdOn).toLocaleString()}</p>
                </div>
              </div>
              
              {selectedGuide.adminRejectionReason && (
                <div className="p-4 bg-rose-400/10 rounded-xl border border-rose-400/20">
                  <p className="text-rose-400 text-xs uppercase tracking-wider mb-2">Rejection Reason</p>
                  <p className="text-[#cee5ff] text-sm">{selectedGuide.adminRejectionReason}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 pt-0 flex gap-3">
              <button onClick={closeDetailsModal} className="flex-1 py-3 rounded-xl bg-white/[0.04] text-[#a3cbf2] text-sm font-bold hover:bg-white/[0.08] transition-all">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.type === 'approve' ? "Approve Guide" :
          confirmModal.type === 'reject' ? "Reject Guide" :
          "Delete Guide"
        }
        text={
          confirmModal.type === 'approve' ? `Are you sure you want to approve "${confirmModal.guideName}"? They will be able to manage boats and trips.` :
          confirmModal.type === 'reject' ? `Are you sure you want to reject "${confirmModal.guideName}"? They will not be able to access the platform.` :
          `Are you sure you want to delete "${confirmModal.guideName}"? This action cannot be undone.`
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: null, guideId: null, guideName: "", rejectionReason: "" })}
        confirmText={
          confirmModal.type === 'approve' ? "Approve" :
          confirmModal.type === 'reject' ? "Reject" :
          "Delete"
        }
        isDanger={confirmModal.type !== 'approve'}
      />
    </div>
  );
};

export default FishingGuidesManagement;