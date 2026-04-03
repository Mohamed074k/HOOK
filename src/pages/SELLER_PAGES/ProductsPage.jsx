import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye, Filter, Package, ChevronDown } from "lucide-react";

const initialProducts = [
  { id: "1", name: "Apex Carbon Reel", category: "Reels", price: 849, stock: 14, rating: 4.8, image: null, status: "Active" },
  { id: "2", name: "HydroScan V3", category: "Electronics", price: 1299, stock: 6, rating: 4.9, image: null, status: "Active" },
  { id: "3", name: "Deep Bait Master", category: "Baits", price: 145, stock: 52, rating: 4.5, image: null, status: "Active" },
  { id: "4", name: "Nautical One Pro", category: "Hooks", price: 550, stock: 0, rating: 4.2, image: null, status: "Out of Stock" },
  { id: "5", name: "CarbonFlex Rod 9ft", category: "Fishing Rods", price: 720, stock: 3, rating: 4.7, image: null, status: "Low Stock" },
];

const categories = ["All Categories", "Fishing Rods", "Reels", "Baits", "Hooks", "Electronics", "Wearables"];
const statusFilters = ["All", "Active", "Out of Stock", "Low Stock"];

const statusStyles = {
  Active: "bg-sky-400/10 text-sky-400",
  "Out of Stock": "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",
  "Low Stock": "bg-yellow-400/10 text-yellow-400",
};

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Animation & Dropdown States
  const [animate, setAnimate] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'category' | 'status' | null

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    const matchesPrice = (!priceRange.min || p.price >= parseInt(priceRange.min)) &&
                         (!priceRange.max || p.price <= parseInt(priceRange.max));
    return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
  });

  const confirmDelete = (id) => setDeleteId(id);
  const doDelete = () => {
    setProducts(products.filter(p => p.id !== deleteId));
    setDeleteId(null);
  };

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
          <p className="text-[#a3cbf2]/50 text-sm mt-1">{filteredProducts.length} products found</p>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

      {/* Filter Panel (Animated Fade Down) */}
      {showFilters && (
        <div className="bg-[#002238] border border-white/5 rounded-2xl p-5 shadow-lg relative z-40 animate-[fadeDown_0.3s_ease-out]">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            
            {/* Animated Category Filter */}
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

            {/* Animated Status Filter */}
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
            onClick={() => { setCategoryFilter("All Categories"); setStatusFilter("All"); setPriceRange({ min: "", max: "" }); setSearch(""); }}
            className="mt-4 text-xs font-semibold text-[#a3cbf2]/40 hover:text-sky-400 transition-colors duration-200"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
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
          {filteredProducts.map((product, idx) => (
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
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <Package size={40} className="text-[#a3cbf2]/20 group-hover:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#002238] via-transparent to-transparent opacity-60" />
                {/* Floating Status Badge */}
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm z-10 ${statusStyles[product.status]}`}>
                  {product.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[#cee5ff] font-bold text-base group-hover:text-white transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-[#a3cbf2]/50 text-xs mt-1 font-medium">{product.category}</p>
                  </div>
                  <span className="text-yellow-400 text-xs tracking-widest shrink-0 ml-2">
                    {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <span className="text-sky-400 font-black text-xl">${product.price}</span>
                </div>

                <p className="text-[#a3cbf2]/40 text-xs mt-2">Stock: {product.stock} units</p>

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
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[#cee5ff] font-bold text-lg mb-2">Delete Product?</h3>
            <p className="text-[#a3cbf2]/60 text-sm mb-6">This will permanently remove the product from your store. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
                Cancel
              </button>
              <button onClick={doDelete} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Required custom CSS for the filter fade-down animation */}
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Custom scrollbar to keep animated dropdowns looking clean */
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(163, 203, 242, 0.4);
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;