// // src/components/Home/StatsSection.jsx
// import React, { useRef, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Map, ShoppingBag, Users, TrendingUp, Anchor, Star, Clock, Award } from "lucide-react";
// import gsap from "gsap";

// const stats = [
//   { label: "Active Trips", value: "128", icon: Map, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20" },
//   { label: "Marketplace Items", value: "3.4K", icon: ShoppingBag, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
//   { label: "Community Members", value: "12K", icon: Users, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20" },
//   { label: "Bookings This Month", value: "456", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
// ];

// const features = [
//   { label: "Expert Captains", value: "50+", icon: Anchor, color: "text-cyan-400", bg: "bg-cyan-400/10" },
//   { label: "5-Star Ratings", value: "98%", icon: Star, color: "text-amber-400", bg: "bg-amber-400/10" },
//   { label: "24/7 Support", value: "Always", icon: Clock, color: "text-emerald-400", bg: "bg-emerald-400/10" },
//   { label: "Verified Trips", value: "100%", icon: Award, color: "text-violet-400", bg: "bg-violet-400/10" },
// ];

// const StatsSection = () => {
//   const sectionRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.from(".stat-card", {
//         opacity: 0,
//         y: 30,
//         duration: 0.6,
//         stagger: 0.1,
//         ease: "back.out(0.4)",
//         scrollTrigger: { trigger: sectionRef.current }
//       });
//     }, sectionRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section ref={sectionRef} className="px-6 md:px-12 py-16">
//       <div className="max-w-7xl mx-auto">
//         {/* Main Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {stats.map(({ label, value, icon: Icon, color, bg, border }, index) => (
//             <motion.div 
//               key={label} 
//               className={`stat-card bg-[#002238] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group`}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.1 }}
//               whileHover={{ y: -4 }}
//             >
//               <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
//                 <Icon className={color} size={22} />
//               </div>
//               <p className="text-3xl md:text-4xl font-black text-[#cee5ff] mb-1">{value}</p>
//               <p className="text-xs text-[#a3cbf2]/60 uppercase tracking-wider">{label}</p>
//             </motion.div>
//           ))}
//         </div>

//         {/* Secondary Features */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {features.map(({ label, value, icon: Icon, color, bg }, index) => (
//             <motion.div 
//               key={label} 
//               className="stat-card bg-[#001526] rounded-2xl p-5 border border-white/5 hover:border-sky-400/20 transition-all group"
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: (index + 4) * 0.1 }}
//               whileHover={{ scale: 1.02 }}
//             >
//               <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
//                 <Icon className={color} size={18} />
//               </div>
//               <p className="text-2xl font-black text-[#cee5ff] mb-1">{value}</p>
//               <p className="text-xs text-[#a3cbf2]/60">{label}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default StatsSection;