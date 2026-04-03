import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ChevronDown, X } from "lucide-react";

const initialOrders = [
  { id: "#ORD-1201", user: "Mohamed Elsayed", seller: "The Bait Shop", total: 849, status: "Shipped", date: "Mar 25, 2025", items: [{ name: "Apex Carbon Reel", quantity: 1, price: 849 }] },
  { id: "#ORD-1200", user: "Ahmed Hafez", seller: "Ocean Gear Co.", total: 1299, status: "Processing", date: "Mar 24, 2025", items: [{ name: "HydroScan V3", quantity: 1, price: 1299 }] },
  { id: "#ORD-1199", user: "Mohamed Ibrahim", seller: "Deep Blue Tackle", total: 145, status: "Delivered", date: "Mar 22, 2025", items: [{ name: "Deep Bait Master", quantity: 1, price: 145 }] },
  { id: "#ORD-1198", user: "Ahmed Mohamed", seller: "Reel Masters", total: 720, status: "Delivered", date: "Mar 20, 2025", items: [{ name: "CarbonFlex Rod", quantity: 1, price: 720 }] },
  { id: "#ORD-1197", user: "Mohamed M.", total: 550, status: "Cancelled", date: "Mar 19, 2025", items: [{ name: "Nautical One Pro", quantity: 1, price: 550 }] },
];

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const statusStyles = {
  Delivered: "bg-sky-400/10 text-sky-400",
  Shipped: "bg-teal-400/10 text-teal-400",
  Processing: "bg-yellow-400/10 text-yellow-400",
  Pending: "bg-orange-400/10 text-orange-400",
  Cancelled: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(initialOrders);
  const [animate, setAnimate] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); 

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Prevent background scrolling only when modal is actively visible
  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalVisible]);

  const updateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setOpenDropdown(null);
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setTimeout(() => setIsModalVisible(true), 10);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedOrder(null), 300); // Wait for exit animation
  };

  return (
    <div className="space-y-6 w-full pb-12">
      
      {/* Animated Header */}
      <div className={`transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Orders</h1>
      </div>
      
      {/* Desktop Table Wrapper */}
      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-[#001526] border-b border-white/10">
            <tr>
              {["Order ID", "User Name", "Total Price", "Status", "Date", ""].map((h, i) => (
                <th 
                  key={h} 
                  className={`text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider ${i === 0 ? 'rounded-tl-2xl' : ''} ${i === 5 ? 'rounded-tr-2xl' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.id} 
                className={`border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors group ${
                  openDropdown === order.id ? 'relative z-50' : 'relative z-10'
                }`}
              >
                <td className="px-6 py-4 text-[#a3cbf2]/40 font-mono text-xs">{order.id}</td>
                <td className="px-6 py-4 text-[#cee5ff] font-medium">{order.user}</td>
                <td className="px-6 py-4 text-sky-400 font-bold">${order.total.toLocaleString()}</td>
                <td className="px-6 py-4 relative">
                  
                  <div className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                      onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:shadow-lg ${statusStyles[order.status] || ""}`}
                    >
                      {order.status}
                      <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === order.id ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Conditionally rendered to completely remove from DOM and prevent scrollbars */}
                    {openDropdown === order.id && (
                      <div className="absolute top-full left-0 mt-2 w-36 bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="py-1">
                          {statusOptions.map(s => (
                            <button
                              key={s}
                              onClick={() => updateStatus(order.id, s)}
                              className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors duration-200 ${
                                order.status === s 
                                  ? statusStyles[s]
                                  : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </td>
                <td className="px-6 py-4 text-[#a3cbf2]/40">{order.date}</td>
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
          <div 
            key={order.id} 
            className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-[#cee5ff] font-semibold text-sm">{order.id}</p>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[order.status] || ""}`}>
                {order.status}
              </span>
            </div>
            <p className="text-[#a3cbf2]/60 text-xs">{order.user}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sky-400 font-bold text-sm">${order.total.toLocaleString()}</span>
              <span className="text-[#a3cbf2]/40 text-xs">{order.date}</span>
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
      
      {/* Order Details Modal - Smooth Enter/Exit */}
      {selectedOrder && (
        <div 
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${
            isModalVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeModal}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl transition-all duration-300 transform max-h-[85vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#a3cbf2]/10 hover:[&::-webkit-scrollbar-thumb]:bg-[#a3cbf2]/20 [&::-webkit-scrollbar-thumb]:rounded-full ${
              isModalVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 sticky top-0 bg-[#002238] pb-2 z-10">
              <h3 className="text-[#cee5ff] font-bold text-lg">Order Details</h3>
              <button onClick={closeModal} className="text-[#a3cbf2]/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-[#001526] rounded-xl border border-white/5">
              <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1 font-medium">Customer</p>
              <p className="text-[#cee5ff] font-medium">{selectedOrder.user}</p>
              <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mt-3 mb-1 font-medium">Order ID</p>
              <p className="text-sky-400 text-sm font-mono font-bold">{selectedOrder.id}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2 font-medium">Products</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-[#001526]/50 rounded-xl border border-white/5">
                    <div>
                      <p className="text-[#cee5ff] text-sm font-medium">{item.name}</p>
                      <p className="text-[#a3cbf2]/40 text-xs mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sky-400 text-sm font-bold">${item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center py-4 border-y border-white/5 mb-4">
              <span className="text-[#cee5ff] font-bold">Total Amount</span>
              <span className="text-sky-400 font-black text-2xl">${selectedOrder.total.toLocaleString()}</span>
            </div>
            
            <div className="relative">
              <label className="block text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2 font-medium">Update Status</label>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'modal' ? null : 'modal')}
                onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                className="w-full bg-[#001526] border border-white/5 hover:border-sky-400/30 rounded-xl px-4 py-3 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all duration-300 text-left flex justify-between items-center shadow-sm"
              >
                <span className="font-medium">{selectedOrder.status}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-[#a3cbf2]/40 transition-transform duration-300 ${openDropdown === 'modal' ? 'rotate-180 text-sky-400' : ''}`} 
                />
              </button>

              {/* Modal Dropdown conditionally rendered too */}
              {openDropdown === 'modal' && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-[#001526] border border-white/10 rounded-xl shadow-xl shadow-black/50 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="py-1">
                    {statusOptions.map(s => (
                      <button
                        key={s}
                        onClick={() => {
                          updateStatus(selectedOrder.id, s);
                          setSelectedOrder({ ...selectedOrder, status: s });
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-200 ${
                          selectedOrder.status === s 
                            ? 'bg-sky-500/20 text-sky-400 font-medium' 
                            : 'text-[#a3cbf2]/70 hover:bg-white/5 hover:text-[#cee5ff]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={closeModal} 
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;