import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Users, Ship, ShieldCheck, Lock, ChevronDown, Check, Star, Loader2, Home, ChevronRight, Copy, MessageCircle, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCommunity } from "../../context/APP_CONTEXT/CommunityContext";
import { POST_CATEGORIES, sharePost, getShareInfo } from "../../services/communityService";
import { toast } from "react-hot-toast";

import PostCard from "../../components/APP_COMPONENTS/COMMUNITY_COMPONENTS/PostCard";
import CreatePostModal from "../../components/APP_COMPONENTS/COMMUNITY_COMPONENTS/CreatePostModal";
import UserAvatar from "../../components/APP_COMPONENTS/COMMUNITY_COMPONENTS/UserAvatar";
import { PostSkeleton } from "../../components/APP_COMPONENTS/COMMUNITY_COMPONENTS/CommunitySkeletons";

const ShareModal = ({ post, isOpen, onClose, onSuccess }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareInfo, setShareInfo] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (post) {
        const originId = post.originalPostId ? post.originalPostId : post.id;
        getShareInfo(originId).then(setShareInfo).catch(() => console.error("Failed to fetch share info"));
      }
    } else {
      document.body.style.overflow = '';
      setShareInfo(null);
      setContent("");
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, post]);

  if (!isOpen || !post) return null;

  const handleShare = async () => {
    setIsSubmitting(true);
    try {
      const originId = post.originalPostId ? post.originalPostId : post.id;
      await sharePost(originId, content);
      toast.success("Post shared to community!");
      onSuccess();
      onClose();
    } catch (error) { 
      toast.error("Failed to share post"); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleCopyLink = async () => {
    if (shareInfo?.postUrl) {
      await navigator.clipboard.writeText(shareInfo.postUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleWhatsAppShare = () => {
    if (shareInfo?.whatsAppShareUrl) {
      window.open(shareInfo.whatsAppShareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-full h-full bg-black/70 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, y: 16, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.95, y: 16, opacity: 0 }} 
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-xl w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#cee5ff]">Share Post</h3>
              <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-[#cee5ff]">
                <X size={18} />
              </button>
            </div>
            
            <textarea 
              value={content} onChange={(e) => setContent(e.target.value)} 
              placeholder="Add your thoughts about this..." 
              className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/40 focus:outline-none focus:border-sky-400/40 resize-none h-24 mb-4" 
            />
            
            <div className="flex gap-3 mb-6">
              <button 
                onClick={onClose} 
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleShare} 
                disabled={isSubmitting} 
                className="flex-1 py-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/20 hover:bg-sky-500/30 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? "Sharing..." : "Share to Feed"}
              </button>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-white/5"></div>
              <span className="text-[10px] text-[#a3cbf2]/40 font-bold uppercase tracking-wider">Or share externally</span>
              <div className="flex-1 h-px bg-white/5"></div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleCopyLink}
                disabled={!shareInfo}
                className="flex-1 py-2.5 rounded-xl bg-[#001526] border border-white/5 text-[#cee5ff] hover:bg-white/5 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Copy size={16} /> Copy Link
              </button>
              <button 
                onClick={handleWhatsAppShare}
                disabled={!shareInfo}
                className="flex-1 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} /> WhatsApp
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CommunityPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { posts, setPosts, sidebarData, isLoading, feedType, setFeedType, categoryFilter, setCategoryFilter, fetchPosts } = useCommunity();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (authLoading) return <div className="min-h-screen bg-[#001526] flex items-center justify-center"><div className="w-12 h-12 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#001526] flex flex-col items-center justify-center text-center p-4">
        <Lock size={64} className="text-sky-400/20 mb-6" />
        <h2 className="text-3xl font-black text-[#cee5ff] mb-2">Join the Community</h2>
        <p className="text-[#a3cbf2]/60 max-w-md mb-8">Login to view discussions, connect with anglers, and share your adventures.</p>
        <Link to="/login" className="px-8 py-3 rounded-xl bg-sky-400 text-[#001526] font-bold hover:shadow-[0_0_20px_rgba(83,214,251,0.3)] transition-all">Login to Access</Link>
      </div>
    );
  }

  const activeCategoryLabel = categoryFilter ? POST_CATEGORIES[categoryFilter]?.label : "All Categories";

  return (
    <div className="min-h-screen bg-[#001526] text-[#cee5ff] relative pb-20 pt-8">
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={fetchPosts} />
      <ShareModal post={postToShare} isOpen={!!postToShare} onClose={() => setPostToShare(null)} onSuccess={fetchPosts} />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="flex items-center gap-2 mb-6 text-xs sm:text-sm font-bold text-[#a3cbf2]/60">
          <Link to="/" className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
            <Home size={16} /> Home
          </Link>
          <ChevronRight size={14} className="text-white/20" />
          <span className="text-[#cee5ff]">Community</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-6">
              
              <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-[#a3cbf2]/50 uppercase tracking-widest mb-4">Top Owners</h3>
                <div className="space-y-4">
                  {sidebarData.boatOwners.map(owner => (
                    <div key={owner.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <UserAvatar url={owner.imageUrl} name={owner.name} className="w-10 h-10 rounded-full border border-white/10 group-hover:border-sky-400/50" />
                        <p className="text-sm font-bold text-[#cee5ff] line-clamp-1 group-hover:text-sky-400 transition-colors">{owner.name}</p>
                      </div>
                      <ShieldCheck size={16} className="text-emerald-400/50 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-[#a3cbf2]/50 uppercase tracking-widest mb-4 flex gap-2"><Ship size={14}/> Top Boats</h3>
                <div className="space-y-4">
                  {sidebarData.boats.map(boat => (
                    <div key={boat.id} className="flex items-center gap-3">
                      <UserAvatar url={boat.imageUrl} name={boat.name} className="w-12 h-10 rounded-lg border border-white/10 bg-[#001526]" />
                      <p className="text-sm font-bold text-[#cee5ff] line-clamp-1">{boat.name}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <div className="bg-[#002238] border border-white/5 rounded-2xl p-5 mb-6 shadow-lg hover:border-white/10 transition-colors">
              <div className="flex gap-4 items-center">
                <div 
                  onClick={(e) => { e.stopPropagation(); navigate(`/community/profile/${user.id}`); }}
                  className="cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                >
                  <UserAvatar url={user?.profilePictureUrl} name={`${user?.firstName} ${user?.lastName}`} className="w-10 h-10 rounded-full border border-sky-400/30" />
                </div>
                <div 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex-1 bg-[#001526] border border-white/5 rounded-full px-5 py-3 text-sm text-[#a3cbf2]/50 transition-all hover:bg-white/5 cursor-text"
                >
                  What's on your mind?
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-20">
              
              <div className="relative w-full sm:w-56">
                <button 
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="w-full flex items-center justify-between gap-4 bg-[#002238] border border-white/5 px-4 py-2.5 rounded-xl text-sm font-bold text-[#cee5ff] hover:bg-[#001526] transition-colors shadow-sm"
                >
                  <span className="truncate flex-1 text-left">Filter: <span className="text-sky-400 font-normal ml-1">{activeCategoryLabel}</span></span>
                  <ChevronDown size={16} className={`shrink-0 transition-transform duration-300 ${isFilterDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isFilterDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-[#002238] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-1 flex flex-col gap-1 w-full">
                        <button 
                          onClick={() => { setCategoryFilter(""); setIsFilterDropdownOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left whitespace-nowrap ${categoryFilter === "" ? "bg-sky-400/10 text-sky-400" : "text-[#cee5ff] hover:bg-white/5"}`}
                        >
                          All Categories {categoryFilter === "" && <Check size={14} className="shrink-0"/>}
                        </button>
                        {Object.entries(POST_CATEGORIES).map(([key, { label }]) => (
                          <button 
                            key={key} 
                            onClick={() => { setCategoryFilter(key); setIsFilterDropdownOpen(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left whitespace-nowrap ${categoryFilter === key ? "bg-sky-400/10 text-sky-400" : "text-[#cee5ff] hover:bg-white/5"}`}
                          >
                            <span className="truncate">{label}</span> {categoryFilter === key && <Check size={14} className="shrink-0"/>}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
                <button onClick={() => setFeedType("latest")} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${feedType === "latest" ? "bg-sky-400/10 text-sky-400 border-sky-400/30" : "bg-[#002238] text-[#a3cbf2] border-white/5 hover:border-white/10"}`}>Latest</button>
                <button onClick={() => setFeedType("trending")} className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${feedType === "trending" ? "bg-sky-400/10 text-sky-400 border-sky-400/30" : "bg-[#002238] text-[#a3cbf2] border-white/5 hover:border-white/10"}`}><Flame size={14} /> Trending</button>
                <button onClick={() => setFeedType("following")} className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${feedType === "following" ? "bg-sky-400/10 text-sky-400 border-sky-400/30" : "bg-[#002238] text-[#a3cbf2] border-white/5 hover:border-white/10"}`}><Users size={14} /> Following</button>
              </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => <PostSkeleton key={i} />)
              ) : posts.length > 0 ? (
                <AnimatePresence>
                  {posts.map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      onShare={(p) => setPostToShare(p)} 
                      onPostDeleted={(id) => setPosts(prev => prev.filter(p => p.id !== id))} 
                    />
                  ))}
                </AnimatePresence>
              ) : (
                <div className="text-center py-12 text-[#a3cbf2]/50">No posts found.</div>
              )}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-6">
              <div className="bg-[#002238] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-[#a3cbf2]/50 uppercase tracking-widest flex items-center gap-2">
                    <Star size={14} className="text-amber-400" /> Top Sellers
                  </h3>
                </div>
                <div className="space-y-4">
                  {sidebarData.sellers.map(seller => (
                    <div key={seller.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <UserAvatar url={seller.storeImageUrl} name={seller.sellerName} className="w-10 h-10 rounded-xl border border-white/10 group-hover:border-sky-400/50" />
                        <div>
                          <p className="text-sm font-bold text-[#cee5ff] group-hover:text-sky-400 line-clamp-1">{seller.sellerName}</p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/marketplace')} className="w-full mt-4 py-2 text-xs font-bold text-sky-400 hover:bg-sky-400/10 rounded-lg transition-colors">
                  Visit Marketplace
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CommunityPage;