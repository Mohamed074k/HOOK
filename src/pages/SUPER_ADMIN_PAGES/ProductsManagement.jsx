import { useState, useEffect } from "react";
import { Search, Eye, Power, Trash2, X } from "lucide-react";

const initialProducts = [
  { id: "1", name: "Apex Carbon Reel", seller: "The Bait Shop", price: 849, stock: 14, status: "Active" },
  { id: "2", name: "HydroScan V3", seller: "Ocean Gear Co.", price: 1299, stock: 6, status: "Active" },
  { id: "3", name: "Deep Bait Master", seller: "Deep Blue Tackle", price: 145, stock: 52, status: "Disabled" },
  { id: "4", name: "CarbonFlex Rod", seller: "Reel Masters", price: 720, stock: 3, status: "Active" },
];

const statusStyles = {
  Active: "bg-sky-400/10 text-sky-400",
  Disabled: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",
};

const ProductsManagement = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);

  // Modal Animation States
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Prevent scrolling when ANY modal is open
  useEffect(() => {
    if (isDeleteVisible || isDetailsVisible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isDeleteVisible, isDetailsVisible]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.seller.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, status: p.status === "Active" ? "Disabled" : "Active" } : p
    ));
  };

  // Delete Modal Handlers
  const openDelete = (id) => {
    setDeleteId(id);
    setTimeout(() => setIsDeleteVisible(true), 10);
  };
  const closeDelete = () => {
    setIsDeleteVisible(false);
    setTimeout(() => setDeleteId(null), 300);
  };
  const doDelete = () => {
    setProducts(products.filter(p => p.id !== deleteId));
    closeDelete();
  };

  // Details Modal Handlers
  const openDetails = (product) => {
    setSelectedProduct(product);
    setTimeout(() => setIsDetailsVisible(true), 10);
  };
  const closeDetails = () => {
    setIsDetailsVisible(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div 
        className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Products Management</h1>
      </div>

      <div 
        className="relative max-w-sm transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 shadow-sm transition-colors"
          placeholder="Search products by name or seller..."
        />
      </div>

      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-[#001526] border-b border-white/10">
            <tr>
              {["Product Name", "Seller", "Price", "Stock", "Status", ""].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200">
                <td className="px-6 py-4 text-[#cee5ff] font-medium">{product.name}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{product.seller}</td>
                <td className="px-6 py-4 text-sky-400 font-bold">${product.price}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{product.stock} units</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[product.status]}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openDetails(product)} className="p-1.5 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => toggleStatus(product.id)} className="p-1.5 rounded-lg text-[#a3cbf2]/30 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all">
                      <Power size={16} />
                    </button>
                    <button onClick={() => openDelete(product.id)} className="p-1.5 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div 
        className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[#cee5ff] font-semibold text-sm">{product.name}</p>
                <p className="text-[#a3cbf2]/40 text-xs mt-0.5">{product.seller}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[product.status]}`}>
                {product.status}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-sky-400 font-bold">${product.price}</span>
              <span className="text-[#a3cbf2]/40 text-xs">{product.stock} in stock</span>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
               <button onClick={() => openDetails(product)} className="flex-1 flex justify-center p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all">
                 <Eye size={16} />
               </button>
               <button onClick={() => toggleStatus(product.id)} className="flex-1 flex justify-center p-2 rounded-lg text-[#a3cbf2]/30 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all">
                 <Power size={16} />
               </button>
               <button onClick={() => openDelete(product.id)} className="flex-1 flex justify-center p-2 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                 <Trash2 size={16} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedProduct && (
        <div 
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isDetailsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={closeDetails}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl transition-all duration-300 transform ${isDetailsVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#cee5ff] font-bold text-lg">Product Details</h3>
              <button onClick={closeDetails} className="text-[#a3cbf2]/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 bg-[#001526] p-5 rounded-xl border border-white/5">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Product Name</span>
                <span className="text-[#cee5ff] font-medium text-right ml-4">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Seller</span>
                <span className="text-[#cee5ff] font-medium text-right ml-4">{selectedProduct.seller}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Price</span>
                <span className="text-sky-400 font-bold text-lg">${selectedProduct.price}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Stock</span>
                <span className="text-[#cee5ff] font-medium">{selectedProduct.stock} units</span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[selectedProduct.status]}`}>
                  {selectedProduct.status}
                </span>
              </div>
            </div>
            
            <button onClick={closeDetails} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300">
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div 
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isDeleteVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={closeDelete}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transition-all duration-300 transform ${isDeleteVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#cee5ff] font-bold text-lg mb-2">Delete Product?</h3>
            <p className="text-[#a3cbf2]/60 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={closeDelete} className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Cancel</button>
              <button onClick={doDelete} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;