 

// src/pages/ChatbotPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Sparkles, Anchor, Compass, Fish, Plus, Search } from "lucide-react";
import ChatbotSidebar from "../../components/APP_COMPONENTS/CHATBOT_COMPONENTS/ChatbotSidebar";
import { useChat } from "../../context/APP_CONTEXT/ChatbotContext";

const ChatbotPage = () => {
  const [input, setInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { messages, isStreaming, sendMessage, startNewChat } = useChat();
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0 || isStreaming) {
      const scrollTimeout = setTimeout(() => {
        scrollToBottom();
      }, 50);
      return () => clearTimeout(scrollTimeout);
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = 0;
  }, []);

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

 

  return (
    <div className="flex h-[calc(100dvh-80px)] bg-[#001526] text-[#cee5ff] overflow-hidden relative">
      
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');`}
      </style>

      {/* Search Modal */}
      <ChatbotSidebar isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />

      {/* --- DESKTOP FLOATING ICONS (Hidden on mobile) --- */}
      <div className="hidden md:flex absolute top-6 left-6 flex-col gap-4 z-30">
        <div className="relative group flex items-center">
          <button
            onClick={() => { startNewChat(); setIsSearchOpen(false); }}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-[#a3cbf2] hover:text-white transition-colors"
          >
            <Plus size={18} strokeWidth={2} />
          </button>
          <span className="absolute left-full ml-3 px-3 py-1.5 bg-[#001a2c] text-white text-[13px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 shadow-lg">
            New chat
          </span>
        </div>

        <div className="relative group flex items-center">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-[#a3cbf2] hover:text-white transition-colors"
          >
            <Search size={18} strokeWidth={2} />
          </button>
          <span className="absolute left-full ml-3 px-3 py-1.5 bg-[#001a2c] text-white text-[13px] font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 shadow-lg">
            Search chats
          </span>
        </div>
      </div>

      {/* Main Chat Area - Full width on mobile, pl-24 on desktop to avoid floating icons */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden md:pl-24">
        
        {/* Ambient Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-sky-500/5 rounded-full blur-3xl mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 md:w-[500px] md:h-[500px] bg-cyan-500/5 rounded-full blur-3xl mix-blend-screen" />
        </div>

        {/* Messages / Empty State Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 relative z-10 flex flex-col"
        >
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
            
            {/* --- EMPTY STATE --- */}
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1 flex flex-col items-center justify-center text-center pt-8 pb-4 md:py-10"
              >
                <motion.div 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-[#002238] to-[#001526] border border-sky-400/20 shadow-[0_0_40px_rgba(83,214,251,0.15)] flex items-center justify-center mb-6 md:mb-8 relative"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bot size={40} className="text-sky-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full" />
                </motion.div>
                
                <h1 className="text-2xl md:text-4xl font-black text-white mb-3 md:mb-4 font-sans px-2">
                  How can <span className="bg-gradient-to-r from-sky-300 to-cyan-400 bg-clip-text text-transparent">Fish Guard AI</span> help you today?
                </h1>
                
                <p className="text-[#a3cbf2]/80 max-w-md mx-auto mb-8 md:mb-12 text-[15px] md:text-base leading-relaxed px-4">
                  Your intelligent maritime navigator. Ask about fishing spots, weather conditions, or gear recommendations.
                </p>

 
              </motion.div>
            )}

            {/* --- ACTIVE CHAT MESSAGES --- */}
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`flex gap-3 md:gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#002238] to-[#001526] border border-sky-400/20 shadow-lg flex items-center justify-center shrink-0 mt-1">
                        <Bot size={16} className="text-sky-400 md:w-[18px] md:h-[18px]" />
                      </div>
                    )}

                    <div 
                      className={`max-w-[88%] md:max-w-[80%] px-4 py-3 md:px-5 md:py-4 rounded-2xl text-[14.5px] md:text-[15.5px] leading-relaxed md:leading-loose shadow-sm whitespace-pre-wrap ${
                        msg.role === "user" 
                          ? "bg-[#002238] border border-white/5 text-white rounded-tr-sm" 
                          : "bg-transparent text-[#cee5ff]"
                      }`}
                      dir="auto" 
                      style={{ fontFamily: "'Cairo', sans-serif" }} // Arabic font ONLY for message content
                    >
                      {msg.role === "ai" && isStreaming && index === messages.length - 1 && !msg.text && (
                         <div className="flex gap-1.5 items-center h-4">
                           {[0, 1, 2].map((i) => (
                             <motion.div
                               key={i}
                               className="w-1.5 h-1.5 bg-sky-400 rounded-full"
                               animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                               transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                             />
                           ))}
                         </div>
                      )}
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* --- INPUT AREA --- */}
        <div className="shrink-0 p-3 md:p-4 bg-gradient-to-t from-[#001526] via-[#001526] to-transparent relative z-20 pb-4 md:pb-8">
          <div className="max-w-3xl mx-auto relative flex flex-col gap-3">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500/20 to-cyan-500/20 blur-md opacity-50" />
            
            {/* Input Box */}
            <div className="relative bg-[#001a2c] border border-white/10 rounded-2xl shadow-2xl flex items-end gap-2 p-1.5 md:p-2 focus-within:border-sky-400/50 transition-colors z-10">
              <button className="p-2 md:p-3 text-[#a3cbf2]/50 hover:text-sky-400 transition-colors shrink-0">
                <Sparkles size={18} className="md:w-5 md:h-5" />
              </button>
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Fish Guard AI anything..."
                className="w-full bg-transparent text-[#cee5ff] placeholder:text-[#a3cbf2]/40 focus:outline-none resize-none py-2.5 md:py-2 max-h-32 text-[15px] md:text-[16px] leading-normal custom-scrollbar overflow-y-auto"
                rows="1"
                dir="auto"
                style={{ fontFamily: "'Cairo', sans-serif" }} 
              />

              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                whileHover={input.trim() && !isStreaming ? { scale: 1.05 } : {}}
                whileTap={input.trim() && !isStreaming ? { scale: 0.95 } : {}}
                className={`p-2.5 md:p-3 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  input.trim() && !isStreaming 
                    ? "bg-[#002238] border border-sky-500/30 text-sky-400 hover:bg-sky-500/10" 
                    : "bg-transparent text-[#a3cbf2]/30 cursor-not-allowed"
                }`}
              >
                <Send size={18} className="md:w-5 md:h-5" />
              </motion.button>
            </div>
            
            {/* Buttons Row & Disclaimer */}
            <div className="flex flex-col items-center gap-3 z-10">
              
              {/* MOBILE ONLY Buttons */}
              <div className="flex md:hidden items-center gap-3 mt-1">
                <button 
                  onClick={() => { startNewChat(); setIsSearchOpen(false); }} 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a3cbf2] hover:text-white transition-colors text-[13px]"
                >
                  <Plus size={16} strokeWidth={2} />
                  <span>New Chat</span>
                </button>

                <button 
                  onClick={() => setIsSearchOpen(true)} 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a3cbf2] hover:text-white transition-colors text-[13px]"
                >
                  <Search size={16} strokeWidth={2} />
                  <span>Search Chats</span>
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-center text-[10px] md:text-[11px] text-[#a3cbf2]/50 font-medium px-2">
                Fish Guard AI can make mistakes. Consider verifying critical maritime conditions.
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatbotPage;