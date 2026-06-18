import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import * as SeasonsService from "../../services/CommunityAdminServices/prohibitedSeasons.service";

const ProhibitedSeasonsContext = createContext();

export const useProhibitedSeasons = () => useContext(ProhibitedSeasonsContext);

export const ProhibitedSeasonsProvider = ({ children }) => {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSeasons = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SeasonsService.getSeasons();
      setSeasons(data || []);
    } catch (error) {
      console.error("Error fetching seasons:", error);
      toast.error("Failed to load prohibited seasons");
    } finally {
      setLoading(false);
    }
  }, []);

  const preparePayload = (data) => {
    return {
      seasonName: data.seasonName,
      // Ensure date is valid ISO string for backend
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      region: data.region || "string", // fallback to prevent empty string errors if backend requires it
      reason: data.reason || "string",
      // Convert comma separated string back to array of strings
      restrictedFishSpecies: data.restrictedFishSpecies
        ? data.restrictedFishSpecies.split(",").map(s => s.trim()).filter(Boolean)
        : [],
      bannedTools: data.bannedTools
        ? data.bannedTools.split(",").map(s => s.trim()).filter(Boolean)
        : [],
      isStrictlyEnforced: data.isStrictlyEnforced
    };
  };

  const createSeason = async (data) => {
    setActionLoading(true);
    try {
      await SeasonsService.addSeason(preparePayload(data));
      toast.success("Season added successfully");
      await fetchSeasons();
      return true;
    } catch (error) {
      console.error("Error adding season:", error);
      toast.error(error.response?.data?.message || "Failed to add season");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const editSeason = async (id, data) => {
    setActionLoading(true);
    try {
      await SeasonsService.updateSeason(id, preparePayload(data));
      toast.success("Season updated successfully");
      await fetchSeasons();
      return true;
    } catch (error) {
      console.error("Error updating season:", error);
      toast.error(error.response?.data?.message || "Failed to update season");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const removeSeason = async (id) => {
    setActionLoading(true);
    try {
      await SeasonsService.deleteSeason(id);
      toast.success("Season deleted successfully");
      await fetchSeasons();
      return true;
    } catch (error) {
      console.error("Error deleting season:", error);
      toast.error("Failed to delete season");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const bulkUpload = async (file) => {
    setActionLoading(true);
    try {
      await SeasonsService.uploadSeasonsJson(file);
      toast.success("Seasons imported successfully");
      await fetchSeasons();
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
    <ProhibitedSeasonsContext.Provider value={{ seasons, loading, actionLoading, fetchSeasons, createSeason, editSeason, removeSeason, bulkUpload }}>
      {children}
    </ProhibitedSeasonsContext.Provider>
  );
};