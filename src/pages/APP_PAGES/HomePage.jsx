// src/pages/HomePage.jsx
import React, { useEffect } from "react";
import { ReactLenis } from 'lenis/react';

import HeroSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/HeroSection";
import CategorySection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/CategorySection";
import HowItWorksSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/HowItWorksSection"; // تم إضافة الاستدعاء هنا
import FeaturedTripsSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/FeaturedTripsSection";
import TopProductsSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/TopProductsSection";
import CommunitySection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/CommunitySection";
import AIAssistantSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/AIAssistantSection";

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ReactLenis 
      root 
      options={{
        lerp: 0.1, 
        duration: 1.5, 
        smoothWheel: true, 
        smoothTouch: false, 
      }}
    >
      <div className="min-h-screen relative" style={{ background: "#001526" }}>
        <HeroSection />
        <CategorySection />
        <FeaturedTripsSection />
        <TopProductsSection />
        <CommunitySection />
        <AIAssistantSection />
         <HowItWorksSection />
      </div>
    </ReactLenis>
  );
};

export default HomePage;