// src/pages/ADMIN_PAGES/components/TripDetailsModal.jsx
import { useState, useEffect } from "react";
import { X, Calendar, Users, MapPin, DollarSign, Anchor, Compass, Wifi, Ship } from "lucide-react";

const TripDetailsModal = ({ trip, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (trip) {
      setIsOpen(true);
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      handleClose();
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [trip]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isClosing) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isClosing) {
      handleClose();
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `https://hook.runasp.net${url}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  if (!isOpen && !trip) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] transition-all duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: isClosing ? 'transparent' : 'rgba(0, 0, 0, 0.85)' }}
      onClick={handleBackdropClick}
    >
      <div className={`flex items-center justify-center min-h-screen p-4 transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <div className="bg-[#002238] border border-white/10 rounded-2xl max-w-4xl w-full shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
            <h3 className="text-[#cee5ff] font-bold text-xl">Trip Details</h3>
            <button 
              onClick={handleClose} 
              className="p-2 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Main Image - Smaller */}
            {trip?.mainImageUrl && (
              <div className="flex justify-center">
                <img 
                  src={getImageUrl(trip.mainImageUrl)} 
                  alt={trip.title}
                  className="w-full max-w-md h-48 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Trip Title</p>
                <p className="text-[#cee5ff] font-medium text-lg">{trip?.title}</p>
              </div>
              <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Trip Manager</p>
                <p className="text-[#cee5ff] font-medium">{trip?.tripManagerName}</p>
              </div>
              <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Boat</p>
                <div className="flex items-center gap-2">
                  <Ship size={14} className="text-sky-400" />
                  <p className="text-[#cee5ff] font-medium">{trip?.boatName}</p>
                </div>
                <p className="text-[#a3cbf2]/40 text-xs mt-1">Capacity: {trip?.boat?.capacity} guests</p>
              </div>
              <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-sky-400" />
                  <p className="text-[#cee5ff] font-medium">{trip?.locationName}</p>
                </div>
                {trip?.address && (
                  <p className="text-[#a3cbf2]/40 text-xs mt-1">{trip.address}</p>
                )}
              </div>
            </div>

            {/* Pricing & Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Price per Person</p>
                <div className="flex items-center gap-2">
                  <DollarSign size={20} className="text-sky-400" />
                  <p className="text-sky-400 font-bold text-2xl">{trip?.pricePerPerson}</p>
                </div>
              </div>
              <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-1">Max Participants</p>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-sky-400" />
                  <p className="text-[#cee5ff] font-bold text-2xl">{trip?.maxParticipants}</p>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-3">
              {trip?.shortDescription && (
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Short Description</p>
                  <p className="text-[#cee5ff] text-sm leading-relaxed">{trip.shortDescription}</p>
                </div>
              )}
              {trip?.detailedDescription && (
                <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                  <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Detailed Description</p>
                  <p className="text-[#cee5ff] text-sm leading-relaxed">{trip.detailedDescription}</p>
                </div>
              )}
            </div>

            {/* Features */}
            {(trip?.isGuided || trip?.hasEquipmentRental || trip?.hasSnorkeling) && (
              <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-3">Features & Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {trip?.isGuided && (
                    <span className="px-3 py-1.5 rounded-lg bg-sky-400/10 text-sky-400 text-xs font-medium flex items-center gap-1">
                      <Compass size={12} /> Guided Tour
                    </span>
                  )}
                  {trip?.hasEquipmentRental && (
                    <span className="px-3 py-1.5 rounded-lg bg-sky-400/10 text-sky-400 text-xs font-medium flex items-center gap-1">
                      <Anchor size={12} /> Equipment Rental
                    </span>
                  )}
                  {trip?.hasSnorkeling && (
                    <span className="px-3 py-1.5 rounded-lg bg-sky-400/10 text-sky-400 text-xs font-medium flex items-center gap-1">
                      <Wifi size={12} /> Snorkeling
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Trip Dates - No vertical scroll, all dates visible */}
            {trip?.tripDates && trip.tripDates.length > 0 && (
              <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-3">Trip Dates & Availability</p>
                <div className="space-y-2">
                  {trip.tripDates.map((date, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[#002238] rounded-lg border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <Calendar size={14} className="text-sky-400 shrink-0" />
                        <div>
                          <p className="text-[#cee5ff] text-sm">
                            {formatDate(date.startDate)}
                          </p>
                          <p className="text-[#cee5ff] text-xs opacity-75">
                            to {formatDate(date.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="flex items-center gap-2">
                          <Users size={12} className="text-[#a3cbf2]/40" />
                          <span className="text-[#a3cbf2]/60 text-xs">Seats: {date.availableSeats}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          date.isActive 
                            ? 'bg-emerald-400/10 text-emerald-400' 
                            : 'bg-red-400/10 text-red-400'
                        }`}>
                          {date.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coordinates if available */}
            {(trip?.latitude || trip?.longitude) && (
              <div className="p-4 bg-[#001526] rounded-xl border border-white/5">
                <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Coordinates</p>
                <div className="flex gap-4 text-sm">
                  {trip?.latitude && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#a3cbf2]/40">Lat:</span>
                      <span className="text-[#cee5ff]">{trip.latitude}</span>
                    </div>
                  )}
                  {trip?.longitude && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#a3cbf2]/40">Lng:</span>
                      <span className="text-[#cee5ff]">{trip.longitude}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Close Button at Bottom */}
          <div className="p-6 pt-0">
            <button 
              onClick={handleClose} 
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;