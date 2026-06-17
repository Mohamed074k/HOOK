import { Outlet } from "react-router-dom";
import { Anchor } from "lucide-react";
import Navbar from "../components/APP_COMPONENTS/Navbar";
import FooterSection from "../components/APP_COMPONENTS/HOME_COMPONENTS/FooterSection";
import BackToTop from "../components/APP_COMPONENTS/BackToTop"; 

const AppLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#001526] text-[#cee5ff]">
    <Navbar />

    {/* Main Content */}
    <main className="flex-1 pt-[65px] md:pt-[69px]">
      <Outlet />
    </main>

<FooterSection />

    {/* Global Back To Top Button */}
    <BackToTop />
  </div>
);

export default AppLayout;