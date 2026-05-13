// Router.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// ─── Auth guard ──────────────────────────────────────────────────────────────
import ProtectedRoute from "./components/ProtectedRoute";

// ─── Layouts ─────────────────────────────────────────────────────────────────
import AppLayout from "./layouts/AppLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SellerLayout from "./layouts/SellerLayout";
import BoatOwnerLayout from "./layouts/BoatOwnerLayout";

// ─── Shared Pages ─────────────────────────────────────────────────────────────
import NotFoundPage from "./pages/NotFoundPage";

// ─── App (User) Pages ─────────────────────────────────────────────────────────
import HomePage from "./pages/APP_PAGES/HomePage";
import LoginPage from "./pages/APP_PAGES/LoginPage";
import RegisterPage from "./pages/APP_PAGES/RegisterPage";
import TripsPage from "./pages/APP_PAGES/TripsPage";
import TripDetailsPage from "./pages/APP_PAGES/TripDetailsPage";
import BookingPage from "./pages/APP_PAGES/BookingPage";
import MarketplacePage from "./pages/APP_PAGES/MarketplacePage";
import CommunityPage from "./pages/APP_PAGES/CommunityPage";
import ProfilePage from "./pages/APP_PAGES/ProfilePage";
import CartPage from "./pages/APP_PAGES/CartPage";

// ─── Super Admin Pages ────────────────────────────────────────────────────────
import SuperAdminDashboard from "./pages/SUPER_ADMIN_PAGES/SuperAdminDashboard";
import UsersManagement from "./pages/SUPER_ADMIN_PAGES/UsersManagement";
import TripsManagement from "./pages/SUPER_ADMIN_PAGES/TripsManagement";
import BoatsManagement from "./pages/SUPER_ADMIN_PAGES/BoatsManagement";
import BookingsManagement from "./pages/SUPER_ADMIN_PAGES/BookingsManagement";
import ProductsManagement from "./pages/SUPER_ADMIN_PAGES/ProductsManagement";
import OrdersManagement from "./pages/SUPER_ADMIN_PAGES/OrdersManagement";
import CommunityManagement from "./pages/SUPER_ADMIN_PAGES/CommunityManagement";
import AnalyticsPage from "./pages/SUPER_ADMIN_PAGES/AnalyticsPage";
import AdminSettingsPage from "./pages/SUPER_ADMIN_PAGES/AdminSettingsPage";
import SellersManagement from "./pages/SUPER_ADMIN_PAGES/SellersManagement";
import FishingGuidesManagement from "./pages/SUPER_ADMIN_PAGES/FishingGuidesManagement";

// ─── Seller Pages ─────────────────────────────────────────────────────────────
import SellerDashboard from "./pages/SELLER_PAGES/SellerDashboard";
import ProductsPage from "./pages/SELLER_PAGES/ProductsPage";
import AddProductPage from "./pages/SELLER_PAGES/AddProductPage";
import ProductDetailsPage from "./pages/SELLER_PAGES/ProductDetailsPage";
import OrdersPage from "./pages/SELLER_PAGES/OrdersPage";
import EarningsPage from "./pages/SELLER_PAGES/EarningsPage";
import SellerReviewsPage from "./pages/SELLER_PAGES/SellerReviewsPage";
import SellerSettingsPage from "./pages/SELLER_PAGES/SellerSettingsPage";

// ─── Boat Owner Pages ──────────────────────────────────────────────────────
import GuideDashboard from "./pages/BOAT_OWNER_PAGES/GuideDashboard";
import GuideTripsPage from "./pages/BOAT_OWNER_PAGES/GuideTripsPage";
import GuideBoatsPage from "./pages/BOAT_OWNER_PAGES/GuideBoatsPage";
import GuideBookingsPage from "./pages/BOAT_OWNER_PAGES/GuideBookingsPage";
import GuideSettingsPage from "./pages/BOAT_OWNER_PAGES/GuideSettingsPage";

// ─── Main Provider ────────────────────────────────────────────────────────────
import { MainProvider } from "./providers/AppProviders.jsx";

// Route wrapper component for dashboards
const DashboardRoute = ({ element, requiredRole }) => {
  return (
    <MainProvider role={requiredRole}>
      <ProtectedRoute requiredRole={requiredRole}>{element}</ProtectedRoute>
    </MainProvider>
  );
};

// Public Route wrapper
const PublicRoute = ({ element }) => {
  return <MainProvider>{element}</MainProvider>;
};

// ─── Router Config ────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  // ── Public Auth Pages ──────────────────────────────────────────────────────
  { path: "/login", element: <PublicRoute element={<LoginPage />} /> },
  { path: "/register", element: <PublicRoute element={<RegisterPage />} /> },

  // ── App (User) Routes — publicly accessible ───────────────────────────────
  {
    path: "/",
    element: <PublicRoute element={<AppLayout />} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "trips", element: <TripsPage /> },
      { path: "trip/:id", element: <TripDetailsPage /> },
      { path: "trip/:id/book", element: <BookingPage /> },
      { path: "marketplace", element: <MarketplacePage /> },
      { path: "community", element: <CommunityPage /> },
      { path: "cart", element: <CartPage /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute allowedRoles={["User", "Admin", "Seller", "BoatOwner"]}>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // ── Super Admin Routes ─────────────────────────────────────────────────────
  {
    path: "/super-admin",
    element: <DashboardRoute element={<SuperAdminLayout />} requiredRole="Admin" />,
    children: [
      { index: true, element: <SuperAdminDashboard /> },
      { path: "users", element: <UsersManagement /> },
      { path: "boat-owners", element: <FishingGuidesManagement /> },
      { path: "sellers", element: <SellersManagement /> },
      { path: "trips", element: <TripsManagement /> },
      { path: "boats", element: <BoatsManagement /> },
      { path: "bookings", element: <BookingsManagement /> },
      { path: "products", element: <ProductsManagement /> },
      { path: "orders", element: <OrdersManagement /> },
      { path: "community", element: <CommunityManagement /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "settings", element: <AdminSettingsPage /> },
    ],
  },

  // ── Seller Routes ──────────────────────────────────────────────────────────
  {
    path: "/seller",
    element: <DashboardRoute element={<SellerLayout />} requiredRole="Seller" />,
    children: [
      { index: true, element: <SellerDashboard /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/add", element: <AddProductPage /> },
      { path: "products/edit/:id", element: <AddProductPage /> },
      { path: "products/:id", element: <ProductDetailsPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "earnings", element: <EarningsPage /> },
      { path: "reviews", element: <SellerReviewsPage /> },
      { path: "settings", element: <SellerSettingsPage /> },
    ],
  },

  // ── Boat Owner Routes ──────────────────────────────────────────────────────
  {
    path: "/boat-owner",
    element: <DashboardRoute element={<BoatOwnerLayout />} requiredRole="BoatOwner" />,
    children: [
      { index: true, element: <GuideDashboard /> },
      { path: "trips", element: <GuideTripsPage /> },
      { path: "trips/add", element: <GuideTripsPage /> },
      { path: "boats", element: <GuideBoatsPage /> },
      { path: "bookings", element: <GuideBookingsPage /> },
      { path: "settings", element: <GuideSettingsPage /> },
    ],
  },

  // ── 404 Catch-All ──────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;