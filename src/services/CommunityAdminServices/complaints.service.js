// src/services/CommunityAdminServices/complaints.service.js
import apiClient from "../../api/apiClient";

export const getComplaints = async (page = 1, pageSize = 50, status = null) => {
  const params = { page, pageSize };
  if (status) params.status = status;
  
  const { data } = await apiClient.get("/api/admin/community/complaints", { params });
  return data;
};

export const getUnderReviewComplaints = async (page = 1, pageSize = 50) => {
  const { data } = await apiClient.get("/api/admin/community/complaints/under-review", { 
    params: { page, pageSize } 
  });
  return data;
};

export const resolveComplaint = async (postId, status, adminNotes) => {
  const { data } = await apiClient.post(`/api/admin/community/complaints/${postId}/resolve`, {
    status,
    adminNotes
  });
  return data;
};