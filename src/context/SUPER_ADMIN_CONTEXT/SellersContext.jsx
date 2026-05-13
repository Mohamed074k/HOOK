import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as sellerService from "../../services/SuperAdminServices/sellers.service";
import { toast } from 'react-hot-toast';
import { useAuth } from '../AuthContext';

const SellerContext = createContext();

export const useSellers = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSellers must be used within a SellerProvider');
  }
  return context;
};

export const SellerProvider = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [sellers, setSellers] = useState([]);
  const [deletedSellers, setDeletedSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [stats, setStats] = useState(null);

  // Role check - Admin only
  const userRoles = Array.isArray(user?.role) 
    ? user.role.map(r => r?.toLowerCase()) 
    : [user?.role?.toLowerCase()];
  const isAdmin = userRoles.includes("admin") || userRoles.includes("superadmin");

  // Helper: Get status text
  const getStatusText = (statusCode) => {
    const statusMap = {
      1: "Pending",
      2: "Approved",
      3: "Rejected",
    };
    return statusMap[statusCode] || "Unknown";
  };

  // Helper: Get status style
  const getStatusStyle = (statusCode) => {
    const styleMap = {
      1: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
      2: "bg-sky-400/10 text-sky-400 border-sky-400/20",
      3: "bg-rose-400/10 text-rose-400 border-rose-400/20",
    };
    return styleMap[statusCode] || "bg-[#a3cbf2]/10 text-[#a3cbf2]/50";
  };

  // Fetch all sellers
  const fetchSellers = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await sellerService.getAllSellers();
      setSellers(data || []);
      
      // Calculate stats
      const statsData = sellerService.getSellerStats(data || []);
      setStats(statsData);
    } catch (err) {
      console.error("Fetch sellers error:", err);
      toast.error("Failed to load sellers");
      setSellers([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Fetch deleted sellers
  const fetchDeletedSellers = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      const data = await sellerService.getDeletedSellers();
      setDeletedSellers(data || []);
    } catch (err) {
      console.error("Fetch deleted sellers error:", err);
      toast.error("Failed to load deleted sellers");
    }
  }, [isAdmin]);

  // Update seller status (approve/reject)
  const updateSellerStatus = useCallback(async (profileId, isApproved, rejectionReason = null) => {
    if (!isAdmin) {
      toast.error("Only Admins can update seller status");
      return;
    }
    
    try {
      await sellerService.updateSellerStatus(profileId, isApproved, rejectionReason);
      
      // Refresh both lists
      await fetchSellers();
      await fetchDeletedSellers();
      
      toast.success(`Seller ${isApproved ? 'approved' : 'rejected'} successfully`);
    } catch (err) {
      console.error("Update seller status error:", err);
      toast.error(err.response?.data?.message || "Failed to update seller status");
      throw err;
    }
  }, [isAdmin, fetchSellers, fetchDeletedSellers]);

  // Delete seller
  const deleteSeller = useCallback(async (id) => {
    if (!isAdmin) {
      toast.error("Only Admins can delete sellers");
      return;
    }
    
    try {
      await sellerService.deleteSeller(id);
      
      // Refresh both lists
      await fetchSellers();
      await fetchDeletedSellers();
      
      toast.success("Seller deleted successfully");
    } catch (err) {
      console.error("Delete seller error:", err);
      toast.error(err.response?.data?.message || "Failed to delete seller");
      throw err;
    }
  }, [isAdmin, fetchSellers, fetchDeletedSellers]);

  // Filter sellers based on search term
  const filteredSellers = (showDeleted ? deletedSellers : sellers).filter(seller =>
    seller.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.governorate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initial load
  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchSellers();
      fetchDeletedSellers();
    }
  }, [authLoading, isAdmin, fetchSellers, fetchDeletedSellers]);

  const value = React.useMemo(() => ({
    sellers: filteredSellers,
    allSellers: sellers,
    deletedSellers,
    loading: loading || authLoading,
    stats,
    searchTerm,
    setSearchTerm,
    showDeleted,
    setShowDeleted,
    updateSellerStatus,
    deleteSeller,
    fetchSellers,
    fetchDeletedSellers,
    getStatusText,
    getStatusStyle,
    isAdmin
  }), [
    filteredSellers, sellers, deletedSellers, loading, authLoading, stats,
    searchTerm, showDeleted, updateSellerStatus, deleteSeller,
    fetchSellers, fetchDeletedSellers, getStatusText, getStatusStyle, isAdmin
  ]);

  return (
    <SellerContext.Provider value={value}>
      {children}
    </SellerContext.Provider>
  );
};