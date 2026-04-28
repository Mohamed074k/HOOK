import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Clock, Users, Star, Waves, Ship, Anchor, 
  Calendar, ChevronLeft, ChevronRight, Check, Wifi,
  Coffee, Utensils, Camera, Shield, Wind, Thermometer,
  Droplets, Fish, Compass, Navigation, Phone, Mail,
  Gift, Heart, Share2, Bookmark, Maximize2, Minimize2, X, ChevronDown,
  Info, Package, Settings, Award, Briefcase, DollarSign, Link as LinkIcon,
  Clock as ClockIcon, UserCheck
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ease = [0.25, 0.46, 0.45, 0.94];

// ─── Trip Data ────────────────────────────────────────────────────────────────
const tripsData = [
  { 
    id: 1,
    title: "Deep Sea Fishing Adventure", 
    location: "Gulf of Mexico, Florida", 
    duration: "8 hours", 
    crew: 6, 
    price: 1000,
    priceDisplay: "$1,000",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&h=900&fit=crop",
    ],
    rating: 4.9,
    reviews: 128,
    featured: true,
    water: "Gulf of Mexico",
    boat: "Ocean Hunter Pro",
    description: "Enjoy a day-long adventure in the deep-sea fishing experience of the Gulf of Mexico. Cruise and depart with expert anglers. Our luxury vessel is designed with the safety of your family in mind. Experience the thrill of catching Marlin, Tuna, and Mahi-Mahi with our state-of-the-art equipment and experienced crew.",
    captain: {
      name: "Captain John Smith",
      experience: "15+ years",
      totalTrips: 342,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Master angler with over 15 years of experience in the Gulf waters"
    },
    cabin: "First Class Luxury Suite",
    equipment: ["Tackle Boxes", "Lures & Repellents", "Fish Finder", "GPS Navigation", "Live Bait Wells", "Outriggers", "Fighting Chair"],
    amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "Mini Bar", "Entertainment System", "Sun Deck"],
    departureDates: ["May 15, 2024", "May 22, 2024", "May 29, 2024", "June 5, 2024"],
    included: ["Professional Guide", "Fishing License", "Tackle & Gear", "Snacks & Drinks", "Photos & Videos", "Safety Equipment"],
    itinerary: [
      { day: 1, title: "Departure & Safety Briefing", description: "Board at 6:00 AM, meet the crew, safety orientation" },
      { day: 2, title: "Deep Sea Fishing", description: "Full day of fishing at prime locations" },
      { day: 3, title: "Island Exploration", description: "Visit remote islands and snorkeling spots" },
      { day: 4, title: "Return Journey", description: "Morning fishing, return to dock by 4:00 PM" },
    ],
    reviewsList: [
      { id: 1, user: "Michael Brown", rating: 5, date: "May 2024", comment: "Absolutely incredible experience! Caught a massive Marlin and the crew was top-notch.", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
      { id: 2, user: "Sarah Johnson", rating: 5, date: "April 2024", comment: "Well organized, great equipment, and Captain John knows his stuff. Highly recommend!", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
      { id: 3, user: "David Wilson", rating: 4, date: "March 2024", comment: "Great trip overall. Weather was perfect and we caught plenty of fish.", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    ]
  },
  { 
    id: 2,
    title: "Keys Fly-Fishing Charter", 
    location: "Islamorada, Florida", 
    duration: "8 hours", 
    crew: 4, 
    price: 800,
    priceDisplay: "$800",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&h=900&fit=crop",
    ],
    rating: 4.8,
    reviews: 94,
    featured: false,
    water: "Atlantic Ocean",
    boat: "Backcountry Skiff",
    description: "Experience the thrill of fly-fishing in the pristine waters of the Florida Keys...",
    captain: { name: "Captain Mike Johnson", experience: "12+ years", totalTrips: 189, image: "https://randomuser.me/api/portraits/men/45.jpg", bio: "" },
    cabin: "Standard Cabin",
    equipment: ["Fly Rods", "Tackle Boxes", "Lures", "Fishing Nets"],
    amenities: ["Basic seating", "Cooler", "Shade cover"],
    departureDates: ["May 18, 2024", "May 25, 2024"],
    included: ["Fishing Guide", "Equipment", "Lunch"],
    itinerary: [],
    reviewsList: [
      { id: 1, user: "Chris Evans", rating: 5, date: "April 2024", comment: "Amazing fly fishing experience!", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
    ]
  },
];

// ─── Animated Background ─────────────────────────────────────────────────────
const AnimatedBackground = React.memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <motion.div
      className="absolute top-20 left-[10%] w-72 h-72 rounded-full"
      style={{ background: "radial-gradient(circle, rgba(83,214,251,0.08) 0%, transparent 70%)" }}
      animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-20 right-[5%] w-96 h-96 rounded-full"
      style={{ background: "radial-gradient(circle, rgba(0,138,167,0.06) 0%, transparent 70%)" }}
      animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
  </div>
));

// ─── Custom Date Selector Component ───────────────────────────────────────
const DateSelector = ({ dates, selectedDate, onSelectDate }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      day: date.getDate(),
      full: dateString
    };
  };

  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {dates.map((date) => {
        const { month, day, full } = formatDate(date);
        const isSelected = selectedDate === full;
        return (
          <motion.button
            key={date}
            onClick={() => onSelectDate(full)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex flex-col items-center px-5 py-2.5 rounded-xl border transition-all duration-200 ${
              isSelected 
                ? "bg-sky-500/20 border-sky-400 text-sky-400 shadow-lg shadow-sky-500/20" 
                : "bg-[#001526] border-white/5 text-[#a3cbf2] hover:border-sky-400/30 hover:text-sky-400"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
            <span className="text-xl font-bold">{day}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

// ─── Review Card Component ────────────────────────────────────────────────
const ReviewCard = ({ review }) => {
  return (
    <div className="p-4 rounded-xl bg-[#001526] border border-white/5 transition-all hover:border-white/10">
      <div className="flex items-start gap-3">
        <img 
          src={review.avatar} 
          alt={review.user} 
          className="w-10 h-10 rounded-full object-cover border border-sky-400/30"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h4 className="font-semibold text-[#cee5ff] text-sm">{review.user}</h4>
            <span className="text-xs text-[#a3cbf2]/40">{review.date}</span>
          </div>
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-white/20"} />
            ))}
          </div>
          <p className="text-[#a3cbf2]/70 text-sm leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Optimized Image Carousel Component ─────────────────────────────────────
const ImageCarousel = React.memo(({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef(null);
  const isHoveredRef = useRef(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!isFullscreen && !isHoveredRef.current) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isFullscreen]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, 5000);
  }, [nextSlide]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const CarouselContent = useCallback(() => (
    <div className="relative w-full h-full bg-[#001526]">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title} - ${currentIndex + 1}`}
          className="w-full h-full object-cover opacity-90"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease }}
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#002238]/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-sky-500 hover:border-sky-400 transition-all duration-300 z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#002238]/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-sky-500 hover:border-sky-400 transition-all duration-300 z-10"
      >
        <ChevronRight size={20} />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-sky-400" : "w-4 bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
      
      <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-[#002238]/60 backdrop-blur-sm border border-white/5 text-white text-xs z-10 font-medium">
        {currentIndex + 1} / {images.length}
      </div>
      
      {!isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[#002238]/50 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-sky-500 hover:border-sky-400 transition-all duration-300 z-10"
        >
          <Maximize2 size={16} />
        </button>
      )}
    </div>
  ), [currentIndex, images, title, prevSlide, nextSlide, goToSlide, toggleFullscreen, isFullscreen]);

  if (isFullscreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      >
        <CarouselContent />
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 z-20 border border-white/10"
        >
          <X size={24} />
        </button>
      </motion.div>
    );
  }

  return (
    <div 
      className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-b-3xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CarouselContent />
    </div>
  );
});

// ─── Share Menu Component ────────────────────────────────────────────────────
const ShareMenu = React.memo(({ onClose }) => {
  const shareUrl = window.location.href;
  
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
    onClose();
  }, [shareUrl, onClose]);

  const shareViaEmail = useCallback(() => {
    window.open(`mailto:?subject=Check out this trip&body=${shareUrl}`, '_blank');
    onClose();
  }, [shareUrl, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full right-0 mt-2 bg-[#002238] border border-white/10 rounded-xl p-2 shadow-2xl w-48 z-30"
    >
      <button
        onClick={copyToClipboard}
        className="w-full px-3 py-2.5 text-left text-sm text-[#a3cbf2] hover:bg-[#001526] hover:text-sky-400 rounded-lg transition-colors flex items-center gap-3"
      >
        <LinkIcon size={14} /> Copy Link
      </button>
      <button
        onClick={shareViaEmail}
        className="w-full px-3 py-2.5 text-left text-sm text-[#a3cbf2] hover:bg-[#001526] hover:text-sky-400 rounded-lg transition-colors flex items-center gap-3"
      >
        <Mail size={14} /> Share via Email
      </button>
    </motion.div>
  );
});

// ─── Info Card Component ────────────────────────────────────────────────────
const InfoCard = React.memo(({ children, title, icon: Icon }) => (
  <motion.div
    className="bg-[#002238] border border-white/5 rounded-2xl p-6 hover:border-sky-400/30 transition-colors duration-300 shadow-sm"
  >
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/5">
      <div className="p-2 rounded-lg bg-sky-400/10">
        <Icon size={18} className="text-sky-400" />
      </div>
      <h3 className="text-lg font-semibold text-[#cee5ff]">{title}</h3>
    </div>
    {children}
  </motion.div>
));

// ─── Main TripDetailsPage Component ─────────────────────────────────────────
const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const foundTrip = tripsData.find(t => t.id === parseInt(id));
    if (foundTrip) {
      setTrip(foundTrip);
      if (foundTrip.departureDates && foundTrip.departureDates.length > 0) {
        setSelectedDate(foundTrip.departureDates[0]);
      }
    }
    setLoading(false);
  }, [id]);

  const handleBookNow = useCallback(() => {
    navigate(`/trip/${trip.id}/book`, {
      state: {
        trip,
        selectedDate,
        quantity,
        totalPrice: trip.price * quantity
      }
    });
  }, [navigate, trip, selectedDate, quantity]);

  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites", {
      style: { background: '#002238', color: '#cee5ff', border: '1px solid rgba(255,255,255,0.1)' }
    });
  }, [isLiked]);

  const toggleShareMenu = useCallback(() => {
    setShowShareMenu(prev => !prev);
  }, []);

  const closeShareMenu = useCallback(() => {
    setShowShareMenu(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/60">Loading adventure...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Compass size={64} className="mx-auto text-white/10 mb-4" />
          <p className="text-[#a3cbf2]/60 text-lg">Trip not found</p>
          <button
            onClick={() => navigate("/trips")}
            className="mt-4 px-6 py-2 rounded-xl bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 transition-colors"
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 relative">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ImageCarousel images={trip.images} title={trip.title} />
      </motion.div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex-1">
              {/* Trip Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#cee5ff] mb-4">{trip.title}</h1>
              
              {/* Location and Rating */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[#a3cbf2] text-sm mb-6">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-sky-400" />
                  {trip.location}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(trip.rating) ? "text-amber-400 fill-amber-400" : "text-white/20"} />
                    ))}
                  </div>
                  <span className="text-[#cee5ff] font-medium">{trip.rating}</span>
                  <span className="text-[#a3cbf2]/60">({trip.reviews} reviews)</span>
                </div>
              </div>

              {/* Stats Row - Duration, Seats, etc */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#001526] border border-white/5">
                  <div className="p-1.5 rounded-lg bg-sky-400/10">
                    <ClockIcon size={16} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[#a3cbf2]/60 text-xs">Duration</p>
                    <p className="text-[#cee5ff] font-semibold text-sm">{trip.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#001526] border border-white/5">
                  <div className="p-1.5 rounded-lg bg-sky-400/10">
                    <Users size={16} className="text-sky-400" />
                  </div>
                  <div>
                     <p className="text-[#cee5ff] font-semibold text-sm">Up to {trip.crew} seats</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#001526] border border-white/5">
                  <div className="p-1.5 rounded-lg bg-sky-400/10">
                    <Ship size={16} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[#a3cbf2]/60 text-xs">Vessel</p>
                    <p className="text-[#cee5ff] font-semibold text-sm">{trip.boat}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className="w-12 h-12 rounded-xl bg-[#001526] border border-white/5 flex items-center justify-center transition-all hover:border-white/10 shadow-sm"
              >
                <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : "text-[#a3cbf2]"} />
              </motion.button>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleShareMenu}
                  className="w-12 h-12 rounded-xl bg-[#001526] border border-white/5 flex items-center justify-center text-[#a3cbf2] hover:text-sky-400 hover:border-sky-400/30 transition-all shadow-sm"
                >
                  <Share2 size={20} />
                </motion.button>
                <AnimatePresence>
                  {showShareMenu && <ShareMenu onClose={closeShareMenu} />}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* About This Trip */}
            <InfoCard title="About This Trip" icon={Info}>
              <p className="text-[#a3cbf2]/80 leading-relaxed">{trip.description}</p>
            </InfoCard>
            
            {/* Captain Info */}
            <InfoCard title="About Your Captain" icon={Navigation}>
              <div className="flex items-center gap-4">
                <img src={trip.captain.image} alt={trip.captain.name} className="w-16 h-16 rounded-full object-cover border-2 border-sky-400" />
                <div>
                  <h4 className="font-semibold text-[#cee5ff] text-lg">{trip.captain.name}</h4>
                  <div className="flex flex-wrap gap-4 mt-1">
                    <p className="text-sm text-sky-400 font-medium">{trip.captain.experience} experience</p>
                    <p className="text-sm text-[#a3cbf2]/60 flex items-center gap-1">
                      <Ship size={12} /> {trip.captain.totalTrips || 250}+ trips completed
                    </p>
                  </div>
                  {trip.captain.bio && (
                    <p className="text-xs text-[#a3cbf2]/60 mt-2">{trip.captain.bio}</p>
                  )}
                </div>
              </div>
            </InfoCard>
            
            {/* Equipment Included - Icon with bg, no checkmark */}
            <InfoCard title="Equipment Included" icon={Fish}>
              <div className="grid grid-cols-2 gap-3">
                {trip.equipment.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm p-2.5 rounded-xl bg-[#001526] border border-white/5">
                    <div className="p-1 rounded-lg bg-sky-400/10">
                      <Fish size={14} className="text-sky-400" />
                    </div>
                    <span className="text-[#cee5ff]">{item}</span>
                  </div>
                ))}
              </div>
            </InfoCard>
            
            {/* Select Date */}
            <InfoCard title="Select Date" icon={Calendar}>
              <DateSelector 
                dates={trip.departureDates}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </InfoCard>
            
            {/* Reviews Section */}
            <InfoCard title={`Reviews (${trip.reviews})`} icon={Star}>
              <div className="space-y-4">
                {trip.reviewsList && trip.reviewsList.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </InfoCard>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:sticky lg:top-8"
          >
            <div className="bg-[#002238] border border-sky-400/20 rounded-2xl p-6 shadow-2xl">
              <div className="text-center mb-6 pb-4 border-b border-white/5">
                <div className="text-3xl font-black text-sky-400">{trip.priceDisplay}</div>
                <div className="text-xs text-[#a3cbf2]/40 uppercase tracking-wider mt-1">per person</div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 rounded-xl bg-[#001526] border border-white/5">
                  <span className="text-sm text-[#a3cbf2]/60">Selected Date</span>
                  <span className="text-sm text-[#cee5ff] font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-[#001526] border border-white/5">
                  <span className="text-sm text-[#a3cbf2]/60">Number of Guests</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 transition-all flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-[#cee5ff] font-bold text-base w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(trip.crew, quantity + 1))}
                      className="w-7 h-7 rounded-lg bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 transition-all flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6 bg-sky-400/5 p-4 rounded-xl border border-sky-400/20">
                <div className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider mb-1">Total for {quantity} {quantity === 1 ? 'guest' : 'guests'}</div>
                <div className="text-3xl font-black text-sky-400">${trip.price * quantity}</div>
              </div>
              
              <motion.button
                onClick={handleBookNow}
                className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-[0_0_20px_rgba(83,214,251,0.2)] flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(83,214,251,0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Book Now</span>
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;
 