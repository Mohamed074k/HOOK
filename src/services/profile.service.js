// src/services/profile.service.js
import apiClient from "../api/apiClient";

// ─── Get User Profile ───────────────────────────────────────────────────────
export const getProfile = async () => {
  const { data } = await apiClient.get("/api/Users/allroles/profile");
  return data;
};

// ─── Update User Profile ────────────────────────────────────────────────────
export const updateProfile = async (formData) => {
  const { data } = await apiClient.put("/api/Users/allroles/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ─── Change Password ────────────────────────────────────────────────────────
export const changePassword = async (passwordData) => {
  const { data } = await apiClient.put("/api/Users/allroles/change-password", passwordData);
  return data;
};