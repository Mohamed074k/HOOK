import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const AnimatedBackground = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".orb-1", { x: 40, y: -30, duration: 15, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb-2", { x: -50, y: 20, duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb-3", { scale: 1.1, opacity: 0.6, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, bgRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="orb-1 absolute top-20 left-[10%] w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(83,214,251,0.08) 0%, transparent 70%)" }} />
      <div className="orb-2 absolute bottom-20 right-[5%] w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,138,167,0.06) 0%, transparent 70%)" }} />
      <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(83,214,251,0.04) 0%, transparent 60%)" }} />
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-sky-400/20"
          style={{ left: `${(i * 37 + 13) % 100}%`, top: `${(i * 53 + 7) % 100}%` }} />
      ))}
    </div>
  );
};

export default AnimatedBackground;