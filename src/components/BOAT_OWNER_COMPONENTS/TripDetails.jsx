// src/components/BOAT_OWNER_COMPONENTS/TripDetails.js
import { useState } from "react";
import { MapPin, Calendar, Users, DollarSign, Compass, Fish, Waves, Ship, Clock, X, Pencil, Plus, Loader2 } from "lucide-react";
import { useTrips } from "../../context/BOAT_OWNER_CONTEXT/TripContext";
import { toast } from 'react-hot-toast';

const TripDetails = ({ trip, onClose, onEdit, animate }) => {
  const { addNewTripDates } = useTrips();
  
  // States for adding new date
  const [showAddDate, setShowAddDate] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newSeats, setNewSeats] = useState(trip.maxParticipants || 1);
  const [addingDate, setAddingDate] = useState(false);
  
  // Local state to show newly added dates instantly without closing the modal
  const [displayedDates, setDisplayedDates] = useState(trip.tripDates || []);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) return imageUrl;
    return `https://hook.runasp.net${imageUrl}`;
  };

  const handleAddDateSubmit = async (e) => {
    e.preventDefault();
    if (!newDate) {
      toast.error("Please select a date and time");
      return;
    }

    setAddingDate(true);
    try {
      // إرسال التاريخ للباك إند
      await addNewTripDates(trip.id, [{
        startDate: newDate,
        availableSeats: newSeats
      }]);

      // تحديث الواجهة فوراً بالتاريخ الجديد
      setDisplayedDates(prev => [...prev, {
        id: Math.random().toString(), // ID مؤقت للعرض بس
        startDate: new Date(newDate).toISOString(),
        availableSeats: newSeats
      }].sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));

      toast.success("Date added successfully!");
      
      // تصفير الفورم وقفلها
      setShowAddDate(false);
      setNewDate("");
      setNewSeats(trip.maxParticipants || 1);
    } catch (error) {
      toast.error("Failed to add date. Please try again.");
    } finally {
      setAddingDate(false);
    }
  };

  return (
    <div className={`space-y-6 transition-all duration-700 ease-out ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">{trip.title}</h1>
          <p className="text-[#a3cbf2]/50 text-sm mt-1 flex items-center gap-1">
            <MapPin size={12} /> {trip.locationName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(trip)}
            className="p-2 rounded-xl bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-all"
            title="Edit Basic Info"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Images Gallery */}
      {trip.images && trip.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trip.images.map((img, idx) => (
            <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden bg-[#001526]">
              <img 
                src={getImageUrl(img.imageUrl)} 
                alt={`${trip.title} ${idx + 1}`}
                className="w-full h-full object-cover"
              />
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-[#002238] border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#cee5ff] mb-3">Description</h2>
            <p className="text-[#a3cbf2]/70 text-sm leading-relaxed whitespace-pre-line">
              {trip.detailedDescription || trip.shortDescription || "No description provided."}
            </p>
          </div>

          {/* Details Grid */}
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
                  {trip.boat && (
                    <p className="text-[#a3cbf2]/30 text-xs">Capacity: {trip.boat.capacity} persons</p>
                  )}
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

          {/* Extra Options */}
          {(trip.isGuided || trip.hasEquipmentRental || trip.hasSnorkeling) && (
            <div className="bg-[#002238] border border-white/5 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#cee5ff] mb-4">Included Options</h2>
              <div className="flex flex-wrap gap-3">
                {trip.isGuided && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-400/10 text-sky-400">
                    <Compass size={14} />
                    <span className="text-sm font-medium">Guided Trip</span>
                  </div>
                )}
                {trip.hasEquipmentRental && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-400/10 text-emerald-400">
                    <Fish size={14} />
                    <span className="text-sm font-medium">Equipment Rental</span>
                  </div>
                )}
                {trip.hasSnorkeling && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-400/10 text-teal-400">
                    <Waves size={14} />
                    <span className="text-sm font-medium">Snorkeling</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Available Dates & Add Date Form */}
          <div className="bg-[#002238] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#cee5ff] flex items-center gap-2">
                <Calendar size={18} className="text-sky-400" />
                Trip Dates
              </h2>
              <button
                onClick={() => setShowAddDate(!showAddDate)}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  showAddDate 
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" 
                    : "bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                }`}
                title={showAddDate ? "Cancel" : "Add New Date"}
              >
                {showAddDate ? <X size={16} /> : <Plus size={16} />}
              </button>
            </div>

            {/* Add Date Form */}
            {showAddDate && (
              <form onSubmit={handleAddDateSubmit} className="bg-[#001526] border border-sky-400/20 p-4 rounded-xl mb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="text-xs text-[#a3cbf2]/60 font-medium mb-1.5 block uppercase tracking-wider">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[#002238] border border-white/5 rounded-lg px-3 py-2 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 transition-all [color-scheme:dark]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-[#a3cbf2]/60 font-medium mb-1.5 block uppercase tracking-wider">
                    Available Seats
                  </label>
                  <input
                    type="number"
                    min="1"
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

            {/* Dates List */}
            {displayedDates.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {displayedDates.map((date) => {
                  const dateObj = new Date(date.startDate);
                  return (
                    <div key={date.id} className="flex items-center justify-between p-3 rounded-xl bg-[#001526] border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-sky-400" />
                          <span className="text-[#cee5ff] text-sm font-medium">
                            {dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 pl-4">
                          <Clock size={11} className="text-[#a3cbf2]/40" />
                          <span className="text-[#a3cbf2]/60 text-xs">
                            {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#002238] px-2.5 py-1 rounded-lg border border-white/5">
                        <Users size={12} className="text-emerald-400" />
                        <span className="text-[#a3cbf2]/80 text-xs font-medium">
                          {date.availableSeats}
                        </span>
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
                  <button 
                    onClick={() => setShowAddDate(true)}
                    className="text-sky-400 text-xs font-medium hover:underline mt-1"
                  >
                    Add the first date
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Location Coordinates */}
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
      
      {/* Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(163, 203, 242, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(163, 203, 242, 0.4);
        }
        [color-scheme="dark"] {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
};

export default TripDetails;