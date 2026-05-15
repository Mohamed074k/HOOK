import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, Star, Loader2, Pencil } from "lucide-react";
import { useProducts } from "../../context/SELLER_CONTEXT/ProductContext";
import ProductReviews from "./../../components/SELLER_COMPONENTS/ProductReviews";

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProductDetails, getCategoryName, getConditionText, getConditionStyle, getImageUrl, isSeller } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchProductDetails();
    return () => clearTimeout(timer);
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const data = await getProductDetails(id);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[#a3cbf2]/50">Product not found</p>
        </div>
      </div>
    );
  }

  const conditionStyle = getConditionStyle(product.condition);
  const stockStatus = product.stockQuantity <= 0 ? "Out of Stock" : (product.stockQuantity <= 5 ? "Low Stock" : "In Stock");
  const stockColor = product.stockQuantity <= 0 ? "text-rose-400" : (product.stockQuantity <= 5 ? "text-yellow-400" : "text-emerald-400");

  // Show reviews view
  if (showReviews) {
    return (
      <ProductReviews 
        product={product} 
        onBack={() => setShowReviews(false)} 
        animate={animate}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div 
        className="flex items-center justify-between transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)" }}
      >
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/seller/products")} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#a3cbf2] hover:text-white hover:border-white/10 transition-all shadow-sm">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">{product.title}</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">Product Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReviews(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-400/20 hover:bg-amber-500/20 transition-all duration-300"
          >
            <Star size={15} />
          </button>
          <button
            onClick={() => navigate(`/seller/products/edit/${id}`, { state: { product } })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-400/20 hover:bg-sky-500/20 transition-all duration-300"
          >
            <Pencil size={15} /> 
          </button>
        </div>
      </div>
      
      {/* Image Gallery */}
      {product.imageUrls && product.imageUrls.length > 0 && (
        <div 
          className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out hover:border-white/10"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
        >
          <h2 className="text-sm font-bold text-[#cee5ff] mb-4">Gallery</h2>
          <div className="grid grid-cols-3 gap-3">
            {product.imageUrls.map((img, idx) => (
              <div key={idx} className="group aspect-square rounded-xl overflow-hidden bg-[#001526] border border-white/5 flex items-center justify-center cursor-pointer"
                   onClick={() => window.open(getImageUrl(img), '_blank')}>
                <img src={getImageUrl(img)} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Product Info */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <h2 className="text-sm font-bold text-[#cee5ff] mb-4">Product Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-[#a3cbf2]/50 text-sm">Product Name</span>
            <span className="text-[#cee5ff] font-medium">{product.title}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-[#a3cbf2]/50 text-sm">Category</span>
            <span className="text-[#cee5ff] font-medium">{getCategoryName(product.category)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-[#a3cbf2]/50 text-sm">Condition</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${conditionStyle}`}>
              {getConditionText(product.condition)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-[#a3cbf2]/50 text-sm">Price</span>
            <span className="text-sky-400 font-bold text-lg">${product.price}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-[#a3cbf2]/50 text-sm">Stock Quantity</span>
            <span className={`font-medium ${stockColor}`}>{product.stockQuantity} units ({stockStatus})</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-[#a3cbf2]/50 text-sm">Seller</span>
            <span className="text-[#cee5ff] font-medium">{product.sellerName}</span>
          </div>
          <div className="py-2 px-2">
            <span className="text-[#a3cbf2]/50 text-sm block mb-2 font-medium">Description</span>
            <p className="text-[#cee5ff]/80 text-sm leading-relaxed bg-[#001526] p-4 rounded-xl border border-white/5">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;