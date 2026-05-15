import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ImagePlus, Upload, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { useProducts } from "../../context/SELLER_CONTEXT/ProductContext";

const categories = [
  { id: 1, name: "Fishing Rods" },
  { id: 2, name: "Fishing Reels" },
  { id: 3, name: "Fishing Lines" },
  { id: 4, name: "Hooks & Rigs" },
  { id: 5, name: "Lures & Baits" },
  { id: 6, name: "Fishing Accessories" },
  { id: 7, name: "Fishing Clothing" },
  { id: 8, name: "Snorkeling & Diving" },
  { id: 9, name: "Boats & Marine Equipment" },
  { id: 10, name: "Storage & Bags" },
];

const conditions = [
  { id: 1, name: "New" },
  { id: 2, name: "Used" },
];

const AddProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingProduct = location.state?.product;
  const { createProduct, updateProduct, getImageUrl } = useProducts();
  
  const [animate, setAnimate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: editingProduct?.title || "",
    description: editingProduct?.description || "",
    condition: editingProduct?.condition || 1,
    category: editingProduct?.category || 1,
    price: editingProduct?.price || "",
    stockQuantity: editingProduct?.stockQuantity || "",
    images: [],
    existingImages: editingProduct?.imageUrls || [],
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const galleryRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    
    // Load existing image previews
    if (editingProduct?.imageUrls) {
      const previews = editingProduct.imageUrls.map(url => getImageUrl(url));
      setImagePreviews(previews);
    }
    
    return () => clearTimeout(timer);
  }, []);
  
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...formData.images, ...files];
    set("images", newImages);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      // Remove existing image (we'll handle this on update)
      const newExisting = formData.existingImages.filter((_, i) => i !== index);
      set("existingImages", newExisting);
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove new image
      const newImages = formData.images.filter((_, i) => i !== index);
      set("images", newImages);
      setImagePreviews(prev => prev.filter((_, i) => i !== index + formData.existingImages.length));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.stockQuantity === "" || parseInt(formData.stockQuantity) < 0) newErrors.stockQuantity = "Stock must be 0 or greater";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validate()) return;
    
    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct({
          productId: editingProduct.id,
          title: formData.title,
          description: formData.description,
          condition: formData.condition,
          category: formData.category,
          price: parseFloat(formData.price),
          stockQuantity: parseInt(formData.stockQuantity),
          newImages: formData.images,
        });
      } else {
        await createProduct({
          title: formData.title,
          description: formData.description,
          condition: formData.condition,
          category: formData.category,
          price: parseFloat(formData.price),
          stockQuantity: parseInt(formData.stockQuantity),
          images: formData.images,
        });
      }
      navigate("/seller/products");
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div 
        className="flex items-center gap-4 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)" }}
      >
        <button onClick={() => navigate("/seller/products")} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#a3cbf2] hover:text-white hover:border-white/10 transition-all shadow-sm">
          <ArrowLeft size={18} />
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
            Product Title *
          </label>
          <input
            type="text"
            placeholder="e.g., Apex Carbon Reel"
            value={formData.title}
            onChange={(e) => set("title", e.target.value)}
            className={`w-full bg-[#001526] border ${errors.title ? 'border-red-400/50' : 'border-white/5 hover:border-sky-400/30'} rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300`}
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>
        
        {/* Category & Condition Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => set("category", parseInt(e.target.value))}
              className="w-full bg-[#001526] border border-white/5 hover:border-sky-400/30 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
              Condition *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => set("condition", parseInt(e.target.value))}
              className="w-full bg-[#001526] border border-white/5 hover:border-sky-400/30 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300"
            >
              {conditions.map(cond => (
                <option key={cond.id} value={cond.id}>{cond.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            Description *
          </label>
          <textarea
            rows={5}
            placeholder="Full product description including features, specifications, materials, etc."
            value={formData.description}
            onChange={(e) => set("description", e.target.value)}
            className={`w-full bg-[#001526] border ${errors.description ? 'border-red-400/50' : 'border-white/5 hover:border-sky-400/30'} rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 resize-none`}
          />
          {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
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
              value={formData.stockQuantity}
              onChange={(e) => set("stockQuantity", e.target.value)}
              className={`w-full bg-[#001526] border ${errors.stockQuantity ? 'border-red-400/50' : 'border-white/5 hover:border-sky-400/30'} rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300`}
            />
            {errors.stockQuantity && <p className="text-red-400 text-xs mt-1">{errors.stockQuantity}</p>}
          </div>
        </div>
        
        {/* Images */}
        <div>
          <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
            Product Images
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-1">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-[#001526] border border-white/5">
                <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button
                  type="button"
                  onClick={() => removeImage(i, i < (formData.existingImages?.length || 0))}
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
          disabled={saving}
          className="px-5 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all duration-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : null}
          {saving ? "Saving..." : (editingProduct ? "Update Product" : "Save Product")}
        </button>
      </div>
    </div>
  );
};

export default AddProductPage;