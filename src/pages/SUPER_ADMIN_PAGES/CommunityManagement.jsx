import { useState, useEffect } from "react";
import { Search, Trash2, EyeOff, MessageCircle, AlertTriangle, Calendar } from "lucide-react";

const initialPosts = [
  { id: "1", user: "Mohamed Elsayed", type: "Advice", content: "Best spots for deep sea fishing in Florida?", date: "Mar 25, 2025" },
  { id: "2", user: "Mohamed Elsayed", type: "Complaint", content: "Cancelled trip last minute, very disappointed", date: "Mar 24, 2025" },
  { id: "3", user: "Mohamed Elsayed", type: "Event", content: "Annual Fishing Tournament - April 15th", date: "Mar 22, 2025" },
  { id: "4", user: "Mohamed Elsayed", type: "Advice", content: "What's the best reel for beginners?", date: "Mar 20, 2025" },
];

const typeStyles = {
  Advice: "bg-sky-400/10 text-sky-400",
  Complaint: "bg-red-400/10 text-red-400",
  Event: "bg-emerald-400/10 text-emerald-400",
};

const typeIcons = {
  Advice: MessageCircle,
  Complaint: AlertTriangle,
  Event: Calendar,
};

const CommunityManagement = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);

  // Modal Animation States
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Prevent scrolling when delete modal is open
  useEffect(() => {
    if (isDeleteVisible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isDeleteVisible]);

  const filteredPosts = posts.filter(p => 
    p.user.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase())
  );

  const openDelete = (id) => {
    setDeleteId(id);
    setTimeout(() => setIsDeleteVisible(true), 10);
  };
  const closeDelete = () => {
    setIsDeleteVisible(false);
    setTimeout(() => setDeleteId(null), 300);
  };

  const doDelete = () => {
    setPosts(posts.filter(p => p.id !== deleteId));
    closeDelete();
  };

  const hidePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

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

      <div 
        className="hidden md:block bg-[#002238] border border-white/5 rounded-2xl overflow-hidden transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        <table className="w-full text-sm">
          <thead className="bg-[#001526] border-b border-white/10">
            <tr>
              {["User", "Post Type", "Content Preview", "Date", ""].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-[#a3cbf2]/50 font-semibold text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => {
              const Icon = typeIcons[post.type];
              return (
                <tr key={post.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors duration-200">
                  <td className="px-6 py-4 text-[#cee5ff] font-medium">{post.user}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold ${typeStyles[post.type]}`}>
                      <Icon size={12} /> {post.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#a3cbf2]/60 max-w-md truncate">{post.content}</td>
                  <td className="px-6 py-4 text-[#a3cbf2]/40">{post.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => hidePost(post.id)} className="p-1.5 rounded-lg text-[#a3cbf2]/30 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all" title="Hide Post">
                        <EyeOff size={16} />
                      </button>
                      <button onClick={() => openDelete(post.id)} className="p-1.5 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div 
        className="md:hidden space-y-3 transform transition-all duration-700 ease-out"
        style={{ opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(20px)", transitionDelay: "200ms" }}
      >
        {filteredPosts.map((post) => {
           const Icon = typeIcons[post.type];
           return (
             <div key={post.id} className="bg-[#002238] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-200">
               <div className="flex items-start justify-between mb-2">
                 <p className="text-[#cee5ff] font-semibold text-sm">{post.user}</p>
                 <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold ${typeStyles[post.type]}`}>
                   <Icon size={10} /> {post.type}
                 </span>
               </div>
               <p className="text-[#a3cbf2]/70 text-sm mt-3 bg-[#001526] p-3 rounded-xl border border-white/5">"{post.content}"</p>
               <div className="flex items-center justify-between mt-4">
                 <span className="text-[#a3cbf2]/40 text-xs">{post.date}</span>
                 <div className="flex gap-2">
                    <button onClick={() => hidePost(post.id)} className="p-1.5 rounded-lg text-[#a3cbf2]/30 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all">
                      <EyeOff size={14} />
                    </button>
                    <button onClick={() => openDelete(post.id)} className="p-1.5 rounded-lg text-[#a3cbf2]/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                      <Trash2 size={14} />
                    </button>
                 </div>
               </div>
             </div>
           );
        })}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div 
          className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${isDeleteVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={closeDelete}
        >
          <div 
            className={`bg-[#002238] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transition-all duration-300 transform ${isDeleteVisible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#cee5ff] font-bold text-lg mb-2">Delete Post?</h3>
            <p className="text-[#a3cbf2]/60 text-sm mb-6">This action cannot be undone. The post will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={closeDelete} className="flex-1 py-2.5 rounded-xl border border-white/5 text-[#a3cbf2]/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">Cancel</button>
              <button onClick={doDelete} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/20 hover:bg-red-500/30 text-sm font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityManagement;