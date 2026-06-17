import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { MapPin, Grid, Bookmark, Heart, HandHeart, UserPlus, Check, Loader2, Award, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCommunityProfile } from "../../context/APP_CONTEXT/CommunityProfileContext";
import { followUser, unfollowUser } from "../../services/communityService";
import { 
  getMyFollowers, getMyFollowing, 
  getUserFollowers, getUserFollowing,
  getUnreadNotificationsCount
} from "../../services/communityProfileService";
import { toast } from "react-hot-toast";

import Breadcrumb from "../../components/APP_COMPONENTS/Breadcrumb";
import FollowModal from "../../components/APP_COMPONENTS/COMMUNITY_COMPONENTS/COMMUNIT_PROFILE_COMPONENTS/FollowModal";
import NotificationsModal from "../../components/APP_COMPONENTS/COMMUNITY_COMPONENTS/COMMUNIT_PROFILE_COMPONENTS/NotificationsModal";
import ProfilePosts from "../../components/APP_COMPONENTS/COMMUNITY_COMPONENTS/COMMUNIT_PROFILE_COMPONENTS/ProfilePosts";
import ProfileLiked from "../../components/APP_COMPONENTS/COMMUNITY_COMPONENTS/COMMUNIT_PROFILE_COMPONENTS/ProfileLiked";
import ProfileSaved from "../../components/APP_COMPONENTS/COMMUNITY_COMPONENTS/COMMUNIT_PROFILE_COMPONENTS/ProfileSaved";
import ProfileSupported from "../../components/APP_COMPONENTS/COMMUNITY_COMPONENTS/COMMUNIT_PROFILE_COMPONENTS/ProfileSupported";

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${import.meta.env.VITE_API_URL || 'https://hook.runasp.net'}${url}`;
};

const CommunityProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  
  const { 
    posts, isLoading, fetchProfileTabFeed, 
    profileData, setProfileData, isProfileLoading, fetchProfileData 
  } = useCommunityProfile();
  
  const isCurrentUser = !userId || userId === user?.id;
  const targetUserId = isCurrentUser ? user?.id : userId;

  const [activeTab, setActiveTab] = useState("posts");
  const [unreadCount, setUnreadCount] = useState(0);

  // Modals for followers/following lists & Notifications
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalConfig, setFollowModalConfig] = useState({ title: "", list: [] });
  const [isFollowListLoading, setIsFollowListLoading] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [userId]);

  // Fetch Unread Notifications Count (Refetches when Modal Closes)
  useEffect(() => {
    if (isCurrentUser && !isNotificationsOpen) {
      const fetchUnread = async () => {
        try {
          const count = await getUnreadNotificationsCount();
          setUnreadCount(count || 0);
        } catch (error) {
          console.error("Failed to load unread count", error);
        }
      };
      fetchUnread();
    }
  }, [isCurrentUser, isNotificationsOpen]);

  // 1. Fetch User Profile Data
  useEffect(() => {
    if (targetUserId) {
      fetchProfileData(targetUserId, isCurrentUser);
    }
  }, [targetUserId, isCurrentUser, fetchProfileData]);

  // 2. Fetch Feed based on Active Tab
  useEffect(() => {
    if (targetUserId) {
      fetchProfileTabFeed(activeTab, targetUserId, isCurrentUser);
    }
  }, [activeTab, targetUserId, isCurrentUser, fetchProfileTabFeed]);

  const handleFollowToggle = async () => {
    if (!profileData) return;
    try {
      if (profileData.isFollowing) {
        await unfollowUser(targetUserId);
        setProfileData(prev => ({ 
          ...prev, 
          isFollowing: false,
          followersCount: Math.max(0, prev.followersCount - 1)
        }));
        toast.success(`Unfollowed ${profileData.firstName}`);
      } else {
        await followUser(targetUserId);
        setProfileData(prev => ({ 
          ...prev, 
          isFollowing: true,
          followersCount: prev.followersCount + 1
        }));
        toast.success(`Following ${profileData.firstName}`);
      }
    } catch (error) {
      const code = error.response?.data?.code;
      if (code === "Community.AlreadyFollowing") { 
        setProfileData(prev => ({ ...prev, isFollowing: true })); 
      } else if (code === "Community.NotFollowing") { 
        setProfileData(prev => ({ ...prev, isFollowing: false })); 
      } else { 
        toast.error("Action failed"); 
      }
    }
  };

  const openFollowersModal = async () => {
    setFollowModalConfig({ title: "Followers", list: [] });
    setIsFollowModalOpen(true);
    setIsFollowListLoading(true);
    try {
      const data = isCurrentUser ? await getMyFollowers() : await getUserFollowers(targetUserId);
      setFollowModalConfig({ title: "Followers", list: data });
    } catch (error) {
      toast.error("Failed to load followers");
    } finally {
      setIsFollowListLoading(false);
    }
  };

  const openFollowingModal = async () => {
    setFollowModalConfig({ title: "Following", list: [] });
    setIsFollowModalOpen(true);
    setIsFollowListLoading(true);
    try {
      const data = isCurrentUser ? await getMyFollowing() : await getUserFollowing(targetUserId);
      setFollowModalConfig({ title: "Following", list: data });
    } catch (error) {
      toast.error("Failed to load following");
    } finally {
      setIsFollowListLoading(false);
    }
  };

  const tabs = [
    { id: "posts", label: "Posts", icon: Grid },
    { id: "liked", label: "Liked", icon: Heart },
    { id: "supported", label: "Supported", icon: HandHeart },
  ];
  if (isCurrentUser) tabs.push({ id: "saved", label: "Saved", icon: Bookmark });

  const breadcrumbItems = [
    { name: "Community", path: "/community", isLast: false },
    { name: "Profile", path: "#", isLast: true }
  ];

  // Custom Skeleton for Profile Loading
  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-[#001526] text-[#cee5ff] relative pb-20 pt-8 w-full">
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative">
          
          <div className="mb-6">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-4 bg-white/5 rounded animate-pulse" />
              <div className="w-4 h-4 bg-white/5 rounded animate-pulse" />
              <div className="w-20 h-4 bg-white/5 rounded animate-pulse" />
              <div className="w-4 h-4 bg-white/5 rounded animate-pulse" />
              <div className="w-16 h-4 bg-white/5 rounded animate-pulse" />
            </div>
          </div>

          <div className="bg-[#002238] border border-white/5 rounded-3xl p-4 sm:p-6 shadow-2xl mb-8 relative">
            <div className="flex justify-between items-start gap-4 mb-6">
              <div className="flex items-center gap-4 sm:gap-5 w-full min-w-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-[#001526] bg-white/5 animate-pulse shrink-0" />
                <div className="space-y-3 w-full">
                  <div className="w-32 sm:w-48 md:w-64 h-6 sm:h-8 md:h-10 bg-white/5 rounded-lg animate-pulse" />
                  <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
              <div className="w-10 h-10 sm:w-24 sm:h-10 rounded-xl bg-white/5 animate-pulse shrink-0 z-10" />
            </div>
            
            <div className="mb-6 space-y-3">
              <div className="w-full max-w-2xl h-4 bg-white/5 rounded animate-pulse" />
              <div className="w-3/4 max-w-xl h-4 bg-white/5 rounded animate-pulse" />
              <div className="flex gap-4 pt-2">
                <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
                <div className="w-32 h-4 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
            
            <div className="flex gap-8 py-4 border-t border-white/5">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center space-y-2">
                  <div className="w-10 h-6 bg-white/5 rounded mx-auto animate-pulse" />
                  <div className="w-16 h-3 bg-white/5 rounded mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-[#001526] flex items-center justify-center text-[#cee5ff]">
        <p>Profile not found.</p>
      </div>
    );
  }

  const fullName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();
  const firstInitial = profileData.firstName?.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-[#001526] text-[#cee5ff] relative pb-20 pt-8">
      <FollowModal 
        isOpen={isFollowModalOpen} 
        onClose={() => setIsFollowModalOpen(false)} 
        title={followModalConfig.title} 
        list={followModalConfig.list} 
        isLoading={isFollowListLoading}
      />
      
      <NotificationsModal 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative">
        
        <div className="mb-6">
          <Breadcrumb customItems={breadcrumbItems} />
        </div>

        <div className="bg-[#002238] border border-white/5 rounded-3xl p-4 sm:p-6 shadow-2xl mb-8 relative">
          
          {/* Main Top Header Section: Flexbox to prevent overlap */}
          <div className="flex justify-between items-start gap-3 sm:gap-4 mb-6">
            
            {/* Left side: Profile Picture & Name */}
            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
              {profileData.profilePictureUrl ? (
                <img 
                  src={getImageUrl(profileData.profilePictureUrl)} 
                  alt={fullName} 
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-[#001526] object-cover bg-[#001526] shadow-lg shrink-0" 
                />
              ) : (
                <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-[#001526] bg-sky-500/20 text-sky-400 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-black uppercase shadow-lg shrink-0">
                  {firstInitial}
                </div>
              )}

              <div className="break-words overflow-hidden min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight truncate">{fullName}</h1>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-medium text-sky-400 bg-sky-400/10 px-2 sm:px-2.5 py-0.5 rounded-lg border border-sky-400/20 flex items-center gap-1.5 w-fit">
                    <Award size={14}/> {profileData.rankTitle || "Member"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Action Button (Bell or Follow) */}
            <div className="shrink-0 z-10">
              {isCurrentUser ? (
                <button 
                  onClick={() => setIsNotificationsOpen(true)}
                  className="w-10 h-10 rounded-xl bg-[#001526] border border-white/5 flex items-center justify-center text-[#a3cbf2] hover:bg-sky-400/10 hover:text-sky-400 hover:border-sky-400/30 transition-all relative shadow-lg"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#001526]">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              ) : (
                <button 
                  onClick={handleFollowToggle} 
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    profileData.isFollowing 
                      ? "bg-[#001526] border border-white/10 text-white hover:bg-white/10" 
                      : "bg-sky-400 text-[#001526] hover:bg-sky-300 shadow-[0_0_15px_rgba(83,214,251,0.3)]"
                  }`}
                >
                  {profileData.isFollowing ? <><Check size={14} className="sm:w-4 sm:h-4" /> Following</> : <><UserPlus size={14} className="sm:w-4 sm:h-4" /> Follow</>}
                </button>
              )}
            </div>

          </div>

          <div className="mb-6">
            {profileData.bio && (
              <p className="text-[#a3cbf2] leading-relaxed mb-4 max-w-2xl text-sm sm:text-base">{profileData.bio}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#a3cbf2]/60">
              {profileData.governorate && (
                <div className="flex items-center gap-1.5"><MapPin size={14} className="text-sky-400/70"/> {profileData.governorate}</div>
              )}
            </div>
          </div>

          <div className="flex gap-4 sm:gap-8 py-4 border-t border-white/5">
            <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab("posts")}>
              <span className="block font-black text-lg sm:text-xl text-white">{profileData.postsCount || 0}</span>
              <span className="text-[10px] sm:text-xs text-[#a3cbf2]/50 uppercase tracking-wider font-bold">Posts</span>
            </div>
            <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={openFollowersModal}>
              <span className="block font-black text-lg sm:text-xl text-white">{profileData.followersCount || 0}</span>
              <span className="text-[10px] sm:text-xs text-[#a3cbf2]/50 uppercase tracking-wider font-bold">Followers</span>
            </div>
            <div className="text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={openFollowingModal}>
              <span className="block font-black text-lg sm:text-xl text-white">{profileData.followingCount || 0}</span>
              <span className="text-[10px] sm:text-xs text-[#a3cbf2]/50 uppercase tracking-wider font-bold">Following</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 border-b border-white/5 mb-6 px-2 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all relative shrink-0 ${activeTab === tab.id ? "text-sky-400" : "text-[#a3cbf2]/50 hover:text-[#a3cbf2]"}`}
            >
              <tab.icon size={14} className="sm:w-4 sm:h-4" /> {tab.label}
              {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400" />}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === "posts" && <ProfilePosts posts={posts} isLoading={isLoading} />}
          {activeTab === "liked" && <ProfileLiked posts={posts} isLoading={isLoading} />}
          {activeTab === "saved" && isCurrentUser && <ProfileSaved posts={posts} isLoading={isLoading} />}
          {activeTab === "supported" && <ProfileSupported posts={posts} isLoading={isLoading} />}
        </div>
      </div>
    </div>
  );
};

export default CommunityProfilePage;