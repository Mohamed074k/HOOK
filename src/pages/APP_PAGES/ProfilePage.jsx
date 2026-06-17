
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./../../components/APP_COMPONENTS/PROFILE_COMPONENTS/Sidebar";
import MobileRadialMenu from "./../../components/APP_COMPONENTS/PROFILE_COMPONENTS/MobileRadialMenu";
import SettingsTab from "./../../components/APP_COMPONENTS/PROFILE_COMPONENTS/SettingsTab";
import TripsTab from "./../../components/APP_COMPONENTS/PROFILE_COMPONENTS/TripsTab";
import OrdersTab from "./../../components/APP_COMPONENTS/PROFILE_COMPONENTS/OrdersTab";

const ProfilePage = () => {
  const { 
    profile,
    loading,
    updateProfile,
    changePassword , 
    boatOwnerStatus,
    sellerStatus,
    submitBoatOwnerApplication,
    submitSellerApplication
  } = useProfile();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');
  const [isMobile, setIsMobile] = useState(false);

    // Make the page always open at the top
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001526] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-sky-400/30 border-t-sky-400 rounded-full" 
        />
      </div>
    );
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="min-h-screen bg-[#001526] text-[#cee5ff]">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />
      )}
      
      {/* Mobile Radial Menu */}
      {isMobile && (
        <MobileRadialMenu activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />
      )}

      {/* Main content */}
      <div className={`${!isMobile ? 'ml-64' : ''} p-4 md:p-8 min-h-screen overflow-hidden`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-7xl mx-auto"
          >
        {activeTab === 'settings' && (
  <SettingsTab 
    profile={profile} 
    updateProfile={updateProfile} 
    changePassword={changePassword}
    boatOwnerStatus={boatOwnerStatus}
    sellerStatus={sellerStatus}
    submitBoatOwnerApplication={submitBoatOwnerApplication}
    submitSellerApplication={submitSellerApplication}
  />
)}
            {activeTab === 'trips' && <TripsTab />}
            {activeTab === 'orders' && <OrdersTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;