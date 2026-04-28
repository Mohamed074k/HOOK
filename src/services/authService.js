import apiClient from "../api/apiClient";

// ─── Login ───────────────────────────────────────────────────────────────────
 export const login = async (email, password) => {
  const { data } = await apiClient.post("/Auth/allroles/login", { email, password });
  return data;
};

// ─── Refresh Token ────────────────────────────────────────────────────────────
 export const refreshToken = async (token, refreshToken) => {
  const { data } = await apiClient.post("/Auth/allroles/refresh", {
    token,
    refreshToken,
  });
  return data;
};

// ─── Register ────────────────────────────────────────────────────────────────
 export const register = async (userData) => {
  const { data } = await apiClient.post("/Auth/allroles/register", userData);
  return data;
};

// ─── Resend Confirmation Email ───────────────────────────────────────────────
 export const resendConfirmation = async (email) => {
  const { data } = await apiClient.post(
    "/Auth/allroles/resend-confirmation-email",
    { email }
  );
  return data;
};