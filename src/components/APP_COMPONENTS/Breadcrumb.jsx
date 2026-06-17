import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ customItems, className = "" }) => {
  const location = useLocation();
  
  // Generate path segments from current URL
  const getPathSegments = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    
    // Map pathnames to display names
    const segmentMap = {
      "marketplace": "Marketplace",
       "cart": "Cart",
        "trips": "Trips",
         };
    
    return pathnames.map((segment, index) => {
      const isLast = index === pathnames.length - 1;
      const displayName = segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const path = `/${pathnames.slice(0, index + 1).join("/")}`;
      
      return { name: displayName, path, isLast };
    });
  };
  
  const segments = customItems || getPathSegments();
  
  if (segments.length === 0) return null;
  
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-center flex-wrap gap-1 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Home Link */}
      <Link
        to="/"
        className="flex items-center gap-1 text-[#a3cbf2]/60 hover:text-sky-400 transition-colors duration-200"
      >
        <Home size={14} />
        <span className="text-sm font-medium">Home</span>
      </Link>
      
      {segments.map((segment, index) => (
        <React.Fragment key={segment.path}>
          <ChevronRight size={12} className="text-[#a3cbf2]/30 shrink-0" />
          
          {segment.isLast ? (
            <span className="text-sky-400 font-semibold text-sm truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
              {segment.name}
            </span>
          ) : (
            <Link
              to={segment.path}
              className="text-[#a3cbf2]/60 hover:text-sky-400 transition-colors duration-200 text-xs font-medium truncate max-w-[120px] sm:max-w-[150px] md:max-w-none"
            >
              {segment.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </motion.nav>
  );
};

export default Breadcrumb;