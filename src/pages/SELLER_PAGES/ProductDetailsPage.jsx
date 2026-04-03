import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Package, Star, ShoppingCart, Pencil } from "lucide-react";

// Mock product data - in real app, fetch by ID
const mockProduct = {
  id: "1",
  name: "Apex Carbon Reel",
  category: "Reels",
  price: 849,
  stock: 14,
  rating: 4.8,
  images: [null, null, null],
  shortDescription: "Premium carbon fishing reel with smooth drag system",
  detailedDescription: "The Apex Carbon Reel features a lightweight carbon body, 15lb drag system, and corrosion-resistant bearings. Perfect for both freshwater and saltwater fishing. Includes 3-year warranty.",
  reviews: [
    { user: "John D.", rating: 5, comment: "Best reel I've ever used!", date: "Mar 25" },
    { user: "Sarah M.", rating: 4.5, comment: "Very smooth, great value", date: "Mar 20" },
  ],
};

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [animate, setAnimate] = useState(false);
  const product = mockProduct; // In real app, fetch product by id

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div 
        className="flex items-center justify-between transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)" }}
      >
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/seller/products")} className="p-2 rounded-xl text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">{product.name}</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">Product Details</p>
          </div>
        </div>
        {/* <button
          onClick={() => navigate(`/seller/products/edit/${id}`, { state: { product } })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-400/20 hover:bg-sky-500/20 transition-all duration-300"
        >
          <Pencil size={15} /> Edit Product
        </button> */}
      </div>
      
      {/* Image Gallery */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <h2 className="text-sm font-bold text-[#cee5ff] mb-4">Gallery</h2>
        <div className="grid grid-cols-3 gap-3">
          {product.images.map((img, idx) => (
            <div key={idx} className="group aspect-square rounded-xl overflow-hidden bg-[#001526] border border-white/5 flex items-center justify-center">
              {img ? (
                <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <Package size={32} className="text-[#a3cbf2]/20 transition-transform duration-500 group-hover:scale-110" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Product Info */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <h2 className="text-sm font-bold text-[#cee5ff] mb-4">Product Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-[#a3cbf2]/50 text-sm">Product Name</span>
            <span className="text-[#cee5ff] font-medium">{product.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-[#a3cbf2]/50 text-sm">Category</span>
            <span className="text-[#cee5ff] font-medium">{product.category}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-[#a3cbf2]/50 text-sm">Price</span>
            <span className="text-sky-400 font-bold text-lg">${product.price}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-[#a3cbf2]/50 text-sm">Stock Quantity</span>
            <span className={`font-medium ${product.stock <= 5 ? 'text-yellow-400' : 'text-[#cee5ff]'}`}>{product.stock} units</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
            <span className="text-[#a3cbf2]/50 text-sm">Rating</span>
            <span className="flex items-center gap-1 text-yellow-400 text-sm tracking-widest">
              {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
              <span className="text-[#a3cbf2]/40 text-xs ml-1 font-sans">({product.rating})</span>
            </span>
          </div>
          <div className="py-2 px-2">
            <span className="text-[#a3cbf2]/50 text-sm block mb-2 font-medium">Short Description</span>
            <p className="text-[#cee5ff]/80 text-sm bg-[#001526] p-3 rounded-xl border border-white/5">{product.shortDescription}</p>
          </div>
          <div className="py-2 px-2">
            <span className="text-[#a3cbf2]/50 text-sm block mb-2 font-medium">Detailed Description</span>
            <p className="text-[#cee5ff]/80 text-sm leading-relaxed bg-[#001526] p-4 rounded-xl border border-white/5">{product.detailedDescription}</p>
          </div>
        </div>
      </div>
      
      {/* Reviews */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out hover:border-white/10"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "300ms" }}
      >
        <h2 className="text-sm font-bold text-[#cee5ff] mb-4">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-[#a3cbf2]/40 text-sm text-center py-6 bg-[#001526] rounded-xl border border-white/5">No reviews yet</p>
        ) : (
          <div className="space-y-3">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="bg-[#001526] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#cee5ff] font-medium text-sm">{review.user}</span>
                  <span className="text-yellow-400 text-xs tracking-widest">
                    {"★".repeat(Math.floor(review.rating))}{"☆".repeat(5 - Math.floor(review.rating))}
                  </span>
                </div>
                <p className="text-[#a3cbf2]/40 text-xs mb-2">{review.date}</p>
                <p className="text-[#cee5ff]/80 text-sm">"{review.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;