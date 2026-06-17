import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Anchor, Compass, ChevronRight, Ship, ChevronDown } from "lucide-react";
import gsap from "gsap";

const HeroSection = () => {
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-eyebrow", { opacity: 0, y: 20, duration: 0.6, delay: 0.2, ease: "power2.out" });
      gsap.from(".hero-h1",      { opacity: 0, y: 40, duration: 0.8, delay: 0.4, ease: "back.out(0.5)" });
      gsap.from(".hero-sub",     { opacity: 0, y: 20, duration: 0.6, delay: 0.7, ease: "power2.out" });
      gsap.from(".hero-ctas",    { opacity: 0, y: 20, duration: 0.6, delay: 0.9, ease: "power2.out" });
      gsap.from(".hero-card",    { opacity: 0, y: 20, duration: 0.6, delay: 1.1, ease: "power2.out" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[65vh] md:min-h-[70vh] lg:min-h-[65vh] flex items-center overflow-hidden"
      style={{ background: "#0a1628" }}
    >
      {/* Full-bleed boat background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Hero.jpg"
          alt="Boat on calm water"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center center" }}
        />
        {/* Dark overlay — heavier on the left so text is readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,20,40,0.82) 0%, rgba(8,20,40,0.55) 50%, rgba(8,20,40,0.15) 100%)",
          }}
        />
        {/* Subtle bottom fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,20,40,0.6) 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(83,214,251,0.3) 0, rgba(83,214,251,0.3) 1px, transparent 0, transparent 50%)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full pt-8 pb-8 md:pt-10 md:pb-8">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <div className="hero-eyebrow inline-flex items-center gap-2 mb-3 md:mb-4">
            <Anchor size={12} className="text-sky-300" />
            <span
              className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "#7dd3fc" }}
            >
              Elevate Your Sea Journey
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-h1 font-black leading-[1.08] mb-3 md:mb-4"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.5rem)", color: "#ddeeff" }}
          >
            Experience
            <br />
            the{" "}
            <em
              className="not-italic"
              style={{
                fontStyle: "italic",
                background: "linear-gradient(90deg, #7dd3fc, #22d3ee, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Magic
            </em>{" "}
            of
            <br />
            Sailing
          </h1>

          {/* Sub-copy */}
          <p
            className="hero-sub text-xs md:text-sm lg:text-base leading-relaxed mb-5 md:mb-6 max-w-md"
            style={{ color: "rgba(163,203,242,0.75)" }}
          >
            Book unforgettable trips, shop premium fishing gear, connect with passionate
            anglers, and explore the sea with AI-powered insights. Discover new
            destinations, plan your perfect journey, and experience every moment on the
            water like never before.
          </p>

          {/* CTAs - smaller buttons for mobile */}
          <div className="hero-ctas flex flex-wrap gap-3 md:gap-4">
            <motion.button
              onClick={() => navigate("/trips")}
              className="flex items-center gap-2 px-5 md:px-6 py-2 md:py-2.5 rounded-full text-white font-bold text-[11px] md:text-sm uppercase tracking-wider"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                boxShadow: "0 0 24px rgba(14,165,233,0.45)",
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 36px rgba(14,165,233,0.65)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Ship size={14} className="md:w-[15px] md:h-[15px]" /> Book Trip
            </motion.button>

            <motion.button
              onClick={() => navigate("/trips")}
              className="flex items-center gap-2 px-5 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-[11px] md:text-sm tracking-wider transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#a3cbf2",
                backdropFilter: "blur(6px)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore <ChevronRight size={13} className="md:w-[15px] md:h-[15px]" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom-right "Know More" + "Awesome Memories" card cluster - only on desktop */}
      {isDesktop && (
        <div className="absolute bottom-10 right-6 lg:right-10 z-10 flex flex-col items-end gap-3 hero-card">
          {/* Know More pill */}
          <motion.button
            onClick={() => navigate("/trips")}
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
              boxShadow: "0 0 20px rgba(14,165,233,0.4)",
              color: "#fff",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Know More <ChevronRight size={14} />
          </motion.button>

          {/* Awesome Memories card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{
              background: "rgba(0,30,60,0.72)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(14,165,233,0.25)",
              minWidth: 220,
            }}
          >
            {/* Stacked avatar thumbnails */}
            <div className="flex -space-x-3 shrink-0">
              {[
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=80&h=80&fit=crop",
                "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=80&h=80&fit=crop",
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=80&h=80&fit=crop",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover"
                  style={{ border: "2px solid rgba(14,165,233,0.4)" }}
                />
              ))}
            </div>
            <div>
              <p className="text-xs font-black" style={{ color: "#ddeeff" }}>
                Awesome Memories
              </p>
              <p className="text-xs" style={{ color: "rgba(163,203,242,0.55)" }}>
                Explore the World, One Adventure<br />at a Time
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ color: "rgba(163,203,242,0.3)" }}
      >
        <ChevronDown size={16} className="md:w-[20px] md:h-[20px]" />
      </motion.div>
    </section>
  );
};

export default HeroSection;


/**
 * HeroSection.jsx — Hook Fishing App  (v2 — realistic boat + fixes)
 * ─────────────────────────────────────────────────────────────────────────────
 * Changes vs v1:
 *  • Boat replaced with detailed 2-D canvas scene (same style as RegisterPage)
 *    rendered onto a Three.js CanvasTexture — looks far more realistic
 *  • Camera starts lower so sky + moon are clearly visible
 *  • Ocean shader shimmer heavily reduced, wave amplitude halved
 *  • Stars count lowered + saturation reduced so they don't reflect bright
 *  • No loading screen — scene appears immediately
 *
 * INSTALL (once):
 *   npm install three @react-three/fiber @react-three/drei framer-motion gsap
 * ─────────────────────────────────────────────────────────────────────────────
 */

// import React, {
//   useRef, useEffect, useState, Suspense, useMemo, useCallback,
// } from "react";
// import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
// import { Stars, shaderMaterial } from "@react-three/drei";
// import * as THREE from "three";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { Anchor, Ship, ChevronRight, ChevronDown } from "lucide-react";
// import gsap from "gsap";

// // ─────────────────────────────────────────────────────────────────────────────
// // 1. OCEAN SHADER  (calmer, less shimmer)
// // ─────────────────────────────────────────────────────────────────────────────
// const OceanShaderMaterial = shaderMaterial(
//   {
//     uTime:      0,
//     uDeep:      new THREE.Color("#00060f"),
//     uShallow:   new THREE.Color("#001e3c"),
//     uHighlight: new THREE.Color("#1a6fa0"),
//     uFoamColor: new THREE.Color("#3a7fa0"),
//   },

//   // VERTEX
//   `
//     uniform float uTime;
//     varying vec2  vUv;
//     varying float vElevation;
//     varying vec3  vNorm;

//     float hash(vec2 p){
//       p = fract(p * vec2(127.1,311.7));
//       p += dot(p, p+45.32);
//       return fract(p.x*p.y);
//     }
//     float noise(vec2 p){
//       vec2 i=floor(p), f=fract(p);
//       f=f*f*(3.0-2.0*f);
//       return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
//                  mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
//     }
//     float fbm(vec2 p){
//       float v=0.0,a=0.5;
//       for(int i=0;i<4;i++){v+=a*noise(p);p*=2.1;a*=0.5;}
//       return v;
//     }

//     void main(){
//       vUv = uv;
//       vec3 pos = position;
//       // Reduced amplitude (*0.18 vs 0.38 before)
//       float w1 = fbm(vec2(pos.x*0.35+uTime*0.22, pos.z*0.35+uTime*0.14))*0.18;
//       float w2 = fbm(vec2(pos.x*0.75-uTime*0.18, pos.z*0.75+uTime*0.12))*0.07;
//       float w3 = sin(pos.x*2.0+uTime*0.9)*sin(pos.z*1.7+uTime*0.65)*0.022;
//       vElevation = w1+w2+w3;
//       pos.y += vElevation;

//       float eps=0.08;
//       float hX=fbm(vec2((position.x+eps)*0.35+uTime*0.22,position.z*0.35+uTime*0.14))*0.18;
//       float hZ=fbm(vec2(position.x*0.35+uTime*0.22,(position.z+eps)*0.35+uTime*0.14))*0.18;
//       vNorm = normalize(vec3(-(hX-w1)/eps,1.0,-(hZ-w1)/eps));

//       gl_Position = projectionMatrix*modelViewMatrix*vec4(pos,1.0);
//     }
//   `,

//   // FRAGMENT
//   `
//     uniform float uTime;
//     uniform vec3  uDeep;
//     uniform vec3  uShallow;
//     uniform vec3  uHighlight;
//     uniform vec3  uFoamColor;
//     varying vec2  vUv;
//     varying float vElevation;
//     varying vec3  vNorm;

//     void main(){
//       float t = smoothstep(-0.12,0.20,vElevation);
//       vec3 col = mix(uDeep, uShallow, t);

//       // Very subtle specular only (reduced from 0.55 -> 0.14)
//       vec3 lightDir = normalize(vec3(0.6,1.0,-0.5));
//       float spec = pow(max(dot(vNorm,lightDir),0.0),40.0);
//       col = mix(col, uHighlight, spec*0.14);

//       // Minimal shimmer lines (was 0.38, now 0.06)
//       float shimmer = smoothstep(0.14,0.22,vElevation)
//                     * (0.3+0.7*sin(vUv.x*80.0+uTime*2.5));
//       col = mix(col, uHighlight, shimmer*0.06);

//       // Very subtle foam on highest crests only
//       float foam = smoothstep(0.16,0.22,vElevation);
//       float fN   = fract(sin(dot(vUv*55.0,vec2(12.98,78.23)))*43758.55);
//       foam *= step(0.52,fN);
//       col = mix(col, uFoamColor, foam*0.22);

//       // Horizon edge fade
//       float edge = 1.0 - smoothstep(0.28,0.50,abs(vUv.y-0.5));

//       gl_FragColor = vec4(col, 0.96*edge);
//     }
//   `
// );
// extend({ OceanShaderMaterial });

// function Ocean() {
//   const matRef = useRef();
//   useFrame(({ clock }) => {
//     if (matRef.current) matRef.current.uTime = clock.getElapsedTime();
//   });
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
//       <planeGeometry args={[40, 40, 200, 200]} />
//       <oceanShaderMaterial ref={matRef} transparent side={THREE.DoubleSide} depthWrite={false} />
//     </mesh>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 2. CANVAS-2D BOAT TEXTURE  (same quality as the RegisterPage boat)
// //    We draw the detailed 2-D boat onto an offscreen canvas, then wrap it
// //    as a Three.js CanvasTexture on a billboard quad.
// // ─────────────────────────────────────────────────────────────────────────────
// function useBoatCanvas(size = 512) {
//   const canvas = useMemo(() => {
//     const c = document.createElement("canvas");
//     c.width  = size;
//     c.height = size;
//     return c;
//   }, [size]);

//   // Draw the boat (same drawing code as RegisterPage but self-contained)
//   const draw2DBoat = useCallback((t) => {
//     const ctx = canvas.getContext("2d");
//     const W = canvas.width;
//     const H = canvas.height;
//     ctx.clearRect(0, 0, W, H);

//     // We only draw the boat itself — no sky/water background
//     // Position: center-bottom of the canvas
//     const boatCX = W * 0.5;
//     const waterY = H * 0.62;
//     const rockAngle = Math.sin(t * 0.55) * 0.025;
//     const bobY      = Math.sin(t * 0.55) * 4;

//     ctx.save();
//     ctx.translate(boatCX, waterY + bobY);
//     ctx.rotate(rockAngle);

//     const bw = W * 0.72;
//     const bh = H * 0.072;

//     // ── Hull shadow
//     ctx.save();
//     ctx.translate(0, bh * 0.5);
//     ctx.scale(1, 0.22);
//     ctx.beginPath();
//     ctx.ellipse(0, 0, bw*0.46, bh*1.2, 0, 0, Math.PI*2);
//     ctx.fillStyle = "rgba(0,0,0,0.38)";
//     ctx.fill();
//     ctx.restore();

//     // ── Hull body
//     ctx.beginPath();
//     ctx.moveTo(-bw*0.5, 0);
//     ctx.bezierCurveTo(-bw*0.52,bh*0.5,-bw*0.44,bh,-bw*0.30,bh);
//     ctx.lineTo(bw*0.30,bh);
//     ctx.bezierCurveTo(bw*0.44,bh,bw*0.52,bh*0.5,bw*0.5,0);
//     ctx.closePath();
//     const hullG = ctx.createLinearGradient(0,0,0,bh);
//     hullG.addColorStop(0,"#1a3d5c");
//     hullG.addColorStop(0.5,"#0e2438");
//     hullG.addColorStop(1,"#060f1c");
//     ctx.fillStyle = hullG;
//     ctx.fill();
//     ctx.strokeStyle = "#2a5070"; ctx.lineWidth = 1.5; ctx.stroke();

//     // ── Gunwale highlight
//     ctx.beginPath();
//     ctx.moveTo(-bw*0.5, 0);
//     ctx.bezierCurveTo(-bw*0.3,-bh*0.2,bw*0.3,-bh*0.2,bw*0.5,0);
//     ctx.strokeStyle = "rgba(83,214,251,0.55)"; ctx.lineWidth=2; ctx.stroke();

//     // Hull stripe
//     ctx.beginPath();
//     ctx.moveTo(-bw*0.44,bh*0.38);
//     ctx.bezierCurveTo(-bw*0.28,bh*0.28,bw*0.28,bh*0.28,bw*0.44,bh*0.38);
//     ctx.strokeStyle="rgba(83,214,251,0.18)"; ctx.lineWidth=5; ctx.stroke();

//     // ── Cabin
//     const cabW=bw*0.34, cabH=bh*3.0;
//     const cabX=-cabW*0.5-bw*0.03, cabY=-cabH;

//     // cabin shadow
//     ctx.fillStyle="rgba(0,0,0,0.22)";
//     ctx.fillRect(cabX+4,cabY+4,cabW,cabH);

//     // cabin body gradient
//     const cabG = ctx.createLinearGradient(cabX,0,cabX+cabW,0);
//     cabG.addColorStop(0,"#0c2236");
//     cabG.addColorStop(0.55,"#102c48");
//     cabG.addColorStop(1,"#071828");
//     ctx.fillStyle=cabG;
//     ctx.beginPath();
//     ctx.roundRect(cabX,cabY,cabW,cabH,[5,5,2,2]);
//     ctx.fill();
//     ctx.strokeStyle="#1e3f5a"; ctx.lineWidth=1; ctx.stroke();

//     // cabin roof
//     ctx.beginPath();
//     ctx.moveTo(cabX-7,cabY);
//     ctx.lineTo(cabX+cabW+7,cabY);
//     ctx.lineTo(cabX+cabW+3,cabY-bh*0.4);
//     ctx.lineTo(cabX-3,cabY-bh*0.4);
//     ctx.closePath();
//     ctx.fillStyle="#06121e"; ctx.fill();
//     ctx.strokeStyle="#1e3f5a"; ctx.lineWidth=0.8; ctx.stroke();

//     // portholes
//     const winPulse = 0.78+0.22*Math.sin(t*1.8);
//     const winY = cabY+cabH*0.38;
//     [-0.26, 0.26].forEach(off => {
//       const wx = off*cabW;
//       const aura = ctx.createRadialGradient(wx,winY,0,wx,winY,24);
//       aura.addColorStop(0,`rgba(83,214,251,${winPulse*0.22})`);
//       aura.addColorStop(1,"transparent");
//       ctx.fillStyle=aura;
//       ctx.beginPath(); ctx.arc(wx,winY,24,0,Math.PI*2); ctx.fill();

//       ctx.beginPath(); ctx.arc(wx,winY,8,0,Math.PI*2);
//       ctx.strokeStyle="#2a5878"; ctx.lineWidth=2.5; ctx.stroke();
//       ctx.beginPath(); ctx.arc(wx,winY,6.5,0,Math.PI*2);
//       ctx.fillStyle=`rgba(83,214,251,${winPulse*0.6})`; ctx.fill();
//       ctx.beginPath(); ctx.arc(wx-2,winY-2.5,2.5,0,Math.PI*2);
//       ctx.fillStyle=`rgba(255,255,255,${winPulse*0.55})`; ctx.fill();
//     });

//     // cabin door
//     ctx.fillStyle="#050d18";
//     ctx.beginPath();
//     ctx.roundRect(-6,cabY+cabH*0.54,12,cabH*0.43,[3,3,0,0]);
//     ctx.fill();
//     ctx.strokeStyle="#1e3f5a"; ctx.lineWidth=0.7; ctx.stroke();

//     // ── Mast
//     const mastH=bh*8.5;
//     const mastX=cabX+cabW*0.5;
//     ctx.beginPath();
//     ctx.moveTo(mastX,cabY-bh*0.4);
//     ctx.lineTo(mastX,cabY-mastH);
//     const mastG=ctx.createLinearGradient(0,cabY,0,cabY-mastH);
//     mastG.addColorStop(0,"#3a5c7a"); mastG.addColorStop(1,"#1e3a52");
//     ctx.strokeStyle=mastG; ctx.lineWidth=3.5; ctx.stroke();

//     // cross beam
//     ctx.beginPath();
//     ctx.moveTo(mastX-bw*0.13,cabY-mastH*0.56);
//     ctx.lineTo(mastX+bw*0.13,cabY-mastH*0.56);
//     ctx.strokeStyle="#22405a"; ctx.lineWidth=2; ctx.stroke();

//     // ── Beacon
//     const beaconY=cabY-mastH;
//     const bp=0.5+0.5*Math.abs(Math.sin(t*1.6));
//     const bGlow=ctx.createRadialGradient(mastX,beaconY,0,mastX,beaconY,32);
//     bGlow.addColorStop(0,`rgba(255,210,80,${bp*0.45})`);
//     bGlow.addColorStop(0.4,`rgba(255,160,30,${bp*0.15})`);
//     bGlow.addColorStop(1,"transparent");
//     ctx.fillStyle=bGlow;
//     ctx.beginPath(); ctx.arc(mastX,beaconY,32,0,Math.PI*2); ctx.fill();
//     ctx.beginPath(); ctx.arc(mastX,beaconY,5,0,Math.PI*2);
//     ctx.fillStyle=`rgba(255,225,110,${0.72+bp*0.28})`; ctx.fill();

//     // ── Rigging
//     [[mastX,cabY-mastH*0.98,-bw*0.49,-bh*0.12],
//      [mastX,cabY-mastH*0.98, bw*0.46,-bh*0.12],
//      [mastX,cabY-mastH*0.56,-bw*0.30,-bh*0.12],
//      [mastX,cabY-mastH*0.56, bw*0.28,-bh*0.12],
//     ].forEach(([x1,y1,x2,y2])=>{
//       ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
//       ctx.strokeStyle="rgba(100,165,205,0.22)"; ctx.lineWidth=0.9; ctx.stroke();
//     });

//     // ── Fishing rod
//     const rBaseX=bw*0.37, rBaseY=-bh*0.12;
//     const rLen=bw*0.78;
//     const rTipX=rBaseX+rLen*Math.cos(-0.54);
//     const rTipY=rBaseY+rLen*Math.sin(-0.54);
//     ctx.beginPath(); ctx.moveTo(rBaseX,rBaseY); ctx.lineTo(rTipX,rTipY);
//     const rodG=ctx.createLinearGradient(rBaseX,rBaseY,rTipX,rTipY);
//     rodG.addColorStop(0,"#507898"); rodG.addColorStop(1,"#90c8e0");
//     ctx.strokeStyle=rodG; ctx.lineWidth=2.8; ctx.lineCap="round"; ctx.stroke(); ctx.lineCap="butt";

//     // rod guides
//     for(let g=0.3;g<=0.9;g+=0.2){
//       const gx=rBaseX+(rTipX-rBaseX)*g, gy=rBaseY+(rTipY-rBaseY)*g;
//       ctx.beginPath(); ctx.arc(gx,gy,3,0,Math.PI*2);
//       ctx.strokeStyle="rgba(180,215,235,0.55)"; ctx.lineWidth=1.1; ctx.stroke();
//     }

//     // fishing line
//     const leX=rTipX+20+Math.sin(t*0.5)*7;
//     const leY=rTipY+60+Math.sin(t*0.8)*12;
//     ctx.beginPath(); ctx.moveTo(rTipX,rTipY);
//     ctx.quadraticCurveTo(rTipX+38,rTipY+24,leX,leY);
//     ctx.strokeStyle="rgba(200,228,255,0.55)"; ctx.lineWidth=1; ctx.stroke();

//     // ── Bobber
//     const bX=leX, bY=leY+Math.sin(t*2.4)*4;
//     for(let r=1;r<=3;r++){
//       const rr=r*10+Math.sin(t*2+r*0.8)*2;
//       ctx.beginPath(); ctx.ellipse(bX,bY+5,rr,rr*0.26,0,0,Math.PI*2);
//       ctx.strokeStyle=`rgba(83,214,251,${0.20/r})`; ctx.lineWidth=0.8; ctx.stroke();
//     }
//     ctx.beginPath(); ctx.ellipse(bX,bY-1,6,6,0,Math.PI,Math.PI*2);
//     ctx.fillStyle="#ddeef0"; ctx.fill();
//     ctx.beginPath(); ctx.ellipse(bX,bY+1,6,6,0,0,Math.PI);
//     ctx.fillStyle="#d93030"; ctx.fill();
//     ctx.beginPath(); ctx.arc(bX-2,bY-3.5,2,0,Math.PI*2);
//     ctx.fillStyle="rgba(255,255,255,0.72)"; ctx.fill();

//     // ── Chimney smoke
//     const chX=cabX+cabW*0.78, chY=cabY-bh*0.4;
//     for(let s=0;s<6;s++){
//       const sT=((t*0.38+s*0.20)%1);
//       const sx=chX+Math.sin(t*0.8+s*1.2)*9*sT;
//       const sy=chY-sT*60;
//       const sr=3.5+sT*14;
//       ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2);
//       ctx.fillStyle=`rgba(110,140,165,${0.14*(1-sT)})`; ctx.fill();
//     }

//     ctx.restore();
//   }, [canvas]);

//   return { canvas, draw2DBoat };
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 3. BILLBOARD BOAT using CanvasTexture
// // ─────────────────────────────────────────────────────────────────────────────
// function BoatBillboard({ position = [0, 0, 0], scale = 1 }) {
//   const { canvas, draw2DBoat } = useBoatCanvas(512);
//   const texRef  = useRef();
//   const meshRef = useRef();
//   const { camera } = useThree();

//   useEffect(() => {
//     // initial draw
//     draw2DBoat(0);
//   }, [draw2DBoat]);

//   useFrame(({ clock, camera: cam }) => {
//     const t = clock.getElapsedTime();
//     draw2DBoat(t);
//     if (texRef.current) texRef.current.needsUpdate = true;
//     // Billboard: always face camera on Y axis
//     if (meshRef.current) {
//       meshRef.current.lookAt(cam.position);
//     }
//   });

//   return (
//     <mesh
//       ref={meshRef}
//       position={position}
//       scale={[scale, scale, scale]}
//     >
//       {/* 1:1 quad sized to show boat nicely */}
//       <planeGeometry args={[2.8, 2.8]} />
//       <meshBasicMaterial transparent alphaTest={0.01} depthWrite={false}>
//         <canvasTexture ref={texRef} attach="map" image={canvas} />
//       </meshBasicMaterial>
//     </mesh>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 4. MOON
// // ─────────────────────────────────────────────────────────────────────────────
// function Moon() {
//   return (
//     <group position={[5.2, 5.8, -20]}>
//       <mesh>
//         <sphereGeometry args={[0.70, 32, 32]} />
//         <meshStandardMaterial color="#D4EEFF" roughness={0.90} emissive="#8aaabb" emissiveIntensity={0.18} />
//       </mesh>
//       {/* crescent cutout */}
//       <mesh position={[0.28, -0.10, 0.46]}>
//         <sphereGeometry args={[0.62, 32, 32]} />
//         <meshStandardMaterial color="#000c1a" roughness={1} />
//       </mesh>
//       <pointLight color="#bde0ff" intensity={3.0} distance={40} decay={2} />
//     </group>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 5. MOON REFLECTION (thin strip on water, very subtle)
// // ─────────────────────────────────────────────────────────────────────────────
// function MoonReflection() {
//   const ref = useRef();
//   useFrame(({ clock }) => {
//     if (ref.current)
//       ref.current.material.opacity = 0.045 + Math.sin(clock.getElapsedTime()*1.3)*0.012;
//   });
//   return (
//     <mesh ref={ref} rotation={[-Math.PI/2,0,0]} position={[3.6, 0.01, -5]}>
//       <planeGeometry args={[0.35, 4.5]} />
//       <meshBasicMaterial color="#b8dfff" transparent opacity={0.045} depthWrite={false} />
//     </mesh>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 6. LAND SILHOUETTE
// // ─────────────────────────────────────────────────────────────────────────────
// function LandSilhouette() {
//   const shape = useMemo(() => {
//     const s = new THREE.Shape();
//     const pts = [
//       [-18,0],[-16,1.6],[-13,0.9],[-9,2.5],[-6,1.6],[-3,3.2],
//       [0,2.2],[3,2.9],[6,2.0],[9,2.7],[12,1.4],[15,0.8],[18,0],
//     ];
//     s.moveTo(pts[0][0], pts[0][1]);
//     pts.slice(1).forEach(([x,y]) => s.lineTo(x,y));
//     s.lineTo(18,-1.2); s.lineTo(-18,-1.2); s.closePath();
//     return s;
//   }, []);
//   return (
//     <mesh position={[0, 0.06, -14]} rotation={[Math.PI/2, 0, 0]}>
//       <shapeGeometry args={[shape]} />
//       <meshBasicMaterial color="#010a14" />
//     </mesh>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 7. CAMERA RIG  (starts at eye-level so sky + moon are prominent)
// // ─────────────────────────────────────────────────────────────────────────────
// function CameraRig() {
//   const { camera } = useThree();
//   const mouse  = useRef({ x:0, y:0 });
//   const smooth = useRef({ x:0, y:0 });
//   const ready  = useRef(false);

//   useEffect(() => {
//     // Start slightly above eye-level so moon is visible from frame 0
//     camera.position.set(0, 3.2, 7.5);
//     camera.lookAt(0, 0.5, 0);

//     gsap.to(camera.position, {
//       x:0.5, y:1.8, z:5.2,
//       duration:3.2,
//       ease:"power3.inOut",
//       onUpdate: () => camera.lookAt(0, 0.6, 0),
//       onComplete: () => { ready.current = true; },
//     });

//     const onMove = (e) => {
//       mouse.current.x = (e.clientX/window.innerWidth  - 0.5)*2;
//       mouse.current.y = (e.clientY/window.innerHeight - 0.5)*2;
//     };
//     window.addEventListener("mousemove", onMove);
//     return () => window.removeEventListener("mousemove", onMove);
//   }, [camera]);

//   useFrame(({ clock }) => {
//     if (!ready.current) return;
//     const t = clock.getElapsedTime();
//     smooth.current.x += (mouse.current.x*0.40 - smooth.current.x)*0.033;
//     smooth.current.y += (-mouse.current.y*0.18 - smooth.current.y)*0.033;

//     camera.position.x = 0.5  + smooth.current.x*0.50 + Math.sin(t*0.07)*0.12;
//     camera.position.y = 1.8  + smooth.current.y*0.22 + Math.sin(t*0.10)*0.04;
//     camera.position.z = 5.2  + Math.sin(t*0.09)*0.10;
//     camera.lookAt(0, 0.60 + smooth.current.y*0.12, 0);
//   });

//   return null;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 8. SCENE
// // ─────────────────────────────────────────────────────────────────────────────
// function Scene() {
//   return (
//     <>
//       <CameraRig />
//       <fog attach="fog" args={["#000a18", 16, 32]} />

//       <ambientLight intensity={0.12} color="#001428" />
//       <directionalLight position={[5,9,-8]} intensity={0.5} color="#7dd3fc" />
//       <pointLight position={[0,-1.5,0]} color="#003355" intensity={1.2} distance={8} />

//       {/* Stars — lower count + smaller so they're sky-only, not reflected bright */}
//       <Stars radius={50} depth={28} count={1200} factor={2.4} fade speed={0.4} />

//       <Moon />
//       <LandSilhouette />
//       <MoonReflection />
//       <Ocean />

//       {/* Main boat (canvas-textured billboard) */}
//       <BoatBillboard position={[-0.15, 0.55, 0]}   scale={1.0} />
//       {/* Distant boats */}
//       <BoatBillboard position={[-4.5,  0.32, -6.5]} scale={0.40} />
//       <BoatBillboard position={[ 4.0,  0.28, -8.0]} scale={0.28} />
//     </>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 9. UI OVERLAY
// // ─────────────────────────────────────────────────────────────────────────────
// const stagger = {
//   hidden:  { opacity:0 },
//   visible: { opacity:1, transition:{ staggerChildren:0.12, delayChildren:0.6 } },
// };
// const item = {
//   hidden:  { opacity:0, y:20, filter:"blur(5px)" },
//   visible: { opacity:1, y:0, filter:"blur(0px)", transition:{ duration:0.7, ease:[0.25,0.46,0.45,0.94] } },
// };

// function HeroOverlay({ navigate }) {
//   return (
//     <motion.div
//       className="absolute inset-0 z-10 flex flex-col justify-center pointer-events-none"
//       initial="hidden" animate="visible" variants={stagger}
//     >
//       <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
//         <div className="max-w-lg">

//           <motion.div variants={item} className="inline-flex items-center gap-2 mb-5">
//             <Anchor size={11} color="#7dd3fc" />
//             <span style={{ color:"#7dd3fc", fontSize:10, fontWeight:700, letterSpacing:"0.22em" }}>
//               ELEVATE YOUR SEA JOURNEY
//             </span>
//           </motion.div>

//           <motion.h1
//             variants={item}
//             style={{ fontSize:"clamp(2rem,5.5vw,3.9rem)", color:"#ddeeff", fontWeight:900, lineHeight:1.06, marginBottom:"1.2rem" }}
//           >
//             Experience
//             <br />the{" "}
//             <span style={{
//               fontStyle:"italic",
//               background:"linear-gradient(92deg,#7dd3fc 0%,#22d3ee 50%,#38bdf8 100%)",
//               WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
//             }}>Magic</span>
//             {" "}of<br />Sailing
//           </motion.h1>

//           <motion.p variants={item} style={{ color:"rgba(163,203,242,0.72)", fontSize:"clamp(0.78rem,1.4vw,0.92rem)", lineHeight:1.72, maxWidth:420, marginBottom:"1.75rem" }}>
//             Book unforgettable trips, shop premium fishing gear, connect with passionate anglers, and explore the sea with AI-powered insights.
//           </motion.p>

//           <motion.div variants={item} className="flex flex-wrap gap-3 pointer-events-auto">
//             <motion.button
//               onClick={() => navigate("/trips")}
//               className="flex items-center gap-2 rounded-full font-bold uppercase tracking-wider text-white"
//               style={{ padding:"10px 24px", fontSize:11, background:"linear-gradient(135deg,#0ea5e9,#06b6d4)", boxShadow:"0 0 28px rgba(14,165,233,0.50)" }}
//               whileHover={{ scale:1.055, boxShadow:"0 0 44px rgba(14,165,233,0.72)" }}
//               whileTap={{ scale:0.97 }}
//             >
//               <Ship size={14} /> Book Trip
//             </motion.button>
//             <motion.button
//               onClick={() => navigate("/trips")}
//               className="flex items-center gap-2 rounded-full font-bold uppercase tracking-wider"
//               style={{ padding:"10px 24px", fontSize:11, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)", color:"#a3cbf2", backdropFilter:"blur(8px)" }}
//               whileHover={{ scale:1.04, background:"rgba(255,255,255,0.12)" }}
//               whileTap={{ scale:0.97 }}
//             >
//               Explore <ChevronRight size={13} />
//             </motion.button>
//           </motion.div>
//         </div>
//       </div>

//       {/* Bottom-right card — desktop only */}
//       <motion.div
//         variants={item}
//         className="absolute bottom-10 right-6 lg:right-12 hidden lg:flex flex-col items-end gap-3 pointer-events-auto"
//       >
//         <motion.button
//           onClick={() => navigate("/trips")}
//           animate={{ x:[0,6,0] }}
//           transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}
//           className="flex items-center gap-2 rounded-full font-bold uppercase tracking-wider text-white"
//           style={{ padding:"10px 20px", fontSize:12, background:"linear-gradient(135deg,#0ea5e9,#06b6d4)", boxShadow:"0 0 24px rgba(14,165,233,0.45)" }}
//           whileHover={{ scale:1.06 }} whileTap={{ scale:0.97 }}
//         >
//           Know More <ChevronRight size={14} />
//         </motion.button>

//         <motion.div
//           animate={{ y:[0,-5,0] }}
//           transition={{ duration:4.0, repeat:Infinity, ease:"easeInOut" }}
//           className="flex items-center gap-5 rounded-2xl"
//           style={{ padding:"12px 20px", background:"rgba(0,18,40,0.72)", backdropFilter:"blur(14px)", border:"1px solid rgba(14,165,233,0.18)" }}
//         >
//           {[{value:"500+",label:"Trips"},{value:"50+",label:"Spots"},{value:"4.9★",label:"Rating"}].map(({value,label})=>(
//             <div key={label} className="text-center">
//               <div style={{ color:"#53D6FB", fontSize:14, fontWeight:900, lineHeight:1.2 }}>{value}</div>
//               <div style={{ color:"rgba(163,203,242,0.45)", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase" }}>{label}</div>
//             </div>
//           ))}
//         </motion.div>
//       </motion.div>

//       <motion.div
//         animate={{ y:[0,9,0] }} transition={{ duration:2.1, repeat:Infinity }}
//         className="absolute bottom-5 left-1/2 -translate-x-1/2"
//         style={{ color:"rgba(163,203,242,0.28)" }}
//       >
//         <ChevronDown size={20} />
//       </motion.div>
//     </motion.div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // 10. ROOT EXPORT  — no loading screen, scene shows immediately
// // ─────────────────────────────────────────────────────────────────────────────
// export default function HeroSection() {
//   const navigate = useNavigate();

//   return (
//     <section style={{
//       position:"relative", overflow:"hidden",
//       height:"clamp(520px,80vh,960px)", minHeight:"65vh",
//       background:"#000a18",
//     }}>
//       {/* 3-D Canvas */}
//       <Canvas
//         style={{ position:"absolute", inset:0 }}
//         camera={{ position:[0,3.2,7.5], fov:52 }}
//         gl={{ antialias:true, alpha:false, powerPreference:"high-performance" }}
//         dpr={[1, Math.min(window.devicePixelRatio, 1.75)]}
//       >
//         <Suspense fallback={null}>
//           <Scene />
//         </Suspense>
//       </Canvas>

//       {/* Gradient overlays */}
//       <div style={{ position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
//         background:"linear-gradient(to right,rgba(0,10,24,0.88) 0%,rgba(0,10,24,0.50) 40%,rgba(0,10,24,0.04) 100%)" }} />
//       <div style={{ position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
//         background:"linear-gradient(to top,rgba(0,10,24,0.65) 0%,transparent 32%)" }} />

//       {/* UI — starts immediately */}
//       <HeroOverlay navigate={navigate} />
//     </section>
//   );
// }