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

  const createSeason = async (data) => {
    setActionLoading(true);
    try {
      await SeasonsService.addSeason(data);
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
      await SeasonsService.updateSeason(id, data);
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
    <ProhibitedSeasonsContext.Provider
      value={{
        seasons,
        loading,
        actionLoading,
        fetchSeasons,
        createSeason,
        editSeason,
        removeSeason,
        bulkUpload
      }}
    >
      {children}
    </ProhibitedSeasonsContext.Provider>
  );
};