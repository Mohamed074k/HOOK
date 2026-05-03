// src/pages/USER_PAGES/components/OrdersTab.jsx
import React, { useState, useEffect } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

const mockOrdersData = [
  { id: 101, orderNumber: "ORD-20260220-0001", productName: "Pro Fishing Rod", date: "2026-02-20", totalPrice: 150.00, status: "Delivered", paymentStatus: "Paid" },
  { id: 102, orderNumber: "ORD-20260315-0042", productName: "Waterproof Jacket", date: "2026-03-15", totalPrice: 89.99, status: "Pending", paymentStatus: "Pending" },
  { id: 103, orderNumber: "ORD-20260401-0112", productName: "Navigation Compass", date: "2026-04-01", totalPrice: 45.50, status: "Cancelled", paymentStatus: "Failed" },
];

const StatusPill = ({ text, type }) => {
  let style = "";
  if (type === "order") {
    style = text === 'Delivered' ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20' 
          : text === 'Pending' ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' 
          : 'bg-rose-400/10 text-rose-300 border-rose-400/20';
  } else if (type === "payment") {
    style = text === 'Paid' ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20' 
          : text === 'Pending' ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' 
          : 'bg-rose-400/10 text-rose-300 border-rose-400/20';
  }
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${style} shadow-sm inline-block`}>
      {text}
    </span>
  );
};

const OrdersTab = () => {
  const [orders, setOrders] = useState(mockOrdersData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

    // Make the page always open at the top
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(search.toLowerCase()) || order.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "All" || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleArchive = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    toast.success("Order archived successfully");
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-[#cee5ff]">My Orders</h2>
        <p className="text-sm text-[#a3cbf2]/60 mt-1">Track and manage your equipment and gear purchases.</p>
      </div>

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
            className="w-full bg-[#001526] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all w-full md:w-40 cursor-pointer hover:border-white/10"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select 
            value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-all w-full md:w-40 cursor-pointer hover:border-white/10"
          >
            <option value="All">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </motion.div>

      <div className="bg-[#002238] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5 text-xs uppercase tracking-wider text-[#a3cbf2]/60">
                <th className="p-4 font-semibold pl-6">Product & Order ID</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Total Price</th>
                <th className="p-4 font-semibold">Order Status</th>
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
                filteredOrders.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    key={order.id} 
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#001526] flex items-center justify-center border border-white/5 shrink-0 group-hover:border-sky-400/30 transition-colors">
                          <ShoppingBag size={20} className="text-sky-400/50 group-hover:text-sky-400 transition-colors" />
                        </div>
                        <div>
                          <p className="font-bold text-[#cee5ff] group-hover:text-sky-300 transition-colors">{order.productName}</p>
                          <p className="text-xs text-[#a3cbf2]/50 mt-0.5">{order.orderNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#a3cbf2]/80">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-sky-400">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-4"><StatusPill text={order.status} type="order" /></td>
                    <td className="p-4"><StatusPill text={order.paymentStatus} type="payment" /></td>
                    <td className="p-4 text-right pr-6 space-x-2">
                      <button onClick={() => toast.success("Order Details Modal Loading...")} className="inline-flex px-4 py-2 text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.1] border border-transparent hover:border-white/10 text-[#cee5ff] rounded-xl transition-all">
                        View Details
                      </button>
                      {order.status === 'Cancelled' && (
                        <button onClick={() => handleArchive(order.id)} className="inline-flex px-4 py-2 text-xs font-semibold border border-white/10 text-[#a3cbf2]/60 hover:text-rose-300 hover:border-rose-400/30 hover:bg-rose-400/10 rounded-xl transition-all">
                          Archive
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersTab;