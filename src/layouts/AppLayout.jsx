import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/APP_COMPONENTS/Navbar";
import FooterSection from "../components/APP_COMPONENTS/HOME_COMPONENTS/FooterSection";
import BackToTop from "../components/APP_COMPONENTS/BackToTop"; 
import FloatingChatbotBtn from "../components/APP_COMPONENTS/FloatingChatbotBtn";

const AppLayout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith('/profile');

  return (
    <div className="min-h-screen flex flex-col bg-[#001526] text-[#cee5ff]">
      <Navbar />

      <main className="flex-1 pt-[65px] md:pt-[69px]">
        <Outlet />
      </main>

      {!isProfilePage && <FooterSection />}

      <BackToTop />
      <FloatingChatbotBtn />
    </div>
  );
};

export default AppLayout;