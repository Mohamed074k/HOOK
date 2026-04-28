// src/components/Home/FooterSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Anchor, MapPin, Phone, Mail, Heart } from "lucide-react";
 
const FooterSection = () => {
  return (
    <footer className="bg-[#001526] border-t border-white/5 px-6 md:px-12 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center">
                <Anchor size={20} className="text-white" />
              </div>
              <span className="text-xl font-black text-[#cee5ff]">HOOK</span>
            </div>
            <p className="text-sm text-[#a3cbf2]/60 mb-4">
              Your premier destination for exclusive fishing expeditions and maritime adventures.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-[#cee5ff] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Browse Trips", "Marketplace", "Community", "About Us", "Contact"].map((link) => (
                <li key={link}>
                  <Link 
                    to={link === "Browse Trips" ? "/trips" : link === "Marketplace" ? "/marketplace" : "#"} 
                    className="text-sm text-[#a3cbf2]/60 hover:text-sky-400 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-[#cee5ff] mb-4">Support</h4>
            <ul className="space-y-2">
              {["FAQ", "Safety Guidelines", "Cancellation Policy", "Terms of Service", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <Link to="#" className="text-sm text-[#a3cbf2]/60 hover:text-sky-400 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-[#cee5ff] mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-[#a3cbf2]/60">
                <MapPin size={16} className="text-sky-400 mt-0.5 flex-shrink-0" />
                <span>123 Marina Bay Drive<br />Miami, FL 33131</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#a3cbf2]/60">
                <Phone size={16} className="text-sky-400 flex-shrink-0" />
                <span>+1 (305) 555-0123</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-[#a3cbf2]/60">
                <Mail size={16} className="text-sky-400 flex-shrink-0" />
                <span>adventures@hook.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#a3cbf2]/40">
            © 2024 HOOK Expeditions. All rights reserved.
          </p>
          <p className="text-xs text-[#a3cbf2]/40 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400 fill-red-400" /> for adventurers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;