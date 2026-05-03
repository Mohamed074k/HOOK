import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import Router from "./Router";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext"; 
import { CartProvider } from "./context/CartContext"; 
import { BoatProvider } from "./context/BOAT_OWNER_CONTEXT/BoatContext"; 
import { TripProvider } from "./context/BOAT_OWNER_CONTEXT/TripContext"; 
import { BookingProvider } from "./context/BOAT_OWNER_CONTEXT/BookingContext"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
    <ProfileProvider>
    <CartProvider>
      <BoatProvider>
      <TripProvider>
      <BookingProvider>
        <Router />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1a1a2e",
              color: "#fff",
              border: "1px solid #A02625",
            },
          }}
        />
      </BookingProvider>
      </TripProvider>
      </BoatProvider>
      </CartProvider>
      </ProfileProvider>
    </AuthProvider>
  </StrictMode>
);