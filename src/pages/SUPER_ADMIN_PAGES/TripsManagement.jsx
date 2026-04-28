// src/pages/ADMIN_PAGES/TripsManagement.jsx
import { useState, useEffect } from "react";
import { Search, Eye, Loader2 } from "lucide-react";
import apiClient from "../../api/apiClient";
import { toast } from 'react-hot-toast';
import TripDetailsModal from "./../../components/SUPER_ADMIN_COMPONENTS/TripDetailsModal";

const statusStyles = {
  Active: "bg-emerald-400/10 text-emerald-400",
  Disabled: "bg-red-400/10 text-red-400",
  Upcoming: "bg-sky-400/10 text-sky-400",
  Completed: "bg-[#a3cbf2]/10 text-[#a3cbf2]/50",
};

const TripsManagement = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchTrips();
    return () => clearTimeout(timer);
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/Trips/allroles/GetAll", {
        params: { pageNumber: 1, pageSize: 100 }
      });
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const fetchTripDetails = async (id) => {
    try {
      const { data } = await apiClient.get(`/api/Trips/allroles/${id}`);
      setSelectedTrip(data);
    } catch (error) {
      console.error("Error fetching trip details:", error);
      toast.error("Failed to load trip details");
    }
  };

  const openTripModal = (trip) => {
    fetchTripDetails(trip.id);
  };

  const closeTripModal = () => {
    setSelectedTrip(null);
  };

  const getTripStatus = (trip) => {
    const hasActiveDates = trip.tripDates?.some(date => date.isActive);
    if (hasActiveDates) {
      const now = new Date();
      const hasUpcomingDates = trip.tripDates?.some(date => 
        date.isActive && new Date(date.startDate) > now
      );
      return hasUpcomingDates ? "Upcoming" : "Active";
    }
    return "Disabled";
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `https://hook.runasp.net${url}`;
  };

  const filteredTrips = trips.filter(trip => 
    trip.title?.toLowerCase().includes(search.toLowerCase()) ||
    trip.tripManagerName?.toLowerCase().includes(search.toLowerCase()) ||
    trip.locationName?.toLowerCase().includes(search.toLowerCase()) ||
    trip.boatName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading trips...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Trips Management</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">Manage and monitor all fishing trips</p>
          </div>
          <div className="text-sm text-[#a3cbf2]/40 bg-[#002238] px-4 py-2 rounded-xl border border-white/5">
            Total: {filteredTrips.length} trips
          </div>
        </div>

        {/* Search Bar */}
        <div 
          className="relative max-w-sm transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 shadow-sm transition-colors"
            placeholder="Search trips by name, manager, location, or boat..."
          />
        </div>

        {/* Desktop Table Block - Eye Icon */}
        <div 
          className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#001526] border-b border-white/10">
                <tr>
                  {["Trip", "Boat", "Location", "Price", "Max Guests", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-[#a3cbf2]/40">
                      No trips found
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip) => {
                    const status = getTripStatus(trip);
                    return (
                      <tr key={trip.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {trip.mainImageUrl && (
                              <img 
                                src={getImageUrl(trip.mainImageUrl)} 
                                alt={trip.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <div className="text-[#cee5ff] font-medium">{trip.title}</div>
                              <div className="text-[#a3cbf2]/40 text-xs">by {trip.tripManagerName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#a3cbf2]/60">{trip.boatName}</td>
                        <td className="px-6 py-4 text-[#a3cbf2]/60">{trip.locationName}</td>
                        <td className="px-6 py-4 text-sky-400 font-bold">${trip.pricePerPerson}</td>
                        <td className="px-6 py-4 text-[#a3cbf2]/60">{trip.maxParticipants}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[status]}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => openTripModal(trip)} 
                            className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards - View Details Button */}
        <div 
          className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
          style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
        >
          {filteredTrips.length === 0 ? (
            <div className="bg-[#002238] border border-white/5 rounded-2xl p-8 text-center text-[#a3cbf2]/40">
              No trips found
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const status = getTripStatus(trip);
              return (
                <div key={trip.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      {trip.mainImageUrl && (
                        <img 
                          src={getImageUrl(trip.mainImageUrl)} 
                          alt={trip.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-[#cee5ff] font-semibold text-sm">{trip.title}</p>
                        <p className="text-[#a3cbf2]/40 text-xs">by {trip.tripManagerName}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyles[status]}`}>
                      {status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-[#a3cbf2]/60">
                      <span className="font-medium">Boat:</span>
                      <span>{trip.boatName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#a3cbf2]/60">
                      <span className="font-medium">Location:</span>
                      <span>{trip.locationName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-sky-400 font-bold">
                      <span className="font-medium">Price:</span>
                      <span>${trip.pricePerPerson}/person</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#a3cbf2]/60">
                      <span className="font-medium">Max Guests:</span>
                      <span>{trip.maxParticipants}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-2">
                    <button 
                      onClick={() => openTripModal(trip)} 
                      className="w-full py-2.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-all text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Trip Details Modal Component */}
      <TripDetailsModal 
        trip={selectedTrip}
        onClose={closeTripModal}
      />
    </>
  );
};

export default TripsManagement;