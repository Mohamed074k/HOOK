import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Star, Quote } from "lucide-react";
import gsap from "gsap";

const communityPosts = [
  {
    id: 1,
    user: "AnnaFisher",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "The Gulf of Mexico trip was absolutely worth every penny. Captain John knows every secret spot. We caught a 120lb Marlin on our first drop! Will definitely be back next season.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop",
    likes: 142,
    time: "2h ago"
  },
  {
    id: 2,
    user: "SamTrout",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "The backcountry skiff experience was incredible. Fly-fishing in crystal clear water with permit and bonefish everywhere. This is world-class angling at its finest.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop",
    likes: 89,
    time: "5h ago"
  },
  {
    id: 3,
    user: "OmarSaeed",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    content: "The Russell Island trip truly exceeded expectations. The snorkeling spots they took us to were untouched. The way of being out there far from the coast was simply breathtaking.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    likes: 203,
    time: "1d ago"
  },
];

const CommunitySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.from(".comm-card", {
            opacity: 0, y: 30, duration: 0.5, stagger: 0.1, ease: "back.out(0.4)"
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-sky-500/10 rounded-full px-3 py-1 mb-3 border border-sky-400/20">
          <MessageSquare size={12} className="text-sky-400" />
          <span className="text-xs text-sky-300 font-semibold tracking-widest uppercase">Sailor Stories</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-[#cee5ff]">From the Community</h2>
        <p className="text-[#a3cbf2]/50 mt-2 max-w-xl mx-auto text-sm">Real sailors, real adventures. See what our community is sharing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {communityPosts.map((post) => (
          <motion.div
            key={post.id}
            className="comm-card bg-[#002238] border border-white/5 rounded-2xl overflow-hidden hover:border-sky-400/20 transition-all duration-300"
            whileHover={{ y: -4 }}
          >
            <div className="p-4 flex items-center gap-3 border-b border-white/5">
              <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full border border-sky-400/30 object-cover" />
              <div>
                <h4 className="text-[#cee5ff] font-bold text-sm">{post.user}</h4>
                <span className="text-[#a3cbf2]/40 text-xs">{post.time}</span>
              </div>
            </div>
            <div className="relative h-36 overflow-hidden">
              <img src={post.image} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002238] via-[#002238]/40 to-transparent" />
            </div>
            <div className="p-4">
              <div className="flex mb-2">
                <Quote size={14} className="text-sky-400/50 flex-shrink-0 mt-0.5 mr-1" />
                <p className="text-[#a3cbf2]/70 text-sm leading-relaxed line-clamp-3">{post.content}</p>
              </div>
              <div className="flex items-center gap-1 text-[#a3cbf2]/40 text-xs mt-3">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span>{post.likes} likes</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CommunitySection;