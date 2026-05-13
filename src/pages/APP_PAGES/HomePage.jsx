import React, { useEffect } from "react"; // 1. Import useEffect
import HeroSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/HeroSection";
import CategorySection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/CategorySection";
import FeaturedTripsSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/FeaturedTripsSection";
import TopProductsSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/TopProductsSection";
import CommunitySection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/CommunitySection";
import AIAssistantSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/AIAssistantSection";

const HomePage = () => {
  // 2. Run this effect on component mount
  useEffect(() => {
    // Standard web API to reset scroll position to the top left
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this only runs once when page loads

  return (
    <div className="min-h-screen relative" style={{ background: "#000d1a" }}>
      <HeroSection />
      <CategorySection />
      <FeaturedTripsSection />
      <TopProductsSection />
      <CommunitySection />
      <AIAssistantSection />
    </div>
  );
};

export default HomePage;