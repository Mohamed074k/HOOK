// src/services/BoatOwnerService/trips.service.js
import apiClient from "../../api/apiClient";

// ─── Get All Trips for Current Boat Owner ───────────────────────────────────
export const getMyTrips = async () => {
  const { data } = await apiClient.get("/api/Trips/boatowner/my-trips");
  return data;
};

// ─── Get Trip by ID ─────────────────────────────────────────────────────────
export const getTripById = async (id) => {
  const { data } = await apiClient.get(`/api/Trips/allroles/${id}`);
  return data;
};

// ─── Create New Trip (with images) ──────────────────────────────────────────
export const createTrip = async (formData) => {
  const { data } = await apiClient.post("/api/Trips/boatowner/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ─── Update Trip Basic Info ─────────────────────────────────────────────────
export const updateTrip = async (id, formData) => {
  const { data } = await apiClient.put(`/api/Trips/boatowner/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ─── Update Trip Images Only ────────────────────────────────────────────────
export const updateTripImages = async (id, formData) => {
  const { data } = await apiClient.put(`/api/Trips/boatowner/${id}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ─── Add Dates to Trip ──────────────────────────────────────────────────────
export const addTripDates = async (id, datesData) => {
  const { data } = await apiClient.post(`/api/Trips/boatowner/add-dates/${id}`, datesData);
  return data;
};

// ─── Toggle Date Status ───────────────────────────────────
export const toggleDateStatus = async (dateId, isActive) => {
  const { data } = await apiClient.patch(`/api/Trips/boatowner/toggle-date-status/${dateId}?isActive=${isActive}`);
  return data;
};

// ─── Delete Trip ────────────────────────────────────────────────────────────
export const deleteTrip = async (id) => {
  const { data } = await apiClient.delete(`/api/Trips/boatowner/delete/${id}`);
  return data;
};