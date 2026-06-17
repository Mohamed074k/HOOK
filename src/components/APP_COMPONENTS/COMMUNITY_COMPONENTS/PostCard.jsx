import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Heart, MessageCircle, Share2, Bookmark, MapPin, Calendar, 
  Users, Repeat2, X, Trash2, Loader2, MoreHorizontal, AlertCircle, HandHeart, Edit2 
} from "lucide-react";
import { 
  POST_CATEGORIES, likePost, savePost, 
  getPostComments, addComment, addReply, deleteComment,
  followUser, unfollowUser, joinEvent, leaveEvent, reportPost, supportPost,
  deletePost
} from "../../../services/communityService";
import { useAuth } from "../../../context/AuthContext";
import { useCommunityProfile } from "../../../context/APP_CONTEXT/CommunityProfileContext";
import UserAvatar from "./UserAvatar";
import EditPostModal from "./EditPostModal";
import { CommentSkeleton } from "./CommunitySkeletons";
import { toast } from "react-hot-toast";

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${import.meta.env.VITE_API_URL || 'https://hook.runasp.net'}${url}`;
};

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// ─── NESTED COMMENT ITEM ───
const CommentItem = ({ comment, onReply, onDelete, currentUser, isReply = false }) => {
  const isOwner = currentUser?.id === comment.userId;
  return (
    <div className={`flex gap-3 ${isReply ? 'ml-8 mt-3 border-l-2 border-white/5 pl-3' : 'mt-5'}`}>
      <UserAvatar url={comment.commenterProfilePictureUrl} name={comment.commenterName} className="w-8 h-8 rounded-full shrink-0" />
      <div className="flex-1">
        <div className="bg-[#001526] p-3 rounded-2xl rounded-tl-none border border-white/5 relative group">
          <p className="text-xs font-bold text-[#cee5ff]">{comment.commenterName}</p>
          <p className="text-sm text-[#a3cbf2] mt-1">{comment.commentText}</p>
          {isOwner && (
            <button onClick={() => onDelete(comment.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-rose-400 hover:bg-rose-400/10 p-1.5 rounded-md transition-all" title="Delete Comment">
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 mt-1.5 ml-2">
          <span className="text-[10px] text-[#a3cbf2]/50">{formatDate(comment.createdOn)}</span>
          {!isReply && <button onClick={() => onReply(comment)} className="text-[10px] font-bold text-[#a3cbf2]/70 hover:text-sky-400">Reply</button>}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} onDelete={onDelete} currentUser={currentUser} isReply={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── COMMENTS DRAWER ───
const CommentsDrawer = ({ post, isOpen, onClose }) => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [localComments, setLocalComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && post) {
      const fetchComments = async () => {
        setIsLoadingComments(true);
        try {
          const data = await getPostComments(post.id);
          setLocalComments(data || []);
        } catch (error) { toast.error("Failed to load comments"); } 
        finally { setIsLoadingComments(false); }
      };
      fetchComments();
    } else {
      setLocalComments([]); setReplyingTo(null); setCommentText("");
    }
  }, [isOpen, post]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      if (replyingTo) {
        const newReply = await addReply(replyingTo.id, commentText);
        const resolved = Array.isArray(newReply) ? newReply[0] : newReply;
        setLocalComments(prev => prev.map(c => c.id === replyingTo.id ? { ...c, replies: [...(c.replies || []), resolved] } : c));
      } else {
        const newCmt = await addComment(post.id, commentText);
        const resolved = Array.isArray(newCmt) ? newCmt[0] : newCmt;
        if (!resolved.replies) resolved.replies = [];
        setLocalComments(prev => [resolved, ...prev]);
      }
      setCommentText(""); setReplyingTo(null);
    } catch (error) { toast.error("Failed to post comment"); } 
    finally { setIsSubmitting(false); }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteComment(id);
      const removeNode = (list) => list.filter(c => c.id !== id).map(c => ({ ...c, replies: c.replies ? removeNode(c.replies) : [] }));
      setLocalComments(prev => removeNode(prev));
      toast.success("Comment deleted");
    } catch (error) { toast.error("Failed to delete comment"); }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end lg:items-center justify-center pointer-events-auto p-0 lg:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <motion.div 
            initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} 
            className="relative w-full lg:w-[600px] h-[85vh] lg:h-[80vh] bg-[#002238] rounded-t-3xl lg:rounded-3xl flex flex-col overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#001526] shrink-0">
              <h3 className="font-bold text-[#cee5ff]">Comments</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={18} className="text-[#cee5ff]" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {isLoadingComments ? (
                <div className="space-y-4">
                  {Array(4).fill(0).map((_, i) => <CommentSkeleton key={i} />)}
                </div>
              ) : localComments.length > 0 ? (
                localComments.map((c) => <CommentItem key={c.id} comment={c} onReply={setReplyingTo} onDelete={handleDeleteComment} currentUser={user} />)
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center"><MessageCircle size={48} className="text-white/5 mb-3" /><p className="text-[#a3cbf2]/50 text-sm">No comments yet. Be the first!</p></div>
              )}
            </div>
            
            <div className="p-4 border-t border-white/5 bg-[#001526] shrink-0">
              {replyingTo && (
                <div className="flex items-center justify-between bg-[#002238] px-4 py-2 rounded-xl mb-3 border border-white/5 shadow-inner">
                  <span className="text-xs text-[#a3cbf2]">Replying to <span className="font-bold text-sky-400">{replyingTo.commenterName}</span></span>
                  <button onClick={() => setReplyingTo(null)} className="text-[#a3cbf2]/50 hover:text-rose-400 p-1"><X size={14}/></button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder={replyingTo ? "Write a reply..." : "Add a comment..."} onKeyDown={(e) => e.key === 'Enter' && handlePostComment()} className="flex-1 bg-[#002238] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/50 transition-colors" />
                <button onClick={handlePostComment} disabled={!commentText.trim() || isSubmitting} className="text-[#001526] bg-sky-400 px-5 py-3 rounded-xl font-bold text-sm hover:bg-sky-300 transition-all disabled:opacity-50 flex items-center justify-center min-w-[80px]">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Post"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// ─── POST CARD MAIN ───
const PostCard = ({ post, onShare, onPostDeleted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const profileCtx = useCommunityProfile();
  
  const [mounted, setMounted] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Actions States
  const [liked, setLiked] = useState(post.isLikedByCurrentUser);
  const [saved, setSaved] = useState(post.isSavedByCurrentUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const [isFollowing, setIsFollowing] = useState(post.isFollowingByCurrentUser || post.isFollowing || false); 
  const [isJoined, setIsJoined] = useState(post.eventDetails?.isJoinedByCurrentUser || false);
  const [participantsCount, setParticipantsCount] = useState(post.eventDetails?.currentParticipants || 0);

  const isComplaint = post.category === 4;
  const [isSupported, setIsSupported] = useState(post.complaintDetails?.isSupportedByCurrentUser || false);
  const [supportCount, setSupportCount] = useState(post.complaintDetails?.supportCount || 0);

  const isShared = !!post.originalPostId && post.originalPost;
  const isOwnPost = user?.id === post.userId;
  const catData = POST_CATEGORIES[post.category] || { label: "General", style: "text-white bg-white/10 border-white/20" };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isReportModalOpen || isDeleteModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isReportModalOpen, isDeleteModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsFollowing(post.isFollowingByCurrentUser || post.isFollowing || false);
  }, [post.isFollowingByCurrentUser, post.isFollowing]);

  const handleLike = async () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    try { await likePost(post.id); } catch { /* Ignore */ }
  };

  const handleSupport = async () => {
    setIsSupported(!isSupported);
    setSupportCount(prev => isSupported ? prev - 1 : prev + 1);
    try { await supportPost(post.id); } catch { /* Ignore */ }
  };

  const handleSave = async () => {
    setSaved(!saved);
    try { await savePost(post.id); } catch { /* Ignore */ }
  };

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    try {
      if (isFollowing) {
        await unfollowUser(post.userId);
        setIsFollowing(false);
        toast.success(`Unfollowed ${post.authorName}`);
      } else {
        await followUser(post.userId);
        setIsFollowing(true);
        toast.success(`Following ${post.authorName}`);
      }
    } catch (error) { 
      const code = error.response?.data?.code;
      if (code === "Community.AlreadyFollowing") { setIsFollowing(true); toast.success("Already following"); } 
      else if (code === "Community.NotFollowing") { setIsFollowing(false); } 
      else { toast.error("Failed to update follow status"); }
    }
  };

  const handleEventJoinToggle = async (eventId, currentJoinState) => {
    try {
      if (currentJoinState) {
        await leaveEvent(eventId);
        setIsJoined(false);
        setParticipantsCount(prev => Math.max(0, prev - 1));
        toast.success("Left the event");
      } else {
        await joinEvent(eventId);
        setIsJoined(true);
        setParticipantsCount(prev => prev + 1);
        toast.success("Joined the event!");
      }
    } catch (error) { toast.error("Failed to update event status"); }
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) return;
    setIsReporting(true);
    try {
      await reportPost(post.id, reportReason);
      toast.success("Post reported successfully");
      setIsReportModalOpen(false);
      setReportReason("");
    } catch (error) {
      if (error.response?.data?.code === "Community.CannotReportOwnPost") toast.error("You cannot report your own post.");
      else toast.error("Failed to report post");
    } finally {
      setIsReporting(false);
    }
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      toast.success("Post deleted successfully");
      setIsDeleteModalOpen(false);
      if (onPostDeleted) onPostDeleted(post.id);
      if (profileCtx && profileCtx.setPosts) profileCtx.setPosts(prev => prev.filter(p => p.id !== post.id));
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    if (profileCtx && profileCtx.fetchProfileTabFeed) {
      profileCtx.fetchProfileTabFeed("posts", user.id, true);
    }
  };

  const renderContent = (data, isNestedShare = false) => {
    const isLocalEvent = !isNestedShare && data.eventDetails;
    const evJoined = isNestedShare ? data.eventDetails?.isJoinedByCurrentUser : isJoined;
    const evParts = isNestedShare ? data.eventDetails?.currentParticipants : participantsCount;

    return (
      <>
        <div className="mb-3">
          <p className="text-[#a3cbf2] text-sm leading-relaxed whitespace-pre-line">{data.content}</p>
        </div>

        {(data.locationName || data.governorate || data.eventDetails) && (
          <div className="flex flex-col gap-2 mb-4">
            {(data.locationName || data.governorate) && (
              <div className="inline-flex items-center w-fit gap-1.5 text-xs text-[#cee5ff] bg-[#001526] px-3 py-1.5 rounded-lg border border-white/5">
                <MapPin size={14} className="text-sky-400" /> {data.locationName || data.governorate}
              </div>
            )}
            {data.eventDetails && (
              <div className="inline-flex flex-wrap items-center w-fit gap-4 text-xs text-[#cee5ff] bg-[#001526] px-3 py-1.5 rounded-lg border border-white/5">
                <div className="flex items-center gap-1.5"><Calendar size={14} className="text-emerald-400" /> {formatDate(data.eventDetails.eventDate)}</div>
                <div className="flex items-center gap-1.5"><Users size={14} className="text-amber-400" /> {evParts} / {data.eventDetails.maxParticipants} Joined</div>
                {isLocalEvent && (
                  <button 
                    onClick={() => handleEventJoinToggle(data.id, isJoined)}
                    className={`ml-2 px-3 py-1 rounded-md font-bold transition-colors ${isJoined ? 'bg-rose-400/10 text-rose-400 hover:bg-rose-400/20' : 'bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20'}`}
                  >
                    {isJoined ? "Leave Event" : "Join Event"}
                  </button>
                )}
                {isNestedShare && evJoined && (
                  <span className="ml-2 px-3 py-1 rounded-md font-bold bg-emerald-400/10 text-emerald-400">Joined</span>
                )}
              </div>
            )}
          </div>
        )}

        {data.images?.length > 0 && (
          <div className="rounded-xl overflow-hidden mb-4 border border-white/5">
            <img src={getImageUrl(data.images[0])} alt="Attachment" className="w-full h-auto max-h-[400px] object-cover bg-[#001526]" />
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {/* ─── MODALS ─── */}
      <CommentsDrawer post={post} isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} />
      <EditPostModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} post={post} onSuccess={handleEditSuccess} />

      {mounted && createPortal(
        <AnimatePresence>
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
              <motion.div 
                initial={{ scale: 0.95, y: 16, opacity: 0 }} 
                animate={{ scale: 1, y: 0, opacity: 1 }} 
                exit={{ scale: 0.95, y: 16, opacity: 0 }} 
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              >
                <div className="flex items-center justify-between mb-2 pb-2">
                  <h3 className="text-[#cee5ff] font-bold text-lg">Delete Post?</h3>
                  <button onClick={() => setIsDeleteModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors"><X size={18} className="text-[#cee5ff]" /></button>
                </div>
                <p className="text-[#a3cbf2]/60 text-sm mb-6">This will permanently remove the post from your profile. This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all disabled:opacity-50">Cancel</button>
                  <button onClick={handleDeletePost} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {isDeleting && <Loader2 size={16} className="animate-spin" />}
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {isReportModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsReportModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
              <motion.div 
                initial={{ scale: 0.95, y: 16, opacity: 0 }} 
                animate={{ scale: 1, y: 0, opacity: 1 }} 
                exit={{ scale: 0.95, y: 16, opacity: 0 }} 
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                  <h3 className="text-[#cee5ff] font-bold text-lg flex items-center gap-2"><AlertCircle className="text-rose-400" size={18}/> Report Post</h3>
                  <button onClick={() => setIsReportModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors"><X size={18} className="text-[#cee5ff]" /></button>
                </div>
                <p className="text-[#a3cbf2]/60 text-sm mb-4">Please specify why you are reporting this post.</p>
                <textarea 
                  value={reportReason} onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Reason for reporting..." 
                  className="w-full bg-[#001526] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#cee5ff] focus:outline-none focus:border-sky-400/40 resize-none h-24 mb-6"
                />
                <div className="flex gap-3">
                  <button onClick={() => setIsReportModalOpen(false)} disabled={isReporting} className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all disabled:opacity-50">Cancel</button>
                  <button onClick={handleReportSubmit} disabled={!reportReason.trim() || isReporting} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {isReporting && <Loader2 size={16} className="animate-spin" />}
                    {isReporting ? "Reporting..." : "Report"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ─── POST DISPLAY ─── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#002238] border border-white/5 rounded-2xl p-5 mb-6 hover:border-white/10 transition-colors shadow-lg">
        
        {isShared && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#a3cbf2]/60 mb-3 pb-3 border-b border-white/5">
            <Repeat2 size={14} className="text-emerald-400" /> {post.authorName} shared a post
          </div>
        )}

        <div className="flex items-start justify-between mb-4 relative">
          <div className="flex items-center gap-3">
            <div className="cursor-pointer" onClick={() => navigate(`/community/profile/${post.userId}`)}>
              <UserAvatar url={post.authorProfilePictureUrl} name={post.authorName} className="w-10 h-10 rounded-full border border-sky-400/30 hover:border-sky-400 transition-colors" />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h4 className="text-[#cee5ff] font-bold text-sm cursor-pointer hover:text-sky-400 transition-colors" onClick={() => navigate(`/community/profile/${post.userId}`)}>
                  {post.authorName}
                </h4>
                {!isOwnPost && (
                  <button onClick={handleFollowToggle} className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${isFollowing ? 'text-[#a3cbf2]/50 border-white/10 hover:border-rose-400 hover:text-rose-400' : 'text-sky-400 border-sky-400/30 hover:bg-sky-400/10'}`}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
              <div className="flex flex-col mt-0.5">
                <span className="text-xs text-[#a3cbf2]/60">{formatDate(post.createdOn)}</span>
                {post.category && (
                  <span className={`inline-block mt-1.5 w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${catData.style}`}>
                    {catData.label}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative" ref={menuRef}>
            <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className="text-[#a3cbf2]/40 hover:text-[#cee5ff] transition-colors p-2">
              <MoreHorizontal size={18} />
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 mt-1 w-32 bg-[#001526] border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden">
                  {isOwnPost ? (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); setIsEditModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm text-[#cee5ff] hover:bg-sky-400/10 hover:text-sky-400 transition-colors flex items-center gap-2">
                        <Edit2 size={14}/> Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); setIsDeleteModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-400/10 transition-colors flex items-center gap-2 border-t border-white/5">
                        <Trash2 size={14}/> Delete
                      </button>
                    </>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); setIsReportModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-400/10 transition-colors flex items-center gap-2">
                      <AlertCircle size={14}/> Report
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {renderContent(post)}

        {isShared && (
          <div className="mt-2 mb-4 border border-white/10 rounded-2xl p-4 bg-[#001526]">
            <div className="flex items-center gap-2 mb-3 cursor-pointer group" onClick={() => navigate(`/community/profile/${post.originalPost.userId}`)}>
              <UserAvatar url={post.originalPost.authorProfilePictureUrl} name={post.originalPost.authorName} className="w-8 h-8 rounded-full border border-white/10 group-hover:border-sky-400/50 transition-colors" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#cee5ff] group-hover:text-sky-400 transition-colors">{post.originalPost.authorName}</span>
                <span className="text-[10px] text-[#a3cbf2]/50">{formatDate(post.originalPost.createdOn)}</span>
                {POST_CATEGORIES[post.originalPost.category] && (
                  <span className={`inline-block mt-1 w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${POST_CATEGORIES[post.originalPost.category].style}`}>
                    {POST_CATEGORIES[post.originalPost.category].label}
                  </span>
                )}
              </div>
            </div>
            {renderContent(post.originalPost, true)}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-6">
            
            <button onClick={handleLike} title="Like" className={`flex items-center gap-2 text-sm transition-colors ${liked ? 'text-rose-400' : 'text-[#a3cbf2]/60 hover:text-rose-400'}`}>
              <Heart size={18} className={liked ? "fill-rose-400" : ""} /><span>{likesCount}</span>
            </button>
            
            {isComplaint && (
              <button onClick={handleSupport} title="Support Complaint" className={`flex items-center gap-2 text-sm transition-colors ${isSupported ? 'text-amber-400' : 'text-[#a3cbf2]/60 hover:text-amber-400'}`}>
                <HandHeart size={18} className={isSupported ? "fill-amber-400/20" : ""} /><span>{supportCount}</span>
              </button>
            )}

            <button onClick={(e) => { e.stopPropagation(); setIsCommentsOpen(true); }} title="Comment" className="flex items-center gap-2 text-sm text-[#a3cbf2]/60 hover:text-sky-400 transition-colors">
              <MessageCircle size={18} /><span>{post.commentsCount}</span>
            </button>
            
            <button onClick={() => onShare(post)} title="Share" className="flex items-center gap-2 text-sm text-[#a3cbf2]/60 hover:text-emerald-400 transition-colors">
              <Share2 size={18} /><span>{post.sharesCount}</span>
            </button>
            
          </div>
          <button onClick={handleSave} title="Save Post" className={`transition-colors ${saved ? 'text-sky-400' : 'text-[#a3cbf2]/60 hover:text-sky-400'}`}>
            <Bookmark size={18} className={saved ? "fill-sky-400" : ""} />
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default PostCard;