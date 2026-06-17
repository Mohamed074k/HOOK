import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as communityService from "../../services/communityService";
import { toast } from "react-hot-toast";
import { useAuth } from "./../../context/AuthContext";

const CommunityContext = createContext(null);

export const CommunityProvider = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]); // <-- We will expose setPosts
  const [sidebarData, setSidebarData] = useState({ boatOwners: [], sellers: [], boats: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [feedType, setFeedType] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchSidebarData = async () => {
    if (!user) return;
    try {
      const [owners, sellers, boats] = await Promise.all([
        communityService.getTopBoatOwners(),
        communityService.getTopSellers(),
        communityService.getTopBoats()
      ]);
      setSidebarData({ boatOwners: owners, sellers, boats });
    } catch (error) {
      console.error("Failed to load sidebar data");
    }
  };

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const params = categoryFilter ? { category: categoryFilter } : {};
      let data = [];
      
      if (feedType === "latest") data = await communityService.getLatestFeed(params);
      else if (feedType === "trending") data = await communityService.getTrendingFeed(params);
      else if (feedType === "following") data = await communityService.getFollowingFeed(params);

      setPosts(data);
    } catch (error) {
      toast.error("Failed to load feed");
    } finally {
      setIsLoading(false);
    }
  }, [feedType, categoryFilter, user]);

  useEffect(() => {
    fetchSidebarData();
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <CommunityContext.Provider value={{ 
      posts, setPosts, // <-- Exposed setPosts here
      sidebarData, isLoading, feedType, setFeedType, categoryFilter, setCategoryFilter, fetchPosts 
    }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used inside <CommunityProvider>");
  return ctx;
};