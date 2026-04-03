import { createBrowserRouter, RouterProvider } from "react-router-dom";

// ─── Layouts ────────────────────────────────────────────────────────────────
import AppLayout from "./layouts/AppLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SellerLayout from "./layouts/SellerLayout";
import FishingGuideLayout from "./layouts/FishingGuideLayout";

// ─── Shared Pages ────────────────────────────────────────────────────────────
import NotFoundPage from "./pages/NotFoundPage";

// ─── App (User) Pages ────────────────────────────────────────────────────────
import HomePage from "./pages/APP_PAGES/HomePage";
import LoginPage from "./pages//APP_PAGES/LoginPage";
import RegisterPage from "./pages//APP_PAGES/RegisterPage";
import TripsPage from "./pages/APP_PAGES/TripsPage";
import MarketplacePage from "./pages/APP_PAGES/MarketplacePage";
import CommunityPage from "./pages/APP_PAGES/CommunityPage";
import ProfilePage from "./pages/APP_PAGES/ProfilePage";

// ─── Super Admin Pages ───────────────────────────────────────────────────────
import SuperAdminDashboard from "./pages/SUPER_ADMIN_PAGES/SuperAdminDashboard";
import UsersManagement from "./pages/SUPER_ADMIN_PAGES/UsersManagement";
import TripsManagement from "./pages/SUPER_ADMIN_PAGES/TripsManagement";
import BoatsManagement from "./pages/SUPER_ADMIN_PAGES/BoatsManagement";
import BookingsManagement from "./pages/SUPER_ADMIN_PAGES/BookingsManagement";
import ProductsManagement from "./pages/SUPER_ADMIN_PAGES/ProductsManagement";
import OrdersManagement from "./pages/SUPER_ADMIN_PAGES/OrdersManagement";
import CommunityManagement from "./pages/SUPER_ADMIN_PAGES/CommunityManagement";
// import ReportsComplaints from "./pages/SUPER_ADMIN_PAGES/ReportsComplaints";
import AnalyticsPage from "./pages/SUPER_ADMIN_PAGES/AnalyticsPage";
 import AdminSettingsPage from "./pages/SUPER_ADMIN_PAGES/AdminSettingsPage";
import SellersManagement from "./pages/SUPER_ADMIN_PAGES/SellersManagement";
import FishingGuidesManagement from "./pages/SUPER_ADMIN_PAGES/FishingGuidesManagement";

// ─── Seller Pages ────────────────────────────────────────────────────────────
import SellerDashboard from "./pages/SELLER_PAGES/SellerDashboard";
import ProductsPage from "./pages/SELLER_PAGES/ProductsPage";
import AddProductPage from "./pages/SELLER_PAGES/AddProductPage";
import ProductDetailsPage from "./pages/SELLER_PAGES/ProductDetailsPage";
import OrdersPage from "./pages/SELLER_PAGES/OrdersPage";
import EarningsPage from "./pages/SELLER_PAGES/EarningsPage"; 
import SellerReviewsPage from "./pages/SELLER_PAGES/SellerReviewsPage";
import SellerSettingsPage from "./pages/SELLER_PAGES/SellerSettingsPage";

// ─── Fishing Guide Pages ─────────────────────────────────────────────────────
import GuideDashboard from "./pages/FISHSING_GUIDE_PAGES/GuideDashboard";
import GuideTripsPage from "./pages/FISHSING_GUIDE_PAGES/GuideTripsPage";
import GuideBoatsPage from "./pages/FISHSING_GUIDE_PAGES/GuideBoatsPage";
import GuideBookingsPage from "./pages/FISHSING_GUIDE_PAGES/GuideBookingsPage";
import GuideReviewsPage from "./pages/FISHSING_GUIDE_PAGES/GuideReviewsPage";
import GuideSettingsPage from "./pages/FISHSING_GUIDE_PAGES/GuideSettingsPage";

// ─── Router Config ───────────────────────────────────────────────────────────
const router = createBrowserRouter([
  // ── Shared Auth Pages ──────────────────────────────────────────────────────
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // ── App (User) Routes  ─────────────────────────────────────────────────────
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true,          element: <HomePage /> },
       { path: "trips",        element: <TripsPage /> },
      { path: "marketplace",  element: <MarketplacePage /> },
      { path: "community",    element: <CommunityPage /> },
      { path: "profile",      element: <ProfilePage /> },
    ],
  },

  // ── Super Admin Routes ─────────────────────────────────────────────────────
  {
    path: "/super-admin",
    element: <SuperAdminLayout />,
    children: [
       { index: true,                          element: <SuperAdminDashboard /> },
       { path: "users",                        element: <UsersManagement /> },
       { path: "fishing-guides",               element: <FishingGuidesManagement /> },
       { path: "sellers",                      element: <SellersManagement /> },
       { path: "trips",                        element: <TripsManagement /> },
       { path: "boats",                        element: <BoatsManagement /> },
       { path: "bookings",                     element: <BookingsManagement /> },
       { path: "products",                     element: <ProductsManagement /> },
       { path: "orders",                       element: <OrdersManagement /> },
       { path: "community",                    element: <CommunityManagement /> },
        { path: "analytics",                    element: <AnalyticsPage /> },
        { path: "settings",                     element: <AdminSettingsPage /> },
    ],
  },

  // ── Seller Routes ──────────────────────────────────────────────────────────
  {
    path: "/seller",
    element: <SellerLayout />,
    children: [
      { index: true,                  element: <SellerDashboard /> },
      { path: "products",             element: <ProductsPage /> },
      { path: "products/add",         element: <AddProductPage /> },
      { path: "products/edit/:id",    element: <AddProductPage /> }, 
      { path: "products/:id",         element: <ProductDetailsPage /> },
      { path: "orders",               element: <OrdersPage /> },
      { path: "earnings",             element: <EarningsPage /> },    
      { path: "reviews",              element: <SellerReviewsPage /> },
      { path: "settings",             element: <SellerSettingsPage /> },
    ],
  },

  // ── Fishing Guide Routes ───────────────────────────────────────────────────
  {
    path: "/fishing-guide",
    element: <FishingGuideLayout />,
    children: [
      { index: true,                  element: <GuideDashboard /> },
      { path: "trips",                element: <GuideTripsPage /> },
      { path: "trips/add",            element: <GuideTripsPage /> },  
      { path: "boats",                element: <GuideBoatsPage /> },
      { path: "bookings",             element: <GuideBookingsPage /> },
      { path: "reviews",              element: <GuideReviewsPage /> },
      { path: "settings",             element: <GuideSettingsPage /> },
    ],
  },

  // ── 404 Catch-All ──────────────────────────────────────────────────────────
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;