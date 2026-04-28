import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, Plus, Minus, ArrowLeft, CreditCard, 
  ShoppingBag, ShieldCheck, Anchor 
} from "lucide-react";
import gsap from "gsap";
import { useCart } from "./../../context/CartContext";

// ─── Animated Background ────────────────────────────────
const AnimatedBackground = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".m-orb-1", { x: 40, y: -30, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".m-orb-2", { x: -50, y: 20, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".m-orb-3", { scale: 1.1, opacity: 0.6, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, bgRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#001526]">
      <div className="m-orb-1 absolute top-20 left-[10%] w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.08) 0%, transparent 70%)" }} />
      <div className="m-orb-2 absolute bottom-20 right-[5%] w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,138,167,0.06) 0%, transparent 70%)" }} />
      <div className="m-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(83,214,251,0.04) 0%, transparent 60%)" }} />
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-sky-400/20"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
      ))}
    </div>
  );
};

// ─── Main Cart Page ───────────────────────────────────────────────────────────
const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const pageRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(".m-cart-title", { opacity: 0, y: -20, duration: 0.6, ease: "power2.out" });
      if (summaryRef.current) {
        gsap.from(summaryRef.current, { opacity: 0, x: 20, duration: 0.6, delay: 0.2, ease: "back.out(0.5)" });
      }
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const shipping = cartTotal > 500 ? 0 : 25; // Free shipping over $500
  const finalTotal = cartTotal + shipping;

  return (
    <div ref={pageRef} className="relative min-h-screen pt-8 px-4 md:px-8 pb-12 text-[#cee5ff] max-w-7xl mx-auto">
      <AnimatedBackground />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 m-cart-title">
        <div>
          <button className="flex items-center gap-2 text-[#a3cbf2]/60 hover:text-sky-400 transition-colors mb-4 text-sm">
            <ArrowLeft size={16} />
            Back to Locker
          </button>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#cee5ff] via-sky-300 to-[#53D6FB] bg-clip-text text-transparent">
            Your Cart
          </h1>
        </div>
        <div className="bg-[#002238] border border-white/5 rounded-2xl px-4 py-3 hidden sm:flex items-center gap-3">
          <ShoppingBag className="text-sky-400" size={24} />
          <div>
            <div className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Items</div>
            <div className="font-bold text-lg leading-none">{cartCount}</div>
          </div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#002238] border border-white/5 rounded-3xl p-12 text-center max-w-2xl mx-auto mt-12"
        >
          <Anchor size={64} className="mx-auto text-white/10 mb-6" />
          <h2 className="text-2xl font-bold mb-2">Your locker is empty</h2>
          <p className="text-[#a3cbf2]/60 mb-8">Looks like you haven't added any gear for your next voyage yet.</p>
          <button className="px-8 py-3 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400 font-semibold hover:bg-sky-400/20 transition-colors inline-flex items-center gap-2">
            <ShoppingBag size={18} />
            Explore Gear
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#002238] border border-white/5 rounded-2xl p-4 flex flex-row items-center gap-4 sm:gap-6 hover:border-white/10 transition-colors group relative overflow-hidden"
                >
                  {/* Subtle glow effect like the product cards */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Image/Emoji - Fixed width for mobile now */}
                  <div className="w-24 sm:w-28 aspect-square bg-gradient-to-br from-[#002c49] to-[#001526] rounded-xl flex items-center justify-center text-4xl sm:text-5xl border border-white/5 shrink-0 relative">
                    {item.emoji}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                      <div className="truncate pr-2">
                        <span className="text-[10px] font-bold text-sky-400 tracking-widest uppercase">{item.type}</span>
                        <h3 className="text-lg sm:text-xl font-bold text-[#cee5ff] truncate">{item.name}</h3>
                      </div>
                      <span className="text-lg sm:text-xl font-bold text-sky-400 tabular-nums">${item.price}</span>
                    </div>
                    <p className="text-[#a3cbf2]/60 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-1">{item.seller}</p>

                    {/* Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 sm:gap-3 bg-[#001526] border border-white/5 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 sm:p-1.5 hover:bg-white/5 rounded-md text-[#a3cbf2] transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-5 sm:w-6 text-center font-semibold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 sm:p-1.5 hover:bg-white/5 rounded-md text-[#a3cbf2] transition-colors disabled:opacity-50"
                          disabled={item.quantity >= item.inStock}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400/70 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div ref={summaryRef} className="bg-[#002238] border border-white/5 rounded-3xl p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-sky-400" />
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-[#a3cbf2]/80">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold tabular-nums">${cartTotal}</span>
                </div>
                <div className="flex justify-between text-[#a3cbf2]/80">
                  <span>Shipping</span>
                  <span className="font-semibold tabular-nums">
                    {shipping === 0 ? <span className="text-emerald-400">Free</span> : `$${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="text-[10px] text-[#a3cbf2]/40 text-right">
                    Spend ${500 - cartTotal} more for free shipping
                  </div>
                )}
              </div>

              <div className="border-t border-white/5 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg text-[#cee5ff]">Total</span>
                  <span className="text-3xl font-black text-sky-400 tabular-nums">${finalTotal}</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-sky-400 text-[#001526] font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(83,214,251,0.2)] hover:shadow-[0_0_30px_rgba(83,214,251,0.4)] transition-shadow"
              >
                Proceed to Checkout
              </motion.button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#a3cbf2]/40">
                <ShieldCheck size={14} />
                Secure encrypted transmission
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;