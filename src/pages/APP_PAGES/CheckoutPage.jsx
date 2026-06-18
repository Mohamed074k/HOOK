import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, CreditCard, Smartphone, MapPin, User, Phone, Mail, 
  Building, Home, Navigation, ShieldCheck, Package, CheckCircle,
  Upload, Image as ImageIcon, X, AlertCircle, ChevronRight, Wallet
} from "lucide-react";
import gsap from "gsap";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { createOrder } from "../../services/order.service";
import { toast } from "react-hot-toast";

// ─── Animated Background ─────────────────────────────────────────────────────
const AnimatedBackground = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".ch-orb-1", { x: 30, y: -20, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ch-orb-2", { x: -40, y: 30, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, bgRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#001526]">
      <div className="ch-orb-1 absolute top-20 left-[10%] w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.08) 0%, transparent 70%)" }} />
      <div className="ch-orb-2 absolute bottom-20 right-[5%] w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,138,167,0.06) 0%, transparent 70%)" }} />
      {[...Array(15)].map((_, i) => (
        <div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-sky-400/20"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
      ))}
    </div>
  );
};

// ─── Booking Stepper (matching booking page) ─────────────────────────────────
const CheckoutStepper = ({ steps, currentStep, setCurrentStep }) => (
  <div className="relative mb-12">
    <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/5 rounded-full" />
    <div className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
    <div className="relative flex justify-between">
      {steps.map((step, idx) => (
        <button 
          key={step.id} 
          onClick={() => idx <= currentStep && setCurrentStep(idx)} 
          className={`flex flex-col items-center gap-2 transition-all ${idx <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all 
            ${idx < currentStep 
              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30" 
              : idx === currentStep 
                ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/40 ring-4 ring-sky-500/20" 
                : "bg-white/5 border border-white/5 text-[#a3cbf2]/40"
            }`}>
            {idx < currentStep ? <CheckCircle size={16} /> : idx + 1}
          </div>
          <span className={`text-xs font-medium hidden sm:block ${idx === currentStep ? "text-sky-400" : "text-[#a3cbf2]/40"}`}>
            {step.label}
          </span>
        </button>
      ))}
    </div>
  </div>
);

// ─── Address Form Component ─────────────────────────────────────────────────
const AddressForm = ({ formData, setFormData, profile }) => {
  const governorates = [
    "Cairo", "Alexandria", "Giza", "Port Said", "Suez", 
    "Luxor", "Aswan", "Asyut", "Beheira", "Beni Suef", 
    "Dakahlia", "Damietta", "Faiyum", "Gharbia", "Ismailia", 
    "Kafr El Sheikh", "Matrouh", "Minya", "Monufia", 
    "New Valley", "North Sinai", "Qalyubia", "Qena", 
    "Red Sea", "Sharqia", "Sohag", "South Sinai"
  ];

  // Pre-fill from profile if available
  useEffect(() => {
    if (profile && !formData.firstName) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        contactEmail: profile.email || "",
        contactPhone: profile.phoneNumber || "",
        governorate: profile.governorate || "",
      }));
    }
  }, [profile]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10">
            <User size={18} className="text-sky-400" />
          </div>
          <h3 className="font-semibold text-[#cee5ff]">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">First Name <span className="text-rose-400">*</span></label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all"
              placeholder="Your"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Last Name <span className="text-rose-400">*</span></label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all"
              placeholder="Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Email <span className="text-rose-400">*</span></label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all"
              placeholder="mohamed@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Phone Number <span className="text-rose-400">*</span></label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all"
              placeholder="+20 123 456 7890"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10">
            <MapPin size={18} className="text-sky-400" />
          </div>
          <h3 className="font-semibold text-[#cee5ff]">Delivery Address</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Governorate <span className="text-rose-400">*</span></label>
            <select
              value={formData.governorate}
              onChange={(e) => setFormData(prev => ({ ...prev, governorate: e.target.value }))}
              className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select Governorate</option>
              {governorates.map(gov => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">City <span className="text-rose-400">*</span></label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all"
              placeholder="City / District"
            />
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Street Address <span className="text-rose-400">*</span></label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all resize-none"
            rows={2}
            placeholder="Building, Street, Area"
          />
        </div>

        <div className="mt-4 space-y-1.5">
          <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Postal Code</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
            className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all"
            placeholder="e.g., 12345"
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─── InstaPay Upload Component ──────────────────────────────────────────────
const InstaPayUpload = ({ receiptImage, setReceiptImage, receiptError, setReceiptError }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setReceiptError("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setReceiptError("Please upload an image file");
        return;
      }
      setReceiptError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setReceiptImage(null);
    setReceiptError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mt-6">
<div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-sky-400/10 shrink-0">
          <Upload size={18} className="text-sky-400" />
        </div>
        <div>
          <h4 className="font-semibold text-[#cee5ff]">Upload Payment Receipt</h4>
          <p className="text-xs text-[#a3cbf2]/50">Please upload a screenshot of your InstaPay payment</p>
          <p className="text-sm font-medium text-sky-400 mt-1">InstaPay Number: 01228563612</p>
        </div>
      </div>

      {!receiptImage ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${receiptError ? 'border-rose-400/50 bg-rose-400/5' : 'border-white/10 hover:border-sky-400/50 hover:bg-sky-400/5'}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <ImageIcon size={40} className="mx-auto text-[#a3cbf2]/30 mb-3" />
          <p className="text-sm text-[#a3cbf2]/60">Click to upload receipt</p>
          <p className="text-xs text-[#a3cbf2]/30 mt-1">PNG, JPG up to 5MB</p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-white/10">
          <img src={receiptImage} alt="Receipt" className="w-full max-h-48 object-contain bg-[#001526] p-2" />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full hover:bg-rose-500 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      )}
      {receiptError && (
        <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
          <AlertCircle size={12} /> {receiptError}
        </p>
      )}
    </div>
  );
};

// ─── Payment Method Selector (matching booking page style) ───────────────────
const PaymentMethodSelector = ({ selectedMethod, setSelectedMethod }) => {
  const methods = [
    { id: 1, name: "Cash on Delivery", icon: Wallet, description: "Pay when you receive your order" },
    { id: 2, name: "Credit Card", icon: CreditCard, description: "Visa, Mastercard accepted" },
    { id: 3, name: "InstaPay", icon: Smartphone, description: "Pay via InstaPay mobile wallet" },
  ];

  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const Icon = method.icon;
        const isSelected = selectedMethod === method.id;
        return (
          <motion.button
            key={method.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedMethod(method.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4
              ${isSelected 
                ? "border-sky-400 bg-sky-400/10 shadow-lg shadow-sky-400/10" 
                : "border-white/5 bg-[#001526] hover:border-white/10"
              }`}
          >
            <div className={`p-2 rounded-lg ${isSelected ? "bg-sky-400/20" : "bg-[#002238]"}`}>
              <Icon size={20} className={isSelected ? "text-sky-400" : "text-[#a3cbf2]/40"} />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-sm ${isSelected ? "text-sky-400" : "text-[#cee5ff]"}`}>
                {method.name}
              </h3>
              <p className="text-xs text-[#a3cbf2]/50">{method.description}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${isSelected ? "border-sky-400" : "border-white/20"}`}
            >
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

// ─── Credit Card Form (empty fields for user to fill) ───────────────────────
const CreditCardForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Cardholder Name</label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Your Name"
          className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all"
        />
      </div>
      
      <div className="space-y-1.5">
        <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="4111 1111 1111 1111"
          maxLength="19"
          className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Expiry Date (MM/YY)</label>
          <input
            type="text"
            value={expiryDate}
            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
            placeholder="12/28"
            maxLength="5"
            className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">CVC/CVV</label>
          <input
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
            placeholder="123"
            maxLength="4"
            className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/50 transition-all"
          />
        </div>
      </div>
      
   
    </div>
  );
};

// ─── Order Summary Sidebar (matching booking page style) ─────────────────────
const OrderSummary = ({ cartItems, cartTotal, shipping, finalTotal }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    const baseUrl = import.meta.env.VITE_API_URL || "https://hook.runasp.net";
    return `${baseUrl}${url}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#002238] border border-white/5 rounded-2xl overflow-hidden sticky top-8">
      <div className="p-5 border-b border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-400/10">
            <Package size={18} className="text-sky-400" />
          </div>
          <h3 className="font-semibold text-[#cee5ff]">Order Summary</h3>
        </div>
        <motion.button animate={{ rotate: isExpanded ? 180 : 0 }} className="text-[#a3cbf2]/60">
          <ChevronRight size={16} />
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-5 space-y-4">
              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-white/5">
                    <div className="w-12 h-12 bg-[#001526] rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {item.mainImageUrl || item.imageUrls?.[0] ? (
                        <img 
                          src={getImageUrl(item.mainImageUrl || item.imageUrls[0])} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={20} className="text-white/10" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#cee5ff] truncate">{item.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-[#a3cbf2]/60">{item.quantity} × ${item.price?.toFixed(2)}</span>
                        <span className="text-sm font-bold text-sky-400">${((item.price || 0) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a3cbf2]/60">Subtotal ({cartItems.length} items)</span>
                  <span className="text-[#cee5ff]">${cartTotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a3cbf2]/60">Shipping</span>
                  <span className="text-[#cee5ff]">
                    {shipping === 0 ? <span className="text-emerald-400">Free</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center">
                  <span className="font-bold text-[#cee5ff] text-base">Total</span>
                  <span className="text-sky-400 text-2xl font-black">${finalTotal?.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#a3cbf2]/40 pt-4 border-t border-white/5">
                <ShieldCheck size={14} className="text-emerald-400/50" />
                Secure encrypted transaction
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Checkout Page ──────────────────────────────────────────────────────
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactEmail: "",
    contactPhone: "",
    governorate: "",
    city: "",
    address: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState(1); // 1 = Cash on Delivery, 2 = Credit Card, 3 = InstaPay
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptError, setReceiptError] = useState(null);

  const steps = [
    { id: 1, label: "Shipping Info" },
    { id: 2, label: "Payment" }
  ];

  // Redirect if not authenticated or cart empty
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to checkout");
      navigate("/login");
    }
    if (!authLoading && cartItems.length === 0) {
       navigate("/marketplace");
    }
  }, [user, authLoading, cartItems, navigate]);

  // Calculate shipping
  const shipping = cartTotal > 500 ? 0 : 25;
  const finalTotal = cartTotal + (cartItems.length > 0 ? shipping : 0);

  // Validate Step 1
  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!formData.contactEmail.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      toast.error("Email is invalid");
      return false;
    }
    if (!formData.contactPhone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!formData.governorate) {
      toast.error("Governorate is required");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("City is required");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    return true;
  };

  // Validate Step 2
  const validateStep2 = () => {
    if (paymentMethod === 3 && !receiptImage) {
      setReceiptError("Please upload the InstaPay receipt");
      toast.error("Please upload the InstaPay receipt");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 0 && validateStep1()) {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    
    try {
      const items = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const orderData = {
        items,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        governorate: formData.governorate,
        city: formData.city,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        postalCode: formData.postalCode || "",
        paymentMethod: paymentMethod,
        clearCartItems: true
      };
      
      if (paymentMethod === 3 && receiptImage) {
        sessionStorage.setItem('instapay_receipt', receiptImage);
      }

      const response = await createOrder(orderData);
      
      clearCart();
      sessionStorage.setItem('last_order', JSON.stringify(response));
      
      toast.success("Order placed successfully!");
      navigate("/order-confirmation", { state: { orders: response } });
      
    } catch (error) {
      console.error("Order creation error:", error);
      let errorMessage = "Failed to place order";
      if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#001526] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-12 bg-[#001526]">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/cart">
            <motion.button 
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#a3cbf2] hover:text-sky-400"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#cee5ff] leading-tight">Checkout</h1>
            <p className="text-sm md:text-base text-[#a3cbf2]/60 mt-1">Complete your purchase and secure your gear</p>
          </div>
        </div>

        <CheckoutStepper steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 0 ? (
                <AddressForm 
                  key="step1"
                  formData={formData}
                  setFormData={setFormData}
                  profile={profile}
                />
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                      <div className="p-2 rounded-lg bg-sky-400/10">
                        <CreditCard size={18} className="text-sky-400" />
                      </div>
                      <h3 className="font-semibold text-[#cee5ff]">Payment Method</h3>
                    </div>
                    
                    <PaymentMethodSelector 
                      selectedMethod={paymentMethod}
                      setSelectedMethod={setPaymentMethod}
                    />
                    
                    {paymentMethod === 2 && <CreditCardForm />}
                    
                    {paymentMethod === 3 && (
                      <InstaPayUpload 
                        receiptImage={receiptImage}
                        setReceiptImage={setReceiptImage}
                        receiptError={receiptError}
                        setReceiptError={setReceiptError}
                      />
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4">
                    <motion.button
                      onClick={handlePrevStep}
                      className="px-6 py-3 rounded-xl border border-white/10 text-[#a3cbf2] font-semibold hover:bg-white/5 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                    
                    <motion.button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(83,214,251,0.2)] hover:shadow-[0_0_30px_rgba(83,214,251,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order <ChevronRight size={18} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue button for step 1 */}
            {currentStep === 0 && (
              <motion.button
                onClick={handleNextStep}
                className="w-full mt-5 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(83,214,251,0.2)] hover:shadow-[0_0_30px_rgba(83,214,251,0.4)] transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue to Payment <ChevronRight size={18} />
              </motion.button>
            )}
          </div>

          <div className="lg:col-span-1">
            <OrderSummary 
              cartItems={cartItems}
              cartTotal={cartTotal}
              shipping={shipping}
              finalTotal={finalTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;