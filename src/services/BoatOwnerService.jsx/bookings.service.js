import apiClient from "../../api/apiClient";

// Get all bookings for boat owner (with optional filters)
export const getBoatOwnerBookings = async (filters = {}) => {
  const { status, location, date } = filters;
  const params = new URLSearchParams();
  
  if (status !== undefined && status !== null) params.append("Status", status);
  if (location) params.append("Location", location);
  if (date) params.append("Date", date);
  
  const queryString = params.toString();
  const url = `/api/Bookings/boatowner/GetAll${queryString ? `?${queryString}` : ''}`;
  
  const { data } = await apiClient.get(url);
  return data;
};

// Get booking statistics
export const getBookingStats = async () => {
  const { data } = await apiClient.get("/api/Bookings/boatowner/stats");
  return data;
};

// Update booking status
export const updateBookingStatus = async (id, status) => {
  const { data } = await apiClient.patch(`/api/Bookings/boatowner/update-status/${id}`, { status });
  return data;
};

// Get single booking by ID (if needed)
export const getBookingById = async (id) => {
  const { data } = await apiClient.get(`/api/Bookings/boatowner/${id}`);
  return data;
};