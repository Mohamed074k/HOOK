import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Eye, EyeOff, ArrowRight, Lock, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ease = [0.25, 0.46, 0.45, 0.94];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15, ease },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease },
  },
};

// ─── Role → default dashboard path ───────────────────────────────────────────
const ROLE_ROUTES = {
  Admin: "/super-admin",
  CommunityAdmin: "/community-admin", 
  Seller: "/seller",
  BoatOwner: "/boat-owner",
  User: "/",
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const decoded = await login(email.trim(), password);
      toast.success(`Welcome back, ${decoded.firstName || decoded.email}!`);
      
      // نستخرج الـ role بأمان سواء كان نص عادي أو جوه مصفوفة (Array)
      const userRole = Array.isArray(decoded.role) ? decoded.role[0] : decoded.role;
      
      // التوجيه بناءً على الـ role المستخرج
      const destination = ROLE_ROUTES[userRole] ?? "/";
      navigate(destination, { replace: true });
      
    } catch (err) {
      const msg =
        err?.response?.data?.description ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-[#000F1F] overflow-hidden"
      style={{
        backgroundImage: "url('/images/Auth-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000F1F] via-[#000F1F]/85 via-50% to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000510]/80 via-[#000510]/40 to-transparent" />
      </div>

      {/* Static ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(83,214,251,0.08) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-sm flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo - Image instead of text */}
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

        {/* Card */}
        <motion.div
          className="w-full border border-[#243649]/60 rounded-2xl p-6 backdrop-blur-md"
          style={{
            background:
              "linear-gradient(160deg, rgba(2,21,37,0.97) 0%, rgba(2,21,37,0.92) 100%)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.7), 0 1px 0 rgba(83,214,251,0.06) inset",
          }}
          variants={cardVariants}
        >
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <h1 className="text-2xl font-medium text-[#D2E4FC] mb-1.5">
              Welcome back
            </h1>
            <p className="text-[#64748B] text-xs italic">
              Enter your credentials to access your account
            </p>
          </motion.div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <motion.div className="relative w-full" variants={itemVariants}>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full bg-[#0E2132]/80 text-[#DAE2FD] border border-[#243649] rounded-xl pl-10 pr-3.5 pt-5 pb-2 text-sm focus:outline-none transition-all duration-300 placeholder-transparent"
                style={{
                  boxShadow:
                    focusedField === "email"
                      ? "0 0 0 1px #53D6FB40, inset 0 1px 0 rgba(83,214,251,0.05)"
                      : "none",
                  borderColor: focusedField === "email" ? "#53D6FB" : undefined,
                }}
                placeholder="Email"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                autoComplete="email"
                disabled={isLoading}
              />
              <motion.label
                htmlFor="email"
                className="absolute left-10 pointer-events-none font-semibold tracking-widest uppercase"
                animate={{
                  top: focusedField === "email" || email ? "6px" : "14px",
                  fontSize: focusedField === "email" || email ? "9px" : "10px",
                  color: focusedField === "email" ? "#53D6FB" : "#64748B",
                }}
                transition={{ duration: 0.22, ease }}
              >
                Email Address
              </motion.label>
              <motion.div
                className="absolute left-3 top-1/2 -translate-y-1/2"
                animate={{ color: focusedField === "email" ? "#53D6FB" : "#475569" }}
                transition={{ duration: 0.2 }}
              >
                <Mail size={15} />
              </motion.div>
            </motion.div>

            {/* Password */}
            <motion.div className="relative w-full" variants={itemVariants}>
     

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full bg-[#0E2132]/80 text-[#DAE2FD] border border-[#243649] rounded-xl pl-10 pr-10 pt-5 pb-2 text-sm focus:outline-none transition-all duration-300 placeholder-transparent tracking-widest"
                  style={{
                    boxShadow:
                      focusedField === "password"
                        ? "0 0 0 1px #53D6FB40, inset 0 1px 0 rgba(83,214,251,0.05)"
                        : "none",
                    borderColor:
                      focusedField === "password" ? "#53D6FB" : undefined,
                  }}
                  placeholder="Password"
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <motion.label
                  htmlFor="password"
                  className="absolute left-10 pointer-events-none font-semibold tracking-widest uppercase"
                  animate={{
                    top: focusedField === "password" || password ? "6px" : "14px",
                    fontSize: focusedField === "password" || password ? "9px" : "10px",
                    color: focusedField === "password" ? "#53D6FB" : "#64748B",
                  }}
                  transition={{ duration: 0.22, ease }}
                >
                  Password
                </motion.label>

                {/* Lock icon left */}
                <motion.div
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  animate={{
                    color: focusedField === "password" ? "#53D6FB" : "#475569",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Lock size={15} />
                </motion.div>

                {/* Toggle right */}
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                  style={{
                    color: focusedField === "password" ? "#53D6FB" : "#475569",
                  }}
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={showPassword ? "off" : "on"}
                      initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.6, rotate: 15 }}
                      transition={{ duration: 0.18 }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full font-bold tracking-widest text-xs flex items-center justify-center gap-2 uppercase mt-2 text-black relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(90deg, #53D6FB 0%, #008AA7 100%)",
              }}
              variants={itemVariants}
              whileHover={
                !isLoading
                  ? {
                      scale: 1.02,
                      boxShadow:
                        "0 0 32px rgba(83,214,251,0.45), 0 8px 24px rgba(0,138,167,0.3)",
                    }
                  : {}
              }
              whileTap={!isLoading ? { scale: 0.97 } : {}}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
            >
              {/* Shimmer sweep */}
              {!isLoading && (
                <motion.span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
                  }}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                />
              )}

              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Log in</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight size={15} />
                  </motion.span>
                </>
              )}
            </motion.button>
          </form>

          {/* Register link */}
          <motion.p
            className="text-center text-[#64748B] text-[11px] mt-5 font-medium"
            variants={itemVariants}
          >
            Don't have an account?{" "}
            <MotionLink to="/register">Sign up</MotionLink>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

const MotionLink = ({ children, to, muted }) => (
  <motion.span
    whileHover={{
      color: muted ? "#94A3B8" : "#FED7AA",
      y: muted ? -1 : 0,
      textShadow: muted ? "none" : "0 0 10px rgba(255,183,125,0.4)",
    }}
    transition={{ duration: 0.2 }}
    style={{
      color: muted ? "inherit" : "#FFB77D",
      display: "inline-block",
      cursor: "pointer",
    }}
  >
    <Link to={to} style={{ color: "inherit", textDecoration: "none" }}>
      {children}
    </Link>
  </motion.span>
);

export default LoginPage;

