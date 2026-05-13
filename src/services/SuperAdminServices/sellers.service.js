import apiClient from "../../api/apiClient";

// Get all sellers (Admin only)
export const getAllSellers = async () => {
  const { data } = await apiClient.get("/api/Seller/admin/allroles/GetAll");
  return data;
};

// Get pending sellers only
export const getPendingSellers = async () => {
  const { data } = await apiClient.get("/api/Seller/admin/pending/GetAll");
  return data;
};

// Get deleted sellers
export const getDeletedSellers = async () => {
  const { data } = await apiClient.get("/api/Seller/admin/deleted/GetAll");
  return data;
};

// Update seller status (approve/reject)
export const updateSellerStatus = async (profileId, isApproved, rejectionReason = null) => {
  const { data } = await apiClient.post("/api/Seller/admin/update-status", {
    profileId,
    isApproved,
    rejectionReason
  });
  return data;
};

// Delete seller (soft delete)
export const deleteSeller = async (id) => {
  const { data } = await apiClient.delete(`/api/Seller/admin/delete/${id}`);
  return data;
};

// Get seller statistics (derived from data)
export const getSellerStats = (sellers) => {
  const totalSellers = sellers.length;
  const pendingSellers = sellers.filter(s => s.status === 1).length;
  const approvedSellers = sellers.filter(s => s.status === 2).length;
  const rejectedSellers = sellers.filter(s => s.status === 3).length;
  
  return {
    totalSellers,
    pendingSellers,
    approvedSellers,
    rejectedSellers
  };
};