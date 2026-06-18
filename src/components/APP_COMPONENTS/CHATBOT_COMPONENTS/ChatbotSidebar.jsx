// src/components/APP_COMPONENTS/CHATBOT_COMPONENTS/ChatbotSidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import { Plus, MessageSquare, Bot, Settings, PanelLeftClose, Trash2 } from "lucide-react";

// Mock previous chats
const previousChats = [
  { id: 1, title: "Best Marlin Spots near Red Sea", date: "Today" },
  { id: 2, title: "Deep Sea Gear Recommendations", date: "Yesterday" },
  { id: 3, title: "Weather forecast for Alexandria", date: "Previous 7 Days" },
  { id: 4, title: "Tuna migration patterns", date: "Previous 7 Days" }
];

const ChatbotSidebar = ({ isOpen, toggleSidebar, onNewChat }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <motion.div 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#001a2c] border-r border-white/5 flex flex-col transition-transform duration-300 ease-[0.25,0.46,0.45,0.94] ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header / New Chat Button */}
        <div className="p-4 pt-6 flex items-center gap-2">
          <motion.button
            onClick={onNewChat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center gap-2 px-4 py-3 bg-sky-500/10 border border-sky-400/20 hover:bg-sky-500/20 hover:border-sky-400/40 rounded-xl text-sky-400 font-bold text-sm transition-colors"
          >
            <Plus size={18} />
            New Chat
          </motion.button>
          
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-3 rounded-xl bg-white/5 text-[#a3cbf2] hover:bg-white/10 hover:text-white transition-colors"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2 space-y-6">
          
          {/* Group: Today */}
          <div>
            <h3 className="text-[10px] font-bold text-[#a3cbf2]/40 uppercase tracking-widest mb-2 px-1">Today</h3>
            <div className="space-y-1">
              {previousChats.filter(c => c.date === "Today").map((chat) => (
                <button key={chat.id} className="w-full group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare size={14} className="text-[#a3cbf2]/50 shrink-0" />
                    <span className="text-sm text-[#cee5ff] truncate group-hover:text-white transition-colors">{chat.title}</span>
                  </div>
                  <Trash2 size={14} className="text-rose-400/0 group-hover:text-rose-400/50 hover:!text-rose-400 shrink-0 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* Group: Previous */}
          <div>
            <h3 className="text-[10px] font-bold text-[#a3cbf2]/40 uppercase tracking-widest mb-2 px-1">Previous</h3>
            <div className="space-y-1">
              {previousChats.filter(c => c.date !== "Today").map((chat) => (
                <button key={chat.id} className="w-full group flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare size={14} className="text-[#a3cbf2]/50 shrink-0" />
                    <span className="text-sm text-[#cee5ff] truncate group-hover:text-white transition-colors">{chat.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer / Profile */}
        <div className="p-4 border-t border-white/5 bg-[#001526]/50">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-left">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shrink-0">
              <User size={16} className="text-[#001526] fill-current" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-[#cee5ff] truncate">Captain Ahab</p>
              <p className="text-xs text-[#a3cbf2]/50 truncate">Free Plan</p>
            </div>
            <Settings size={16} className="text-[#a3cbf2]/50" />
          </button>
        </div>
      </motion.div>
    </>
  );
};

// Quick generic User icon fallback since lucide's is outlined
const User = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

export default ChatbotSidebar;