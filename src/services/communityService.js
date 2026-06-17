import apiClient from "../api/apiClient";

export const getLatestFeed = async (params = {}) => {
  const { data } = await apiClient.get("/api/Feed/latest", { params });
  return data;
};

export const getTrendingFeed = async (params = {}) => {
  const { data } = await apiClient.get("/api/Feed/trending", { params });
  return data;
};

export const getFollowingFeed = async (params = {}) => {
  const { data } = await apiClient.get("/api/Feed/following", { params });
  return data;
};

export const getTopBoatOwners = async () => {
  const { data } = await apiClient.get("/api/Community/home/boat-owners");
  return data;
};

export const getTopSellers = async () => {
  const { data } = await apiClient.get("/api/Community/home/sellers");
  return data;
};

export const getTopBoats = async () => {
  const { data } = await apiClient.get("/api/Community/home/boats");
  return data;
};

export const createPost = async (formData) => {
  const { data } = await apiClient.post("/api/Community/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const sharePost = async (originalPostId, content) => {
  const { data } = await apiClient.post(`/api/Community/posts/${originalPostId}/share`, { content });
  return data;
};

export const getShareInfo = async (postId) => {
  const { data } = await apiClient.get(`/api/Community/posts/${postId}/share-info`);
  return data;
};

export const likePost = async (id) => {
  const { data } = await apiClient.post(`/api/Community/posts/${id}/like`);
  return data;
};

export const savePost = async (id) => {
  const { data } = await apiClient.post(`/api/Community/posts/${id}/save`);
  return data;
};

export const reportPost = async (id, reason) => {
  const { data } = await apiClient.post(`/api/Community/posts/${id}/report`, { reason });
  return data;
};

export const supportPost = async (id) => {
  const { data } = await apiClient.post(`/api/Community/posts/${id}/support`);
  return data;
};

export const getPostComments = async (postId, page = 1, pageSize = 50) => {
  const { data } = await apiClient.get(`/api/Community/posts/${postId}/comments`, {
    params: { page, pageSize }
  });
  return data;
};

export const addComment = async (postId, commentText) => {
  const { data } = await apiClient.post(`/api/Community/posts/${postId}/comments`, { 
    commentText,
    parentCommentId: null
  });
  return data;
};

export const addReply = async (commentId, commentText) => {
  const { data } = await apiClient.post(`/api/Community/comments/${commentId}/replies`, { 
    commentText 
  });
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await apiClient.delete(`/api/Community/comments/${commentId}`);
  return data;
};

export const followUser = async (followingId) => {
  const { data } = await apiClient.post(`/api/Community/users/${followingId}/follow`);
  return data;
};

export const unfollowUser = async (followingId) => {
  const { data } = await apiClient.delete(`/api/Community/users/${followingId}/unfollow`);
  return data;
};

export const joinEvent = async (postId) => {
  const { data } = await apiClient.post(`/api/Community/events/${postId}/join`);
  return data;
};

export const leaveEvent = async (postId) => {
  const { data } = await apiClient.delete(`/api/Community/events/${postId}/leave`);
  return data;
};

export const updatePost = async (id, formData) => {
  const { data } = await apiClient.put(`/api/Community/posts/${id}`, formData, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export const deletePost = async (id) => {
  const { data } = await apiClient.delete(`/api/Community/posts/${id}`);
  return data;
};

export const POST_CATEGORIES = {
  1: { label: "Experience", style: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
  2: { label: "Event", style: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  3: { label: "Warning", style: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  4: { label: "Complaint", style: "text-rose-400 bg-rose-400/10 border-rose-400/20" }
};