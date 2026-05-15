import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as productService from "../../services/SellerServices/sellerProduct.service";
import { toast } from 'react-hot-toast';
import { useAuth } from '../AuthContext';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Check if user is seller
  const userRoles = Array.isArray(user?.role) 
    ? user.role.map(r => r?.toLowerCase()) 
    : [user?.role?.toLowerCase()];
  const isSeller = userRoles.includes("seller");

  // Fetch seller products
  const fetchProducts = useCallback(async () => {
    if (!isSeller) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await productService.getSellerProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [isSeller]);

  // Create product
  const createProduct = useCallback(async (productData) => {
    if (!isSeller) {
      toast.error("Only sellers can create products");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Title", productData.title);
      formData.append("Description", productData.description || "");
      formData.append("Condition", productData.condition);
      formData.append("Category", productData.category);
      formData.append("Price", productData.price);
      formData.append("StockQuantity", productData.stockQuantity);
      
      // Append images
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach(image => {
          formData.append("Images", image);
        });
      }

      const newProduct = await productService.createProduct(formData);
      setProducts(prev => [newProduct, ...prev]);
      toast.success("Product created successfully");
      return newProduct;
    } catch (err) {
      console.error("Create product error:", err);
      let errorMessage = "Failed to create product";
      if (err.response?.data?.title) {
        errorMessage = err.response.data.title;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      toast.error(errorMessage);
      throw err;
    }
  }, [isSeller]);

  // Update product
  const updateProduct = useCallback(async (productData) => {
    if (!isSeller) {
      toast.error("Only sellers can update products");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("ProductId", productData.productId);
      formData.append("Title", productData.title);
      formData.append("Description", productData.description || "");
      formData.append("Condition", productData.condition);
      formData.append("Category", productData.category);
      formData.append("Price", productData.price);
      formData.append("StockQuantity", productData.stockQuantity);
      
      // Append new images
      if (productData.newImages && productData.newImages.length > 0) {
        productData.newImages.forEach(image => {
          formData.append("NewImages", image);
        });
      }

      // 1. Send the update to the backend
      await productService.updateProduct(formData);
      
      // 2. Fetch the fresh, COMPLETE product details using the GET /id endpoint
      // This ensures we get the full object with images and descriptions back
      const freshProduct = await productService.getProductById(productData.productId);
      
      // 3. Overwrite the state with the full data
      setProducts(prev => prev.map(p => p.id === freshProduct.id ? freshProduct : p));
      
      toast.success("Product updated successfully");
      return freshProduct;
    } catch (err) {
      console.error("Update product error:", err);
      let errorMessage = "Failed to update product";
      if (err.response?.data?.title) {
        errorMessage = err.response.data.title;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      toast.error(errorMessage);
      throw err;
    }
  }, [isSeller]);

  // Delete product
  const deleteProduct = useCallback(async (productId) => {
    if (!isSeller) {
      toast.error("Only sellers can delete products");
      return;
    }

    try {
      await productService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error("Failed to delete product");
      throw err;
    }
  }, [isSeller]);

  // Get single product details
  const getProductDetails = useCallback(async (productId) => {
    try {
      const data = await productService.getProductById(productId);
      return data;
    } catch (err) {
      console.error("Get product details error:", err);
      toast.error("Failed to load product details");
      throw err;
    }
  }, []);

  // Filter products based on search, category, status, price
  const filteredProducts = React.useMemo(() => {
    let filtered = products;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (categoryFilter !== "All Categories") {
      const categoryId = Object.keys(productService.getCategoryName).find(
        key => productService.getCategoryName(key) === categoryFilter
      );
      if (categoryId) {
        filtered = filtered.filter(p => p.category === parseInt(categoryId));
      }
    }
    
    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(p => {
        const stockStatus = productService.getStockStatus(p.stockQuantity).text;
        return stockStatus === statusFilter;
      });
    }
    
    // Price filter
    if (priceRange.min) {
      filtered = filtered.filter(p => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.price <= parseFloat(priceRange.max));
    }
    
    return filtered;
  }, [products, searchTerm, categoryFilter, statusFilter, priceRange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setStatusFilter("All");
    setPriceRange({ min: "", max: "" });
  }, []);

  useEffect(() => {
    if (!authLoading && isSeller) {
      fetchProducts();
    }
  }, [authLoading, isSeller, fetchProducts]);

  const value = React.useMemo(() => ({
    products: filteredProducts,
    allProducts: products,
    loading: loading || authLoading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    priceRange,
    setPriceRange,
    filteredProducts,
    clearFilters,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    isSeller,
    // Helper functions
    getConditionText: productService.getConditionText,
    getConditionStyle: productService.getConditionStyle,
    getCategoryName: productService.getCategoryName,
    getStockStatus: productService.getStockStatus,
    getImageUrl: productService.getImageUrl,
  }), [
    filteredProducts, products, loading, authLoading,
    searchTerm, categoryFilter, statusFilter, priceRange,
    createProduct, updateProduct, deleteProduct, getProductDetails,
    clearFilters, isSeller
  ]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};