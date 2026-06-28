import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Eye, EyeOff, CheckCircle2,
  ArrowRight, Loader2, MapPin, Phone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../services/authService";

const ease = [0.25, 0.46, 0.45, 0.94];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1, ease },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.55, ease },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.65, ease },
  },
};

const FloatingField = ({
  id, label, type = "text", value, onChange,
  focusedField, setFocusedField, rightSlot, disabled,
}) => {
  const isFocused = focusedField === id;
  const isFloated = isFocused || value.length > 0;

  return (
    <motion.div className="relative w-full group" variants={itemVariants}>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled ? true : undefined}
        className="peer w-full bg-[#0E2132]/80 text-[#DAE2FD] border border-[#243649] rounded-xl px-3.5 pt-5 pb-2 text-sm focus:outline-none transition-all duration-300 placeholder-transparent disabled:opacity-60"
        style={{
          boxShadow: isFocused ? "0 0 0 1px #53D6FB40, inset 0 1px 0 rgba(83,214,251,0.05)" : "none",
          borderColor: isFocused ? "#53D6FB" : undefined,
          paddingRight: rightSlot ? "2.5rem" : undefined,
        }}
        placeholder={label}
        onFocus={() => setFocusedField(id)}
        onBlur={() => setFocusedField(null)}
        autoComplete="off"
      />
      <motion.label
        htmlFor={id}
        className="absolute left-3.5 pointer-events-none font-semibold tracking-widest uppercase"
        animate={{
          top: isFloated ? "6px" : "14px",
          fontSize: isFloated ? "9px" : "10px",
          color: isFocused ? "#53D6FB" : "#64748B",
          letterSpacing: isFloated ? "0.12em" : "0.1em",
        }}
        transition={{ duration: 0.22, ease }}
      >
        {label}
      </motion.label>
      {rightSlot && (
        <motion.div
          className="absolute right-3.5 top-4"
          animate={{ color: isFocused ? "#53D6FB" : "#475569" }}
          transition={{ duration: 0.2 }}
        >
          {rightSlot}
        </motion.div>
      )}
    </motion.div>
  );
};

const calcStrength = (val) => {
  let s = 0;
  if (val.length >= 8) s++;
  if (/[A-Z]/.test(val)) s++;
  if (/[0-9]/.test(val)) s++;
  if (/[^A-Za-z0-9]/.test(val)) s++;
  return s;
};

const strengthColors = ["#243649", "#EF4444", "#F59E0B", "#53D6FB", "#22D3EE"];
const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

const GOVERNORATES = [
  "Cairo", "Alexandria", "Giza", "Dakahlia", "Red Sea", "Beheira",
  "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qaliubiya",
  "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said",
  "Damietta", "Sharkia", "South Sinai", "Kafr El Sheikh", "Matrouh",
  "Luxor", "Qena", "North Sinai", "Sohag",
];

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const egyptRegex = /^(01)[0-9]{9}$/;
  return phoneRegex.test(phone) || egyptRegex.test(phone);
};

const FishingBoatScene = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.45,
      r: Math.random() * 1.8 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.5 + 0.5,
    }));

    const mountainPoints = [
      [0, 0.58], [0.05, 0.48], [0.12, 0.52], [0.18, 0.42],
      [0.26, 0.46], [0.32, 0.38], [0.4, 0.44], [0.48, 0.5],
      [0.55, 0.44], [0.62, 0.48], [0.7, 0.4], [0.78, 0.46],
      [0.85, 0.5], [0.92, 0.44], [1, 0.5], [1, 0.58],
    ];

    const draw = (t) => {
      const time = t * 0.001;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.58);
      sky.addColorStop(0, "#000308");
      sky.addColorStop(0.4, "#000F1F");
      sky.addColorStop(0.75, "#001A35");
      sky.addColorStop(1, "#002848");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h * 0.58);

      stars.forEach(s => {
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(time * s.speed + s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r * tw, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * tw})`;
        ctx.fill();
      });

      const mx = w * 0.72, my = h * 0.12;
      const halo = ctx.createRadialGradient(mx, my, 10, mx, my, 80);
      halo.addColorStop(0, "rgba(180,230,255,0.12)");
      halo.addColorStop(0.5, "rgba(83,214,251,0.05)");
      halo.addColorStop(1, "transparent");
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(mx, my, 80, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(mx, my, 26, 0, Math.PI * 2);
      ctx.fillStyle = "#D4EEFF"; ctx.fill();
      ctx.beginPath(); ctx.arc(mx + 10, my - 5, 22, 0, Math.PI * 2);
      ctx.fillStyle = "#000F1F"; ctx.fill();
      [[mx - 6, my + 5, 2.5], [mx - 2, my - 3, 1.8], [mx - 10, my + 1, 1.4]].forEach(([cx, cy, cr]) => {
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,15,40,0.4)"; ctx.fill();
      });

      const hGlow = ctx.createLinearGradient(0, h * 0.45, 0, h * 0.6);
      hGlow.addColorStop(0, "rgba(0,80,120,0.0)");
      hGlow.addColorStop(0.5, "rgba(30,100,150,0.18)");
      hGlow.addColorStop(1, "rgba(0,40,80,0.0)");
      ctx.fillStyle = hGlow;
      ctx.fillRect(0, h * 0.45, w, h * 0.15);

      ctx.beginPath();
      ctx.moveTo(0, h * 0.58);
      mountainPoints.forEach(([px, py]) => ctx.lineTo(px * w, py * h));
      ctx.lineTo(w, h * 0.58);
      ctx.closePath();
      const landGrd = ctx.createLinearGradient(0, h * 0.38, 0, h * 0.58);
      landGrd.addColorStop(0, "#051525");
      landGrd.addColorStop(1, "#020C18");
      ctx.fillStyle = landGrd;
      ctx.fill();
      ctx.beginPath();
      mountainPoints.forEach(([px, py], i) => {
        if (i === 0) ctx.moveTo(px * w, py * h);
        else ctx.lineTo(px * w, py * h);
      });
      ctx.strokeStyle = "rgba(83,214,251,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const waterTop = h * 0.555;
      const water = ctx.createLinearGradient(0, waterTop, 0, h);
      water.addColorStop(0, "#001E3C");
      water.addColorStop(0.25, "#001428");
      water.addColorStop(0.6, "#000C1A");
      water.addColorStop(1, "#00060F");
      ctx.fillStyle = water;
      ctx.fillRect(0, waterTop, w, h - waterTop);

      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y = waterTop + Math.sin(x * 0.018 + time * 1.1) * 2.5
          + Math.sin(x * 0.035 + time * 0.7) * 1.2;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(83,214,251,0.18)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const y = waterTop + i * 14
            + Math.sin(x * 0.022 + time * (0.9 - i * 0.1) + i * 1.2) * (2 - i * 0.3)
            + Math.sin(x * 0.04 + time * 0.5 + i) * 0.8;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(83,214,251,${0.07 - i * 0.012})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      const refX = mx;
      for (let i = 0; i < 8; i++) {
        const refY = waterTop + 20 + i * 28;
        const refW = (22 - i * 1.5) * (0.7 + 0.3 * Math.sin(time * 1.5 + i * 0.4));
        const refAlpha = (0.18 - i * 0.018) * (0.6 + 0.4 * Math.sin(time + i));
        ctx.beginPath();
        ctx.ellipse(refX, refY, refW, 3 + i * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,235,255,${refAlpha})`;
        ctx.fill();
      }

      for (let i = 0; i < 4; i++) {
        const shaftX = w * (0.22 + i * 0.2);
        const shaftGrd = ctx.createLinearGradient(shaftX, waterTop, shaftX, h);
        const alpha = 0.025 + Math.sin(time * 0.6 + i * 1.3) * 0.012;
        shaftGrd.addColorStop(0, `rgba(83,214,251,${alpha})`);
        shaftGrd.addColorStop(1, "transparent");
        ctx.fillStyle = shaftGrd;
        ctx.beginPath();
        ctx.moveTo(shaftX - 20, waterTop);
        ctx.lineTo(shaftX + 20, waterTop);
        ctx.lineTo(shaftX + 55, h);
        ctx.lineTo(shaftX - 55, h);
        ctx.closePath();
        ctx.fill();
      }

      const rockAngle = Math.sin(time * 0.55) * 0.025;
      const bobY = Math.sin(time * 0.55) * 5;
      const boatCX = w * 0.46;
      const boatBaseY = waterTop + bobY;

      ctx.save();
      ctx.translate(boatCX, boatBaseY);
      ctx.rotate(rockAngle);

      const bw = Math.min(w * 0.38, 200); 
      const bh = Math.min(h * 0.055, 32); 

      ctx.save();
      ctx.translate(0, bh * 0.5);
      ctx.scale(1, 0.25);
      ctx.beginPath();
      ctx.ellipse(0, 0, bw * 0.45, bh * 1.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.moveTo(-bw * 0.5, 0);
      ctx.bezierCurveTo(-bw * 0.52, bh * 0.5, -bw * 0.44, bh, -bw * 0.3, bh);
      ctx.lineTo(bw * 0.3, bh);
      ctx.bezierCurveTo(bw * 0.44, bh, bw * 0.52, bh * 0.5, bw * 0.5, 0);
      ctx.closePath();
      const hullGrd = ctx.createLinearGradient(0, 0, 0, bh);
      hullGrd.addColorStop(0, "#0D2840");
      hullGrd.addColorStop(0.5, "#081A2E");
      hullGrd.addColorStop(1, "#040E1C");
      ctx.fillStyle = hullGrd;
      ctx.fill();

      ctx.strokeStyle = "#1A3A55";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-bw * 0.5, 0);
      ctx.bezierCurveTo(-bw * 0.3, -bh * 0.18, bw * 0.3, -bh * 0.18, bw * 0.5, 0);
      ctx.strokeStyle = "rgba(83,214,251,0.45)";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-bw * 0.46, bh * 0.38);
      ctx.bezierCurveTo(-bw * 0.3, bh * 0.28, bw * 0.3, bh * 0.28, bw * 0.46, bh * 0.38);
      ctx.strokeStyle = "rgba(83,214,251,0.12)";
      ctx.lineWidth = 4;
      ctx.stroke();

      const cabW = bw * 0.32;
      const cabH = bh * 2.8;
      const cabX = -cabW * 0.5 - bw * 0.04;
      const cabY = -cabH;

      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(cabX + 3, cabY + 3, cabW, cabH);

      const cabGrd = ctx.createLinearGradient(cabX, cabY, cabX + cabW, cabY);
      cabGrd.addColorStop(0, "#0A1F35");
      cabGrd.addColorStop(0.5, "#0D2640");
      cabGrd.addColorStop(1, "#071828");
      ctx.fillStyle = cabGrd;
      ctx.beginPath();
      ctx.roundRect(cabX, cabY, cabW, cabH, [4, 4, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = "#1A3A55";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cabX - 6, cabY);
      ctx.lineTo(cabX + cabW + 6, cabY);
      ctx.lineTo(cabX + cabW + 2, cabY - bh * 0.35);
      ctx.lineTo(cabX - 2, cabY - bh * 0.35);
      ctx.closePath();
      ctx.fillStyle = "#071520";
      ctx.fill();
      ctx.strokeStyle = "#1A3A55";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      const winPulse = 0.75 + 0.25 * Math.sin(time * 1.8);
      const winY = cabY + cabH * 0.38;
      [-0.28, 0.28].forEach(offset => {
        const wx = offset * cabW;
        const wAura = ctx.createRadialGradient(wx, winY, 0, wx, winY, 22);
        wAura.addColorStop(0, `rgba(83,214,251,${winPulse * 0.18})`);
        wAura.addColorStop(1, "transparent");
        ctx.fillStyle = wAura;
        ctx.beginPath(); ctx.arc(wx, winY, 22, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(wx, winY, 7, 0, Math.PI * 2);
        ctx.strokeStyle = "#2A5070"; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(wx, winY, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(83,214,251,${winPulse * 0.55})`; ctx.fill();
        ctx.beginPath(); ctx.arc(wx - 2, winY - 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${winPulse * 0.5})`; ctx.fill();
      });

      ctx.fillStyle = "#060F1C";
      ctx.beginPath();
      ctx.roundRect(-5, cabY + cabH * 0.55, 10, cabH * 0.42, [3, 3, 0, 0]);
      ctx.fill();
      ctx.strokeStyle = "#1A3A55";
      ctx.lineWidth = 0.6;
      ctx.stroke();

      const mastH = bh * 7.5;
      const mastX = cabX + cabW * 0.5;
      ctx.beginPath();
      ctx.moveTo(mastX, cabY - bh * 0.35);
      ctx.lineTo(mastX, cabY - mastH);
      const mastGrd = ctx.createLinearGradient(0, cabY, 0, cabY - mastH);
      mastGrd.addColorStop(0, "#2A4A65");
      mastGrd.addColorStop(1, "#1A3248");
      ctx.strokeStyle = mastGrd;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mastX - bw * 0.12, cabY - mastH * 0.55);
      ctx.lineTo(mastX + bw * 0.12, cabY - mastH * 0.55);
      ctx.strokeStyle = "#1E3A52";
      ctx.lineWidth = 1.8;
      ctx.stroke();

      const beaconY = cabY - mastH;
      const beaconPulse = 0.5 + 0.5 * Math.abs(Math.sin(time * 1.6));
      const bGlow = ctx.createRadialGradient(mastX, beaconY, 0, mastX, beaconY, 30);
      bGlow.addColorStop(0, `rgba(255,210,80,${beaconPulse * 0.4})`);
      bGlow.addColorStop(0.4, `rgba(255,160,30,${beaconPulse * 0.15})`);
      bGlow.addColorStop(1, "transparent");
      ctx.fillStyle = bGlow;
      ctx.beginPath(); ctx.arc(mastX, beaconY, 30, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(mastX, beaconY, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,220,100,${0.7 + beaconPulse * 0.3})`; ctx.fill();

      [[mastX, cabY - mastH * 0.98, -bw * 0.48, -bh * 0.1],
       [mastX, cabY - mastH * 0.98,  bw * 0.45, -bh * 0.1],
       [mastX, cabY - mastH * 0.55, -bw * 0.3,  -bh * 0.1],
       [mastX, cabY - mastH * 0.55,  bw * 0.3,  -bh * 0.1],
      ].forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(100,160,200,0.2)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      const rodBaseX = bw * 0.35;
      const rodBaseY = -bh * 0.1;
      const rodLen = bw * 0.75;
      const rodTipX = rodBaseX + rodLen * Math.cos(-0.55);
      const rodTipY = rodBaseY + rodLen * Math.sin(-0.55);

      ctx.beginPath();
      ctx.moveTo(rodBaseX, rodBaseY);
      ctx.lineTo(rodTipX, rodTipY);
      const rodGrd = ctx.createLinearGradient(rodBaseX, rodBaseY, rodTipX, rodTipY);
      rodGrd.addColorStop(0, "#4A7A9B");
      rodGrd.addColorStop(1, "#8BBDD4");
      ctx.strokeStyle = rodGrd;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.lineCap = "butt";

      for (let g = 0.3; g <= 0.9; g += 0.2) {
        const gx = rodBaseX + (rodTipX - rodBaseX) * g;
        const gy = rodBaseY + (rodTipY - rodBaseY) * g;
        ctx.beginPath();
        ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(180,210,230,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const lineEndX = rodTipX + 18 + Math.sin(time * 0.5) * 6;
      const lineEndY = rodTipY + 55 + Math.sin(time * 0.8) * 10;
      const lineCtrlX = rodTipX + 35;
      const lineCtrlY = rodTipY + 22;
      ctx.beginPath();
      ctx.moveTo(rodTipX, rodTipY);
      ctx.quadraticCurveTo(lineCtrlX, lineCtrlY, lineEndX, lineEndY);
      ctx.strokeStyle = "rgba(200,225,255,0.55)";
      ctx.lineWidth = 0.9;
      ctx.stroke();

      const bobberX = lineEndX;
      const bobberY = lineEndY + Math.sin(time * 2.4) * 3.5;
      for (let r = 1; r <= 3; r++) {
        const rr = r * 9 + Math.sin(time * 2 + r * 0.8) * 2;
        ctx.beginPath();
        ctx.ellipse(bobberX, bobberY + 4, rr, rr * 0.28, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(83,214,251,${0.22 / r})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.ellipse(bobberX, bobberY - 1, 5, 5, 0, Math.PI, Math.PI * 2);
      ctx.fillStyle = "#DDEEEE";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(bobberX, bobberY + 1, 5, 5, 0, 0, Math.PI);
      ctx.fillStyle = "#E03333";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bobberX - 1.5, bobberY - 3, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(bobberX, bobberY + 5);
      ctx.lineTo(bobberX + Math.sin(time * 0.4) * 4, bobberY + 32);
      ctx.strokeStyle = "rgba(180,210,255,0.3)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bobberX + Math.sin(time * 0.4) * 4 + 5, bobberY + 38, 6, Math.PI * 0.9, Math.PI * 2);
      ctx.strokeStyle = "rgba(160,200,230,0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      const chimneyX = cabX + cabW * 0.78;
      const chimneyY = cabY - bh * 0.35;
      for (let s = 0; s < 5; s++) {
        const smokeT = (time * 0.4 + s * 0.22) % 1;
        const sx = chimneyX + Math.sin(time * 0.8 + s * 1.2) * 8 * smokeT;
        const sy = chimneyY - smokeT * 55;
        const sr = 3 + smokeT * 12;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,130,160,${0.12 * (1 - smokeT)})`;
        ctx.fill();
      }

      ctx.restore(); 

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const y = h * (0.82 + i * 0.07)
            + Math.sin(x * 0.015 + time * (0.7 + i * 0.2) + i * 2) * (4 + i * 2)
            + Math.sin(x * 0.03 + time * 0.5) * 2;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
        const fgGrd = ctx.createLinearGradient(0, h * 0.8, 0, h);
        fgGrd.addColorStop(0, `rgba(0,${15 + i * 5},${30 + i * 8},${0.55 + i * 0.12})`);
        fgGrd.addColorStop(1, `rgba(0,5,12,${0.7 + i * 0.1})`);
        ctx.fillStyle = fgGrd;
        ctx.fill();
      }

      const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.2, w * 0.5, h * 0.5, h * 0.8);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,3,10,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

// ─── RegisterPage ─────────────────────────────────────────────────────────────
const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "", governorate: "", phoneNumber: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = calcStrength(form.password);
  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("Please enter your first and last name."); 
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Please enter your email address."); 
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters."); 
      return false;
    }
    if (passwordStrength < 3) {
      toast.error("Password is too weak. Add uppercase, numbers, or symbols."); 
      return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match."); 
      return false;
    }
    if (!form.phoneNumber.trim()) {
      toast.error("Please enter your phone number.");
      return false;
    }
    if (!validatePhoneNumber(form.phoneNumber)) {
      toast.error("Please enter a valid phone number (e.g., 01234567890 or +201234567890).");
      return false;
    }
    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions."); 
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const data = await register({
        email: form.email.trim(), 
        password: form.password,
        firstName: form.firstName.trim(), 
        lastName: form.lastName.trim(),
        governorate: form.governorate || null,
        phoneNumber: form.phoneNumber.trim(),
      });
      toast.success(data?.message || "Registration successful! Please check your email.");
      navigate("/login");
    } catch (err) {
      console.error("Registration Failed:", err);
      const resData = err?.response?.data;
      
      let msg = "Registration failed. Please try again.";

      if (typeof resData === "string") {
        msg = resData;
      } else if (resData?.errors && typeof resData.errors === "object") {
        // PRIORITY FLIPPED: Checks deep validation dict BEFORE generic ProblemDetails title!
        const firstKey = Object.keys(resData.errors)[0];
        if (firstKey && Array.isArray(resData.errors[firstKey]) && resData.errors[firstKey][0]) {
          msg = resData.errors[firstKey][0];
        }
      } else if (resData?.description) {
        msg = resData.description;
      } else if (resData?.message) {
        msg = resData.message;
      } else if (resData?.title) {
        msg = resData.title;
      } else if (err?.message && err.message !== "Network Error") {
        msg = err.message;
      }

      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  return (
    <div className="min-h-screen flex items-stretch bg-[#000F1F] overflow-hidden">

      <div className="relative z-10 w-full lg:w-[46%] flex flex-col items-center justify-center p-6 md:p-10 min-h-screen bg-[#000F1F]">

        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(83,214,251,0.05) 0%, transparent 60%)" }}
        />

        <motion.div
          className="relative w-full max-w-sm flex flex-col items-center"
          initial="hidden" animate="visible" variants={containerVariants}
        >
          <motion.div
            className="flex justify-center mb-7 cursor-pointer"
            variants={itemVariants}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <Link to="/">
              <img
                src="/images/HOOK.png"
                alt="HOOK Logo"
                className="h-20 w-auto md:h-22 object-cover"
                style={{ filter: "drop-shadow(0 0 18px rgba(83,214,251,0.35))" }}
              />
            </Link>
          </motion.div>

          <motion.div
            className="w-full border border-[#243649]/60 rounded-2xl p-6 backdrop-blur-md"
            style={{
              background: "linear-gradient(160deg, rgba(2,21,37,0.97) 0%, rgba(2,21,37,0.92) 100%)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 1px 0 rgba(83,214,251,0.06) inset",
            }}
            variants={cardVariants}
          >
            <motion.div className="text-center mb-6" variants={itemVariants}>
              <h1 className="text-2xl font-medium text-[#D2E4FC] mb-1.5">Create your account</h1>
              <p className="text-[#64748B] text-xs italic">Start your journey with Hook</p>
            </motion.div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <motion.div className="flex gap-3" variants={itemVariants}>
                <FloatingField id="firstName" label="First Name" value={form.firstName}
                  onChange={set("firstName")} focusedField={focusedField}
                  setFocusedField={setFocusedField} rightSlot={<User size={15} />} disabled={isLoading} />
                <FloatingField id="lastName" label="Last Name" value={form.lastName}
                  onChange={set("lastName")} focusedField={focusedField}
                  setFocusedField={setFocusedField} disabled={isLoading} />
              </motion.div>

              <FloatingField id="email" label="Email Address" type="email" value={form.email}
                onChange={set("email")} focusedField={focusedField}
                setFocusedField={setFocusedField} rightSlot={<Mail size={15} />} disabled={isLoading} />

              <FloatingField id="phoneNumber" label="Phone Number" type="tel" value={form.phoneNumber}
                onChange={set("phoneNumber")} focusedField={focusedField}
                setFocusedField={setFocusedField} rightSlot={<Phone size={15} />} disabled={isLoading} />

              <motion.div className="relative w-full" variants={itemVariants}>
                <select
                  id="governorate" value={form.governorate} onChange={set("governorate")}
                  disabled={isLoading ? true : undefined}
                  onFocus={() => setFocusedField("governorate")}
                  onBlur={() => setFocusedField(null)}
                  className="peer w-full bg-[#0E2132]/80 text-[#DAE2FD] border border-[#243649] rounded-xl pl-3.5 pr-8 pt-5 pb-2 text-sm focus:outline-none transition-all duration-300 appearance-none disabled:opacity-60"
                  style={{
                    boxShadow: focusedField === "governorate" ? "0 0 0 1px #53D6FB40" : "none",
                    borderColor: focusedField === "governorate" ? "#53D6FB" : undefined,
                    color: form.governorate ? "#DAE2FD" : "transparent",
                  }}
                >
                  <option value="" disabled hidden />
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g} style={{ background: "#0E2132", color: "#DAE2FD" }}>{g}</option>
                  ))}
                </select>
                <motion.label
                  htmlFor="governorate"
                  className="absolute left-3.5 pointer-events-none font-semibold tracking-widest uppercase"
                  animate={{
                    top: focusedField === "governorate" || form.governorate ? "6px" : "14px",
                    fontSize: focusedField === "governorate" || form.governorate ? "9px" : "10px",
                    color: focusedField === "governorate" ? "#53D6FB" : "#64748B",
                  }}
                  transition={{ duration: 0.22, ease }}
                >Governorate (Optional)</motion.label>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <MapPin size={14} className="text-[#475569]" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password" value={form.password} onChange={set("password")}
                    disabled={isLoading ? true : undefined}
                    className="peer w-full bg-[#0E2132]/80 text-[#DAE2FD] border border-[#243649] rounded-xl px-3.5 pr-10 pt-5 pb-2 text-sm focus:outline-none transition-all duration-300 placeholder-transparent tracking-widest disabled:opacity-60"
                    style={{
                      boxShadow: focusedField === "password" ? "0 0 0 1px #53D6FB40, inset 0 1px 0 rgba(83,214,251,0.05)" : "none",
                      borderColor: focusedField === "password" ? "#53D6FB" : undefined,
                    }}
                    placeholder="Password"
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="new-password"
                  />
                  <motion.label htmlFor="password"
                    className="absolute left-3.5 pointer-events-none font-semibold tracking-widest uppercase"
                    animate={{
                      top: focusedField === "password" || form.password ? "6px" : "14px",
                      fontSize: focusedField === "password" || form.password ? "9px" : "10px",
                      color: focusedField === "password" ? "#53D6FB" : "#64748B",
                    }}
                    transition={{ duration: 0.22, ease }}
                  >Password</motion.label>
                  <motion.button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-4 focus:outline-none"
                    style={{ color: focusedField === "password" ? "#53D6FB" : "#475569" }}
                    whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span key={showPassword ? "off" : "on"}
                        initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                </div>
                <div className="flex items-center justify-between mt-2 px-0.5">
                  <div className="flex gap-1 flex-1 mr-3">
                    {[1, 2, 3, 4].map((bar) => (
                      <motion.div key={bar} className="h-0.5 flex-1 rounded-full"
                        animate={{
                          backgroundColor: bar <= passwordStrength ? strengthColors[passwordStrength] : "#243649",
                          boxShadow: bar <= passwordStrength && passwordStrength >= 3
                            ? `0 0 6px ${strengthColors[passwordStrength]}80` : "none",
                        }}
                        transition={{ duration: 0.3, ease }}
                      />
                    ))}
                  </div>
                  <motion.span className="text-[9px]"
                    animate={{ color: passwordStrength > 0 ? strengthColors[passwordStrength] : "#64748B" }}
                    transition={{ duration: 0.3 }}
                  >
                    {passwordStrength === 0 ? "Must include symbols" : strengthLabels[passwordStrength]}
                  </motion.span>
                </div>
              </motion.div>

              <motion.div className="relative w-full" variants={itemVariants}>
                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirmPassword" value={form.confirmPassword} onChange={set("confirmPassword")}
                  disabled={isLoading ? true : undefined}
                  className="peer w-full bg-[#0E2132]/80 text-[#DAE2FD] border border-[#243649] rounded-xl px-3.5 pr-10 pt-5 pb-2 text-sm focus:outline-none transition-all duration-300 placeholder-transparent tracking-widest disabled:opacity-60"
                  style={{
                    boxShadow: focusedField === "confirmPassword" ? "0 0 0 1px #53D6FB40" : "none",
                    borderColor: focusedField === "confirmPassword"
                      ? "#53D6FB"
                      : form.confirmPassword.length > 0
                        ? passwordsMatch ? "#22D3EE" : "#EF4444"
                        : undefined,
                  }}
                  placeholder="Confirm Password"
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="new-password"
                />
                <motion.label htmlFor="confirmPassword"
                  className="absolute left-3.5 pointer-events-none font-semibold tracking-widest uppercase"
                  animate={{
                    top: focusedField === "confirmPassword" || form.confirmPassword ? "6px" : "14px",
                    fontSize: focusedField === "confirmPassword" || form.confirmPassword ? "9px" : "10px",
                    color: focusedField === "confirmPassword" ? "#53D6FB" : "#64748B",
                  }}
                  transition={{ duration: 0.22, ease }}
                >Confirm Password</motion.label>
                <motion.button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-4 focus:outline-none"
                  style={{ color: focusedField === "confirmPassword" ? "#53D6FB" : "#475569" }}
                  whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span key={showConfirm ? "off" : "on"}
                      initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}
                    >
                      {form.confirmPassword.length > 0
                        ? passwordsMatch
                          ? <CheckCircle2 size={15} style={{ color: "#22D3EE" }} />
                          : showConfirm ? <EyeOff size={15} /> : <Eye size={15} />
                        : showConfirm ? <EyeOff size={15} /> : <Eye size={15} />
                      }
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </motion.div>

              <motion.div className="flex items-center gap-2.5 pt-1" variants={itemVariants}>
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <input type="checkbox" id="terms" checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)} disabled={isLoading ? true : undefined}
                    className="peer w-4 h-4 rounded appearance-none border border-[#53D6FB] bg-transparent checked:bg-[#53D6FB] transition-all duration-300 cursor-pointer"
                  />
                  <div className="absolute text-[#003542] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-300">
                    <CheckCircle2 size={12} strokeWidth={3} />
                  </div>
                </div>
                <label htmlFor="terms" className="text-xs text-[#94A3B8] cursor-pointer select-none">
                  I agree to the{" "}
                  <motion.span className="text-[#FFB77D] inline-block cursor-pointer"
                    whileHover={{ color: "#FED7AA", textShadow: "0 0 12px rgba(255,183,125,0.4)" }}
                    transition={{ duration: 0.2 }}
                  >Terms & Conditions</motion.span>
                </label>
              </motion.div>

              <motion.button
                type="submit" disabled={isLoading ? true : undefined}
                className="w-full py-3 rounded-full font-bold tracking-widest text-xs flex items-center justify-center gap-2 uppercase mt-3 text-black relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(90deg, #53D6FB 0%, #008AA7 100%)" }}
                variants={itemVariants}
                whileHover={!isLoading ? { scale: 1.02, boxShadow: "0 0 32px rgba(83,214,251,0.45), 0 8px 24px rgba(0,138,167,0.3)" } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              >
                {!isLoading && (
                  <motion.span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)" }}
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                  />
                )}
                {isLoading ? (
                  <><Loader2 size={15} className="animate-spin" /><span>Creating account…</span></>
                ) : (
                  <>
                    <span>Create Account</span>
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                      <ArrowRight size={15} />
                    </motion.span>
                  </>
                )}
              </motion.button>
            </form>

            <motion.p className="text-center text-[#64748B] text-[11px] mt-5 font-medium" variants={itemVariants}>
              Already have an account?{" "}
              <MotionLink to="/login">Log in</MotionLink>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      <div className="hidden lg:block relative w-[54%] overflow-hidden">
        <div
          className="absolute left-0 top-0 w-40 h-full pointer-events-none z-10"
          style={{ background: "linear-gradient(to right, #000F1F, transparent)" }}
        />
        <div className="absolute inset-0">
          <FishingBoatScene />
        </div>
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-5 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease }}
        >
          {[
            { value: "500+", label: "Trips Completed" },
            { value: "50+", label: "Destinations" },
            { value: "4.9★", label: "Avg. Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center px-4 py-2 rounded-xl backdrop-blur-sm"
              style={{ background: "rgba(2,21,37,0.65)", border: "1px solid rgba(83,214,251,0.14)" }}
            >
              <div className="text-[#53D6FB] font-bold text-lg leading-tight">{value}</div>
              <div className="text-[#64748B] text-[10px] tracking-wider uppercase">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
};

const MotionLink = ({ children, to }) => (
  <motion.span
    whileHover={{ color: "#FED7AA", textShadow: "0 0 10px rgba(255,183,125,0.4)" }}
    transition={{ duration: 0.2 }}
    style={{ color: "#FFB77D", display: "inline-block", cursor: "pointer" }}
  >
    <Link to={to} style={{ color: "inherit", textDecoration: "none" }}>{children}</Link>
  </motion.span>
);

export default RegisterPage;