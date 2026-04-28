import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Role → default dashboard path ───────────────────────────────────────────
const ROLE_DEFAULTS = {
  Admin: "/super-admin",
  Seller: "/seller",
  BoatOwner: "/boat-owner",
  User: "/",
};

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#A02625" }}>
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize user.role to always be an array
  const userRoles = Array.isArray(user.role) ? user.role : [user.role].filter(Boolean);

  // Check if any of the user's roles match the allowed roles
  const hasAllowedRole = allowedRoles.length === 0 || allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAllowedRole) {
    // Redirect to the user's primary role dashboard
    const primaryRole = userRoles[0]; 
    const fallback = ROLE_DEFAULTS[primaryRole] ?? "/";
    return <Navigate to={fallback} replace />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;