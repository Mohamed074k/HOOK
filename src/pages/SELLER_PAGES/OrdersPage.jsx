import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Eye, X, Loader2, AlertTriangle, Truck, Edit2 } from "lucide-react";
import apiClient from "../../api/apiClient";
import { toast } from 'react-hot-toast';
import UpdateStatusModal, { getStatusIcon, getStatusLabel } from "../../components/SELLER_COMPONENTS/UpdateStatusModal";

const statusStyles = {
  1: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  2: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  3: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  4: "bg-rose-400/10 text-rose-400 border-rose-400/20",
};

const paymentMethodMap = {
  1: "Cash on Delivery",
  2: "Credit Card",
  3: "Online Payment"
};

const getCategoryName = (categoryId) => {
  const categories = {
    1: "Fishing Rods", 2: "Fishing Reels", 3: "Fishing Lines",
    4: "Hooks & Rigs", 5: "Lures & Baits", 6: "Fishing Accessories",
    7: "Fishing Clothing", 8: "Snorkeling & Diving", 9: "Boats & Marine Equipment",
    10: "Storage & Bags"
  };
  return categories[categoryId] || "Unknown";
};

const getConditionText = (conditionId) => {
  return conditionId === 1 ? "New" : "Used";
};

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

// Confirm Cancel Modal Component with smooth animations
const ConfirmCancelModal = ({ isOpen, onClose, onConfirm, orderId, isCancelling, errorMessage }) => {
  const [reason, setReason] = useState("");
  const [render, setRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setTimeout(() => setAnimate(true), 10);
      setReason(""); // Reset reason field when opening
    } else {
      setAnimate(false);
      setTimeout(() => setRender(false), 300);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }
    onConfirm(orderId, reason);
  };

  if (!render) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${animate ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-md bg-[#001526] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${animate ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-400/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-[#cee5ff]">Cancel Order</h3>
          </div>
          
          <p className="text-[#a3cbf2]/70 text-sm mb-4">
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>

          <div className="mb-4">
            <label className="block text-[#a3cbf2]/60 text-xs font-medium mb-1.5 uppercase tracking-wider">
              Cancellation Reason *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you're cancelling this order..."
              className="w-full bg-[#002238] border border-white/5 rounded-xl px-4 py-2.5 text-[#cee5ff] text-sm focus:outline-none focus:border-rose-400/40 focus:ring-1 focus:ring-rose-400/10 transition-all duration-200 resize-none"
            />
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
              <p className="text-red-400 text-sm font-medium">{errorMessage}</p>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isCancelling}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-[#a3cbf2]/70 hover:bg-white/10 transition-all font-medium text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isCancelling}
              className="flex-1 px-4 py-2 rounded-lg bg-rose-400/10 text-rose-400 border border-rose-400/20 hover:bg-rose-400/20 transition-all font-medium text-sm disabled:opacity-50"
            >
              {isCancelling ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Confirm Cancellation"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  
  // Status Modal State
  const [statusModal, setStatusModal] = useState({ isOpen: false, orderId: null, currentStatus: null });

  // Order Details Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Cancel modal states
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchOrders();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (isModalVisible || statusModal.isOpen || cancelModal.isOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalVisible, statusModal.isOpen, cancelModal.isOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/marketplace/orders/admin-seller/my-orders");
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setStatusModal({ isOpen: false, orderId: null, currentStatus: null });
    setUpdatingOrderId(orderId);
    
    try {
      if (newStatus === 2) {
        await apiClient.patch(`/api/marketplace/orders/admin-seller/out-for-delivery/${orderId}`);
        toast.success("Order status updated to Out for Delivery");
      } else if (newStatus === 4) {
        setCancelModal({ isOpen: true, orderId });
        setUpdatingOrderId(null);
        return;
      } else {
        toast.error("Status update not available for this status");
        setUpdatingOrderId(null);
        return;
      }

      await fetchOrders();
      
      // Live update if Details Modal is open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId, reason) => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await apiClient.patch(`/api/marketplace/orders/admin-seller/cancel/${orderId}?reason=${encodeURIComponent(reason)}`);
      toast.success("Order cancelled successfully");
      await fetchOrders();
      setCancelModal({ isOpen: false, orderId: null });
      
      if (selectedOrder && selectedOrder.id === orderId) {
        closeModal();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      const errorMessage = error.response?.data?.message || "Failed to cancel order";
      setCancelError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setTimeout(() => setIsModalVisible(true), 10);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatOrderId = (id) => `#${id.slice(0, 8).toUpperCase()}`;

  const getCustomerName = (order) => `${order.firstName || ''} ${order.lastName || ''}`.trim() || "Customer";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-12 px-3 sm:px-0">
      {/* Animated Header */}
      <div className={`transform transition-all duration-700 ease-out ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Orders Management</h1>
        <p className="text-[#a3cbf2]/50 text-sm mt-1">Manage and track your customer orders</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-[#002238] border border-white/5 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sky-400/10 flex items-center justify-center">
            <Truck size={32} className="text-sky-400" />
          </div>
          <p className="text-[#a3cbf2]/50 text-lg">No orders yet</p>
          <p className="text-[#a3cbf2]/40 text-sm mt-1">When customers place orders, they'll appear here</p>
        </div>
      ) : (
        <>
          {/* Desktop Table Wrapper */}
          <div 
            className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-x-auto transform transition-all duration-700 ease-out"
            style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
          >
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-[#001526] border-b border-white/10">
                <tr>
                  {["Order ID", "Customer", "Total", "Status", "Date", ""].map((h, i) => (
                    <th key={h} className={`text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider ${i === 0 ? 'rounded-tl-2xl' : ''} ${i === 5 ? 'rounded-tr-2xl' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4 text-[#a3cbf2]/40 font-mono text-xs">{formatOrderId(order.id)}</td>
                    <td className="px-6 py-4 text-[#cee5ff] font-medium">{getCustomerName(order)}</td>
                    <td className="px-6 py-4 text-sky-400 font-bold">${order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {/* Interactive Badge acting as Update Button - Only clickable if Pending (1) */}
                      <button
                        onClick={() => setStatusModal({ isOpen: true, orderId: order.id, currentStatus: order.status })}
                        disabled={order.status !== 1 || updatingOrderId === order.id}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${order.status === 1 ? 'hover:opacity-80 hover:scale-[1.02] cursor-pointer' : 'cursor-default'} ${statusStyles[order.status] || statusStyles[1]}`}
                      >
                        {updatingOrderId === order.id ? <Loader2 size={14} className="animate-spin" /> : getStatusIcon(order.status, 14)}
                        <span>{getStatusLabel(order.status)}</span>
                        {order.status === 1 && (
                          <Edit2 size={12} className="ml-1 opacity-60" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-[#a3cbf2]/40 text-xs">{formatDate(order.createdOn)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(order)}
                        className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all duration-200"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Cards */}
          <div 
            className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
            style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
          >
            {orders.map((order) => (
              <div key={order.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[#cee5ff] font-semibold text-sm">{formatOrderId(order.id)}</p>
                  <button
                    onClick={() => setStatusModal({ isOpen: true, orderId: order.id, currentStatus: order.status })}
                    disabled={order.status !== 1}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyles[order.status] || statusStyles[1]}`}
                  >
                    {getStatusIcon(order.status, 12)}
                    {getStatusLabel(order.status)}
                  </button>
                </div>
                <p className="text-[#a3cbf2]/60 text-xs">{getCustomerName(order)}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sky-400 font-bold text-sm">${order.total.toLocaleString()}</span>
                  <span className="text-[#a3cbf2]/40 text-xs">{formatDate(order.createdOn)}</span>
                </div>
                <button
                  onClick={() => openModal(order)}
                  className="w-full mt-3 flex items-center justify-center gap-1 py-2 rounded-lg border border-white/5 text-[#a3cbf2]/40 hover:text-sky-400 hover:border-sky-400/20 text-xs transition-all duration-300"
                >
                  <Eye size={12} /> View Details
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Order Details Modal */}
      {selectedOrder && createPortal(
        <div 
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isModalVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={closeModal}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl flex flex-col max-w-md w-full shadow-2xl transition-all duration-300 transform max-h-[85vh] overflow-hidden ${isModalVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Modal Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5 shrink-0">
              <h3 className="text-[#cee5ff] font-bold text-lg">Order Details</h3>
              <button onClick={closeModal} className="text-[#a3cbf2]/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="p-6 pt-4 overflow-y-auto overflow-x-hidden custom-scrollbar flex-1">
              <div className="mb-4 p-4 bg-[#001526] rounded-xl border border-white/5">
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1 font-medium">Customer</p>
                <p className="text-[#cee5ff] font-medium">{getCustomerName(selectedOrder)}</p>
                
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mt-3 mb-1 font-medium">Contact</p>
                <p className="text-[#a3cbf2]/70 text-sm">{selectedOrder.contactEmail || "N/A"}</p>
                <p className="text-[#a3cbf2]/70 text-sm">{selectedOrder.contactPhone || "N/A"}</p>
                
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mt-3 mb-1 font-medium">Shipping Address</p>
                <p className="text-[#a3cbf2]/70 text-sm">
                  {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.governorate}
                  {selectedOrder.postalCode && `, ${selectedOrder.postalCode}`}
                </p>
                
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mt-3 mb-1 font-medium">Payment Method</p>
                <p className="text-[#cee5ff] text-sm">{paymentMethodMap[selectedOrder.paymentMethod] || "Unknown"}</p>
                
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mt-3 mb-1 font-medium">Order ID</p>
                <p className="text-sky-400 text-sm font-mono font-bold">{selectedOrder.id}</p>
              </div>
              
              <div className="mb-4">
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2 font-medium">Products</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start p-3 bg-[#001526]/50 rounded-xl border border-white/5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          {item.mainImageUrl && (
                            <img 
                              src={getImageUrl(item.mainImageUrl)} 
                              alt={item.title}
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-[#cee5ff] text-sm font-medium truncate">{item.title}</p>
                            <p className="text-[#a3cbf2]/40 text-xs mt-0.5">
                              {getCategoryName(item.category)} • {getConditionText(item.condition)}
                            </p>
                            <p className="text-[#a3cbf2]/40 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-sky-400 text-sm font-bold shrink-0 ml-2">${item.unitPrice}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center py-4 border-y border-white/5 mb-4">
                <span className="text-[#cee5ff] font-bold">Subtotal</span>
                <span className="text-sky-400 font-bold">${selectedOrder.subTotal?.toLocaleString() || selectedOrder.total?.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 mb-4">
                <span className="text-[#cee5ff] font-bold text-lg">Total Amount</span>
                <span className="text-sky-400 font-black text-2xl">${selectedOrder.total.toLocaleString()}</span>
              </div>
              
              {selectedOrder.cancellationReason && selectedOrder.status === 4 && (
                <div className="mb-4 p-3 bg-rose-400/10 border border-rose-400/20 rounded-xl">
                  <p className="text-rose-400 text-xs font-medium mb-1">Cancellation Reason</p>
                  <p className="text-[#cee5ff]/80 text-sm">{selectedOrder.cancellationReason}</p>
                </div>
              )}
              
              {/* Trigger the Update Status Modal from Details - Only shown if status is Pending (1) */}
              {selectedOrder.status === 1 && (
                <div className="mt-4">
                  <label className="block text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2 font-medium">Update Status</label>
                  <button
                    onClick={() => setStatusModal({ isOpen: true, orderId: selectedOrder.id, currentStatus: selectedOrder.status })}
                    className="w-full bg-[#001526] border border-white/5 hover:border-sky-400/30 rounded-xl px-4 py-3 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 transition-all duration-300 text-left flex justify-between items-center shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                       <span className={statusStyles[selectedOrder.status] ? statusStyles[selectedOrder.status].split(' ')[1] : ''}>
                          {getStatusIcon(selectedOrder.status, 18)}
                       </span>
                       <span className="font-medium">{getStatusLabel(selectedOrder.status)}</span>
                    </div>
                    <Edit2 size={16} className="text-sky-400" />
                  </button>
                </div>
              )}
              
              <button 
                onClick={closeModal} 
                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Global Status Update Modal */}
      <UpdateStatusModal 
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, orderId: null, currentStatus: null })}
        currentStatus={statusModal.currentStatus}
        onUpdate={(newStatus) => updateOrderStatus(statusModal.orderId, newStatus)}
        isUpdating={updatingOrderId === statusModal.orderId}
      />

      {/* Cancel Order Confirmation Modal */}
      <ConfirmCancelModal
        isOpen={cancelModal.isOpen}
        onClose={() => { setCancelModal({ isOpen: false, orderId: null }); setCancelError(null); }}
        onConfirm={handleCancelOrder}
        orderId={cancelModal.orderId}
        isCancelling={isCancelling}
        errorMessage={cancelError}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(163, 203, 242, 0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(163, 203, 242, 0.4); }
      `}</style>
    </div>
  );
};

export default OrdersPage;