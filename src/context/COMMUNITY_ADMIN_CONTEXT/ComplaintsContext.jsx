// src/context/COMMUNITY_ADMIN_CONTEXT/CommunityContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import * as complaintService from "../../services/CommunityAdminServices/complaints.service";
import { toast } from 'react-hot-toast';

const CommunityContext = createContext();

export const useCommunityAdmin = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunityAdmin must be used within a CommunityAdminProvider');
  }
  return context;
};

export const CommunityAdminProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch complaints (handles both specific status and under-review)
  const fetchComplaints = useCallback(async (tabStatus) => {
    setLoading(true);
    try {
      let data;
      if (tabStatus === 2) {
        // Specifically use the under-review endpoint
        data = await complaintService.getUnderReviewComplaints(1, 100);
      } else {
        // Use generic endpoint for Pending (1), Resolved (3), Rejected (4)
        data = await complaintService.getComplaints(1, 100, tabStatus);
      }
      setComplaints(data || []);
    } catch (err) {
      console.error("Fetch complaints error:", err);
      toast.error("Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update complaint status
  const updateComplaintStatus = async (postId, newStatus, adminNotes = "") => {
    setActionLoading(postId);
    try {
      await complaintService.resolveComplaint(postId, newStatus, adminNotes);
      toast.success("Complaint status updated successfully");
      
      // Remove from current view to reflect change instantly
      setComplaints(prev => prev.filter(c => c.postId !== postId));
      return true;
    } catch (err) {
      console.error("Update complaint error:", err);
      toast.error(err?.response?.data?.message || "Failed to update complaint");
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      1: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20", // Pending
      2: "bg-sky-400/10 text-sky-400 border-sky-400/20",       // Under Review
      3: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20", // Resolved
      4: "bg-rose-400/10 text-rose-400 border-rose-400/20"       // Rejected
    };
    return map[status] || "bg-[#a3cbf2]/10 text-[#a3cbf2]/50";
  };

  const getStatusText = (status) => {
    const map = { 1: "Pending", 2: "Under Review", 3: "Resolved", 4: "Rejected" };
    return map[status] || "Unknown";
  };

  const value = {
    complaints,
    loading,
    actionLoading,
    fetchComplaints,
    updateComplaintStatus,
    getStatusStyle,
    getStatusText
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};