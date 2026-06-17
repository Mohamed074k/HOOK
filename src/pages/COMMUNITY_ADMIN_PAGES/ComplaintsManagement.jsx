// src/pages/COMMUNITY_ADMIN_PAGES/ComplaintsManagement.jsx
import { useState, useEffect } from "react";
import { Search, Eye, Loader2, AlertCircle, MessageSquare, X, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import { useCommunityAdmin } from "../../context/COMMUNITY_ADMIN_CONTEXT/ComplaintsContext";
import toast from "react-hot-toast";

const ComplaintsManagement = () => {
  const { complaints, loading, actionLoading, fetchComplaints, updateComplaintStatus, getStatusStyle, getStatusText } = useCommunityAdmin();
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);
  
  // Tabs: 1 = Pending, 2 = UnderReview, 3 = Resolved, 4 = Rejected
  const [activeTab, setActiveTab] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const tabs = [
    { id: 1, label: "Pending" },
    { id: 2, label: "Under Review" },
    { id: 3, label: "Resolved" },
    { id: 4, label: "Rejected" }
  ];

  const activeTabLabel = tabs.find(t => t.id === activeTab)?.label;

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchComplaints(activeTab);
    return () => clearTimeout(timer);
  }, [activeTab, fetchComplaints]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isDetailsVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDetailsVisible]);

  const filteredComplaints = complaints.filter(c => 
    c.authorName?.toLowerCase().includes(search.toLowerCase()) ||
    c.postContent?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setAdminNotes(complaint.adminNotes || "");
    setTimeout(() => setIsDetailsVisible(true), 10);
  };

  const closeModal = () => {
    setIsDetailsVisible(false);
    setTimeout(() => {
      setSelectedComplaint(null);
      setAdminNotes("");
    }, 300);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedComplaint) return;
    
    if ((newStatus === 3 || newStatus === 4) && !adminNotes.trim()) {
       toast.error("Admin notes are required to resolve or reject a complaint.");
       return;
    }

    const success = await updateComplaintStatus(selectedComplaint.postId, newStatus, adminNotes);
    if (success) closeModal();
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-x-hidden sm:overflow-visible mx-auto">
      
      {/* Header */}
      <div 
        className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Complaints Triage</h1>
          <p className="text-[#a3cbf2]/50 text-sm mt-1">Review and manage community reports</p>
        </div>
        <div className="text-sm text-[#a3cbf2]/40 bg-[#002238] px-4 py-2 rounded-xl border border-white/5">
          Total: {filteredComplaints.length} complaints
        </div>
      </div>

      {/* Tabs & Search */}
      <div 
        className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between w-full min-w-0 transform transition-all duration-700 ease-out relative z-20"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        {/* Tab Controls Wrapper - z-30 applied here */}
        <div className="w-full md:w-auto relative z-30">
          
          {/* Mobile Dropdown Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className="md:hidden w-full bg-[#002238] border border-white/5 hover:border-sky-400/30 rounded-xl px-4 py-3 text-sm font-medium text-[#cee5ff] focus:outline-none transition-all duration-300 flex items-center justify-between shadow-sm"
          >
            <span>{activeTabLabel}</span>
            <ChevronDown size={16} className={`text-[#a3cbf2]/50 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-sky-400" : ""}`} />
          </button>

          {/* Mobile Animated Dropdown List */}
          <div className={`md:hidden absolute top-full left-0 w-full mt-2 bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden origin-top transition-all duration-300 ease-out ${isDropdownOpen ? 'opacity-100 scale-y-100 translate-y-0 visible' : 'opacity-0 scale-y-95 -translate-y-2 invisible'}`}>
            <div className="py-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 ${
                    activeTab === tab.id 
                    ? "bg-sky-500/20 text-sky-400 font-medium" 
                    : "text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Horizontal Tabs */}
          <div className="hidden md:flex bg-[#002238] p-1 rounded-xl border border-white/5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? "bg-sky-500/20 text-sky-400 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.15)]" 
                  : "text-[#a3cbf2]/60 hover:text-[#cee5ff] hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-sm shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 shadow-sm transition-colors"
            placeholder="Search authors or content..."
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
            <p className="text-[#a3cbf2]/50">Loading complaints...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div 
            className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
            style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#001526] border-b border-white/10">
                  <tr>
                    {["Author", "Reported Content", "Supports", "Date", "Status", ""].map((h) => (
                      <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-[#a3cbf2]/40">
                        No complaints found in this category.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((complaint) => (
                      <tr key={complaint.postId} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group">
                        <td className="px-6 py-4 text-[#cee5ff] font-medium whitespace-nowrap">
                          {complaint.authorName}
                        </td>
                        <td className="px-6 py-4 text-[#a3cbf2]/60 max-w-xs truncate">
                          {complaint.postContent}
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-rose-400">
                            <AlertCircle size={14} />
                            {complaint.supportCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#a3cbf2]/60 whitespace-nowrap">
                          {new Date(complaint.createdOn).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(complaint.status)}`}>
                            {getStatusText(complaint.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => openModal(complaint)} 
                            className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div 
            className="md:hidden space-y-3 transform transition-all duration-700 ease-out w-full min-w-0"
            style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
          >
            {filteredComplaints.length === 0 ? (
              <div className="bg-[#002238] border border-white/5 rounded-2xl p-8 text-center text-[#a3cbf2]/40 min-w-0">
                No complaints found in this category.
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div key={complaint.postId} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3 min-w-0">
                    <div className="flex-1 truncate pr-2">
                      <p className="text-[#cee5ff] font-semibold text-sm truncate">{complaint.authorName}</p>
                      <p className="text-[#a3cbf2]/40 text-xs mt-0.5 truncate">{new Date(complaint.createdOn).toLocaleDateString()}</p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(complaint.status)}`}>
                      {getStatusText(complaint.status)}
                    </span>
                  </div>
                  
                  <div className="bg-[#001526] rounded-xl p-3 mb-3 border border-white/5">
                    <p className="text-[#cee5ff]/80 text-xs line-clamp-3 leading-relaxed">
                      {complaint.postContent}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                    <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium">
                      <AlertCircle size={14} />
                      <span>{complaint.supportCount} Supports</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <button 
                      onClick={() => openModal(complaint)} 
                      className="w-full py-2.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Review Modal */}
      {selectedComplaint && (
        <div 
          className={`fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isDetailsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={closeModal}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl max-w-lg w-full shadow-2xl transition-all duration-300 transform flex flex-col max-h-[90vh] ${isDetailsVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <h3 className="text-lg font-bold text-[#cee5ff] flex items-center gap-2">
                <MessageSquare size={18} className="text-sky-400" />
                Complaint Review
              </h3>
              <button onClick={closeModal} className="p-1.5 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              {/* Author Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Author</p>
                  <p className="text-[#cee5ff] font-medium text-sm truncate">{selectedComplaint.authorName}</p>
                </div>
                <div className="p-3 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Supports</p>
                  <p className="text-rose-400 font-bold text-sm">{selectedComplaint.supportCount}</p>
                </div>
              </div>

              {/* Content */}
              <div>
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Reported Content</p>
                <div className="bg-[#001526] rounded-xl p-4 border border-white/5">
                  <p className="text-[#cee5ff]/90 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedComplaint.postContent}
                  </p>
                </div>
              </div>

              {/* Action Area */}
              {(activeTab === 1 || activeTab === 2) && (
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Admin Resolution Notes</p>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Required for resolution/rejection..."
                    className="w-full bg-[#001526] border border-white/10 rounded-xl p-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 resize-none h-24"
                  />
                </div>
              )}
              
              {/* Read-only notes */}
              {(activeTab === 3 || activeTab === 4) && selectedComplaint.adminNotes && (
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Admin Notes</p>
                  <div className="bg-[#001526] rounded-xl p-3 border border-white/5">
                    <p className="text-[#cee5ff]/80 text-sm leading-relaxed">
                      {selectedComplaint.adminNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-white/10 shrink-0 flex gap-3">
              {activeTab === 1 && (
                <button
                  onClick={() => handleStatusUpdate(2)}
                  disabled={actionLoading === selectedComplaint.postId}
                  className="w-full py-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === selectedComplaint.postId ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
                  Investigate (Under Review)
                </button>
              )}

              {activeTab === 2 && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(4)}
                    disabled={actionLoading === selectedComplaint.postId}
                    className="flex-1 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(3)}
                    disabled={actionLoading === selectedComplaint.postId}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} /> Resolve
                  </button>
                </>
              )}
              
              {(activeTab === 3 || activeTab === 4) && (
                <button
                  onClick={closeModal}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg transition-all"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsManagement;