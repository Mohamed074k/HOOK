import apiClient from "../../api/apiClient";

export const getSeasons = async () => {
  const { data } = await apiClient.get("/api/admin/fishguard/seasons");
  return data;
};

export const getSeasonDetails = async (id) => {
  const { data } = await apiClient.get(`/api/admin/fishguard/seasons/${id}`);
  return data;
};

export const addSeason = async (seasonData) => {
  const { data } = await apiClient.post("/api/admin/fishguard/seasons", seasonData);
  return data;
};

export const updateSeason = async (id, seasonData) => {
  const { data } = await apiClient.put(`/api/admin/fishguard/seasons/${id}`, seasonData);
  return data;
};

export const deleteSeason = async (id) => {
  const { data } = await apiClient.delete(`/api/admin/fishguard/seasons/${id}`);
  return data;
};

export const uploadSeasonsJson = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const { data } = await apiClient.post("/api/admin/fishguard/seasons/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};