import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { 
  Calendar, Clock, MapPin, Users, CreditCard, Wallet, 
  ChevronRight, ChevronLeft, Check, Shield, AlertCircle,
  User, Mail, Phone, MessageSquare, Lock, Eye, EyeOff,
  ArrowLeft, Home, Plane, Ship, Anchor, Waves, Star,
  Sparkles, Ticket, DollarSign, ShoppingBag, Trash2, 
  Plus, Minus, CreditCard as CardIcon, Building, Smartphone,
  HelpCircle, FileText, Truck, Award, Gift, Zap, Heart,
  Clock as ClockIcon, Banknote, CheckCircle, Loader2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const ease = [0.25, 0.46, 0.45, 0.94];

// ─── Trip Data (fallback if no state is passed) ─────────────────────────────
const tripsData = [
  { 
    id: 1,
    title: "Deep Sea Fishing Adventure", 
    location: "Gulf of Mexico, Florida", 
    duration: "8 hours", 
    crew: 6, 
    price: 1000,
    priceDisplay: "$1,000",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop",
    rating: 4.9,
    departureDates: ["May 15, 2024", "May 22, 2024", "May 29, 2024", "June 5, 2024"],
  },
  { 
    id: 2,
    title: "Keys Fly-Fishing Charter", 
    location: "Islamorada, Florida", 
    duration: "8 hours", 
    crew: 4, 
    price: 800,
    priceDisplay: "$800",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
    rating: 4.8,
    departureDates: ["May 18, 2024", "May 25, 2024"],
  },
];

// ─── Animated Background Component ───────────────────────────────────────────
const AnimatedBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <motion.div
      className="absolute top-20 left-[10%] w-72 h-72 rounded-full"
      style={{ background: "radial-gradient(circle, rgba(83,214,251,0.08) 0%, transparent 70%)" }}
      animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-20 right-[5%] w-96 h-96 rounded-full"
      style={{ background: "radial-gradient(circle, rgba(0,138,167,0.06) 0%, transparent 70%)" }}
      animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
  </div>
));

// ─── Stepper Component ───────────────────────────────────────────────────────
const BookingStepper = ({ steps, currentStep, setCurrentStep }) => {
  return (
    <div className="relative mb-12">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/5 rounded-full" />
      <div 
        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full transition-all duration-500"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      />
      <div className="relative flex justify-between">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => idx <= currentStep && setCurrentStep(idx)}
            className={`flex flex-col items-center gap-2 transition-all ${
              idx <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50"
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              idx < currentStep 
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30" 
                : idx === currentStep 
                ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/40 ring-4 ring-sky-500/20" 
                : "bg-white/5 border border-white/5 text-[#a3cbf2]/40"
            }`}>
              {idx < currentStep ? <Check size={16} /> : idx + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${
              idx === currentStep ? "text-sky-400" : "text-[#a3cbf2]/40"
            }`}>
              {step.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Form Input Component ─────────────────────────────────────────────────────
const FormInput = ({ label, icon: Icon, error, touched, ...props }) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />}
        <input
          {...props}
          className={`w-full bg-[#001526] border rounded-xl px-3 py-3 text-sm text-[#cee5ff] placeholder:text-[#64748B]/50 focus:outline-none transition-all hover:border-white/10 ${
            Icon ? "pl-9" : "pl-3"
          } ${
            error && touched 
              ? "border-red-500/50 focus:border-red-500" 
              : "border-white/5 focus:border-sky-400/50"
          }`}
        />
      </div>
      {error && touched && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

// ─── Date Selector Component ─────────────────────────────────────────────────
const DateSelector = ({ dates, selectedDate, onSelectDate }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      day: date.getDate(),
      full: dateString
    };
  };

  return (
    <div className="flex flex-wrap gap-3">
      {dates.map((date) => {
        const { month, day, full } = formatDate(date);
        const isSelected = selectedDate === full;
        return (
          <motion.button
            key={date}
            onClick={() => onSelectDate(full)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex flex-col items-center px-5 py-2.5 rounded-xl border transition-all duration-200 ${
              isSelected 
                ? "bg-sky-500/20 border-sky-400 text-sky-400 shadow-lg shadow-sky-500/20" 
                : "bg-[#001526] border-white/5 text-[#a3cbf2] hover:border-sky-400/30 hover:text-sky-400"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
            <span className="text-xl font-bold">{day}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

// ─── Payment Method Component ─────────────────────────────────────────────────
const PaymentMethod = ({ selected, onSelect }) => {
  const methods = [
    { id: "instapay", name: "InstaPay", icon: Smartphone, gradient: "from-purple-500 to-pink-500", description: "Pay instantly via InstaPay" },
    { id: "cash", name: "Cash on Arrival", icon: Banknote, gradient: "from-emerald-500 to-teal-500", description: "Pay when you arrive" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {methods.map((method) => (
        <motion.button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 ${
            selected === method.id
              ? "border-sky-400 bg-sky-400/10 shadow-[0_0_15px_rgba(83,214,251,0.2)]"
              : "border-white/5 bg-[#001526] hover:border-sky-400/30"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${method.gradient} flex items-center justify-center`}>
            <method.icon size={18} className="text-white" />
          </div>
          <div className="text-left">
            <span className="text-sm font-medium text-[#cee5ff] block">{method.name}</span>
            <span className="text-xs text-[#a3cbf2]/40">{method.description}</span>
          </div>
          {selected === method.id && <Check size={16} className="ml-auto text-sky-400" />}
        </motion.button>
      ))}
    </div>
  );
};

// ─── Trip Header Component ────────────────────────────────────────────────────
const TripHeader = ({ trip }) => {
  if (!trip) return null;
  
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-[#001526] border border-white/5">
      <img 
        src={trip.image} 
        alt={trip.title} 
        className="w-20 h-20 rounded-xl object-cover shadow-sm border border-white/5"
      />
      <div className="flex-1">
        <h3 className="font-bold text-[#cee5ff] text-lg">{trip.title}</h3>
        <div className="flex items-center gap-2 text-sm text-[#a3cbf2]/60 mt-1">
          <MapPin size={14} className="text-sky-400" />
          <span>{trip.location}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-xs text-[#a3cbf2]/60">
            <ClockIcon size={12} className="text-sky-400" />
            <span>{trip.duration}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-[#cee5ff]">{trip.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Order Summary Component ──────────────────────────────────────────────────
const OrderSummary = ({ trip, quantity, selectedDate, totalPrice, paymentMethod }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const serviceFee = Math.floor(totalPrice * 0.05);
  const finalTotal = totalPrice + serviceFee;

  if (!trip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#002238] border border-white/5 rounded-2xl overflow-hidden sticky top-8"
    >
      <div 
        className="p-5 border-b border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-400/10">
            <ShoppingBag size={18} className="text-sky-400" />
          </div>
          <h3 className="font-semibold text-[#cee5ff]">Booking Summary</h3>
        </div>
        <motion.button
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[#a3cbf2]/60"
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4">
              <TripHeader trip={trip} />
              
              <div className="space-y-3 text-sm bg-[#001526] p-4 rounded-xl border border-white/5">
                <div className="flex justify-between">
                  <span className="text-[#a3cbf2]/60">Departure Date</span>
                  <span className="text-[#cee5ff] font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a3cbf2]/60">Duration</span>
                  <span className="text-[#cee5ff] font-medium">{trip.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a3cbf2]/60">Guests</span>
                  <span className="text-[#cee5ff] font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a3cbf2]/60">Payment Method</span>
                  <span className="text-[#cee5ff] font-medium capitalize">{paymentMethod === "instapay" ? "InstaPay" : "Cash on Arrival"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#a3cbf2]/60">Trip price ({quantity} × ${trip.price})</span>
                  <span className="text-[#cee5ff]">${trip.price * quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#a3cbf2]/60">Service fee</span>
                  <span className="text-[#cee5ff]">+${serviceFee}</span>
                </div>
                <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center font-bold">
                  <span className="text-[#cee5ff] text-base">Total Amount</span>
                  <span className="text-sky-400 text-2xl">${finalTotal}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Step 1: Trip Details & Guest Info ───────────────────────────────────────
const StepTripDetails = ({ trip, selectedDate, setSelectedDate, quantity, setQuantity, formData, setFormData, onNext }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const incrementQuantity = () => setQuantity(prev => Math.min(trip.crew, prev + 1));
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Trip Image and Info at Top */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <TripHeader trip={trip} />
      </div>

      {/* Select Schedule */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10">
            <Calendar size={18} className="text-sky-400" />
          </div>
          <h3 className="font-semibold text-[#cee5ff]">Select Schedule</h3>
        </div>
        <DateSelector 
          dates={trip.departureDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* Guest List with Increment/Decrement */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10">
            <Users size={18} className="text-sky-400" />
          </div>
          <h3 className="font-semibold text-[#cee5ff]">Number of Guests</h3>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#001526] border border-white/5">
          <span className="text-[#a3cbf2]/60">Total guests</span>
          <div className="flex items-center gap-4">
            <button
              onClick={decrementQuantity}
              className="w-8 h-8 rounded-lg bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 transition-all flex items-center justify-center"
            >
              <Minus size={16} />
            </button>
            <span className="text-[#cee5ff] font-bold text-lg w-8 text-center">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="w-8 h-8 rounded-lg bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 transition-all flex items-center justify-center"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        <p className="text-xs text-[#a3cbf2]/40 mt-2">Maximum {trip.crew} guests allowed</p>
      </div>

      {/* Passenger Details - Full name and email in same row on desktop */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10">
            <User size={18} className="text-sky-400" />
          </div>
          <h3 className="font-semibold text-[#cee5ff]">Passenger Details</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              icon={User}
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
              touched={touched.fullName}
              placeholder="Enter your full name"
            />
            <FormInput
              label="Email Address"
              icon={Mail}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              placeholder="your@email.com"
            />
          </div>
          <FormInput
            label="Phone Number"
            icon={Phone}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.phone}
            touched={touched.phone}
            placeholder="+1 (555) 000-0000"
          />
          <div className="space-y-1.5">
            <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Special Requests (Optional)</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#001526] border border-white/5 rounded-xl px-3 py-3 text-sm text-[#cee5ff] placeholder:text-[#64748B]/50 hover:border-white/10 focus:outline-none focus:border-sky-400/50 transition-all resize-none"
              placeholder="Dietary restrictions, accessibility needs, special occasions..."
            />
          </div>
        </div>
      </div>

      <motion.button
        onClick={handleNext}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(83,214,251,0.2)] hover:shadow-[0_0_30px_rgba(83,214,251,0.4)] transition-all"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        Continue to Payment
        <ChevronRight size={18} />
      </motion.button>
    </motion.div>
  );
};

// ─── Step 2: Payment Method ───────────────────────────────────────────────────
const StepPayment = ({ trip, quantity, selectedDate, totalPrice, paymentMethod, setPaymentMethod, onComplete, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("Booking request submitted! Your trip is under review.");
    setIsProcessing(false);
    onComplete();
  };

  const serviceFee = Math.floor(totalPrice * 0.05);
  const finalTotal = totalPrice + serviceFee;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Trip Image, Name, Location at Top */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <TripHeader trip={trip} />
      </div>

      {/* Payment Method Selection */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10">
            <CreditCard size={18} className="text-sky-400" />
          </div>
          <h3 className="font-semibold text-[#cee5ff]">Select Payment Method</h3>
        </div>
        <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />
      </div>

      {/* Investment Details */}
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10">
            <DollarSign size={18} className="text-sky-400" />
          </div>
          <h3 className="font-semibold text-[#cee5ff]">Investment Details</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#a3cbf2]/60">Trip Price</span>
            <span className="text-[#cee5ff]">${trip.price} × {quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#a3cbf2]/60">Subtotal</span>
            <span className="text-[#cee5ff]">${trip.price * quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#a3cbf2]/60">Service Fee (5%)</span>
            <span className="text-[#cee5ff]">+${serviceFee}</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
            <span className="text-[#cee5ff]">Total Amount</span>
            <span className="text-sky-400 text-xl">${finalTotal}</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 border border-white/5">
        <Shield size={20} className="text-sky-400" />
        <div>
          <p className="text-xs text-[#cee5ff]">Your payment is secure and encrypted</p>
          <p className="text-xs text-[#a3cbf2]/60">You'll receive a confirmation email once booked</p>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl border border-white/10 text-[#a3cbf2] font-medium hover:bg-white/10 hover:text-[#cee5ff] transition-all"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isProcessing}
        >
          Back
        </motion.button>
        <motion.button
          onClick={handleConfirmBooking}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(83,214,251,0.2)] hover:shadow-[0_0_30px_rgba(83,214,251,0.4)] transition-all"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Confirm Booking
              <Lock size={14} />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Step 3: Confirmation - Trip Under Review (Full Width, Centered) ──────────
const StepConfirmation = ({ trip, quantity, selectedDate, totalPrice, formData, bookingRef }) => {
  const serviceFee = Math.floor(totalPrice * 0.05);
  const finalTotal = totalPrice + serviceFee;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease }}
      className="w-full"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Success Icon */}
        <div className="py-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-5">
            <ClockIcon size={40} className="text-amber-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#cee5ff] mb-2">Your Trip is Under Review!</h2>
          <p className="text-[#a3cbf2]/60">
            We're reviewing your booking details. You'll receive a confirmation email shortly.
          </p>
        </div>

        {/* Trip Details Card */}
        <div className="bg-[#002238] border border-white/5 rounded-2xl overflow-hidden text-left">
          <div className="p-5 border-b border-white/5 bg-sky-400/5">
            <h3 className="font-bold text-[#cee5ff] flex items-center gap-2">
              <Ticket size={18} className="text-sky-400" />
              Booking Reference: {bookingRef}
            </h3>
          </div>
          
          <div className="p-5 space-y-4">
            {/* Trip Image and Basic Info */}
            <div className="flex gap-4">
              <img 
                src={trip.image} 
                alt={trip.title} 
                className="w-20 h-20 rounded-xl object-cover shadow-sm border border-white/5"
              />
              <div>
                <h4 className="font-bold text-[#cee5ff] text-lg">{trip.title}</h4>
                <div className="flex items-center gap-2 text-sm text-[#a3cbf2]/60 mt-1">
                  <MapPin size={14} className="text-sky-400" />
                  <span>{trip.location}</span>
                </div>
              </div>
            </div>

            {/* Trip Details Grid */}
            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="p-3 rounded-xl bg-[#001526] border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-sky-400" />
                  <span className="text-xs text-[#a3cbf2]/60">Date</span>
                </div>
                <p className="text-[#cee5ff] font-medium text-sm">{selectedDate}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#001526] border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <ClockIcon size={14} className="text-sky-400" />
                  <span className="text-xs text-[#a3cbf2]/60">Duration</span>
                </div>
                <p className="text-[#cee5ff] font-medium text-sm">{trip.duration}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#001526] border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={14} className="text-sky-400" />
                  <span className="text-xs text-[#a3cbf2]/60">Guests</span>
                </div>
                <p className="text-[#cee5ff] font-medium text-sm">{quantity} guests</p>
              </div>
              <div className="p-3 rounded-xl bg-[#001526] border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign size={14} className="text-sky-400" />
                  <span className="text-xs text-[#a3cbf2]/60">Total Paid</span>
                </div>
                <p className="text-sky-400 font-bold text-sm">${finalTotal}</p>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="p-3 rounded-xl bg-[#001526] border border-white/5">
              <p className="text-xs text-[#a3cbf2]/60 mb-2">Booked by</p>
              <p className="text-[#cee5ff] font-medium">{formData.fullName}</p>
              <p className="text-[#a3cbf2]/60 text-xs mt-1">{formData.email} • {formData.phone}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-8">
          <Link to="/trips">
            <motion.button
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-[#a3cbf2] font-medium hover:bg-white/10 hover:text-[#cee5ff] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Browse More Trips
            </motion.button>
          </Link>
          <Link to="/">
            <motion.button
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-semibold shadow-[0_0_20px_rgba(83,214,251,0.2)] hover:shadow-[0_0_30px_rgba(83,214,251,0.4)] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Home
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main BookingPage Component ───────────────────────────────────────────────
const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("instapay");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef] = useState(`TRIP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const stateData = location.state;
    if (stateData && stateData.trip) {
      setTrip(stateData.trip);
      setQuantity(stateData.quantity || 1);
      setSelectedDate(stateData.selectedDate || "");
      setLoading(false);
    } else {
      const foundTrip = tripsData.find(t => t.id === parseInt(id));
      if (foundTrip) {
        setTrip(foundTrip);
        if (foundTrip.departureDates?.length) setSelectedDate(foundTrip.departureDates[0]);
      }
      setLoading(false);
    }
  }, [id, location.state]);

  const totalPrice = useMemo(() => 
    trip ? trip.price * quantity : 0,
    [trip, quantity]
  );

  const steps = [
    { id: 1, label: "Trip Details" },
    { id: 2, label: "Payment" },
    { id: 3, label: "Confirmation" },
  ];

  const handleComplete = () => {
    setBookingComplete(true);
    setCurrentStep(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/60">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-white/10 mb-4" />
          <p className="text-[#a3cbf2]/60 text-lg">Trip not found</p>
          <button
            onClick={() => navigate("/trips")}
            className="mt-4 px-6 py-2 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400 hover:bg-sky-400/20 transition-colors"
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-12">
      <AnimatedBackground />
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          style: { background: "#002238", color: "#cee5ff", border: "1px solid rgba(83,214,251,0.2)" } 
        }} 
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={`/trip/${id}`}>
            <motion.button
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#a3cbf2] hover:text-sky-400 hover:border-white/10 transition-all shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#cee5ff] leading-tight">
              {bookingComplete ? "Booking Confirmed" : "Complete Your Booking"}
            </h1>
            <p className="text-sm md:text-base text-[#a3cbf2]/60 mt-1">
              {bookingComplete 
                ? "Your adventure is being prepared" 
                : "Secure your spot for an unforgettable adventure"}
            </p>
          </div>
        </div>

        {/* Stepper - Show only when not in confirmation */}
        {!bookingComplete && currentStep < 2 && (
          <BookingStepper steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
        )}

        {/* Main Content */}
        {!bookingComplete ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === 0 ? (
                  <StepTripDetails
                    key="step1"
                    trip={trip}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    formData={formData}
                    setFormData={setFormData}
                    onNext={() => setCurrentStep(1)}
                  />
                ) : (
                  <StepPayment
                    key="step2"
                    trip={trip}
                    quantity={quantity}
                    selectedDate={selectedDate}
                    totalPrice={totalPrice}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    onComplete={handleComplete}
                    onBack={() => setCurrentStep(0)}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                trip={trip}
                quantity={quantity}
                selectedDate={selectedDate}
                totalPrice={totalPrice}
                paymentMethod={paymentMethod}
              />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <StepConfirmation
              trip={trip}
              quantity={quantity}
              selectedDate={selectedDate}
              totalPrice={totalPrice}
              formData={formData}
              bookingRef={bookingRef}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;