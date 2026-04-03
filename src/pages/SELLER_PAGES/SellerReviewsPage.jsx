import { useState, useEffect } from "react";

const reviews = [
  { user: "Mohamed S.", product: "Apex Carbon Reel", rating: 5, comment: "Best reel I've ever used. Smooth drag, incredible build quality.", date: "Mar 25" },
  { user: "Ahmed H.", product: "HydroScan V3", rating: 5, comment: "Game-changer for finding fish. Worth every penny!", date: "Mar 22" },
  { user: "Ismail F.", product: "Deep Bait Master", rating: 4, comment: "Great lures, just wish there were more color options.", date: "Mar 18" },
  { user: "Omar K.", product: "CarbonFlex Rod", rating: 5, comment: "Perfect balance and sensitivity. Highly recommend!", date: "Mar 15" },
  { user: "Mohamed E.", product: "Nautical One Pro", rating: 4, comment: "Good quality, comfortable fit.", date: "Mar 12" },
];

const barData = [72, 18, 6, 3, 1];

const SellerReviewsPage = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
     <div className="space-y-6 w-full pb-12">
      
      {/* Animated Header */}
      <div className={`transform transition-all duration-700 ease-out ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}>
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Customer Reviews</h1>
      </div>

      {/* Rating Summary - Animated Bars */}
      <div 
        className="bg-[#002238] border border-white/5 rounded-2xl p-6 transform transition-all duration-700 ease-out"
        style={{
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "100ms",
        }}
      >
        <div className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
          <div className="text-center shrink-0 min-w-[100px]">
            <p className="text-6xl font-black text-[#cee5ff]">4.8</p>
            <p className="text-yellow-400 text-2xl mt-1 tracking-widest">★★★★★</p>
            <p className="text-[#a3cbf2]/50 text-sm mt-1">Overall Rating</p>
          </div>
          
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

      {/* Review Cards - Staggered Entry */}
      <div className="space-y-4">
        {reviews.map(({ user, product, rating, comment, date }, idx) => (
          <div
            key={idx}
            className="group bg-[#002238] border border-white/5 rounded-2xl p-6 hover:border-yellow-400/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-400/5 ring-1 ring-transparent hover:ring-yellow-400/10 transition-all duration-500 transform ease-out"
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(20px)",
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
                  <p className="text-[#a3cbf2]/40 text-xs">{product} · {date}</p>
                </div>
              </div>
              <span className="text-yellow-400 text-sm tracking-widest shrink-0">
                {"★".repeat(rating)}{"☆".repeat(5 - rating)}
              </span>
            </div>
            {/* Fixed pl-13 to pl-[52px] to align text correctly under the avatar */}
            <p className="text-[#a3cbf2]/70 text-sm leading-relaxed pl-[52px]">"{comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerReviewsPage;