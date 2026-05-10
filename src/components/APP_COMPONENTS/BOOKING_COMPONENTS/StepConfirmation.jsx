import React from "react";
import { motion } from "framer-motion";
import { Clock as ClockIcon, Ticket, MapPin, Calendar, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

// Helper if needed locally
const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

const StepConfirmation = ({ trip, quantity, selectedDate, totalPrice, formData, bookingRef }) => {
  const serviceFee = Math.floor(totalPrice * 0.05);
  const finalTotal = totalPrice + serviceFee;
  const duration = trip?.tripDates?.[0] 
    ? `${Math.ceil((new Date(trip.tripDates[0].endDate) - new Date(trip.tripDates[0].startDate)) / (1000 * 60 * 60))} hours`
    : trip?.duration || "N/A";
  const imageUrl = trip?.mainImageUrl || (trip?.image ? trip.image : trip?.images?.[0]?.imageUrl);
  const location = trip?.locationName || trip?.location;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="w-full">
      <div className="max-w-3xl mx-auto text-center">
        <div className="py-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-5">
            <ClockIcon size={40} className="text-amber-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#cee5ff] mb-2">Booking Pending!</h2>
          <p className="text-[#a3cbf2]/60">
            Your booking request has been sent to the admin. You'll receive a confirmation once reviewed.
          </p>
        </div>

        <div className="bg-[#002238] border border-white/5 rounded-2xl overflow-hidden text-left">
          <div className="p-5 border-b border-white/5 bg-amber-400/5 flex justify-between items-center">
            <h3 className="font-bold text-[#cee5ff] flex items-center gap-2">
              <Ticket size={18} className="text-amber-400" />
              Booking Ref: {bookingRef || "Pending"}
            </h3>
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">Status: Pending</span>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex gap-4">
              {imageUrl && (
                <img src={getImageUrl(imageUrl)} alt={trip?.title} className="w-20 h-20 rounded-xl object-cover shadow-sm border border-white/5" />
              )}
              <div>
                <h4 className="font-bold text-[#cee5ff] text-lg">{trip?.title || trip?.tripTitle}</h4>
                <div className="flex items-center gap-2 text-sm text-[#a3cbf2]/60 mt-1">
                  <MapPin size={14} className="text-sky-400" />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="p-3 rounded-xl bg-[#001526] border border-white/5">
                <div className="flex items-center gap-2 mb-1"><Calendar size={14} className="text-sky-400" /><span className="text-xs text-[#a3cbf2]/60">Date</span></div>
                <p className="text-[#cee5ff] font-medium text-sm">{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'TBD'}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#001526] border border-white/5">
                <div className="flex items-center gap-2 mb-1"><ClockIcon size={14} className="text-sky-400" /><span className="text-xs text-[#a3cbf2]/60">Duration</span></div>
                <p className="text-[#cee5ff] font-medium text-sm">{duration}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#001526] border border-white/5">
                <div className="flex items-center gap-2 mb-1"><Users size={14} className="text-sky-400" /><span className="text-xs text-[#a3cbf2]/60">Guests</span></div>
                <p className="text-[#cee5ff] font-medium text-sm">{quantity} guests</p>
              </div>
              <div className="p-3 rounded-xl bg-[#001526] border border-white/5">
                <div className="flex items-center gap-2 mb-1"><DollarSign size={14} className="text-sky-400" /><span className="text-xs text-[#a3cbf2]/60">Total Paid</span></div>
                <p className="text-sky-400 font-bold text-sm">${finalTotal}</p>
              </div>
            </div>

  
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-8">
          <Link to="/trips">
            <motion.button className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 text-[#a3cbf2] font-medium hover:bg-white/10 hover:text-[#cee5ff] transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Browse More Trips
            </motion.button>
          </Link>
          <Link to="/">
            <motion.button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-semibold shadow-[0_0_20px_rgba(83,214,251,0.2)] transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Go to Home
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default StepConfirmation;