// src/pages/HomePage.jsx
import React, { useEffect, Suspense } from "react";
import { ReactLenis } from 'lenis/react';

import HeroSection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/HeroSection";
import CategorySection from "../../components/APP_COMPONENTS/HOME_COMPONENTS/CategorySection";

const FeaturedTripsSection = React.lazy(() => import("../../components/APP_COMPONENTS/HOME_COMPONENTS/FeaturedTripsSection"));
const TopProductsSection = React.lazy(() => import("../../components/APP_COMPONENTS/HOME_COMPONENTS/TopProductsSection"));
const CommunitySection = React.lazy(() => import("../../components/APP_COMPONENTS/HOME_COMPONENTS/CommunitySection"));
const AIAssistantSection = React.lazy(() => import("../../components/APP_COMPONENTS/HOME_COMPONENTS/AIAssistantSection"));
const HowItWorksSection = React.lazy(() => import("../../components/APP_COMPONENTS/HOME_COMPONENTS/HowItWorksSection"));

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ReactLenis 
      root 
      options={{
        lerp: 0.1, 
        duration: 1.2, 
        smoothWheel: true, 
        smoothTouch: false, 
      }}
    >
      <div className="min-h-screen relative" style={{ background: "#001526" }}>
        <HeroSection />
        <CategorySection />
        
        <Suspense fallback={<div className="min-h-[300px]" />}>
          <FeaturedTripsSection />
          <TopProductsSection />
          <CommunitySection />
          <AIAssistantSection />
          <HowItWorksSection />
        </Suspense>
      </div>
    </ReactLenis>
  );
};

export default HomePage;