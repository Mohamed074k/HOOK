import apiClient from "../../api/apiClient";

export const getTools = async () => {
  const { data } = await apiClient.get("/api/admin/fishguard/tools");
  return data;
};

export const getToolDetails = async (id) => {
  const { data } = await apiClient.get(`/api/admin/fishguard/tools/${id}`);
  return data;
};

export const addTool = async (toolData) => {
  const { data } = await apiClient.post("/api/admin/fishguard/tools", toolData);
  return data;
};

export const updateTool = async (id, toolData) => {
  const { data } = await apiClient.put(`/api/admin/fishguard/tools/${id}`, toolData);
  return data;
};

export const deleteTool = async (id) => {
  const { data } = await apiClient.delete(`/api/admin/fishguard/tools/${id}`);
  return data;
};

export const uploadToolsJson = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const { data } = await apiClient.post("/api/admin/fishguard/tools/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};