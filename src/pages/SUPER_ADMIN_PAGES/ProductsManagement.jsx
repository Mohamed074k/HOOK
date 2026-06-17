import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Eye, X, Loader2, Package, AlertTriangle, Star, DollarSign, Box, User, MessageSquare, Trash2 } from "lucide-react";
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

// Custom Confirm Modal Component (Using Portal to cover full screen)
const ConfirmModal = ({ isOpen, title, text, onConfirm, onCancel, confirmText = "Confirm", isDanger = false }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-[#cee5ff] mb-2">{title}</h3>
            <p className="text-sm text-[#a3cbf2]/70 mb-6">{text}</p>
            <div className="flex gap-3">
              <motion.button 
                onClick={onCancel} 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button 
                onClick={onConfirm} 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${isDanger ? 'bg-rose-400/15 text-rose-300 hover:bg-rose-400/25 border border-rose-400/30' : 'bg-sky-400 text-[#001526] hover:bg-sky-300'}`}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
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
                  {/* Images Gallery */}
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
    getCategoryName,
    getConditionText,
    getStockStatus,
    getImageUrl,
    searchTerm,
    setSearchTerm,
    deleteProduct
  } = useSuperAdminProducts();
  
  const [animate, setAnimate] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    productId: null,
    productTitle: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
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

  // Delete Handlers
  const openDeleteConfirm = (e, product) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      productId: product.id,
      productTitle: product.title,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(confirmModal.productId);
    } catch (error) {
      console.error("Failed to delete product", error);
    } finally {
      setConfirmModal({ isOpen: false, productId: null, productTitle: "" });
    }
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

  return (
    <div className="space-y-6 pb-12 w-full max-w-7xl mx-auto relative">
      
      {/* Header & Search */}
      <div className={`relative z-20 transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3 w-full">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Products Management</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">{filteredProducts.length} products found</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#002238] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 transition-colors"
              placeholder="Search products by name..."
            />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-12 text-center transform transition-all duration-700 ease-out w-full"
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
          {/* Desktop Table Layout */}
          <div 
            className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out w-full"
            style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#001526] border-b border-b-white/10">
                  <tr>
                    {["Product", "Category", "Price", "Stock", "Seller", "Actions"].map((h) => (
                      <th key={h} className={`${h === 'Actions' ? 'text-right' : 'text-left'} px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
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
                        <td className="px-6 py-4 text-[#a3cbf2]/60">{product.sellerName || "Unknown"}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openDetails(product)}
                              className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={(e) => openDeleteConfirm(e, product)}
                              className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile List Layout - Image on left, content in middle, actions on right */}
          <div 
            className="md:hidden flex flex-col gap-3 transform transition-all duration-700 ease-out w-full overflow-x-hidden"
            style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
          >
            {filteredProducts.map((product) => {
              const mainImage = product.mainImageUrl;
              const stockStatus = getStockStatus(product.stockQuantity);
              
              return (
                <div 
                  key={product.id} 
                  className="bg-[#002238] border border-white/5 rounded-2xl p-3 hover:border-sky-400/30 transition-all duration-200"
                >
                  <div className="flex gap-3">
                    {/* Product Image - Small on left */}
                    <div className="shrink-0">
                      {mainImage ? (
                        <img 
                          src={getImageUrl(mainImage)} 
                          alt={product.title}
                          className="w-20 h-20 rounded-xl object-cover bg-[#001526] border border-white/10"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-[#001526] border border-white/10 flex items-center justify-center">
                          <Package size={28} className="text-[#a3cbf2]/20" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info - Middle */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#cee5ff] font-bold text-sm line-clamp-1">{product.title}</h3>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-sky-400/10 text-sky-400 text-[10px] font-medium">
                          {getCategoryName(product.category)}
                        </span>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${stockStatus.className}`}>
                          {stockStatus.text}
                        </span>
                      </div>
                      
                      <p className="text-[#a3cbf2]/40 text-[10px] mt-1.5">
                        Seller: <span className="text-[#a3cbf2]/60">{product.sellerName || "Unknown"}</span>
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sky-400 font-bold text-base">${product.price}</span>
                        <span className="text-[#a3cbf2]/40 text-[10px]">{product.stockQuantity} units</span>
                      </div>
                      
                      {/* Rating stars if available */}
                      {product.averageRating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={10} 
                                className={i < Math.floor(product.averageRating) 
                                  ? "text-yellow-400 fill-yellow-400" 
                                  : "text-white/20"
                                } 
                              />
                            ))}
                          </div>
                          <span className="text-[#a3cbf2]/40 text-[9px]">
                            ({product.reviewsCount || 0})
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons - Right side */}
                    <div className="shrink-0 flex flex-col gap-2">
                      <button
                        onClick={() => openDetails(product)}
                        className="p-2 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => openDeleteConfirm(e, product)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Product"
        text={`Are you sure you want to delete "${confirmModal.productTitle}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, productId: null, productTitle: "" })}
        confirmText="Delete"
        isDanger={true}
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
        
        /* Line clamp utility */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProductsManagement;