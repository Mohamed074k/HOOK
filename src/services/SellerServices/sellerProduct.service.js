import apiClient from "../../api/apiClient";

// ─── Product CRUD Operations ───────────────────────────────────────────────

// Get all products for the current seller
export const getSellerProducts = async () => {
  const { data } = await apiClient.get("/api/marketplace/seller/products/seller/my-products");
  return data;
};

// Get single product by ID (for viewing)
export const getProductById = async (id) => {
  const { data } = await apiClient.get(`/api/marketplace/products/allroles/${id}`);
  return data;
};

// Create new product
export const createProduct = async (formData) => {
  const { data } = await apiClient.post("/api/marketplace/seller/products/seller/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Update existing product
export const updateProduct = async (formData) => {
  const { data } = await apiClient.put("/api/marketplace/seller/products/seller/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Delete product
export const deleteProduct = async (productId) => {
  const { data } = await apiClient.delete(`/api/marketplace/seller/products/seller/delete/${productId}`);
  return data;
};

// ─── Helper Functions ─────────────────────────────────────────────────────

// Get condition text (1: New, 2: Used)
export const getConditionText = (condition) => {
  const conditionMap = {
    1: "New",
    2: "Used",
  };
  return conditionMap[condition] || "Unknown";
};

// Get condition style
export const getConditionStyle = (condition) => {
  const styleMap = {
    1: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    2: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  };
  return styleMap[condition] || "bg-[#a3cbf2]/10 text-[#a3cbf2]/50";
};

// Get category name from ID
export const getCategoryName = (categoryId) => {
  const categoryMap = {
    1: "Fishing Rods",
    2: "Fishing Reels",
    3: "Fishing Lines",
    4: "Hooks & Rigs",
    5: "Lures & Baits",
    6: "Fishing Accessories",
    7: "Fishing Clothing",
    8: "Snorkeling & Diving",
    9: "Boats & Marine Equipment",
    10: "Storage & Bags",
  };
  return categoryMap[categoryId] || "Unknown";
};

// Get stock status
export const getStockStatus = (quantity) => {
  if (quantity <= 0) return { text: "Out of Stock", className: "bg-rose-400/10 text-rose-400" };
  if (quantity <= 5) return { text: "Low Stock", className: "bg-yellow-400/10 text-yellow-400" };
  return { text: "Active", className: "bg-sky-400/10 text-sky-400" };
};

// Get image URL helper
export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `https://hook.runasp.net${url}`;
};