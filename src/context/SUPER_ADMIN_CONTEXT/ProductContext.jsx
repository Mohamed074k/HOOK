import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from "../../api/apiClient";
import { toast } from 'react-hot-toast';
import { useAuth } from '../AuthContext';

const ProductContext = createContext();

export const useSuperAdminProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useSuperAdminProducts must be used within a SuperAdminProductProvider');
  }
  return context;
};

export const SuperAdminProductProvider = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if user is super admin
  const userRoles = Array.isArray(user?.role) 
    ? user.role.map(r => r?.toLowerCase()) 
    : [user?.role?.toLowerCase()];
  const isSuperAdmin = userRoles.includes("admin");

  // Fetch all products (super admin view)
  const fetchProducts = useCallback(async () => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/marketplace/products/allroles/search", {
        params: {
          PageSize: 100,
          PageNumber: 1
        }
      });
      setProducts(data || []);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  // Get single product details
  const getProductDetails = useCallback(async (productId) => {
    try {
      const { data } = await apiClient.get(`/api/marketplace/products/allroles/${productId}`);
      return data;
    } catch (err) {
      console.error("Get product details error:", err);
      toast.error("Failed to load product details");
      throw err;
    }
  }, []);

  // Delete product (super admin)
  const deleteProduct = useCallback(async (productId) => {
    if (!isSuperAdmin) {
      toast.error("Only admins can delete products");
      return;
    }

    try {
      await apiClient.delete(`/api/marketplace/seller/products/seller/delete/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error("Failed to delete product");
      throw err;
    }
  }, [isSuperAdmin]);

  // Helper functions
  const getConditionText = (condition) => {
    const conditionMap = {
      1: "New",
      2: "Used",
    };
    return conditionMap[condition] || "Unknown";
  };

  const getConditionStyle = (condition) => {
    const styleMap = {
      1: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
      2: "bg-orange-400/10 text-orange-400 border-orange-400/20",
    };
    return styleMap[condition] || "bg-[#a3cbf2]/10 text-[#a3cbf2]/50";
  };

  const getCategoryName = (categoryId) => {
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

  const getStockStatus = (quantity) => {
    if (quantity <= 0) return { text: "Out of Stock", className: "bg-rose-400/10 text-rose-400" };
    if (quantity <= 5) return { text: "Low Stock", className: "bg-yellow-400/10 text-yellow-400" };
    return { text: "Active", className: "bg-sky-400/10 text-sky-400" };
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
    return `${baseUrl}${url}`;
  };

  useEffect(() => {
    if (!authLoading && isSuperAdmin) {
      fetchProducts();
    }
  }, [authLoading, isSuperAdmin, fetchProducts]);

  const value = React.useMemo(() => ({
    products,
    loading: loading || authLoading,
    searchTerm,
    setSearchTerm,
    deleteProduct,
    getProductDetails,
    isSuperAdmin,
    getConditionText,
    getConditionStyle,
    getCategoryName,
    getStockStatus,
    getImageUrl,
  }), [
    products, loading, authLoading, searchTerm,
    deleteProduct, getProductDetails, isSuperAdmin
  ]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};