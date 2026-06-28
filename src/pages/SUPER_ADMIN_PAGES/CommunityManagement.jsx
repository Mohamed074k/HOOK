import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Trash2, Eye, MessageCircle, AlertTriangle, Calendar, Loader2, X, MapPin, Heart, MessageSquare, Share2, Compass } from "lucide-react";
import apiClient from "../../api/apiClient"; 
import toast from "react-hot-toast";

 const typeStyles = {
  Experience: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  Event: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  Warning: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  Complaint: "bg-red-400/10 text-red-400 border-red-400/20",
};

const typeIcons = {
  Experience: Compass,
  Event: Calendar,
  Warning: AlertTriangle,
  Complaint: AlertTriangle,
};

 const resolvePostType = (categoryInt) => {
  switch (categoryInt) {
    case 1: return "Experience";
    case 2: return "Event";
    case 3: return "Warning";
    case 4: return "Complaint";
    default: return "Experience"; 
  }
};

const formatPostDate = (isoString) => {
  if (!isoString) return "Recent";
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recent";
  }
};

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const baseUrl = 'https://hook.runasp.net';
  return `${baseUrl}${url}`;
};

// ─── Post Deep Inspection Modal ───────────────────────────────────────────────
const PostDetailsModal = ({ post, isOpen, onClose }) => {
  if (!post || !isOpen) return null;

  const Icon = typeIcons[post.type] || Compass;
  const badgeStyle = typeStyles[post.type] || typeStyles.Experience;
  const authorPic = getImageUrl(post.raw?.authorProfilePictureUrl);
  const postImages = post.raw?.images?.map(url => getImageUrl(url)).filter(Boolean) || [];

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#002238] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[scaleUp_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
              <Icon size={14} /> {post.type}
            </span>
            <span className="text-[#a3cbf2]/40 text-xs">• ID: {post.id?.slice(0, 8)}...</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-[#a3cbf2]/40 hover:text-white hover:bg-white/5 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          
          <div className="flex items-start gap-4 p-4 bg-[#001526] rounded-xl border border-white/5">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-sky-500/10 border border-white/10 shrink-0 flex items-center justify-center text-sky-400 font-bold uppercase">
              {authorPic ? <img src={authorPic} alt="" className="w-full h-full object-cover" /> : (post.user?.[0] || "U")}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-[#cee5ff] font-bold text-base">{post.user}</h4>
                <span className="text-[#a3cbf2]/40 text-xs flex items-center gap-1">
                  <MapPin size={12} /> {post.raw?.locationName || post.raw?.governorate || "Egypt"}
                </span>
              </div>
              <p className="text-[#a3cbf2]/60 text-xs mt-1 italic">
                {post.raw?.authorBio || "No author biography provided."}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Post Content</p>
            <div className="p-4 bg-[#001526] rounded-xl border border-white/5 text-[#cee5ff] text-sm leading-relaxed whitespace-pre-wrap">
              {post.raw?.content || "Empty content payload."}
            </div>
          </div>

          {postImages.length > 0 && (
            <div>
              <p className="text-[#a3cbf2]/40 text-xs uppercase tracking-wider mb-2">Attached Media ({postImages.length})</p>
              <div className="grid grid-cols-2 gap-3">
                {postImages.map((img, idx) => (
                  <a key={idx} href={img} target="_blank" rel="noreferrer" className="aspect-video rounded-xl overflow-hidden border border-white/10 block group">
                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-[#001526] rounded-xl border border-white/5 flex items-center justify-center gap-2 text-rose-400">
              <Heart size={16} /> <span className="text-xs font-bold">{post.raw?.likesCount || 0} Likes</span>
            </div>
            <div className="p-3 bg-[#001526] rounded-xl border border-white/5 flex items-center justify-center gap-2 text-sky-400">
              <MessageSquare size={16} /> <span className="text-xs font-bold">{post.raw?.commentsCount || 0} Comments</span>
            </div>
            <div className="p-3 bg-[#001526] rounded-xl border border-white/5 flex items-center justify-center gap-2 text-emerald-400">
              <Share2 size={16} /> <span className="text-xs font-bold">{post.raw?.sharesCount || 0} Shares</span>
            </div>
          </div>

          <div className="text-right text-[11px] text-[#a3cbf2]/30 pt-1">
            Created on: {new Date(post.raw?.createdOn || Date.now()).toLocaleString()}
          </div>

        </div>

        <div className="p-6 pt-0">
          <button 
            onClick={onClose} 
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-bold hover:shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ─── CommunityManagement Main Page ────────────────────────────────────────────
const CommunityManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);

  // Modal States
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    fetchPosts();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDeleteVisible || isDetailsOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isDeleteVisible, isDetailsOpen]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/Feed/all", {
        params: { page: 1, pageSize: 50 },
      });

      const rawList = Array.isArray(data) ? data : data?.items || [];
      
      const mappedPosts = rawList.map((item) => ({
        id: item.id,
        user: item.authorName || "Anonymous Angler",
        type: resolvePostType(item.category), 
        content: item.content || "No written content provided.",
        date: formatPostDate(item.createdOn),
        raw: item 
      }));

      setPosts(mappedPosts);
    } catch (error) {
      console.error("Failed to fetch community feed:", error);
      toast.error("Could not load community feed.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(p => 
    p.user.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase())
  );

  const openDetails = (post) => {
    setSelectedPost(post);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedPost(null), 200);
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setTimeout(() => setIsDeleteVisible(true), 10);
  };

  const closeDelete = () => {
    setIsDeleteVisible(false);
    setTimeout(() => setDeleteId(null), 300);
  };

  const doDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/Community/admin/delete-post/${deleteId}`);
      
      setPosts((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Post deleted permanently.");
      closeDelete();
    } catch (err) {
      console.error("Delete post error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete post.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-[#a3cbf2]/50 text-sm">Loading community feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div 
        className="flex items-center justify-between flex-wrap gap-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(-20px)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-black text-[#cee5ff]">Community Management</h1>
      </div>

      <div 
        className="relative max-w-sm transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "100ms" }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3cbf2]/40" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#002238] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none focus:border-sky-400/40 shadow-sm transition-colors"
          placeholder="Search posts by user or content..."
        />
      </div>

      {/* DESKTOP TABLE  */}
      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-[#001526] border-b border-white/10">
            <tr>
              {["User", "Post Type", "Content Preview", "Date", ""].map((h, i) => (
                <th key={i} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-[#a3cbf2]/40">No posts found matching your search.</td>
              </tr>
            ) : (
              filteredPosts.map((post) => {
                const Icon = typeIcons[post.type] || Compass;
                const badgeStyle = typeStyles[post.type] || typeStyles.Experience;

                return (
                  <tr key={post.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200">
                    <td className="px-6 py-4 text-[#cee5ff] font-medium">{post.user}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
                        <Icon size={12} /> {post.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#a3cbf2]/60 max-w-md truncate">{post.content}</td>
                    <td className="px-6 py-4 text-[#a3cbf2]/40 whitespace-nowrap">{post.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openDetails(post)} className="p-1.5 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all" title="View Details">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openDelete(post.id)} className="p-1.5 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/*  MOBILE CARDS */}
      <div 
        className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        {filteredPosts.length === 0 ? (
          <div className="bg-[#002238] border border-white/5 rounded-2xl p-8 text-center text-[#a3cbf2]/40 text-xs">No posts found.</div>
        ) : (
          filteredPosts.map((post) => {
            const Icon = typeIcons[post.type] || Compass;
            const badgeStyle = typeStyles[post.type] || typeStyles.Experience;

            return (
              <div key={post.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[#cee5ff] font-semibold text-sm">{post.user}</p>
                  <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
                    <Icon size={10} /> {post.type}
                  </span>
                </div>
                <p className="text-[#a3cbf2]/70 text-sm mt-3 bg-[#001526] p-3 rounded-xl border border-white/5 break-words">"{post.content}"</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[#a3cbf2]/40 text-xs">{post.date}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openDetails(post)} className="p-1.5 rounded-lg text-[#a3cbf2]/30 hover:text-sky-400 hover:bg-sky-400/10 transition-all">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => openDelete(post.id)} className="p-1.5 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODALS */}
      <PostDetailsModal 
        post={selectedPost}
        isOpen={isDetailsOpen}
        onClose={closeDetails}
      />

      {deleteId && createPortal(
        <div 
          className={`fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isDeleteVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={!deleting ? closeDelete : undefined}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transition-all duration-300 transform ${isDeleteVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#cee5ff] font-bold text-lg mb-2">Delete Post?</h3>
            <p className="text-[#a3cbf2]/60 text-sm mb-6">This action cannot be undone. The post will be permanently removed.</p>
            <div className="flex gap-3">
              <button 
                onClick={closeDelete} 
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={doDelete} 
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : null}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(163, 203, 242, 0.2);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default CommunityManagement;