import { useState, useEffect } from "react";
import { Search, Eye, X } from "lucide-react";

const initialBookings = [
  { id: "BK-001", user: "Mohamed Elsayed", trip: "Deep Sea Adventure", boat: "Sea Hunter", date: "Apr 2, 2025", status: "Confirmed", paymentStatus: "Paid" },
  { id: "BK-002", user: "Mohamed Elsayed", trip: "Coastal Fly Fishing", boat: "Flat Master", date: "Apr 5, 2025", status: "Confirmed", paymentStatus: "Paid" },
  { id: "BK-003", user: "Mohamed Elsayed", trip: "Sunset Charter", boat: "Sunset Dream", date: "Apr 8, 2025", status: "Pending", paymentStatus: "Pending" },
  { id: "BK-004", user: "Mohamed Elsayed", trip: "Deep Sea Adventure", boat: "Sea Hunter", date: "Apr 12, 2025", status: "Confirmed", paymentStatus: "Paid" },
  { id: "BK-005", user: "Mohamed Elsayed", trip: "Sunset Charter", boat: "Sunset Dream", date: "Mar 20, 2025", status: "Completed", paymentStatus: "Paid" },
];

const statusStyles = {
  Confirmed: "bg-sky-400/10 text-sky-400",
  Pending: "bg-yellow-400/10 text-yellow-400",
  Completed: "bg-teal-400/10 text-teal-400",
  Cancelled: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",
};

const paymentStyles = {
  Paid: "bg-emerald-400/10 text-emerald-400",
  Pending: "bg-yellow-400/10 text-yellow-400",
  Failed: "bg-red-400/10 text-red-400",
};

const BookingsManagement = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);

  // Modal Animation States
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalVisible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalVisible]);

  const filteredBookings = bookings.filter(b => 
    b.user.toLowerCase().includes(search.toLowerCase()) ||
    b.trip.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setTimeout(() => setIsModalVisible(true), 10);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedBooking(null), 300);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div 
        className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Bookings Management</h1>
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
          placeholder="Search by user, trip, or ID..."
        />
      </div>

      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-[#001526] border-b border-white/10">
            <tr>
              {["Booking ID", "User", "Trip", "Boat", "Date", "Status", "Payment", ""].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200 group">
                <td className="px-6 py-4 text-sky-400 font-mono text-xs">{booking.id}</td>
                <td className="px-6 py-4 text-[#cee5ff] font-medium group-hover:text-white transition-colors">{booking.user}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{booking.trip}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{booking.boat}</td>
                <td className="px-6 py-4 text-[#a3cbf2]/60">{booking.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[booking.status]}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${paymentStyles[booking.paymentStatus]}`}>
                    {booking.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(booking)} className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div 
        className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sky-400 font-mono text-xs mb-0.5">{booking.id}</p>
                <p className="text-[#cee5ff] font-semibold text-sm">{booking.user}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyles[booking.status]}`}>
                  {booking.status}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${paymentStyles[booking.paymentStatus]}`}>
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
            <div className="bg-[#001526] p-3 rounded-xl border border-white/5 space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-[#a3cbf2]/40">Trip:</span>
                <span className="text-[#cee5ff] font-medium">{booking.trip}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#a3cbf2]/40">Boat:</span>
                <span className="text-[#cee5ff] font-medium">{booking.boat}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#a3cbf2]/40">Date:</span>
                <span className="text-[#cee5ff] font-medium">{booking.date}</span>
              </div>
            </div>
            <button onClick={() => openModal(booking)} className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/40 hover:text-sky-400 hover:border-sky-400/20 text-sm font-medium transition-all duration-300">
              <Eye size={14} /> View Details
            </button>
          </div>
        ))}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div 
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isModalVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={closeModal}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl transition-all duration-300 transform ${isModalVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#cee5ff] font-bold text-lg">Booking Details</h3>
              <button onClick={closeModal} className="text-[#a3cbf2]/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 bg-[#001526] p-5 rounded-xl border border-white/5">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Booking ID</span>
                <span className="text-sky-400 font-mono text-sm font-bold">{selectedBooking.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">User</span>
                <span className="text-[#cee5ff] font-medium">{selectedBooking.user}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Trip</span>
                <span className="text-[#cee5ff] font-medium">{selectedBooking.trip}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Boat</span>
                <span className="text-[#cee5ff] font-medium">{selectedBooking.boat}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Date</span>
                <span className="text-[#cee5ff] font-medium">{selectedBooking.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5 items-center">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[selectedBooking.status]}`}>
                  {selectedBooking.status}
                </span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="text-[#a3cbf2]/50 text-sm font-medium">Payment Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${paymentStyles[selectedBooking.paymentStatus]}`}>
                  {selectedBooking.paymentStatus}
                </span>
              </div>
            </div>
            
            <button onClick={closeModal} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300">
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManagement;