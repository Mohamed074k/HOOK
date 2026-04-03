import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ImagePlus, Upload, Trash2, ChevronLeft } from "lucide-react";

const categories = ["Fishing Rods", "Reels", "Baits", "Hooks", "Electronics", "Wearables", "Tools", "Apparel"];

const AddProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingProduct = location.state?.product;
  
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    name: editingProduct?.name || "",
    shortDescription: editingProduct?.shortDescription || "",
    detailedDescription: editingProduct?.detailedDescription || "",
    category: editingProduct?.category || "Fishing Rods",
    price: editingProduct?.price || "",
    stock: editingProduct?.stock || "",
    images: editingProduct?.images || [],
  });
  
  const [errors, setErrors] = useState({});
  const galleryRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => set("images", [...formData.images, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index) => {
    set("images", formData.images.filter((_, i) => i !== index));
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.stock === "" || parseInt(formData.stock) < 0) newErrors.stock = "Stock must be 0 or greater";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!validate()) return;
    // Save logic here
    navigate("/seller/products");
  };
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div 
        className="flex items-center gap-4 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)" }}
      >
        <button onClick={() => navigate("/seller/products")} className="p-2 rounded-xl text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-[#a3cbf2]/50 text-sm mt-1">
            {editingProduct ? "Update your product information" : "Add a new product to your store"}
          </p>
        </div>
      </div>
      
      {/* Form */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 space-y-6 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        {/* Basic Info */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            Product Name *
          </label>
          <input
            type="text"
            placeholder="e.g., Apex Carbon Reel"
            value={formData.name}
            onChange={(e) => set("name", e.target.value)}
            className={`w-full bg-[#001526] border ${errors.name ? 'border-red-400/50' : 'border-white/5 hover:border-sky-400/30'} rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300`}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        
        {/* Category Dropdown */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full bg-[#001526] border border-white/5 hover:border-sky-400/30 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300"
          >
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
        </div>
        
        {/* Short Description */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            Short Description
          </label>
          <textarea
            rows={2}
            placeholder="Brief description shown in product cards"
            value={formData.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            className="w-full bg-[#001526] border border-white/5 hover:border-sky-400/30 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 resize-none"
          />
        </div>
        
        {/* Detailed Description */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            Detailed Description
          </label>
          <textarea
            rows={5}
            placeholder="Full product description including features, specifications, materials, etc."
            value={formData.detailedDescription}
            onChange={(e) => set("detailedDescription", e.target.value)}
            className="w-full bg-[#001526] border border-white/5 hover:border-sky-400/30 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 resize-none"
          />
        </div>
        
        {/* Pricing & Inventory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
              Price ($) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => set("price", e.target.value)}
              className={`w-full bg-[#001526] border ${errors.price ? 'border-red-400/50' : 'border-white/5 hover:border-sky-400/30'} rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300`}
            />
            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
              Stock Quantity *
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => set("stock", e.target.value)}
              className={`w-full bg-[#001526] border ${errors.stock ? 'border-red-400/50' : 'border-white/5 hover:border-sky-400/30'} rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300`}
            />
            {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock}</p>}
          </div>
        </div>
        
        {/* Images */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            Product Images
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-1">
            {formData.images.map((src, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-[#001526] border border-white/5">
                <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} className="text-white" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-sky-400/30 hover:bg-sky-400/5 flex flex-col items-center justify-center gap-1 transition-all duration-300 text-[#a3cbf2]/30 hover:text-sky-400"
            >
              <ImagePlus size={20} />
              <span className="text-xs font-medium">Upload</span>
            </button>
          </div>
          <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          <p className="text-[#a3cbf2]/30 text-xs mt-2">Upload multiple product images</p>
        </div>
      </div>
      
      {/* Buttons */}
      <div 
        className="flex items-center justify-end gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <button
          onClick={() => navigate("/seller/products")}
          className="px-5 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          {editingProduct ? "Update Product" : "Save Product"}
        </button>
      </div>
    </div>
  );
};

export default AddProductPage;