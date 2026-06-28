import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, User, Mail, Phone, ChevronRight, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";

// --- Form Input Helper ---
const FormInput = ({ label, icon: Icon, error, touched, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">{label}</label>
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />}
      <input
        {...props}
        className={`w-full bg-[#001526] border rounded-xl px-3 py-3 text-sm text-[#cee5ff] placeholder:text-[#64748B]/50 focus:outline-none transition-all hover:border-white/10 ${
          Icon ? "pl-9" : "pl-3"
        } ${error && touched ? "border-red-500/50 focus:border-red-500" : "border-white/5 focus:border-sky-400/50"}`}
      />
    </div>
    {error && touched && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (validate()) onNext();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

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
          <h3 className="font-semibold text-[#cee5ff]">Passenger Details</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Full Name" icon={User} name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} error={errors.fullName} touched={touched.fullName} placeholder="Enter your full name" />
            <FormInput label="Email Address (Optional)" icon={Mail} name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="your@email.com" />
          </div>
          <FormInput label="Phone Number" icon={Phone} name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} error={errors.phone} touched={touched.phone} placeholder="01xxxxxxxxx" />
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

export default StepTripDetails;