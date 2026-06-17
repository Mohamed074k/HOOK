import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import * as LocationsService from "../../services/CommunityAdminServices/prohibitedLocations.service";

const ProhibitedLocationsContext = createContext();

export const useProhibitedLocations = () => useContext(ProhibitedLocationsContext);

export const ProhibitedLocationsProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await LocationsService.getLocations();
      setLocations(data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load prohibited locations");
    } finally {
      setLoading(false);
    }
  }, []);

  const createLocation = async (data) => {
    setActionLoading(true);
    try {
      await LocationsService.addLocation(data);
      toast.success("Location added successfully");
      await fetchLocations();
      return true;
    } catch (error) {
      console.error("Error adding location:", error);
      toast.error(error.response?.data?.message || "Failed to add location");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const editLocation = async (id, data) => {
    setActionLoading(true);
    try {
      await LocationsService.updateLocation(id, data);
      toast.success("Location updated successfully");
      await fetchLocations();
      return true;
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error(error.response?.data?.message || "Failed to update location");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const removeLocation = async (id) => {
    setActionLoading(true);
    try {
      await LocationsService.deleteLocation(id);
      toast.success("Location deleted successfully");
      await fetchLocations();
      return true;
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const bulkUpload = async (file) => {
    setActionLoading(true);
    try {
      await LocationsService.uploadLocationsJson(file);
      toast.success("Locations imported successfully");
      await fetchLocations();
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
    <ProhibitedLocationsContext.Provider
      value={{
        locations,
        loading,
        actionLoading,
        fetchLocations,
        createLocation,
        editLocation,
        removeLocation,
        bulkUpload
      }}
    >
      {children}
    </ProhibitedLocationsContext.Provider>
  );
};