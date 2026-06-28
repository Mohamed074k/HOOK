import { useState, useEffect } from "react";
import { 
  MapPin, Calendar, Users, DollarSign, Compass, Fish, Waves, 
  Ship, Clock, X, Pencil, Plus, Loader2, CheckCircle, 
  XCircle, Star, Trash2, AlertCircle, AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrips } from "../../context/BOAT_OWNER_CONTEXT/TripContext";
import toast from "react-hot-toast";

const ConfirmDeleteDateModal = ({ isOpen, onClose, onConfirm, dateInfo, isDeleting, errorMessage }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isDeleting && onClose()}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#001526] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-400/10 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-[#cee5ff]">Confirm Delete</h3>
              </div>
              
              <p className="text-[#a3cbf2]/70 text-sm mb-2">
                Are you sure you want to permanently delete this trip date?
              </p>

              {dateInfo && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4 mt-4">
                  <p className="text-[#cee5ff] font-medium text-sm flex items-center gap-2">
                    <Calendar size={14} className="text-sky-400" /> {dateInfo.date}
                  </p>
                  <p className="text-[#a3cbf2]/50 text-xs mt-1 flex items-center gap-1.5 pl-5">
                    <Clock size={12} /> {dateInfo.time} • <Users size={12} className="ml-1" /> {dateInfo.seats} seats
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-red-400 text-sm font-medium leading-relaxed">{errorMessage}</p>
                </div>
              )}
              
              {!errorMessage && (
                <p className="text-yellow-400/70 text-xs mb-6 mt-4">
                  ⚠️ This action cannot be undone. You can only delete or deactivate dates if all related payments are fully refunded.
                </p>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-[#a3cbf2]/70 hover:bg-white/10 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20 transition-all font-medium text-sm disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Confirm Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TripDetails = ({ trip, onClose, onEdit, onViewReviews, animate }) => {
  const { allTrips, addNewTripDates, toggleDateStatus, deleteTripDate } = useTrips();
  const liveTrip = allTrips?.find(t => t.id === trip.id) || trip;

  const [showAddDate, setShowAddDate] = useState(false);
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newSeats, setNewSeats] = useState(trip.maxParticipants || 0);
  const [addingDate, setAddingDate] = useState(false);
  
  const [togglingDateId, setTogglingDateId] = useState(null);
  const [deletingDateId, setDeletingDateId] = useState(null);
  const [deleteDateModal, setDeleteDateModal] = useState({ isOpen: false, date: null });
  const [deleteErrorMessage, setDeleteErrorMessage] = useState(null);
  const [displayedDates, setDisplayedDates] = useState(liveTrip.tripDates || []);

  useEffect(() => {
    if (liveTrip?.tripDates) {
      setDisplayedDates(liveTrip.tripDates);
    }
  }, [liveTrip]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) return imageUrl;
    const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
    return `${baseUrl}${imageUrl}`;
  };

  const handleAddDateSubmit = async (e) => {
    e.preventDefault();
    if (!newStartDate || !newEndDate) {
      toast.error("Please select both start and end date/time");
      return;
    }

    if (new Date(newEndDate) <= new Date(newStartDate)) {
      toast.error("End date must be after the start date");
      return;
    }

    setAddingDate(true);
    try {
      await addNewTripDates(trip.id, [{
        startDate: newStartDate,
        endDate: newEndDate,
        availableSeats: Number(newSeats) || 0
      }]);

      toast.success("Date added successfully!");
      setShowAddDate(false);
      setNewStartDate("");
      setNewEndDate("");
      setNewSeats(trip.maxParticipants || 0);
    } catch (error) {
      toast.error("Failed to add date. Please try again.");
    } finally {
      setAddingDate(false);
    }
  };

  const handleToggleStatus = async (dateId, currentStatus) => {
    setTogglingDateId(dateId);
    try {
      const newStatus = !currentStatus;
      await toggleDateStatus(dateId, newStatus);
      setDisplayedDates(prev => prev.map(date => 
        date.id === dateId ? { ...date, isActive: newStatus } : date
      ));
    } catch (error) {
      console.error("Error toggling date status:", error);
    } finally {
      setTogglingDateId(null);
    }
  };

  const handleDeleteDateClick = (date) => {
    const startObj = new Date(date.startDate);
    const endObj = new Date(date.endDate || date.startDate);
    setDeleteErrorMessage(null);
    setDeleteDateModal({
      isOpen: true,
      date: {
        id: date.id,
        date: `${startObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${endObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`,
        time: startObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seats: date.availableSeats,
        status: date.isActive !== false ? 'Active' : 'Inactive'
      }
    });
  };

  const handleConfirmHardDelete = async () => {
    if (!deleteDateModal.date?.id) return;
    setDeletingDateId(deleteDateModal.date.id);
    setDeleteErrorMessage(null);
    try {
      await deleteTripDate(deleteDateModal.date.id);
      setDisplayedDates(prev => prev.filter(date => date.id !== deleteDateModal.date.id));
      setDeleteDateModal({ isOpen: false, date: null });
    } catch (error) {
      console.error("Error deleting date:", error);
      const responseData = error.response?.data;
      const isUnrefundedError = responseData?.code === "Trip.DateHasUnrefundedBookings" || 
                               (responseData?.description || "").toLowerCase().includes("refund");

      if (isUnrefundedError) {
        setDeleteErrorMessage("Cannot delete trip date. You must refund all payments first (status 4).");
      } else if (error.response?.status === 500) {
        setDeleteErrorMessage("Server Error: Cannot delete this date because there are still bookings tied to it in the system.");
      } else {
        setDeleteErrorMessage(responseData?.description || responseData?.message || "Failed to delete date. Please try again.");
      }
    } finally {
      setDeletingDateId(null);
    }
  };

  return (
    <>
      <div className={`space-y-6 transition-all duration-700 ease-out ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">{trip.title}</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1 flex items-center gap-1">
              <MapPin size={12} /> {trip.locationName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onViewReviews(trip)} className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all" title="View Reviews">
              <Star size={18} />
            </button>
            <button onClick={() => onEdit(trip)} className="p-2 rounded-xl bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-all" title="Edit Basic Info">
              <Pencil size={18} />
            </button>
            <button onClick={onClose} className="p-2 rounded-xl text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        {trip.images && trip.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {trip.images.map((img, idx) => (
              <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden bg-[#001526]">
                <img src={getImageUrl(img.imageUrl)} alt={`${trip.title} ${idx + 1}`} className="w-full h-full object-cover" />
                {img.isMainImage && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-sky-500 rounded-md text-white text-[10px] font-bold">
                    MAIN
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#002238] border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#cee5ff] mb-3">Description</h2>
              <p className="text-[#a3cbf2]/70 text-sm leading-relaxed whitespace-pre-line">
                {trip.detailedDescription || trip.shortDescription || "No description provided."}
              </p>
            </div>

            <div className="bg-[#002238] border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#cee5ff] mb-4">Trip Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center">
                    <Users size={18} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[#a3cbf2]/40 text-xs">Max Participants</p>
                    <p className="text-[#cee5ff] font-medium">{trip.maxParticipants} persons</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                    <DollarSign size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[#a3cbf2]/40 text-xs">Price</p>
                    <p className="text-[#cee5ff] font-medium">${trip.pricePerPerson} / person</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center">
                    <Ship size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[#a3cbf2]/40 text-xs">Boat</p>
                    <p className="text-[#cee5ff] font-medium">{trip.boatName || "Not assigned"}</p>
                    {trip.boat && <p className="text-[#a3cbf2]/30 text-xs">Capacity: {trip.boat.capacity} persons</p>}
                  </div>
                </div>
                {trip.address && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center">
                      <MapPin size={18} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-[#a3cbf2]/40 text-xs">Address</p>
                      <p className="text-[#cee5ff] font-medium text-sm">{trip.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {(trip.isGuided || trip.hasEquipmentRental || trip.hasSnorkeling) && (
              <div className="bg-[#002238] border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-[#cee5ff] mb-4">Included Options</h2>
                <div className="flex flex-wrap gap-3">
                  {trip.isGuided && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-400/10 text-sky-400">
                      <Compass size={14} /> <span className="text-sm font-medium">Guided Trip</span>
                    </div>
                  )}
                  {trip.hasEquipmentRental && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-400/10 text-emerald-400">
                      <Fish size={14} /> <span className="text-sm font-medium">Equipment Rental</span>
                    </div>
                  )}
                  {trip.hasSnorkeling && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-400/10 text-teal-400">
                      <Waves size={14} /> <span className="text-sm font-medium">Snorkeling</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-[#002238] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#cee5ff] flex items-center gap-2">
                  <Calendar size={18} className="text-sky-400" /> Trip Dates
                </h2>
                <button
                  onClick={() => setShowAddDate(!showAddDate)}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${showAddDate ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"}`}
                  title={showAddDate ? "Cancel" : "Add New Date"}
                >
                  {showAddDate ? <X size={16} /> : <Plus size={16} />}
                </button>
              </div>

              {showAddDate && (
                <form onSubmit={handleAddDateSubmit} className="bg-[#001526] border border-sky-400/20 p-4 rounded-xl mb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="text-xs text-[#a3cbf2]/60 font-medium mb-1.5 block uppercase tracking-wider">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      className="w-full bg-[#002238] border border-white/5 rounded-lg px-3 py-2 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 transition-all [color-scheme:dark]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#a3cbf2]/60 font-medium mb-1.5 block uppercase tracking-wider">End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                      className="w-full bg-[#002238] border border-white/5 rounded-lg px-3 py-2 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 transition-all [color-scheme:dark]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#a3cbf2]/60 font-medium mb-1.5 block uppercase tracking-wider">Available Seats</label>
                    <input
                      type="number"
                      min="0"
                      max={trip.maxParticipants || undefined}
                      value={newSeats}
                      onChange={(e) => setNewSeats(e.target.value)}
                      className="w-full bg-[#002238] border border-white/5 rounded-lg px-3 py-2 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 transition-all"
                      required
                    />
                    <p className="text-[10px] text-[#a3cbf2]/30 mt-1">Max capacity is {trip.maxParticipants}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={addingDate}
                    className="w-full py-2.5 rounded-lg bg-sky-500 text-white text-sm font-bold hover:bg-sky-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {addingDate ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    {addingDate ? "Adding Date..." : "Save Date"}
                  </button>
                </form>
              )}

              {displayedDates.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {displayedDates.map((date) => {
                    const startObj = new Date(date.startDate);
                    const endObj = new Date(date.endDate || date.startDate);
                    const isActive = date.isActive !== false;
                    const isToggling = togglingDateId === date.id;
                    const isDeleting = deletingDateId === date.id;
                    
                    return (
                      <div 
                        key={date.id} 
                        className={`flex flex-col gap-2 p-3 rounded-xl border transition-all duration-200 ${isActive ? 'bg-[#001526] border-white/5 hover:border-white/10' : 'bg-[#001526]/50 border-red-500/20 opacity-60'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} className={isActive ? 'text-sky-400' : 'text-red-400'} />
                              <span className={`text-sm font-medium ${isActive ? 'text-[#cee5ff]' : 'text-[#a3cbf2]/50'}`}>
                                {startObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – {endObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {!isActive && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">Inactive</span>}
                            </div>
                            <div className="flex items-center gap-1.5 pl-4">
                              <Clock size={11} className="text-[#a3cbf2]/40" />
                              <span className={`text-xs ${isActive ? 'text-[#a3cbf2]/60' : 'text-[#a3cbf2]/30'}`}>
                                {startObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {date.remainingTimeText || `${date.durationDays || 0}d left`}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${isActive ? 'bg-[#002238] border-white/5' : 'bg-[#002238]/50 border-red-500/20'}`}>
                              <Users size={12} className={isActive ? 'text-emerald-400' : 'text-red-400/50'} />
                              <span className={`text-xs font-medium ${isActive ? 'text-[#a3cbf2]/80' : 'text-[#a3cbf2]/40'}`}>
                                {date.availableSeats}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/5 mt-1">
                          <button
                            onClick={() => handleToggleStatus(date.id, isActive)}
                            disabled={isToggling}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                            title={isActive ? "Deactivate Date" : "Activate Date"}
                          >
                            {isToggling ? <Loader2 size={12} className="animate-spin" /> : isActive ? <><CheckCircle size={12} /> Active</> : <><XCircle size={12} /> Inactive</>}
                          </button>
                          <button
                            onClick={() => handleDeleteDateClick(date)}
                            disabled={isDeleting}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
                            title="Permanently Delete Date"
                          >
                            {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <><Trash2 size={12} /> Delete</>}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 bg-[#001526] rounded-xl border border-white/5">
                  <Calendar size={24} className="text-[#a3cbf2]/20 mx-auto mb-2" />
                  <p className="text-[#a3cbf2]/50 text-sm">No dates available yet</p>
                  {!showAddDate && (
                    <button onClick={() => setShowAddDate(true)} className="text-sky-400 text-xs font-medium hover:underline mt-1">
                      Add the first date
                    </button>
                  )}
                </div>
              )}
            </div>

            {(trip.latitude || trip.longitude) && (
              <div className="bg-[#002238] border border-white/5 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-[#cee5ff] mb-3">Meeting Point</h2>
                {trip.latitude && trip.longitude && (
                  <p className="text-[#a3cbf2]/60 text-xs font-mono">
                    {trip.latitude}, {trip.longitude}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(163, 203, 242, 0.2); border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(163, 203, 242, 0.4); }
          [color-scheme="dark"] { color-scheme: dark; }
        `}</style>
      </div>

      <ConfirmDeleteDateModal
        isOpen={deleteDateModal.isOpen}
        onClose={() => { setDeleteDateModal({ isOpen: false, date: null }); setDeleteErrorMessage(null); }}
        onConfirm={handleConfirmHardDelete}
        dateInfo={deleteDateModal.date}
        isDeleting={deletingDateId !== null}
        errorMessage={deleteErrorMessage}
      />
    </>
  );
};

export default TripDetails;