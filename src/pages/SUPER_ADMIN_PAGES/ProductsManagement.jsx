// src/pages/SUPER_ADMIN_PAGES/ProductsManagement.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Eye, X, Loader2, Package, AlertTriangle, Star, DollarSign, Box, User, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSuperAdminProducts } from "../../context/SUPER_ADMIN_CONTEXT/ProductContext";
import { toast } from 'react-hot-toast';

// Helper function for image URLs
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

// Product Details Modal
const ProductDetailsModal = ({ product, isOpen, onClose, getCategoryName, getConditionText, getStockStatus, getImageUrl }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { getProductDetails } = useSuperAdminProducts();

  useEffect(() => {
    if (isOpen && product) {
      fetchProductDetails();
    }
  }, [isOpen, product]);

  const fetchProductDetails = async () => {
    setLoadingDetails(true);
    try {
      const details = await getProductDetails(product.id);
      setProductDetails(details);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setProductDetails(product);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (!product) return null;

  const displayData = productDetails || product;
  const status = getStockStatus(displayData.stockQuantity);
  const conditionText = getConditionText(displayData.condition);
  const categoryName = getCategoryName(displayData.category);

  // Use createPortal to mount the modal to document.body so it covers the entire screen
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-3xl bg-[#002238] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10 shrink-0">
              <h3 className="text-xl font-bold text-[#cee5ff]">Product Details</h3>
              <button 
                onClick={onClose} 
                className="p-2 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              {loadingDetails ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="text-sky-400 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Images Gallery - Smaller images */}
                  {displayData.imageUrls && displayData.imageUrls.length > 0 && (
                    <div>
                      <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-3">Product Images</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {displayData.imageUrls.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => window.open(getImageUrl(img), '_blank')}
                            className="group relative aspect-square rounded-lg overflow-hidden bg-[#001526] border border-white/5 hover:border-sky-400/30 transition-all"
                          >
                            <img 
                              src={getImageUrl(img)} 
                              alt={`${displayData.title} ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={14} className="text-sky-400" />
                        <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Product Name</p>
                      </div>
                      <p className="text-[#cee5ff] font-medium text-lg">{displayData.title}</p>
                    </div>
                    
                    <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Box size={14} className="text-sky-400" />
                        <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Category</p>
                      </div>
                      <p className="text-[#cee5ff] font-medium">{categoryName}</p>
                    </div>
                    
                    <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Star size={14} className="text-sky-400" />
                        <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Condition</p>
                      </div>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        conditionText === "New" 
                          ? "bg-emerald-400/10 text-emerald-400" 
                          : "bg-orange-400/10 text-orange-400"
                      }`}>
                        {conditionText}
                      </span>
                    </div>
                    
                    <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign size={14} className="text-sky-400" />
                        <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Price</p>
                      </div>
                      <p className="text-sky-400 font-bold text-2xl">${displayData.price}</p>
                    </div>
                    
                    <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Package size={14} className="text-sky-400" />
                        <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Stock</p>
                      </div>
                      <p className="text-[#cee5ff] font-medium">{displayData.stockQuantity} units</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${status.className}`}>
                        {status.text}
                      </span>
                    </div>
                    
                    <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={14} className="text-sky-400" />
                        <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Seller</p>
                      </div>
                      <p className="text-[#cee5ff] font-medium">{displayData.sellerName || "Unknown"}</p>
                    </div>

                    {displayData.averageRating > 0 && (
                      <div className="p-4 bg-[#001526] rounded-xl border border-white/5 md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Star size={14} className="text-yellow-400" />
                          <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Rating</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400 text-lg tracking-widest">
                              {"★".repeat(Math.floor(displayData.averageRating))}
                              {"☆".repeat(5 - Math.floor(displayData.averageRating))}
                            </span>
                            <span className="text-[#cee5ff] font-medium ml-2">{displayData.averageRating.toFixed(1)}</span>
                          </div>
                          <span className="text-[#a3cbf2]/40 text-sm">({displayData.reviewsCount || 0} reviews)</span>
                        </div>
                      </div>
                    )}

                    {/* Latest Review Box */}
                    {displayData.reviews && displayData.reviews.length > 0 && (
                      <div className="p-4 bg-[#001526] rounded-xl border border-white/5 md:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare size={14} className="text-sky-400" />
                          <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider">Latest Review</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[#cee5ff] font-medium text-sm">{displayData.reviews[0].buyerName}</span>
                            <div className="flex text-yellow-400 text-xs">
                              {"★".repeat(displayData.reviews[0].rating)}
                              {"☆".repeat(5 - displayData.reviews[0].rating)}
                            </div>
                          </div>
                          <p className="text-[#cee5ff]/80 text-sm italic border-l-2 border-sky-400/30 pl-3 py-1">
                            "{displayData.reviews[0].comment}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  {displayData.description && (
                    <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                      <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Description</p>
                      <p className="text-[#cee5ff]/80 text-sm leading-relaxed whitespace-pre-line">
                        {displayData.description}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-6 pt-0 shrink-0">
              <button 
                onClick={onClose} 
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-sky-500/20 transition-all"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const ProductsManagement = () => {
  const { 
    products, 
    loading, 
    isSuperAdmin, 
    getProductDetails,
    getCategoryName,
    getConditionText,
    getStockStatus,
    getImageUrl,
    searchTerm,
    setSearchTerm
  } = useSuperAdminProducts();
  
  const [animate, setAnimate] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter products based on search
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Details Modal Handlers
  const openDetails = (product) => {
    setSelectedProduct(product);
    setTimeout(() => setIsDetailsVisible(true), 10);
  };
  
  const closeDetails = () => {
    setIsDetailsVisible(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle size={48} className="text-rose-400 mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading products...</p>
        </div>
      </div>
    );
  }

  const getProductStatus = (stockQuantity) => {
    const status = getStockStatus(stockQuantity);
    return {
      text: status.text,
      className: status.className
    };
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-3 sm:px-0">
      {/* Header */}
      <div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Products Management</h1>
          <p className="text-[#a3cbf2]/50 text-sm mt-1">View all marketplace products</p>
        </div>
      </div>

      {/* Search Bar */}
      <div 
        className="relative max-w-md transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 shadow-sm transition-colors"
          placeholder="Search products by name..."
        />
        <p className="text-[#a3cbf2]/30 text-xs mt-2 ml-1">
          Total: {filteredProducts.length} products
        </p>
      </div>

      {/* Desktop Table */}
      {filteredProducts.length === 0 ? (
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-12 text-center transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
        >
          <Package size={48} className="text-[#a3cbf2]/20 mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50 text-lg">No products found</p>
          <p className="text-[#a3cbf2]/40 text-sm mt-1">
            {searchTerm ? "Try a different search term" : "No products available in the marketplace"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table Wrapper */}
          <div 
            className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
            style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#001526] border-b border-white/10">
                  <tr>
                    {["Product", "Category", "Price", "Stock", "Status", "Seller", ""].map((h) => (
                      <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = getProductStatus(product.stockQuantity);
                    const mainImage = product.mainImageUrl;
                    
                    return (
                      <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {mainImage && (
                              <img 
                                src={getImageUrl(mainImage)} 
                                alt={product.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <span className="text-[#cee5ff] font-medium group-hover:text-white transition-colors">{product.title}</span>
                          </div>
                         </td>
                        <td className="px-6 py-4 text-[#a3cbf2]/60">{getCategoryName(product.category)}</td>
                        <td className="px-6 py-4 text-sky-400 font-bold">${product.price}</td>
                        <td className="px-6 py-4 text-[#a3cbf2]/60">{product.stockQuantity} units</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.className}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#a3cbf2]/60">{product.sellerName || "Unknown"}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openDetails(product)}
                            className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div 
            className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
            style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
          >
            {filteredProducts.map((product) => {
              const status = getProductStatus(product.stockQuantity);
              const mainImage = product.mainImageUrl;
              
              return (
                <div key={product.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
                  <div className="flex items-start gap-3 mb-3">
                    {mainImage && (
                      <img 
                        src={getImageUrl(mainImage)} 
                        alt={product.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#cee5ff] font-semibold text-sm truncate">{product.title}</p>
                      <p className="text-[#a3cbf2]/40 text-xs mt-0.5">{getCategoryName(product.category)}</p>
                      <p className="text-[#a3cbf2]/40 text-xs mt-1">Seller: {product.sellerName || "Unknown"}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${status.className}`}>
                      {status.text}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-sky-400 font-bold text-lg">${product.price}</span>
                    <span className="text-[#a3cbf2]/40 text-xs">{product.stockQuantity} in stock</span>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => openDetails(product)} 
                      className="flex-1 flex justify-center items-center gap-1 p-2 rounded-xl bg-white/5 text-[#cee5ff] hover:bg-white/10 text-sm font-medium transition-all"
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsVisible}
        onClose={closeDetails}
        getCategoryName={getCategoryName}
        getConditionText={getConditionText}
        getStockStatus={getStockStatus}
        getImageUrl={getImageUrl}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(163, 203, 242, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(163, 203, 242, 0.4);
        }
      `}</style>
    </div>
  );
};

export default ProductsManagement;