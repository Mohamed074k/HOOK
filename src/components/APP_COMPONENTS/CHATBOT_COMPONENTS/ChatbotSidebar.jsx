import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Trash2, MessageSquare, X } from "lucide-react";
import { useChat } from "../../../context/APP_CONTEXT/ChatbotContext";

// Helper to format dates
const formatChatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const ChatbotSidebar = ({ isSearchOpen, setIsSearchOpen }) => {
  const { 
    conversations, 
    activeConversationId, 
    loadConversation, 
    toggleStar, 
    deleteChat 
  } = useChat();
  
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const filteredChats = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const starredChats = filteredChats.filter((c) => c.isStarred);
  const recentChats = filteredChats.filter((c) => !c.isStarred);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleSelectChat = (id) => {
    loadConversation(id);
    setIsSearchOpen(false);
  };

  return (
    <>
       <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col items-center bg-[#00101c]/95 backdrop-blur-md pt-12 md:pt-16 px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <div 
              className="w-full max-w-3xl flex flex-col items-center h-full max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Close Button Mobile */}
              <div className="w-full flex justify-end mb-4 md:hidden">
                <button onClick={() => setIsSearchOpen(false)} className="p-2 bg-white/5 rounded-full text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Search Input Pill */}
              <div className="w-full relative mb-8 md:mb-10">
                <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a3cbf2]/50" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#001a2c] border border-white/5 rounded-full py-3.5 md:py-4 pl-14 pr-6 text-white text-base md:text-lg placeholder:text-[#a3cbf2]/40 focus:outline-none focus:bg-[#002238] transition-colors shadow-2xl"
                />
              </div>

              {/* Chat List Area */}
              <div className="w-full flex-1 flex flex-col overflow-y-auto custom-scrollbar pb-10">
                {filteredChats.length === 0 ? (
                  <div className="text-center text-[#a3cbf2]/40 mt-10">
                    No chats found.
                  </div>
                ) : (
                  <>
                    {starredChats.length > 0 && (
                      <div className="mb-8">
                        <div className="text-yellow-500/60 text-sm font-medium mb-3 px-4 flex items-center gap-1.5">
                          <Star size={16} className="fill-yellow-500/40" /> Starred
                        </div>
                        <div className="flex flex-col space-y-1">
                          {starredChats.map((chat) => (
                            <ChatItem
                              key={chat.id}
                              chat={chat}
                              isActive={activeConversationId === chat.id}
                              onSelect={() => handleSelectChat(chat.id)}
                              onStar={() => toggleStar(chat.id)}
                              onDelete={() => deleteChat(chat.id)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {recentChats.length > 0 && (
                      <div>
                        <div className="text-[#a3cbf2]/50 text-sm font-medium mb-3 px-4">
                          Recent
                        </div>
                        <div className="flex flex-col space-y-1">
                          {recentChats.map((chat) => (
                            <ChatItem
                              key={chat.id}
                              chat={chat}
                              isActive={activeConversationId === chat.id}
                              onSelect={() => handleSelectChat(chat.id)}
                              onStar={() => toggleStar(chat.id)}
                              onDelete={() => deleteChat(chat.id)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const ChatItem = ({ chat, isActive, onSelect, onStar, onDelete }) => (
  <div
    onClick={onSelect}
    className={`w-full flex items-center justify-between px-4 py-3.5 md:py-4 rounded-2xl cursor-pointer transition-colors group ${
      isActive ? "bg-sky-500/10 border border-sky-500/20" : "hover:bg-white/5 border border-transparent"
    }`}
  >
    <div className="flex items-center gap-3 md:gap-4 overflow-hidden flex-1 pr-4">
      <MessageSquare size={18} className={isActive ? "text-sky-400" : "text-[#a3cbf2]/40"} />
      <span 
        className={`text-[14px] md:text-[15px] truncate transition-colors leading-relaxed ${isActive ? "text-white font-semibold" : "text-[#cee5ff] group-hover:text-white"}`}
        dir="auto"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        {chat.title}
      </span>
    </div>

    <div className="flex items-center gap-2 md:gap-3 shrink-0">
      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onStar(); }}
          className="p-1.5 md:p-2 rounded-full text-[#a3cbf2]/50 hover:bg-white/10 hover:text-yellow-400 transition-colors"
          title={chat.isStarred ? "Remove Star" : "Star Chat"}
        >
          <Star size={16} className={chat.isStarred ? "fill-yellow-400 text-yellow-400" : ""} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 md:p-2 rounded-full text-[#a3cbf2]/50 hover:bg-white/10 hover:text-rose-400 transition-colors"
          title="Delete Chat"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <span className="text-[12px] md:text-[13px] text-[#a3cbf2]/50 hidden sm:block w-20 text-right">
        {formatChatDate(chat.lastMessageAt || chat.createdOn)}
      </span>
    </div>
  </div>
);

export default ChatbotSidebar;