import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
 import { CreditCard, DollarSign, Shield, Loader2, Lock, Smartphone, Banknote, Check, Upload, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "../../../api/apiClient";

// --- API Endpoints ---
const createBooking = (bookingData) => {
  return apiClient.post('/api/Bookings/user/create', bookingData);
};

const uploadReceipt = (bookingId, receiptImage) => {
  const formData = new FormData();
  formData.append('ReceiptImage', receiptImage);
  return apiClient.post(`/api/Payments/user/upload-receipt/${bookingId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// --- Payment Method Selector ---
const PaymentMethod = ({ selected, onSelect }) => {
  const methods = [
    { id: 2, name: "InstaPay", icon: Smartphone, gradient: "from-purple-500 to-pink-500", description: "Pay instantly via InstaPay" },
    { id: 1, name: "Cash on Arrival", icon: Banknote, gradient: "from-emerald-500 to-teal-500", description: "Pay when you arrive" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {methods.map((method) => (
        <motion.button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 ${
            selected === method.id ? "border-sky-400 bg-sky-400/10 shadow-[0_0_15px_rgba(83,214,251,0.2)]" : "border-white/5 bg-[#001526] hover:border-sky-400/30"
          }`}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
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

// --- Main Step Component ---
const StepPayment = ({ trip, quantity, selectedDateId, totalPrice, paymentMethod, setPaymentMethod, formData, onComplete, onBack, TripHeader }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);

  const handleConfirmBooking = async () => {
    if (paymentMethod === 2 && !receiptFile) {
      toast.error("Please upload your InstaPay receipt image.");
      return;
    }

    if (!selectedDateId) {
      toast.error("Error: Trip date is not selected properly.");
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        tripDateId: selectedDateId,
        numberOfParticipants: quantity,
        paymentMethod: paymentMethod, 
        specialRequests: formData.specialRequests
      };

      const bookingRes = await createBooking(payload);
      
      const newBookingId = bookingRes.data.id; 
      const paymentId = bookingRes.data.payment?.id; 

      if (paymentMethod === 2 && receiptFile) {
        if (!paymentId) {
          toast.error("Payment ID not found in server response.");
          setIsProcessing(false);
          return;
        }
        await uploadReceipt(paymentId, receiptFile);
      }

      toast.success("Booking request submitted successfully!");
      onComplete(newBookingId); 

    } catch (error) {
      console.error("Booking error:", error);
      const errorData = error.response?.data;

      if (errorData?.description) {
        if (
          errorData.description.toLowerCase().includes("already") || 
          errorData.code?.toLowerCase().includes("booked") ||
          errorData.code?.toLowerCase().includes("exists")
        ) {
          toast.error("You have already booked this date! Please check your bookings.");
        } else {
          toast.error(errorData.description);
        }
      } 
      else if (errorData?.message) {
        toast.error(errorData.message);
      } 
      else if (typeof errorData === "string") {
        toast.error(errorData);
      } 
      else {
        toast.error("Failed to process booking. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const serviceFee = Math.floor(totalPrice * 0.05);
  const finalTotal = totalPrice + serviceFee;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-5">
      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <TripHeader trip={trip} />
      </div>

      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10"><CreditCard size={18} className="text-sky-400" /></div>
          <h3 className="font-semibold text-[#cee5ff]">Select Payment Method</h3>
        </div>
        
        <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />

        {/* Upload Receipt Section with Image Preview */}
        <AnimatePresence>
          {paymentMethod === 2 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              {receiptFile ? (
                <div className="relative w-full h-48 rounded-xl border border-sky-400/30 overflow-hidden bg-[#001526] group">
                  <img 
                    src={URL.createObjectURL(receiptFile)} 
                    alt="Receipt Preview" 
                    className="w-full h-full object-contain"
                  />
                  {/* زر حذف الصورة */}
                  <button 
                    onClick={() => setReceiptFile(null)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors backdrop-blur-sm shadow-lg"
                    title="Remove Image"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm text-xs text-center text-emerald-400 font-medium truncate">
                    {receiptFile.name}
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-sky-400/30 rounded-xl cursor-pointer bg-[#001526] hover:bg-sky-400/5 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload size={24} className="text-sky-400 mb-2" />
                    <p className="text-sm text-[#a3cbf2]">Click to upload InstaPay Receipt</p>
                    <p className="text-xs text-[#a3cbf2]/50 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if(e.target.files && e.target.files[0]) {
                      setReceiptFile(e.target.files[0]);
                    }
                  }} />
                </label>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <div className="p-2 rounded-lg bg-sky-400/10"><DollarSign size={18} className="text-sky-400" /></div>
          <h3 className="font-semibold text-[#cee5ff]">Investment Details</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#a3cbf2]/60">Trip Price</span>
            <span className="text-[#cee5ff]">${trip.pricePerPerson || trip.price} × {quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#a3cbf2]/60">Subtotal</span>
            <span className="text-[#cee5ff]">${totalPrice}</span>
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

      <div className="flex gap-3">
        <motion.button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl border border-white/10 text-[#a3cbf2] font-medium hover:bg-white/10 hover:text-[#cee5ff] transition-all"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} disabled={isProcessing}
        >
          Back
        </motion.button>
        <motion.button
          onClick={handleConfirmBooking}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(83,214,251,0.2)] transition-all"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} disabled={isProcessing}
        >
          {isProcessing ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <>Confirm Booking <Lock size={14} /></>}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StepPayment;