import React from "react";

// Contexts
import { AuthProvider } from "../context/AuthContext";
import { ProfileProvider } from "../context/ProfileContext";
import { CartProvider } from "../context/CartContext";
import { ChatProvider } from "../context/APP_CONTEXT/ChatbotContext";
// APP CONTEXTS
import { CommunityProvider } from "../context/APP_CONTEXT/CommunityContext";
import { CommunityProfileProvider } from "../context/APP_CONTEXT/CommunityProfileContext";

// BOAT OWNER CONTEXTS
import { BoatProvider } from "../context/BOAT_OWNER_CONTEXT/BoatContext";
import { TripProvider } from "../context/BOAT_OWNER_CONTEXT/TripContext";
import { BookingProvider } from "../context/BOAT_OWNER_CONTEXT/BookingContext";

// SUPER ADMIN CONTEXTS
import { SellerProvider } from "../context/SUPER_ADMIN_CONTEXT/SellersContext";
import { SuperAdminProductProvider } from "../context/SUPER_ADMIN_CONTEXT/ProductContext";

// COMMUNITY ADMIN CONTEXTS
import { CommunityAdminProvider } from "../context/COMMUNITY_ADMIN_CONTEXT/ComplaintsContext"; 
import { ProhibitedLocationsProvider } from "../context/COMMUNITY_ADMIN_CONTEXT/ProhibitedLocationsContext";
import { ProhibitedToolsProvider } from "../context/COMMUNITY_ADMIN_CONTEXT/ProhibitedToolsContext"; 
import { ProhibitedSeasonsProvider } from "../context/COMMUNITY_ADMIN_CONTEXT/ProhibitedSeasonsContext"; 

// SELLER CONTEXTS
import { ProductProvider } from "../context/SELLER_CONTEXT/ProductContext";

// Role-based Providers
const BoatOwnerProviders = ({ children }) => (
  <BoatProvider>
    <TripProvider>
      <BookingProvider>{children}</BookingProvider>
    </TripProvider>
  </BoatProvider>
);

const SellerProviders = ({ children }) => (
  <SellerProvider>
    <ProductProvider>{children}</ProductProvider>
  </SellerProvider>
);

const SuperAdminProviders = ({ children }) => (
  <SellerProvider>
    <SuperAdminProductProvider>{children}</SuperAdminProductProvider>
  </SellerProvider>
);

// Community Admin Providers
const CommunityAdminProviders = ({ children }) => (
  <CommunityAdminProvider>
    <ProhibitedLocationsProvider> 
    <ProhibitedToolsProvider> 
    <ProhibitedSeasonsProvider> 
      {children}
    </ProhibitedSeasonsProvider>
    </ProhibitedToolsProvider>
    </ProhibitedLocationsProvider>
  </CommunityAdminProvider> 
);

// App Providers for public pages (all users)
const AppProviders = ({ children }) => (
  <ProfileProvider>
    <CartProvider>
      <CommunityProvider>
        <CommunityProfileProvider>
          <ChatProvider> 
            {children}
          </ChatProvider>
        </CommunityProfileProvider>
      </CommunityProvider>
    </CartProvider>
  </ProfileProvider>
);

// Main Provider with Role logic
export const MainProvider = ({ children, role }) => {
  const getRoleProviders = (userRole) => {
    switch (userRole) {
      case "Admin":
        return SuperAdminProviders;
      case "CommunityAdmin":        
        return CommunityAdminProviders; 
      case "Seller":
        return SellerProviders;
      case "BoatOwner":
        return BoatOwnerProviders;
      default:
        return ({ children }) => <>{children}</>;
    }
  };

  const RoleProviders = getRoleProviders(role);

  return (
    <AuthProvider>
      <AppProviders>
        <RoleProviders>{children}</RoleProviders>
      </AppProviders>
    </AuthProvider>
  );
};

export default MainProvider;