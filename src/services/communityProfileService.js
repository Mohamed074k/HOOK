import apiClient from "../api/apiClient";

export const getMyPosts = async (page = 1, pageSize = 20) => {
  const { data } = await apiClient.get("/api/Feed/my-posts", {
    params: { page, pageSize }
  });
  return data;
};

export const getUserPosts = async (userId, page = 1, pageSize = 20) => {
  const { data } = await apiClient.get(`/api/Feed/user/${userId}`, {
    params: { page, pageSize }
  });
  return data;
};

export const getSavedPosts = async (page = 1, pageSize = 20) => {
  const { data } = await apiClient.get("/api/Feed/saved", {
    params: { page, pageSize }
  });
  return data;
};

export const getLikedPosts = async (userId, page = 1, pageSize = 20) => {
  const params = { page, pageSize };
  if (userId) params.userId = userId;
  const { data } = await apiClient.get("/api/Feed/liked", { params });
  return data;
};

export const getSupportedComplaints = async (userId, page = 1, pageSize = 20) => {
  const params = { page, pageSize };
  if (userId) params.userId = userId;
  const { data } = await apiClient.get("/api/Feed/supported-complaints", { params });
  return data;
};

export const getCurrentUserProfile = async () => {
  const { data } = await apiClient.get("/api/Users/allroles/profile");
  return data;
};

export const getUserProfile = async (userId) => {
  const { data } = await apiClient.get(`/api/Users/allroles/profile/${userId}`);
  return data;
};

// ─── FOLLOWERS/FOLLOWING ENDPOINTS ───────────────────────────────────────────
export const getMyFollowing = async () => {
  const { data } = await apiClient.get("/api/Users/my-following");
  return data;
};

export const getMyFollowers = async () => {
  const { data } = await apiClient.get("/api/Users/my-followers");
  return data;
};

export const getUserFollowing = async (userId) => {
  const { data } = await apiClient.get(`/api/Users/${userId}/following`);
  return data;
};

export const getUserFollowers = async (userId) => {
  const { data } = await apiClient.get(`/api/Users/${userId}/followers`);
  return data;
};

// ─── NOTIFICATIONS ENDPOINTS ─────────────────────────────────────────────────
export const getNotifications = async (page = 1, pageSize = 20) => {
  const { data } = await apiClient.get("/api/Notifications", {
    params: { page, pageSize }
  });
  return data;
};

export const markNotificationAsRead = async (id) => {
  const { data } = await apiClient.post(`/api/Notifications/${id}/read`);
  return data;
};

export const getUnreadNotificationsCount = async () => {
  const { data } = await apiClient.get("/api/Notifications/unread/count");
  return data;
};