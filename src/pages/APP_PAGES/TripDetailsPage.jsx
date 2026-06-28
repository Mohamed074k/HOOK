import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Clock, Users, Star, Waves, Ship, Anchor, 
  Calendar, ChevronLeft, ChevronRight, Check, Wifi,
  Coffee, Utensils, Camera, Shield, Wind, Thermometer,
  Droplets, Fish, Compass, Navigation, Phone, Mail,
  Gift, Share2, Bookmark, Maximize2, Minimize2, X, ChevronDown,
  Info, Package, Settings, Award, Briefcase, DollarSign, Link as LinkIcon,
  Clock as ClockIcon, UserCheck, MessageCircle, ThumbsUp
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";

const ease = [0.25, 0.46, 0.45, 0.94];

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

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

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-4 rounded-xl bg-[#001526] border border-white/5 transition-all hover:border-white/10">
      <div className="flex items-start gap-3">
        {review.userImage ? (
          <img 
            src={getImageUrl(review.userImage)} 
            alt={review.userName} 
            className="w-10 h-10 rounded-full object-cover border border-sky-400/30"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-sky-400/20 flex items-center justify-center border border-sky-400/30">
            <UserCheck size={18} className="text-sky-400" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h4 className="font-semibold text-[#cee5ff] text-sm">{review.userName}</h4>
            <span className="text-xs text-[#a3cbf2]/40">{formatDate(review.createdOn)}</span>
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
          src={getImageUrl(images[currentIndex].imageUrl || images[currentIndex])}
          alt={`${title} - ${currentIndex + 1}`}
          className="w-full h-full object-cover opacity-90"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease }}
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      {images.length > 1 && (
        <>
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
        </>
      )}
      
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[#002238]/50 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-sky-500 hover:border-sky-400 transition-all duration-300 z-10"
      >
        <Maximize2 size={16} />
      </button>
    </div>
  ), [currentIndex, images, title, prevSlide, nextSlide, goToSlide, toggleFullscreen]);

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

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchTripDetails = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/api/Trips/allroles/${id}`);
        setTrip(response.data);
      } catch (error) {
        console.error("Error fetching trip details:", error);
        toast.error("Failed to load trip details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTripDetails();
    }
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      setReviewsLoading(true);
      try {
        const response = await apiClient.get(`/api/Reviews/allroles/trip/${id}`);
        const reviewsData = response.data;
        setReviews(reviewsData);
        
        if (reviewsData.length > 0) {
          const avg = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
          setAverageRating(avg);
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleBookNow = useCallback(() => {
    navigate(`/trip/${trip.id}/book`, {
      state: { trip }
    });
  }, [navigate, trip]);

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
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#001526]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/60">Loading adventure...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#001526]">
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

  const activeTripDates = trip.tripDates?.filter(date => date.isActive && date.availableSeats >= 0) || [];
  const mainImage = trip.mainImageUrl || trip.images?.find(img => img.isMainImage)?.imageUrl || trip.images?.[0]?.imageUrl;
  
  const carouselImages = trip.images?.length > 0 
    ? trip.images 
    : mainImage ? [{ imageUrl: mainImage, isMainImage: true }] : [];

  return (
    <div className="space-y-6 pb-20 relative min-h-screen bg-[#001526]">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {carouselImages.length > 0 ? (
          <ImageCarousel images={carouselImages} title={trip.title} />
        ) : (
          <div className="h-[60vh] bg-gradient-to-br from-sky-500/20 to-cyan-500/20 flex items-center justify-center">
            <Ship size={80} className="text-sky-400/40" />
          </div>
        )}
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#cee5ff] mb-4">{trip.title}</h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[#a3cbf2] text-sm mb-6">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-sky-400" />
                  {trip.locationName}
                </span>
                {averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < Math.floor(averageRating) ? "text-amber-400 fill-amber-400" : "text-white/20"} />
                      ))}
                    </div>
                    <span className="text-[#cee5ff] font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-[#a3cbf2]/60">({reviews.length} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#001526] border border-white/5">
                  <div className="p-1.5 rounded-lg bg-sky-400/10">
                    <ClockIcon size={16} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[#a3cbf2]/60 text-xs">Duration</p>
                    <p className="text-[#cee5ff] font-semibold text-sm">
                      {trip.tripDates?.[0] ? 
                        (trip.tripDates[0].durationDays > 0 ? `${trip.tripDates[0].durationDays} days` : `${trip.tripDates[0].durationHours} hours`)
                        : 'Flexible'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#001526] border border-white/5">
                  <div className="p-1.5 rounded-lg bg-sky-400/10">
                    <Users size={16} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[#a3cbf2]/60 text-xs">Max Capacity</p>
                    <p className="text-[#cee5ff] font-semibold text-sm">Up to {trip.maxParticipants}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#001526] border border-white/5">
                  <div className="p-1.5 rounded-lg bg-sky-400/10">
                    <Ship size={16} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[#a3cbf2]/60 text-xs">Boat</p>
                    <p className="text-[#cee5ff] font-semibold text-sm">{trip.boat?.name || trip.boatName || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 relative">
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
            <InfoCard title="About This Trip" icon={Info}>
              <p className="text-[#a3cbf2]/80 leading-relaxed whitespace-pre-line">
                {trip.detailedDescription || trip.shortDescription || "No description available."}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {trip.isGuided && (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-sky-400/10 text-sky-400 border border-sky-400/20">
                    Guided Tour
                  </span>
                )}
                {trip.hasEquipmentRental && (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-sky-400/10 text-sky-400 border border-sky-400/20">
                    Equipment Included
                  </span>
                )}
                {trip.hasSnorkeling && (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-sky-400/10 text-sky-400 border border-sky-400/20">
                    Snorkeling Available
                  </span>
                )}
              </div>
            </InfoCard>
            
            {trip.boat && (
              <InfoCard title="About the Boat" icon={Anchor}>
                <div className="flex items-start gap-4">
                  {trip.boat.mainImageUrl && (
                    <img 
                      src={getImageUrl(trip.boat.mainImageUrl)}
                      alt={trip.boat.name}
                      className="w-24 h-24 rounded-xl object-cover border border-sky-400/30"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#cee5ff] text-lg">{trip.boat.name}</h4>
                    <p className="text-[#a3cbf2]/70 text-sm mt-1">{trip.boat.description}</p>
                    <p className="text-sm text-[#a3cbf2]/60 mt-2 flex items-center gap-1">
                      <Users size={12} /> Capacity: {trip.boat.capacity} people
                    </p>
                  </div>
                </div>
              </InfoCard>
            )}
            
            {trip.tripManagerName && (
              <InfoCard title="Trip Manager" icon={Navigation}>
                <div className="flex items-center gap-4">
                  {trip.tripManagerImageUrl ? (
                    <img 
                      src={getImageUrl(trip.tripManagerImageUrl)}
                      alt={trip.tripManagerName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-sky-400/30"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-16 h-16 rounded-full bg-sky-400/20 flex items-center justify-center border border-sky-400/30">
                            <svg class="w-7 h-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-sky-400/20 flex items-center justify-center border border-sky-400/30">
                      <UserCheck size={28} className="text-sky-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-[#cee5ff] text-lg">{trip.tripManagerName}</h4>
                    <p className="text-sm text-[#a3cbf2]/60">Your dedicated trip manager</p>
                  </div>
                </div>
              </InfoCard>
            )}
            
            <InfoCard title={`Reviews (${reviews.length})`} icon={Star}>
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="p-4 rounded-xl bg-[#001526] border border-white/5 animate-pulse">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-sky-400/10" />
                        <div className="flex-1">
                          <div className="h-4 w-32 bg-sky-400/10 rounded mb-2" />
                          <div className="h-3 w-full bg-sky-400/10 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star size={32} className="mx-auto text-white/10 mb-2" />
                  <p className="text-[#a3cbf2]/60">No reviews yet</p>
                  <p className="text-xs text-[#a3cbf2]/40 mt-1">Be the first to share your experience!</p>
                </div>
              )}
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
                <div className="text-3xl font-black text-sky-400">{trip.pricePerPerson} L.E</div>
                <div className="text-xs text-[#a3cbf2]/40 uppercase tracking-wider mt-1">per person</div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 rounded-xl bg-[#001526] border border-white/5">
                  <span className="text-sm text-[#a3cbf2]/60 flex items-center gap-2">
                    <Users size={16} className="text-sky-400" /> Max Capacity
                  </span>
                  <span className="text-sm text-[#cee5ff] font-medium">
                    Up to {trip.maxParticipants}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-[#001526] border border-white/5">
                  <span className="text-sm text-[#a3cbf2]/60 flex items-center gap-2">
                    <ClockIcon size={16} className="text-sky-400" /> Schedule Status
                  </span>
                  <span className="text-xs text-[#cee5ff] font-medium text-right max-w-[140px] truncate">
                    {trip.tripDates?.[0]?.remainingTimeText || "Flexible Dates"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-[#001526] border border-white/5">
                  <span className="text-sm text-[#a3cbf2]/60 flex items-center gap-2">
                    <Ship size={16} className="text-sky-400" /> Boat
                  </span>
                  <span className="text-sm text-[#cee5ff] font-medium truncate max-w-[140px]" title={trip.boat?.name || trip.boatName || 'N/A'}>
                    {trip.boat?.name || trip.boatName || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-[#001526] border border-white/5">
                  <span className="text-sm text-[#a3cbf2]/60 flex items-center gap-2">
                    <MapPin size={16} className="text-sky-400" /> Location
                  </span>
                  <span className="text-sm text-[#cee5ff] font-medium text-right truncate max-w-[140px]" title={trip.locationName}>
                    {trip.locationName}
                  </span>
                </div>
              </div>
              
              <motion.button
                onClick={handleBookNow}
                disabled={activeTripDates.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  activeTripDates.length === 0
                    ? "bg-gray-600/30 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-[0_0_20px_rgba(83,214,251,0.2)] hover:shadow-[0_0_30px_rgba(83,214,251,0.4)]"
                }`}
                whileHover={activeTripDates.length > 0 ? { scale: 1.02 } : {}}
                whileTap={activeTripDates.length > 0 ? { scale: 0.98 } : {}}
              >
                <span>{activeTripDates.length > 0 ? 'Book' : 'No Dates Available'}</span>
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