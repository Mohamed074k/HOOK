import React from "react";

// Contexts
import { AuthProvider } from "../context/AuthContext";
import { ProfileProvider } from "../context/ProfileContext";
import { CartProvider } from "../context/CartContext";

// BOAT OWNER CONTEXTS
import { BoatProvider } from "../context/BOAT_OWNER_CONTEXT/BoatContext";
import { TripProvider } from "../context/BOAT_OWNER_CONTEXT/TripContext";
import { BookingProvider } from "../context/BOAT_OWNER_CONTEXT/BookingContext";

// SUPER ADMIN CONTEXTS
import { SellerProvider } from "../context/SUPER_ADMIN_CONTEXT/SellersContext";
import { SuperAdminProductProvider } from "../context/SUPER_ADMIN_CONTEXT/ProductContext";

// SELLER CONTEXTS
import { ProductProvider } from "../context/SELLER_CONTEXT/ProductContext";

// Protected Route Component
import ProtectedRoute from "../components/ProtectedRoute";

// Role-based Providers
const BoatOwnerProviders = ({ children }) => (
  <BoatProvider>
    <TripProvider>
      <BookingProvider>{children}</BookingProvider>
    </TripProvider>
  </BoatProvider>
);

// Seller Providers
const SellerProviders = ({ children }) => (
  <SellerProvider>
    <ProductProvider>{children}</ProductProvider>
  </SellerProvider>
);

// Super Admin Providers
const SuperAdminProviders = ({ children }) => (
  <SellerProvider>
    <SuperAdminProductProvider>{children}</SuperAdminProductProvider>
  </SellerProvider>
);

// App Providers for public pages (all users)
const AppProviders = ({ children }) => (
  <ProfileProvider>
    <CartProvider>{children}</CartProvider>
  </ProfileProvider>
);

// Main Provider with Role logic
export const MainProvider = ({ children, role }) => {
  const getRoleProviders = (userRole) => {
    switch (userRole) {
      case "Admin":
        return SuperAdminProviders;
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