import { Anchor, TrendingUp, Map, ShoppingBag, Users } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Active Trips", value: "128", icon: Map, color: "text-sky-400", bg: "bg-sky-400/10" },
  { label: "Marketplace Items", value: "3.4K", icon: ShoppingBag, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Community Members", value: "12K", icon: Users, color: "text-violet-400", bg: "bg-violet-400/10" },
  { label: "Bookings This Month", value: "456", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-400/10" },
];

const HomePage = () => (
  <div className="space-y-16">
    {/* Hero */}
    <section className="min-h-[70vh] flex items-center px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#002c49] via-[#001526] to-[#000f1e] -z-10" />
      <div className="absolute top-0 left-0 w-full h-full opacity-20 -z-10"
        style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #a3cbf2 0px, transparent 50%)" }} />
      <div className="max-w-3xl">
        <span className="text-amber-400 uppercase text-xs font-bold tracking-widest">The Deep Expedition</span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#cee5ff] mt-4 mb-6 leading-tight">
          Chart Your Next<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-500">
            Oceanic Chapter
          </span>
        </h1>
        <p className="text-[#c2c7ce] text-lg max-w-xl mb-10">
          Access the world's most exclusive nautical registry. From deep-sea expeditions to coastal retreats.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/trips" className="bg-sky-400 text-[#003353] px-8 py-3 rounded-xl font-bold hover:bg-sky-300 transition-colors">
            Explore Trips
          </Link>
          <Link to="/marketplace" className="border border-sky-400/30 text-sky-300 px-8 py-3 rounded-xl font-bold hover:bg-sky-400/10 transition-colors">
            Browse Gear
          </Link>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="px-6 md:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#002238] rounded-2xl p-6 border border-white/5">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}>
              <Icon className={color} size={20} />
            </div>
            <p className="text-3xl font-black text-[#cee5ff]">{value}</p>
            <p className="text-sm text-[#a3cbf2]/60 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Quick Links */}
    <section className="px-6 md:px-12 pb-20">
      <h2 className="text-2xl font-bold text-[#cee5ff] mb-6 max-w-screen-xl mx-auto">Explore HOOK</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
        {[
          { title: "Book a Fishing Trip", desc: "Find expert guides for your next adventure.", link: "/trips", color: "from-sky-500/20 to-sky-900/10" },
          { title: "Shop the Marketplace", desc: "Premium gear from verified sellers.", link: "/marketplace", color: "from-emerald-500/20 to-emerald-900/10" },
          { title: "Join the Community", desc: "Share catches, tips, and tales.", link: "/community", color: "from-violet-500/20 to-violet-900/10" },
        ].map(({ title, desc, link, color }) => (
          <Link key={title} to={link} className={`bg-gradient-to-br ${color} border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all group`}>
            <h3 className="text-xl font-bold text-[#cee5ff] mb-2 group-hover:text-white">{title}</h3>
            <p className="text-[#a3cbf2]/60 text-sm">{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  </div>
);

export default HomePage;


// import React from "react";
// import HeroSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/HeroSection";
// import CategorySection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/CategorySection";
// import FeaturedTripsSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/FeaturedTripsSection";
// import TopProductsSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/TopProductsSection";
// import CommunitySection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/CommunitySection";
// import AIAssistantSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/AIAssistantSection";

// const HomePage = () => {
//   return (
//     <div className="min-h-screen relative" style={{ background: "#000d1a" }}>
//       <HeroSection />
//       <CategorySection />
//       <FeaturedTripsSection />
//       <TopProductsSection />
//       <CommunitySection />
//       <AIAssistantSection />
//     </div>
//   );
// };

// export default HomePage;