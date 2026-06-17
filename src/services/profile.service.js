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

// ─── Boat Owner Application ─────────────────────────────────────────────────
export const applyForBoatOwner = async (formData) => {
  const { data } = await apiClient.post("/api/BoatOwner/allroles/apply", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ─── Seller Application ─────────────────────────────────────────────────────
export const applyForSeller = async (formData) => {
  const { data } = await apiClient.post("/api/Seller/admin-user/apply", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};