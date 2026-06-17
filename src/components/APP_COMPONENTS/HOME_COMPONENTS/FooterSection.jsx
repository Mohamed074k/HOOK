// src/components/APP_COMPONENTS/HOME_COMPONENTS/FooterSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Heart } from "lucide-react";
// استيراد أيقونات السوشيال ميديا من react-icons
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";

// --- Animation Variants ---
const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } 
  },
};

const FooterSection = () => {
  return (
    <footer className="bg-[#000F1F] border-t border-[#102a42] px-6 md:px-12 py-16 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-sky-500/5 blur-[100px] pointer-events-none rounded-full" />

      <motion.div 
        className="max-w-7xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={footerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
          
          {/* --- Brand & About --- */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <Link to="/">
                <img 
                  src="/images/HOOK.png" 
                  alt="HOOK Logo" 
                  className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(83,214,251,0.2)]" 
                />
              </Link>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-6 max-w-xs">
              Your premier destination for exclusive fishing expeditions, premium gear, and a thriving maritime community.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, idx) => (
                <motion.a 
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-[#001526] border border-[#102a42] flex items-center justify-center text-[#94A3B8] hover:text-[#53D6FB] hover:border-[#53D6FB]/50 hover:bg-[#53D6FB]/5 transition-all duration-300"
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* --- Quick Links --- */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-[#E2E8F0] mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Browse Trips", path: "/trips" }, 
                { name: "Marketplace", path: "/marketplace" }, 
                { name: "Community", path: "/community" }, 
                { name: "About Us", path: "#" }, 
                { name: "Contact", path: "#" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-[#94A3B8] hover:text-[#53D6FB] transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 h-px bg-[#53D6FB] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 ease-out" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* --- Support --- */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-[#E2E8F0] mb-6 tracking-wide">Support</h4>
            <ul className="space-y-3">
              {["FAQ", "Safety Guidelines", "Cancellation Policy", "Terms of Service", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <Link to="#" className="text-sm text-[#94A3B8] hover:text-[#53D6FB] transition-colors inline-flex items-center group">
                    <span className="w-0 h-px bg-[#53D6FB] mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300 ease-out" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* --- Contact --- */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-[#E2E8F0] mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-[#94A3B8] group">
                <div className="p-2 rounded-lg bg-[#001526] border border-[#102a42] group-hover:border-[#53D6FB]/30 transition-colors">
                  <MapPin size={16} className="text-[#53D6FB]" />
                </div>
                <span className="mt-1 leading-relaxed">Kafr Elsheikh<br />Egypt, 33511</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#94A3B8] group">
                <div className="p-2 rounded-lg bg-[#001526] border border-[#102a42] group-hover:border-[#53D6FB]/30 transition-colors">
                  <Phone size={16} className="text-[#53D6FB]" />
                </div>
                <span>01228563612</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#94A3B8] group">
                <div className="p-2 rounded-lg bg-[#001526] border border-[#102a42] group-hover:border-[#53D6FB]/30 transition-colors">
                  <Mail size={16} className="text-[#53D6FB]" />
                </div>
                <span>hook@gmail.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* --- Bottom Bar --- */}
        <motion.div 
          variants={itemVariants}
          className="pt-8 border-t border-[#102a42] flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs text-[#64748B]">
            © {new Date().getFullYear()} HOOK Expeditions. All rights reserved.
          </p>
          <p className="text-xs text-[#64748B] flex items-center gap-1.5">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> for adventurers
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default FooterSection;