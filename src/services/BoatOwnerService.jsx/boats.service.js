import apiClient from "../../api/apiClient";

// ─── Get All Boats for Current Boat Owner ───────────────────────────────────
export const getMyBoats = async () => {
  const { data } = await apiClient.get("/api/Boats/boatowner/my-boats");
  return data;
};

// ─── Get Boat by ID ────────────────────────────────────────────
export const getBoatById = async (id) => {
  const { data } = await apiClient.get(`/api/Boats/Admin-BoatOwner/${id}`);
  return data;
};

// ─── Create New Boat (with images) ─────────────────────────────────────────
export const createBoat = async (formData) => {
  const { data } = await apiClient.post("/api/Boats/boatowner/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ─── Update Boat Basic Info (Name, Description, Capacity) ─────────────────
export const updateBoat = async (id, formData) => {
  const { data } = await apiClient.put(`/api/Boats/boatowner/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ─── Update Boat Images Only ───────────────────────────────────────────────
export const updateBoatImages = async (id, formData) => {
  const { data } = await apiClient.put(`/api/Boats/boatowner/${id}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ─── Delete Boat ───────────────────────────────────────────────────────────
export const deleteBoat = async (id) => {
  const { data } = await apiClient.delete(`/api/Boats/boatowner/delete/${id}`);
  return data;
};