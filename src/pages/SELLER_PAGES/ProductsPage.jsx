import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye, Package, ChevronDown, Filter, Loader2 } from "lucide-react";
import { useProducts } from "../../context/SELLER_CONTEXT/ProductContext";

const categories = ["All Categories", "Fishing Rods", "Fishing Reels", "Fishing Lines", "Hooks & Rigs", "Lures & Baits", "Fishing Accessories", "Fishing Clothing", "Snorkeling & Diving", "Boats & Marine Equipment", "Storage & Bags"];
const statusFilters = ["All", "Active", "Out of Stock", "Low Stock"];

const ProductsPage = () => {
  const navigate = useNavigate();
  const { 
    products, 
    loading, 
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    priceRange,
    setPriceRange,
    clearFilters,
    deleteProduct,
    getStockStatus,
    getCategoryName,
    getImageUrl,
    isSeller
  } = useProducts();
  
  const [animate, setAnimate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const confirmDelete = (id) => setDeleteId(id);
  
  const doDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (!isSeller) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[#a3cbf2]/50">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div 
        className={`flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">My Products</h1>
          <p className="text-[#a3cbf2]/50 text-sm mt-1">{products.length} products found</p>
        </div>
        <button
          onClick={() => navigate("/seller/products/add")}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div 
        className={`flex flex-col sm:flex-row gap-3 transform transition-all duration-700 ease-out`}
        style={{
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "100ms",
        }}
      >
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40 group-focus-within:text-sky-400 transition-colors duration-300" size={18} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 shadow-sm hover:shadow-sky-400/5"
            placeholder="Search products by name..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border transition-all duration-300 shadow-sm ${
            showFilters 
              ? "bg-sky-500/10 border-sky-400/30 text-sky-400" 
              : "bg-[#002238] border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 hover:border-white/10"
          }`}
        >
          <Filter size={16} className={showFilters ? "fill-sky-400/20" : ""} /> Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-[#002238] border border-white/5 rounded-2xl p-5 shadow-lg relative z-40 animate-[fadeDown_0.3s_ease-out]">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            
            {/* Category Filter */}
            <div className={`relative group ${openDropdown === 'category' ? 'z-50' : 'z-10'}`}>
              <label className="block text-[#a3cbf2]/40 text-xs font-medium mb-1.5 uppercase tracking-wider">Category</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                className="w-full bg-[#001526] border border-white/5 hover:border-sky-400/30 rounded-xl pl-4 pr-10 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 text-left relative"
              >
                <span className="block truncate">{categoryFilter}</span>
                <ChevronDown 
                  size={14} 
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40 transition-all duration-300 pointer-events-none ${
                    openDropdown === 'category' ? 'rotate-180 text-sky-400' : ''
                  }`} 
                />
              </button>

              <div 
                className={`absolute top-full left-0 mt-2 w-full bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden origin-top transition-all duration-300 ease-out ${
                  openDropdown === 'category' 
                    ? 'opacity-100 scale-y-100 translate-y-0 visible' 
                    : 'opacity-0 scale-y-95 -translate-y-2 invisible'
                }`}
              >
                <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                  {categories.map(c => (
                    <button
                      key={c}
                      onClick={() => { setCategoryFilter(c); setOpenDropdown(null); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                        categoryFilter === c 
                          ? 'bg-sky-500/20 text-sky-400 font-medium' 
                          : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className={`relative group ${openDropdown === 'status' ? 'z-50' : 'z-10'}`}>
              <label className="block text-[#a3cbf2]/40 text-xs font-medium mb-1.5 uppercase tracking-wider">Status</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                className="w-full bg-[#001526] border border-white/5 hover:border-sky-400/30 rounded-xl pl-4 pr-10 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 text-left relative"
              >
                <span className="block truncate">{statusFilter}</span>
                <ChevronDown 
                  size={14} 
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40 transition-all duration-300 pointer-events-none ${
                    openDropdown === 'status' ? 'rotate-180 text-sky-400' : ''
                  }`} 
                />
              </button>

              <div 
                className={`absolute top-full left-0 mt-2 w-full bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden origin-top transition-all duration-300 ease-out ${
                  openDropdown === 'status' 
                    ? 'opacity-100 scale-y-100 translate-y-0 visible' 
                    : 'opacity-0 scale-y-95 -translate-y-2 invisible'
                }`}
              >
                <div className="py-1">
                  {statusFilters.map(s => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setOpenDropdown(null); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                        statusFilter === s 
                          ? 'bg-sky-500/20 text-sky-400 font-medium' 
                          : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-[#a3cbf2]/40 text-xs font-medium mb-1.5 uppercase tracking-wider">Min Price</label>
              <input
                type="number"
                placeholder="$0"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-full bg-[#001526] border border-white/5 hover:border-sky-400/30 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-[#a3cbf2]/40 text-xs font-medium mb-1.5 uppercase tracking-wider">Max Price</label>
              <input
                type="number"
                placeholder="$9999"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-full bg-[#001526] border border-white/5 hover:border-sky-400/30 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300"
              />
            </div>
          </div>
          
          <button
            onClick={clearFilters}
            className="mt-4 text-xs font-semibold text-[#a3cbf2]/40 hover:text-sky-400 transition-colors duration-200"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-12 text-center transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
        >
          <Package size={48} className="mx-auto text-[#a3cbf2]/20 mb-4" />
          <p className="text-[#a3cbf2]/30 text-sm mb-4">No products found</p>
          <button
            onClick={() => navigate("/seller/products/add")}
            className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-400 transition-all"
          >
            <Plus size={16} /> Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 relative z-10">
          {products.map((product, idx) => {
            const stockStatus = getStockStatus(product.stockQuantity);
            const imageUrl = getImageUrl(product.mainImageUrl);
            
            return (
              <div
                key={product.id}
                className="group bg-[#002238] border border-white/5 rounded-2xl overflow-hidden hover:border-sky-400/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-400/5 ring-1 ring-transparent hover:ring-sky-400/10 transform transition-all duration-700 ease-out"
                style={{
                  opacity: animate ? 1 : 0,
                  transform: animate ? "translateY(0)" : "translateY(30px)",
                  transitionDelay: `${(idx + 2) * 100}ms`,
                }}
              >
                {/* Image */}
                <div className="h-44 bg-gradient-to-br from-sky-900 to-[#001526] flex items-center justify-center relative overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Package size={40} className="text-[#a3cbf2]/20 group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002238] via-transparent to-transparent opacity-60" />
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm z-10 ${stockStatus.className}`}>
                    {stockStatus.text}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-[#cee5ff] font-bold text-base group-hover:text-white transition-colors line-clamp-1">{product.title}</h3>
                      <p className="text-[#a3cbf2]/50 text-xs mt-1 font-medium">{getCategoryName(product.category)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-sky-400 font-black text-xl">${product.price}</span>
                  </div>

                  <p className="text-[#a3cbf2]/40 text-xs mt-2">Stock: {product.stockQuantity} units</p>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 mt-4 pt-4 border-t border-white/5">
                    <button
                      onClick={() => navigate(`/seller/products/${product.id}`)}
                      className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all duration-200"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/seller/products/edit/${product.id}`, { state: { product } })}
                      className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-[#cee5ff] hover:bg-white/5 transition-all duration-200"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => confirmDelete(product.id)}
                      className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[#cee5ff] font-bold text-lg mb-2">Delete Product?</h3>
            <p className="text-[#a3cbf2]/60 text-sm mb-6">This will permanently remove the product from your store. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={deleting} className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all disabled:opacity-50">
                Cancel
              </button>
              <button onClick={doDelete} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <Loader2 size={16} className="animate-spin" /> : null}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(163, 203, 242, 0.2);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;