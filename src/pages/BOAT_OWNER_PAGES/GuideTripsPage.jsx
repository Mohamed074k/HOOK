// src/pages/BOAT_OWNER_PAGES/GuideTripsPage.js
import { useState, useEffect } from "react";
import { Plus, MapPin, Users, Compass, Pencil, Trash2, Eye, Loader2, Search, Calendar, DollarSign } from "lucide-react";
import { useTrips } from "../../context/BOAT_OWNER_CONTEXT/TripContext";
import TripWizard from "../../components/BOAT_OWNER_COMPONENTS/TripWizard";
import TripDetails from "../../components/BOAT_OWNER_COMPONENTS/TripDetails";
import TripReviews from "../../components/BOAT_OWNER_COMPONENTS/TripReviews";

const optionIcons = {
  guidedTrip: { icon: Compass, label: "Guided" },
  equipmentRental: { icon: Compass, label: "Equipment" },
  snorkeling: { icon: Compass, label: "Snorkeling" },
};

const GuideTripsPage = () => {
  const { 
    trips, 
    allTrips, 
    loading, 
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    createTrip, 
    updateTrip, 
    deleteTrip 
  } = useTrips();
  
  const [view, setView] = useState("list");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const openAdd = () => {
    setSelectedTrip(null);
    setView("wizard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (trip) => {
    setSelectedTrip(trip);
    setView("wizard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDetails = (trip) => {
    setSelectedTrip(trip);
    setView("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeWizard = () => {
    setView("list");
    setSelectedTrip(null);
  };

  const openReviews = (trip) => {
    setSelectedTrip(trip);
    setView("reviews");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (formData) => {
    try {
      if (selectedTrip) {
        await updateTrip(selectedTrip.id, formData);
      } else {
        await createTrip(formData);
      }
      closeWizard();
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };

  const confirmDelete = (id) => setDeleteId(id);
  
  const handleDelete = async () => {
    try {
      await deleteTrip(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) return imageUrl;
    return `https://hook.runasp.net${imageUrl}`;
  };

  if (loading && allTrips.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50">Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (view === "wizard") {
    return <TripWizard trip={selectedTrip} onClose={closeWizard} onSave={handleSave} />;
  }

  if (view === "details" && selectedTrip) {
    return <TripDetails trip={selectedTrip} onClose={closeWizard} onEdit={openEdit} onViewReviews={openReviews} animate={animate} />;
  }

  if (view === "reviews" && selectedTrip) {
    return <TripReviews trip={selectedTrip} onBack={() => setView("details")} animate={animate} />;
  }
  
  return (
    <div className="space-y-6">
      <div className={`transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">My Trips</h1>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">
              {allTrips.length} trips total
            </p>
          </div>
          <button
            onClick={openAdd}
            className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" /> 
              Add New Trip
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>

      <div className={`transform transition-all duration-700 delay-100 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3cbf2]/30" />
          <input
            type="text"
            placeholder="Search trips by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#002238] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-[#cee5ff] text-sm focus:outline-none focus:border-sky-400/40 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {trips.map((trip, idx) => {
          const coverImage = getImageUrl(trip.mainImageUrl || trip.images?.[0]?.imageUrl);
          
          return (
            <div
              key={trip.id}
              className={`group bg-[#002238] border border-white/5 rounded-2xl overflow-hidden hover:border-sky-400/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-400/5 ring-1 ring-transparent hover:ring-sky-400/10 transition-all duration-300`}
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              <div className="h-32 relative overflow-hidden bg-gradient-to-br from-sky-900 to-[#001526]">
                {coverImage ? (
                  <img 
                    src={coverImage} 
                    alt={trip.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Compass size={32} className="text-[#a3cbf2]/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#002238] via-transparent to-transparent opacity-60" />
              </div>

              <div className="p-4">
                <h3 className="text-[#cee5ff] font-bold text-base group-hover:text-white transition-colors line-clamp-1">
                  {trip.title}
                </h3>
                
                <p className="text-[#a3cbf2]/40 text-xs mt-0.5 flex items-center gap-1">
                  <MapPin size={10} /> {trip.locationName || "Location not set"}
                </p>

                <div className="flex flex-wrap gap-3 mt-3 text-xs text-[#a3cbf2]/50">
                  <span className="flex items-center gap-1">
                    <Users size={11} /> {trip.maxParticipants} max
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={11} /> ${trip.pricePerPerson}/person
                  </span>
                  {trip.tripDates && trip.tripDates.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {trip.tripDates.length} dates
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {trip.isGuided && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-400/10 text-sky-400">
                      Guided
                    </span>
                  )}
                  {trip.hasEquipmentRental && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400">
                      Equipment
                    </span>
                  )}
                  {trip.hasSnorkeling && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/10 text-teal-400">
                      Snorkeling
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={() => openDetails(trip)}
                    className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all duration-200"
                    title="View Details"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => openEdit(trip)}
                    className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-[#cee5ff] hover:bg-white/5 transition-all duration-200"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => confirmDelete(trip.id)}
                    className="p-2 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={openAdd}
          className={`min-h-[280px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 text-[#a3cbf2]/30 hover:border-sky-400/30 hover:text-sky-400/60 hover:bg-sky-400/5 transition-all duration-300 group`}
          style={{
            opacity: animate ? 1 : 0,
            transform: animate ? "translateY(0)" : "translateY(30px)",
            transitionDelay: `${trips.length * 100}ms`,
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-sky-400/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
          </div>
          <span className="text-sm font-medium">Create New Trip</span>
          <span className="text-xs text-[#a3cbf2]/20 group-hover:text-[#a3cbf2]/40 transition-colors">Click to start</span>
        </button>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-[#002238] border border-white/5 text-[#a3cbf2]/50 hover:text-white hover:border-sky-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-[#a3cbf2]/50 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-[#002238] border border-white/5 text-[#a3cbf2]/50 hover:text-white hover:border-sky-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[#cee5ff] font-bold text-lg mb-2">Delete Trip?</h3>
            <p className="text-[#a3cbf2]/60 text-sm mb-6">
              This will permanently remove the trip and all its data. Bookings for this trip will be affected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideTripsPage;