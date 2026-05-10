import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Check, MapPin, ClockIcon, Star, ShoppingBag, ChevronRight, Calendar, Users, User, Minus, Plus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "../../api/apiClient";

// Components
import StepPayment from "./../../components/APP_COMPONENTS/BOOKING_COMPONENTS/StepPayment";
import StepConfirmation from "./../../components/APP_COMPONENTS/BOOKING_COMPONENTS/StepConfirmation";

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

// --- Shared Small Components (Background, Stepper, Summary, TripHeader) ---
const AnimatedBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <motion.div className="absolute top-20 left-[10%] w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.08) 0%, transparent 70%)" }} animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div className="absolute bottom-20 right-[5%] w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,138,167,0.06) 0%, transparent 70%)" }} animate={{ x: [0, -40, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
  </div>
));

const BookingStepper = ({ steps, currentStep, setCurrentStep }) => (
  <div className="relative mb-12">
    <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/5 rounded-full" />
    <div className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
    <div className="relative flex justify-between">
      {steps.map((step, idx) => (
        <button key={step.id} onClick={() => idx <= currentStep && setCurrentStep(idx)} className={`flex flex-col items-center gap-2 transition-all ${idx <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${idx < currentStep ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30" : idx === currentStep ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/40 ring-4 ring-sky-500/20" : "bg-white/5 border border-white/5 text-[#a3cbf2]/40"}`}>
            {idx < currentStep ? <Check size={16} /> : idx + 1}
          </div>
          <span className={`text-xs font-medium hidden sm:block ${idx === currentStep ? "text-sky-400" : "text-[#a3cbf2]/40"}`}>{step.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export const TripHeader = ({ trip }) => {
  if (!trip) return null;
  const duration = trip.tripDates?.[0] ? `${Math.ceil((new Date(trip.tripDates[0].endDate) - new Date(trip.tripDates[0].startDate)) / (1000 * 60 * 60))} hours` : trip.duration || "N/A";
  const location = trip.locationName || trip.location;
  const imageUrl = trip.mainImageUrl || (trip.image ? trip.image : trip.images?.[0]?.imageUrl);
  
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-[#001526] border border-white/5">
      {imageUrl && <img src={getImageUrl(imageUrl)} alt={trip.title} className="w-20 h-20 rounded-xl object-cover shadow-sm border border-white/5" />}
      <div className="flex-1">
        <h3 className="font-bold text-[#cee5ff] text-lg">{trip.title || trip.tripTitle}</h3>
        <div className="flex items-center gap-2 text-sm text-[#a3cbf2]/60 mt-1"><MapPin size={14} className="text-sky-400" /><span>{location}</span></div>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-xs text-[#a3cbf2]/60"><ClockIcon size={12} className="text-sky-400" /><span>{duration}</span></div>
          <div className="flex items-center gap-0.5"><Star size={12} className="text-amber-400 fill-amber-400" /><span className="text-xs text-[#cee5ff]">{trip.rating || 4.5}</span></div>
        </div>
      </div>
    </div>
  );
};

const OrderSummary = ({ trip, quantity, selectedDate, totalPrice, paymentMethod }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const serviceFee = Math.floor(totalPrice * 0.05);
  const finalTotal = totalPrice + serviceFee;
  if (!trip) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#002238] border border-white/5 rounded-2xl overflow-hidden sticky top-8">
      <div className="p-5 border-b border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-sky-400/10"><ShoppingBag size={18} className="text-sky-400" /></div><h3 className="font-semibold text-[#cee5ff]">Booking Summary</h3></div>
        <motion.button animate={{ rotate: isExpanded ? 180 : 0 }} className="text-[#a3cbf2]/60"><ChevronRight size={16} /></motion.button>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-5 space-y-4">
              <TripHeader trip={trip} />
              <div className="space-y-3 text-sm bg-[#001526] p-4 rounded-xl border border-white/5">
                <div className="flex justify-between"><span className="text-[#a3cbf2]/60">Date</span><span className="text-[#cee5ff] font-medium">{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Select date'}</span></div>
                <div className="flex justify-between"><span className="text-[#a3cbf2]/60">Guests</span><span className="text-[#cee5ff] font-medium">{quantity}</span></div>
                <div className="flex justify-between"><span className="text-[#a3cbf2]/60">Payment</span><span className="text-[#cee5ff] font-medium capitalize">{paymentMethod === 2 ? "InstaPay" : "Cash on Arrival"}</span></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-[#a3cbf2]/60">Price ({quantity} × ${trip.pricePerPerson || trip.price})</span><span className="text-[#cee5ff]">${totalPrice}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#a3cbf2]/60">Service fee</span><span className="text-[#cee5ff]">+${serviceFee}</span></div>
                <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center font-bold"><span className="text-[#cee5ff] text-base">Total</span><span className="text-sky-400 text-2xl">${finalTotal}</span></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Page ───
const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateId, setSelectedDateId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(2); // 2 = InstaPay
  // تمت إزالة حقول الاسم، الايميل ورقم الهاتف من هنا
  const [formData, setFormData] = useState({ specialRequests: "" });
  
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stateData = location.state;
    if (stateData && stateData.trip) {
      setTrip(stateData.trip);
      setQuantity(stateData.quantity || 1);
      setSelectedDate(stateData.selectedDate || "");
      setSelectedDateId(stateData.selectedDateId || null);
      setLoading(false);
    } else if (id) {
      apiClient.get(`/api/Trips/allroles/${id}`).then(response => {
        setTrip(response.data);
        if (response.data.tripDates?.length) {
          const activeDate = response.data.tripDates.find(d => d.isActive && d.availableSeats > 0);
          if (activeDate) {
            setSelectedDate(activeDate.startDate);
            setSelectedDateId(activeDate.id);
          }
        }
        setLoading(false);
      }).catch(err => {
        toast.error("Failed to load trip details");
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, location.state]);

  const totalPrice = useMemo(() => trip ? (trip.pricePerPerson || trip.price) * quantity : 0, [trip, quantity]);
  const steps = [{ id: 1, label: "Trip Details" }, { id: 2, label: "Payment" }, { id: 3, label: "Confirmation" }];

  const handleDateSelection = (dateString, dateId) => {
    setSelectedDate(dateString);
    setSelectedDateId(dateId);
  };

  const handleComplete = (newBookingRef) => {
    setBookingRef(newBookingRef);
    setBookingComplete(true);
    setCurrentStep(2);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mx-auto" /></div>;
  if (!trip) return <div className="min-h-screen flex items-center justify-center text-center"><AlertCircle size={48} className="mx-auto text-white/10 mb-4" /><p className="text-[#a3cbf2]/60 text-lg">Trip not found</p></div>;

  return (
    <div className="relative min-h-screen pb-12">
      <AnimatedBackground />
      <Toaster position="top-center" toastOptions={{ style: { background: "#002238", color: "#cee5ff", border: "1px solid rgba(83,214,251,0.2)" } }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link to={`/trip/${id}`}>
            <motion.button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#a3cbf2] hover:text-sky-400" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><ArrowLeft size={18} /></motion.button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#cee5ff] leading-tight">{bookingComplete ? "Booking Received" : "Complete Your Booking"}</h1>
            <p className="text-sm md:text-base text-[#a3cbf2]/60 mt-1">{bookingComplete ? "Your adventure is being reviewed" : "Secure your spot for an unforgettable adventure"}</p>
          </div>
        </div>

        {!bookingComplete && currentStep < 2 && <BookingStepper steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />}

        {!bookingComplete ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === 0 ? (
                  <StepTripDetails key="step1" trip={trip} selectedDate={selectedDate} setSelectedDate={handleDateSelection} quantity={quantity} setQuantity={setQuantity} formData={formData} setFormData={setFormData} onNext={() => setCurrentStep(1)} TripHeader={TripHeader} />
                ) : (
                  <StepPayment key="step2" trip={trip} quantity={quantity} selectedDate={selectedDate} selectedDateId={selectedDateId} totalPrice={totalPrice} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} formData={formData} onComplete={handleComplete} onBack={() => setCurrentStep(0)} TripHeader={TripHeader} />
                )}
              </AnimatePresence>
            </div>
            <div className="lg:col-span-1">
              <OrderSummary trip={trip} quantity={quantity} selectedDate={selectedDate} totalPrice={totalPrice} paymentMethod={paymentMethod} />
            </div>
          </div>
        ) : (
          <StepConfirmation trip={trip} quantity={quantity} selectedDate={selectedDate} totalPrice={totalPrice} formData={formData} bookingRef={bookingRef} />
        )}
      </div>
    </div>
  );
};


// --- Date Selector Component ---
const DateSelector = ({ dates, selectedDate, onSelectDate }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return { month: date.toLocaleString('default', { month: 'short' }), day: date.getDate(), full: dateString };
  };

  return (
    <div className="flex flex-wrap gap-3">
      {dates && dates.length > 0 ? (
        dates.map((dateItem, index) => {
          const dateValue = dateItem.startDate || dateItem;
          const { month, day, full } = formatDate(dateValue);
          const isSelected = selectedDate === full;
          const isAvailable = typeof dateItem === 'object' ? (dateItem.availableSeats > 0 && dateItem.isActive) : true;
          
          return (
            <motion.button
              key={index}
              onClick={() => isAvailable && onSelectDate(full, dateItem.id)}
              whileHover={isAvailable ? { scale: 1.02, y: -2 } : {}}
              whileTap={isAvailable ? { scale: 0.98 } : {}}
              disabled={!isAvailable}
              className={`flex flex-col items-center px-5 py-2.5 rounded-xl border transition-all duration-200 ${
                !isAvailable 
                  ? "bg-[#001526]/50 border-white/5 text-[#a3cbf2]/30 cursor-not-allowed" 
                  : isSelected 
                    ? "bg-sky-500/20 border-sky-400 text-sky-400 shadow-lg shadow-sky-500/20" 
                    : "bg-[#001526] border-white/5 text-[#a3cbf2] hover:border-sky-400/30 hover:text-sky-400"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
              <span className="text-xl font-bold">{day}</span>
              {typeof dateItem === 'object' && dateItem.availableSeats && (
                <span className="text-[9px] mt-1 text-[#a3cbf2]/40">{dateItem.availableSeats} seats</span>
              )}
            </motion.button>
          );
        })
      ) : (
        <p className="text-[#a3cbf2]/40 text-sm">No available dates</p>
      )}
    </div>
  );
};

// --- Main Step Component ---
const StepTripDetails = ({ trip, selectedDate, setSelectedDate, quantity, setQuantity, formData, setFormData, onNext, TripHeader }) => {

  const handleNext = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    onNext();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const maxParticipants = trip?.maxParticipants || trip?.crew || 10;
  const incrementQuantity = () => setQuantity(prev => Math.min(maxParticipants, prev + 1));
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const activeDates = trip?.tripDates?.filter(date => date.isActive && date.availableSeats > 0) || [];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-5">
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <TripHeader trip={trip} />
      </div>

      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10"><Calendar size={18} className="text-sky-400" /></div>
          <h3 className="font-semibold text-[#cee5ff]">Select Schedule</h3>
        </div>
        <DateSelector dates={activeDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10"><Users size={18} className="text-sky-400" /></div>
          <h3 className="font-semibold text-[#cee5ff]">Number of Guests</h3>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#001526] border border-white/5">
          <span className="text-[#a3cbf2]/60">Total guests</span>
          <div className="flex items-center gap-4">
            <button onClick={decrementQuantity} className="w-8 h-8 rounded-lg bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 transition-all flex items-center justify-center"><Minus size={16} /></button>
            <span className="text-[#cee5ff] font-bold text-lg w-8 text-center">{quantity}</span>
            <button onClick={incrementQuantity} className="w-8 h-8 rounded-lg bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 transition-all flex items-center justify-center"><Plus size={16} /></button>
          </div>
        </div>
      </div>

      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10"><User size={18} className="text-sky-400" /></div>
          <h3 className="font-semibold text-[#cee5ff]">Additional Information</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">Special Requests (Optional)</label>
            <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={3} className="w-full bg-[#001526] border border-white/5 rounded-xl px-3 py-3 text-sm text-[#cee5ff] placeholder:text-[#64748B]/50 hover:border-white/10 focus:outline-none focus:border-sky-400/50 transition-all resize-none" placeholder="Dietary restrictions, accessibility needs..." />
          </div>
        </div>
      </div>

      <motion.button
        onClick={handleNext}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(83,214,251,0.2)] hover:shadow-[0_0_30px_rgba(83,214,251,0.4)] transition-all"
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
      >
        Continue to Payment <ChevronRight size={18} />
      </motion.button>
    </motion.div>
  );
};

export default BookingPage;