// src/services/chatService.js
import apiClient from "../api/apiClient"; 

export const getConversations = async () => {
  const { data } = await apiClient.get("/api/fishguard/conversations");
  return data;
};

export const getConversationById = async (id) => {
  const { data } = await apiClient.get(`/api/fishguard/conversations/${id}`);
  return data;
};

export const starConversation = async (id) => {
  const { data } = await apiClient.patch(`/api/fishguard/conversations/${id}/star`);
  return data;
};

export const deleteConversation = async (id) => {
  const { data } = await apiClient.delete(`/api/fishguard/conversations/${id}`);
  return data;
};

 export const sendChatMessageStream = async (message, conversationId = null) => {
 
  const baseURL = apiClient.defaults.baseURL || ""; 
  const url = conversationId 
    ? `${baseURL}/api/fishguard/chat/${conversationId}` 
    : `${baseURL}/api/fishguard/chat`;

   const token = localStorage.getItem("token"); 

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ message }),
  });
};