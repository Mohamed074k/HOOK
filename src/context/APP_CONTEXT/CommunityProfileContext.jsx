// src/context/APP_CONTEXT/CommunityProfileContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import * as profileService from "../../services/communityProfileService";
import { toast } from "react-hot-toast";

const CommunityProfileContext = createContext(null);

export const CommunityProfileProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const fetchProfileTabFeed = useCallback(async (tab, userId, isCurrentUser) => {
    setIsLoading(true);
    try {
      let data = [];
      if (tab === "posts") {
        data = isCurrentUser 
          ? await profileService.getMyPosts() 
          : await profileService.getUserPosts(userId);
      } else if (tab === "liked") {
        data = await profileService.getLikedPosts(isCurrentUser ? null : userId);
      } else if (tab === "saved" && isCurrentUser) {
        data = await profileService.getSavedPosts();
      } else if (tab === "supported") {
        data = await profileService.getSupportedComplaints(isCurrentUser ? null : userId);
      }
      setPosts(data || []);
    } catch (error) {
      toast.error("Failed to load feed");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProfileData = useCallback(async (userId, isCurrentUser) => {
    setIsProfileLoading(true);
    try {
      const data = isCurrentUser
        ? await profileService.getCurrentUserProfile()
        : await profileService.getUserProfile(userId);
      setProfileData(data);
    } catch (error) {
      toast.error("Failed to load profile details");
      setProfileData(null);
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  return (
    <CommunityProfileContext.Provider value={{ 
      posts, setPosts, isLoading, fetchProfileTabFeed,
      profileData, setProfileData, isProfileLoading, fetchProfileData
    }}>
      {children}
    </CommunityProfileContext.Provider>
  );
};

export const useCommunityProfile = () => {
  const ctx = useContext(CommunityProfileContext);
  if (!ctx) throw new Error("useCommunityProfile must be used inside <CommunityProfileProvider>");
  return ctx;
};