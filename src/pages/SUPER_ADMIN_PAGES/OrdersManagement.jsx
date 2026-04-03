import { useState, useEffect } from "react";
import { Search, Eye, X } from "lucide-react";

const initialOrders = [
  { id: "#ORD-1201", user: "Mohamed Elsayed", seller: "The Bait Shop", total: 849, status: "Shipped", date: "Mar 25, 2025" },
  { id: "#ORD-1200", user: "Mohamed Elsayed", seller: "Ocean Gear Co.", total: 1299, status: "Processing", date: "Mar 24, 2025" },
  { id: "#ORD-1199", user: "Mohamed Elsayed", seller: "Deep Blue Tackle", total: 145, status: "Delivered", date: "Mar 22, 2025" },
  { id: "#ORD-1198", user: "Mohamed Elsayed", seller: "Reel Masters", total: 720, status: "Delivered", date: "Mar 20, 2025" },
];

const statusStyles = {
  Delivered: "bg-sky-400/10 text-sky-400",
  Shipped: "bg-teal-400/10 text-teal-400",
  Processing: "bg-yellow-400/10 text-yellow-400",
  Cancelled: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);
  
  // Modal states for smooth enter/exit animations
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Prevent background scrolling when modal is open
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

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.user.toLowerCase().includes(search.toLowerCase()) ||
    o.seller.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (order) => {
    setSelectedOrder(order);
    setTimeout(() => setIsModalVisible(true), 10);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedOrder(null), 300); // Wait for transition to finish
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div 
        className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Orders Management</h1>
      </div>

      <div 
        className="relative max-w-sm transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 shadow-sm transition-colors"
          placeholder="Search by order ID, user, or seller..."
        />
      </div>

      {/* Desktop Table Wrapper */}
      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-[#001526] border-b border-white/10">
            <tr>
              {["Order ID", "User", "Seller", "Total Price", "Status", "Date", ""].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                <td className="px-6 py-4 text-sky-400 font-mono text-xs">{order.id}</td>
                <td className="px-6 py-4 text-[#cee5ff] font-medium">{order.user}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{order.seller}</td>
                <td className="px-6 py-4 text-sky-400 font-bold">${order.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{order.date}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(order)} className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards Wrapper - Removed nested initial entrance animations to stop scrollbar glitch */}
      <div 
        className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sky-400 font-semibold text-sm">{order.id}</p>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[order.status] || ""}`}>
                {order.status}
              </span>
            </div>
            <p className="text-[#cee5ff] font-medium text-sm mb-1">{order.user}</p>
            <p className="text-[#a3cbf2]/60 text-xs mb-3">{order.seller}</p>
            <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
              <span className="text-sky-400 font-bold text-sm">${order.total.toLocaleString()}</span>
              <span className="text-[#a3cbf2]/40 text-xs">{order.date}</span>
            </div>
            <button
              onClick={() => openModal(order)}
              className="w-full mt-4 flex items-center justify-center gap-1 py-2 rounded-lg border border-white/5 text-[#a3cbf2]/40 hover:text-sky-400 hover:border-sky-400/20 text-xs transition-all duration-300"
            >
              <Eye size={12} /> View Details
            </button>
          </div>
        ))}
      </div>

      {/* Order Details Modal - Handled with Mount/Unmount logic for smooth exits */}
      {selectedOrder && (
        <div 
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${
            isModalVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeModal} // Click outside to close
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl transition-all duration-300 transform ${
              isModalVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#cee5ff] font-bold text-lg">Order Details</h3>
              <button onClick={closeModal} className="text-[#a3cbf2]/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 bg-[#001526] p-5 rounded-xl border border-white/5">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Order ID</span>
                <span className="text-sky-400 font-mono text-sm font-bold">{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">User</span>
                <span className="text-[#cee5ff] font-medium">{selectedOrder.user}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Seller</span>
                <span className="text-[#cee5ff] font-medium">{selectedOrder.seller}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Total Price</span>
                <span className="text-sky-400 font-black text-lg">${selectedOrder.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 items-center">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Date</span>
                <span className="text-[#cee5ff] font-medium">{selectedOrder.date}</span>
              </div>
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

export default OrdersManagement;