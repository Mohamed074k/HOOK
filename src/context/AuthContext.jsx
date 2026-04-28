import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as authService from "../services/authService";

// ─── Role Claim Key (Microsoft Identity Schema) ───────────────────────────────
const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Helper: decode token → user object ──────────────────────────────────────
const decodeUser = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.sub || decoded.nameid || decoded.id,
      email: decoded.email,
      firstName: decoded.given_name || decoded.firstName,
      lastName: decoded.family_name || decoded.lastName,
      role: decoded[ROLE_CLAIM] || decoded.role || null,
    };
  } catch {
    return null;
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeUser(token);
      // Check token expiry
      if (decoded) {
        try {
          const { exp } = jwtDecode(token);
          if (exp * 1000 > Date.now()) {
            setUser(decoded);
          } else {
            // Token expired — wipe storage
            localStorage.clear();
          }
        } catch {
          localStorage.clear();
        }
      }
    }
    setIsLoading(false);
  }, []);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const data = await authService.login(email, password);

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);

    // Persist extra profile fields that aren't in the JWT
    localStorage.setItem("userProfile", JSON.stringify({
      id: data.id,
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      governorate: data.governorate,
      profilePictureUrl: data.profilePictureUrl,
    }));

    const decoded = decodeUser(data.token);
    setUser(decoded);

    return decoded; // caller can use decoded.role for navigation
  };

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default AuthContext;
