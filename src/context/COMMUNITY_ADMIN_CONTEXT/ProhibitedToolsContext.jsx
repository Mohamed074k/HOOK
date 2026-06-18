import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import * as ToolsService from "../../services/CommunityAdminServices/prohibitedTools.service";

const ProhibitedToolsContext = createContext();

export const useProhibitedTools = () => useContext(ProhibitedToolsContext);

export const ProhibitedToolsProvider = ({ children }) => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTools = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ToolsService.getTools();
      // Sort so the newest added tools (highest ID) appear at the top!
      const sortedData = (data || []).sort((a, b) => b.id - a.id);
      setTools(sortedData);
    } catch (error) {
      console.error("Error fetching tools:", error);
      toast.error("Failed to load prohibited tools");
    } finally {
      setLoading(false);
    }
  }, []);

  // Format exactly matching the POST/PUT Swagger body
  const preparePayload = (data) => {
    return {
      name: data.name,
      type: data.type || "string",
      description: data.description,
      material: data.material || "string",
      isActive: data.isActive,
      minMeshSizeCm: data.minMeshSizeCm ? Number(data.minMeshSizeCm) : 0,
      maxLengthMeters: data.maxLengthMeters ? Number(data.maxLengthMeters) : 0,
      banReason: data.banReason || "string"
    };
  };

  const createTool = async (data) => {
    setActionLoading(true);
    try {
      await ToolsService.addTool(preparePayload(data));
      toast.success("Tool added successfully");
      await fetchTools();
      return true;
    } catch (error) {
      console.error("Error adding tool:", error);
      toast.error(error.response?.data?.message || "Failed to add tool");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const editTool = async (id, data) => {
    setActionLoading(true);
    try {
      await ToolsService.updateTool(id, preparePayload(data));
      toast.success("Tool updated successfully");
      await fetchTools();
      return true;
    } catch (error) {
      console.error("Error updating tool:", error);
      toast.error(error.response?.data?.message || "Failed to update tool");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const removeTool = async (id) => {
    setActionLoading(true);
    try {
      await ToolsService.deleteTool(id);
      toast.success("Tool deleted successfully");
      await fetchTools();
      return true;
    } catch (error) {
      console.error("Error deleting tool:", error);
      toast.error("Failed to delete tool");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const bulkUpload = async (file) => {
    setActionLoading(true);
    try {
      await ToolsService.uploadToolsJson(file);
      toast.success("Tools imported successfully");
      await fetchTools();
      return true;
    } catch (error) {
      console.error("Error uploading JSON:", error);
      toast.error(error.response?.data?.message || "Failed to upload file. Check format.");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProhibitedToolsContext.Provider value={{ tools, loading, actionLoading, fetchTools, createTool, editTool, removeTool, bulkUpload }}>
      {children}
    </ProhibitedToolsContext.Provider>
  );
};