import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, ShoppingBag, Package, X, Calendar, CreditCard, Eye, ChevronDown, MapPin, User, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast';
import apiClient from "../../../api/apiClient";

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

// Enum Mappers
const getOrderStatusString = (status) => {
  switch (status) {
    case 1: return "Pending";
    case 2: return "Out for Delivery";
    case 3: return "Delivered";
    case 4: return "Cancelled";
    default: return "Unknown";
  }
};

const getPaymentMethodString = (method) => {
  switch (method) {
    case 1: return "Cash on Delivery";
    case 2: return "Credit Card";
    case 3: return "Online Payment";
    default: return "Unknown";
  }
};

const StatusPill = ({ status }) => {
  const text = getOrderStatusString(status);
  let style = text === 'Delivered' ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20' 
            : text === 'Pending' ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' 
            : text === 'Out for Delivery' ? 'bg-sky-400/10 text-sky-300 border-sky-400/20'
            : 'bg-rose-400/10 text-rose-300 border-rose-400/20';

  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${style} shadow-sm inline-block whitespace-nowrap`}>
      {text}
    </span>
  );
};

// Custom Animated Dropdown Component
const AnimatedDropdown = ({ value, options, onChange, placeholder = "Select option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className="relative w-full md:w-48" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] hover:border-white/10 transition-all focus:outline-none focus:border-sky-400/50 shadow-sm"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={16} className={`text-[#a3cbf2]/60 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180 text-sky-400' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="absolute z-50 w-full mt-2 bg-[#002238] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    value === option.value 
                      ? 'bg-sky-400/10 text-sky-400 font-semibold' 
                      : 'text-[#cee5ff] hover:bg-white/5'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Order Details Modal
const OrderDetailsModal = ({ isOpen, order, onClose }) => {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-50 bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-3xl bg-[#002238] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-start justify-between shrink-0 bg-[#001526]/30">
              <div>
                <h3 className="text-xl font-bold text-[#cee5ff]">Order Details</h3>
                <p className="text-sm text-[#a3cbf2]/60 mt-1">ORD-{order.id.split('-')[0].toUpperCase()} • {new Date(order.createdOn).toLocaleDateString()}</p>
              </div>
              <motion.button 
                onClick={onClose} 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white/5 rounded-full text-[#a3cbf2]/60 hover:text-white hover:bg-rose-500/20 transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              {/* Status Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#001526] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-400/10 flex items-center justify-center border border-sky-400/20">
                    <Package size={20} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider font-semibold mb-1">Status</p>
                    <StatusPill status={order.status} />
                  </div>
                </div>
                {order.cancellationReason && (
                  <div className="sm:text-right bg-rose-400/5 px-3 py-2 rounded-lg border border-rose-400/10">
                    <p className="text-xs text-rose-300/70 font-semibold mb-0.5">Cancellation Reason:</p>
                    <p className="text-sm text-rose-200">{order.cancellationReason}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Items List */}
                <div className="md:col-span-3 space-y-4">
                  <h4 className="text-sm font-bold text-[#cee5ff] uppercase tracking-wider">Items ({order.items?.length || 0})</h4>
                  <div className="space-y-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-16 h-16 rounded-lg bg-[#001526] overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                          {item.mainImageUrl ? (
                            <img src={getImageUrl(item.mainImageUrl)} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} className="text-[#a3cbf2]/30" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h5 className="font-semibold text-[#cee5ff] truncate">{item.title}</h5>
                            <p className="text-xs text-[#a3cbf2]/60 mt-0.5">Qty: {item.quantity}</p>
                          </div>
                          <div className="font-bold text-sky-400 text-sm">
                            ${item.unitPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer & Summary */}
                <div className="md:col-span-2 space-y-6">
                  {/* Shipping Info */}
                  <div>
                    <h4 className="text-sm font-bold text-[#cee5ff] uppercase tracking-wider mb-4">Shipping Info</h4>
                    <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                      <div className="flex gap-3 text-sm">
                        <User size={16} className="text-sky-400/60 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[#cee5ff] font-medium">{order.firstName} {order.lastName}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 text-sm">
                        <Phone size={16} className="text-sky-400/60 shrink-0 mt-0.5" />
                        <p className="text-[#a3cbf2]/80">{order.contactPhone}</p>
                      </div>
                      <div className="flex gap-3 text-sm">
                        <Mail size={16} className="text-sky-400/60 shrink-0 mt-0.5" />
                        <p className="text-[#a3cbf2]/80 break-all">{order.contactEmail}</p>
                      </div>
                      <div className="flex gap-3 text-sm border-t border-white/10 pt-3 mt-3">
                        <MapPin size={16} className="text-sky-400/60 shrink-0 mt-0.5" />
                        <div className="text-[#a3cbf2]/80 leading-relaxed">
                          <p>{order.address}</p>
                          <p>{order.city}, {order.governorate}</p>
                          <p>Postal: {order.postalCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="text-sm font-bold text-[#cee5ff] uppercase tracking-wider mb-4">Order Summary</h4>
                    <div className="bg-[#001526] p-4 rounded-xl border border-white/5 space-y-2 text-sm">
                      <div className="flex justify-between text-[#a3cbf2]/80">
                        <span>Payment Method</span>
                        <span className="text-[#cee5ff]">{getPaymentMethodString(order.paymentMethod)}</span>
                      </div>
                      <div className="flex justify-between text-[#a3cbf2]/80">
                        <span>Subtotal</span>
                        <span className="text-[#cee5ff]">${order.subTotal.toFixed(2)}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-white/10 flex justify-between font-bold text-base">
                        <span className="text-[#cee5ff]">Total</span>
                        <span className="text-sky-400">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Custom Confirm Modal (For Cancelling)
const ConfirmModal = ({ isOpen, title, text, onConfirm, onCancel }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[60] bg-[#001526]/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-sm bg-[#002238] border border-white/10 rounded-2xl p-6 shadow-2xl"
        >
          <h3 className="text-lg font-bold text-[#cee5ff] mb-2">{title}</h3>
          <p className="text-sm text-[#a3cbf2]/70 mb-6">{text}</p>
          <div className="flex gap-3">
            <motion.button 
              onClick={onCancel} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] text-[#a3cbf2] hover:bg-white/[0.08] transition-colors"
            >
              Back
            </motion.button>
            <motion.button 
              onClick={onConfirm} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 rounded-xl text-sm font-semibold bg-rose-400/15 text-rose-300 hover:bg-rose-400/25 border border-rose-400/30 transition-colors"
            >
              Cancel Order
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Modals state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [detailsTarget, setDetailsTarget] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/marketplace/orders/admin-user/my-purchases");
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async () => {
    if (!cancelTarget) return;
    try {
      await apiClient.patch(`/api/marketplace/orders/admin-user/cancel/${cancelTarget}`);
      toast.success("Order cancelled successfully");
      fetchOrders(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelTarget(null);
      setDetailsTarget(null); // Close details modal if open
    }
  };

  const filteredOrders = orders.filter(order => {
    const firstItemTitle = order.items?.[0]?.title || "";
    const shortId = order.id.split('-')[0];
    
    const matchesSearch = firstItemTitle.toLowerCase().includes(search.toLowerCase()) || shortId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || getOrderStatusString(order.status) === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Out for Delivery", value: "Out for Delivery" },
    { label: "Delivered", value: "Delivered" },
    { label: "Cancelled", value: "Cancelled" }
  ];

  const listVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-[#cee5ff]">My Orders</h2>
        <p className="text-sm text-[#a3cbf2]/60 mt-1">Track and manage your equipment and gear purchases.</p>
      </div>

      {/* Filters & Search */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#002238] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-lg"
      >
        <div className="relative flex-1 w-full group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40 group-focus-within:text-sky-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by product or order ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#001526] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all shadow-sm"
          />
        </div>
        
        {/* Animated Custom Dropdown */}
        <AnimatedDropdown 
          value={statusFilter} 
          options={statusOptions} 
          onChange={setStatusFilter} 
        />
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div 
            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 border-4 border-sky-400/30 border-t-sky-400 rounded-full" 
          />
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-white/5 text-xs uppercase tracking-wider text-[#a3cbf2]/60">
                    <th className="p-4 font-semibold pl-6">Order Details</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Payment</th>
                    <th className="p-4 font-semibold text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-[#a3cbf2]/50 bg-[#001526]/50">
                        <ShoppingBag size={32} className="mx-auto mb-3 opacity-20" />
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, i) => {
                      const firstItem = order.items?.[0];
                      const extraCount = order.items?.length - 1;
                      const shortId = order.id.split('-')[0].toUpperCase();
                      const isPending = order.status === 1;

                      return (
                        <motion.tr 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: i * 0.05 }}
                          key={order.id} 
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#001526] overflow-hidden border border-white/5 shrink-0 group-hover:border-sky-400/30 transition-colors flex items-center justify-center">
                                {firstItem?.mainImageUrl ? (
                                  <img src={getImageUrl(firstItem.mainImageUrl)} alt={firstItem.title} className="w-full h-full object-cover" />
                                ) : (
                                  <Package size={20} className="text-sky-400/50" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-[#cee5ff] group-hover:text-sky-300 transition-colors">
                                  {firstItem?.title || "Unknown Product"} {extraCount > 0 && <span className="text-xs text-sky-400/80">+{extraCount} more</span>}
                                </p>
                                <p className="text-xs text-[#a3cbf2]/50 mt-0.5">ORD-{shortId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-[#a3cbf2]/80">{new Date(order.createdOn).toLocaleDateString()}</td>
                          <td className="p-4 font-bold text-sky-400">${order.total.toFixed(2)}</td>
                          <td className="p-4"><StatusPill status={order.status} /></td>
                          <td className="p-4 text-[#a3cbf2]/80">{getPaymentMethodString(order.paymentMethod)}</td>
                          <td className="p-4 text-right pr-6 space-x-2">
                            {/* Actions Group */}
                            <div className="flex items-center justify-end gap-2">
                              {/* Details Button */}
                              <button 
                                onClick={() => setDetailsTarget(order)} 
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 border border-sky-400/20 transition-all tooltip-trigger"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              
                              {/* Cancel Button */}
                              <button 
                                onClick={() => setCancelTarget(order.id)} 
                                disabled={!isPending}
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                                  isPending 
                                    ? 'bg-rose-400/10 text-rose-400 border border-rose-400/20 hover:bg-rose-400/20 cursor-pointer' 
                                    : 'bg-white/[0.02] text-white/20 border border-white/5 cursor-not-allowed'
                                }`}
                                title={isPending ? "Cancel Order" : "Only pending orders can be cancelled"}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 border border-white/5 rounded-2xl text-center text-[#a3cbf2]/50 bg-[#002238]">
                <ShoppingBag size={32} className="mx-auto mb-3 opacity-20" />
                No orders found.
              </div>
            ) : (
              <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-4">
                {filteredOrders.map((order) => {
                  const firstItem = order.items?.[0];
                  const extraCount = order.items?.length - 1;
                  const shortId = order.id.split('-')[0].toUpperCase();
                  const isPending = order.status === 1;

                  return (
                    <motion.div 
                      key={order.id}
                      variants={itemVariants}
                      className="bg-[#002238] border border-white/5 rounded-2xl p-4 shadow-lg flex flex-col gap-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-[#001526] overflow-hidden border border-white/10 shrink-0 flex items-center justify-center">
                            {firstItem?.mainImageUrl ? (
                              <img src={getImageUrl(firstItem.mainImageUrl)} alt={firstItem.title} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={24} className="text-sky-400/50" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#cee5ff] text-base leading-tight">
                              {firstItem?.title || "Unknown Product"} 
                            </p>
                            {extraCount > 0 && <p className="text-xs text-sky-400/80 mt-0.5">+{extraCount} more items</p>}
                            <p className="text-xs text-[#a3cbf2]/50 mt-1">ORD-{shortId}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 p-3 bg-[#001526]/50 rounded-xl border border-white/[0.02]">
                        <div className="flex items-center gap-2 text-sm text-[#a3cbf2]/80">
                          <Calendar size={14} className="text-sky-400/50" />
                          {new Date(order.createdOn).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#a3cbf2]/80">
                          <CreditCard size={14} className="text-sky-400/50" />
                          <span className="truncate" title={getPaymentMethodString(order.paymentMethod)}>
                            {getPaymentMethodString(order.paymentMethod)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#a3cbf2]/50 uppercase tracking-wider mb-0.5">Total Amount</span>
                          <span className="font-bold text-sky-400 text-lg">${order.total.toFixed(2)}</span>
                          <div className="mt-1"><StatusPill status={order.status} /></div>
                        </div>
                        
                        {/* Mobile Actions */}
                        <div className="flex flex-col gap-2">
                           <button 
                             onClick={() => setDetailsTarget(order)} 
                             className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-400/10 text-sky-400 border border-sky-400/20 hover:bg-sky-400/20 transition-colors flex items-center justify-center gap-1.5"
                           >
                             <Eye size={14} /> View Details
                           </button>

                           <button 
                             onClick={() => setCancelTarget(order.id)} 
                             disabled={!isPending}
                             className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                               isPending
                                ? 'bg-rose-400/10 text-rose-400 border border-rose-400/20 hover:bg-rose-400/20'
                                : 'bg-white/[0.02] text-white/20 border border-white/5 cursor-not-allowed'
                             }`}
                           >
                             <X size={14} /> Cancel Order
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={!!cancelTarget} 
        title="Cancel Order"
        text="Are you sure you want to cancel this order? This action cannot be undone."
        onConfirm={handleCancelOrder} 
        onCancel={() => setCancelTarget(null)} 
      />

      {/* Details Modal */}
      <OrderDetailsModal 
        isOpen={!!detailsTarget}
        order={detailsTarget}
        onClose={() => setDetailsTarget(null)}
      />

    </div>
  );
};

export default OrdersTab;