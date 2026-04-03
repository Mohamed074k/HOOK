import { useState, useEffect } from "react";

const reviews = [
  {
    user: "Ahmed H.",
    trip: "Deep Sea Adventure",
    stars: 5,
    comment: "Tarek is an outstanding guide. Found blue marlin on our very first cast. Will definitely book again!",
    date: "Mar 28",
  },
  {
    user: "Yasmine M.",
    trip: "Coastal Fly Fishing",
    stars: 5,
    comment: "Beautiful morning on the water. Expert instruction and great company. 10/10.",
    date: "Mar 24",
  },
  {
    user: "Omar F.",
    trip: "Sunset Charter",
    stars: 4,
    comment: "Great sunset charter. Caught a few snapper and had an amazing time. Highly recommend.",
    date: "Mar 18",
  },
];

const barData = [85, 12, 2, 1, 0];

const GuideReviewsPage = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
     <div className="space-y-6 w-full pb-12">
      
      {/* Header */}
      <div className={`transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">My Reviews</h1>
      </div>

      {/* Rating Summary */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
        style={{
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(30px)",
          transitionDelay: "100ms",
        }}
      >
        <div className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
          {/* Score */}
          <div className="text-center shrink-0 min-w-[100px]">
            <p className="text-6xl font-black text-[#cee5ff]">4.9</p>
            <p className="text-yellow-400 text-2xl mt-1 tracking-widest">★★★★★</p>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">48 reviews</p>
          </div>

          {/* Bar chart */}
          <div className="flex-1 w-full space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = barData[5 - star];
              return (
                <div key={star} className="flex items-center gap-3 text-sm group">
                  <span className="text-[#a3cbf2]/40 w-8 text-right text-xs">{star}★</span>
                  <div className="flex-1 h-2 bg-[#001526] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        // Added animation logic to the bars
                        width: animate ? `${pct}%` : "0%",
                        transitionDelay: "300ms"
                      }}
                    />
                  </div>
                  <span className="text-[#a3cbf2]/40 w-8 text-xs">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.map(({ user, trip, stars, comment, date }, idx) => (
          <div
            key={user}
            // Cleaned up duplicate transition classes and unified hover styles to match your other pages
            className="group bg-[#002238] border border-white/5 rounded-2xl p-6 hover:border-yellow-400/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/5 ring-1 ring-transparent hover:ring-yellow-400/10 transform transition-all duration-700 ease-out"
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(30px)",
              transitionDelay: `${(idx + 2) * 100}ms`,
            }}
          >
            <div className="flex items-start justify-between mb-3 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 font-black text-sm shrink-0">
                  {user[0]}
                </div>
                <div>
                  <p className="text-[#cee5ff] font-semibold group-hover:text-white transition-colors">{user}</p>
                  <p className="text-[#a3cbf2]/40 text-xs">{trip} · {date}</p>
                </div>
              </div>
              <span className="text-yellow-400 text-sm tracking-widest shrink-0">
                {"★".repeat(stars)}{"☆".repeat(5 - stars)}
              </span>
            </div>
            {/* Swapped pl-13 (invalid tailwind) to pl-[52px] to perfectly align text under the username (40px avatar + 12px gap) */}
            <p className="text-[#a3cbf2]/70 text-sm leading-relaxed pl-[52px]">{comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideReviewsPage;