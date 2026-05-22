import apiClient from "../api/apiClient";

export const createOrder = async (orderData) => {
  const response = await apiClient.post("/api/marketplace/orders/admin-user/create", orderData);
  return response.data;
};