import apiClient from "../../api/apiClient";

export const getLocations = async () => {
  const { data } = await apiClient.get("/api/admin/fishguard/locations");
  return data;
};

export const getLocationDetails = async (id) => {
  const { data } = await apiClient.get(`/api/admin/fishguard/locations/${id}`);
  return data;
};

export const addLocation = async (locationData) => {
  const { data } = await apiClient.post("/api/admin/fishguard/locations", locationData);
  return data;
};

export const updateLocation = async (id, locationData) => {
  const { data } = await apiClient.put(`/api/admin/fishguard/locations/${id}`, locationData);
  return data;
};

export const deleteLocation = async (id) => {
  const { data } = await apiClient.delete(`/api/admin/fishguard/locations/${id}`);
  return data;
};

  export const uploadLocationsJson = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const { data } = await apiClient.post("/api/admin/fishguard/locations/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};