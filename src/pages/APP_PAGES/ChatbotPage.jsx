// src/pages/ChatbotPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Menu, Sparkles, Anchor, Compass, Fish } from "lucide-react";
import ChatbotSidebar from "../../components/APP_COMPONENTS/CHATBOT_COMPONENTS/ChatbotSidebar";

const ChatbotPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Mock API logic
  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now(), role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    
    // 2. Trigger AI Thinking state
    setIsThinking(true);

    // 3. Mock Response Delay
    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        role: "ai", 
        text: "That's a great question! Based on the current lunar cycle and water temperatures off the coast, I'd highly recommend aiming for early morning trips (around 5:00 AM). Marlin activity has been spiking near the drop-offs. Would you like me to find some available charters for you?" 
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsThinking(false);
    }, 2000); // 2 second delay for realism
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const suggestions = [
    { icon: Compass, text: "Best times for Deep Sea fishing?" },
    { icon: Fish, text: "Identify this fish species" },
    { icon: Anchor, text: "What gear do I need for Tuna?" }
  ];

  return (
    <div className="flex h-screen bg-[#001526] text-[#cee5ff] overflow-hidden font-sans">
      
      {/* Sidebar Component */}
      <ChatbotSidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onNewChat={startNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#001a2c]/80 backdrop-blur-md absolute top-0 left-0 right-0 z-20">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-[#a3cbf2] hover:text-white">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-sky-400" />
            <span className="font-bold text-sm tracking-widest uppercase">Fish Guard AI</span>
          </div>
          <div className="w-8" /> {/* spacer for centering */}
        </div>

        {/* Ambient Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl mix-blend-screen" />
        </div>

        {/* Messages / Empty State Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-20 lg:pt-8 pb-32 px-4 md:px-8 relative z-10 flex flex-col">
          <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col">
            
            {/* --- EMPTY STATE --- */}
            {messages.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-1 flex flex-col items-center justify-center text-center mt-[-10vh]"
              >
                <motion.div 
                  className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-[#002238] to-[#001526] border border-sky-400/20 shadow-[0_0_40px_rgba(83,214,251,0.15)] flex items-center justify-center mb-8 relative"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bot size={48} className="text-sky-400" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full animate-ping opacity-75" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full" />
                </motion.div>
                
                <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                  How can <span className="bg-gradient-to-r from-sky-300 to-cyan-400 bg-clip-text text-transparent">Fish Guard AI</span> help you today?
                </h1>
                <p className="text-[#a3cbf2]/60 max-w-md mx-auto mb-10 text-sm">
                  Your intelligent maritime navigator. Ask about fishing spots, weather conditions, or gear recommendations.
                </p>

                {/* Suggestion Chips */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                  {suggestions.map((item, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setInput(item.text)}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex flex-col items-start p-4 rounded-2xl bg-[#002238] border border-white/5 hover:border-sky-400/30 hover:bg-sky-500/5 transition-colors text-left group"
                    >
                      <item.icon size={18} className="text-sky-400/60 mb-3 group-hover:text-sky-400 transition-colors" />
                      <span className="text-xs text-[#cee5ff] group-hover:text-white leading-relaxed">{item.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- ACTIVE CHAT MESSAGES --- */}
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {/* AI Avatar */}
                    {msg.role === "ai" && (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#002238] to-[#001526] border border-sky-400/20 shadow-lg flex items-center justify-center shrink-0 mt-1">
                        <Bot size={18} className="text-sky-400" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-2xl text-[13px] md:text-sm leading-relaxed shadow-sm ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-sky-500 to-cyan-600 text-white rounded-tr-sm shadow-sky-500/20" 
                        : "bg-[#002238] border border-white/5 text-[#cee5ff] rounded-tl-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

               {/* --- THINKING INDICATOR --- */}
               {isThinking && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 justify-start"
                 >
                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#002238] to-[#001526] border border-sky-400/20 shadow-lg flex items-center justify-center shrink-0 mt-1">
                     <Bot size={18} className="text-sky-400" />
                   </div>
                   <div className="bg-[#002238] border border-white/5 px-5 py-5 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-[52px]">
                     {[0, 1, 2].map((i) => (
                       <motion.div
                         key={i}
                         className="w-1.5 h-1.5 bg-sky-400 rounded-full"
                         animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                         transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                       />
                     ))}
                   </div>
                 </motion.div>
               )}
               <div ref={messagesEndRef} className="h-4" />
            </div>

          </div>
        </div>

        {/* --- INPUT AREA --- */}
        <div className="absolute bottom-10 left-0 right-0 p-4 bg-gradient-to-t from-[#001526] via-[#001526] to-transparent pt-12 z-20">
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500/20 to-cyan-500/20 blur-md opacity-50" />
            
            <div className="relative bg-[#001a2c] border border-white/10 rounded-2xl shadow-2xl flex items-end gap-2 p-2 focus-within:border-sky-400/50 transition-colors">
              <button className="p-3 text-[#a3cbf2]/50 hover:text-sky-400 transition-colors shrink-0">
                <Sparkles size={20} />
              </button>
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Fish Guard AI anything..."
                className="w-full bg-transparent text-[#cee5ff] placeholder:text-[#a3cbf2]/30 focus:outline-none resize-none py-3 max-h-32 text-sm leading-relaxed custom-scrollbar"
                rows="1"
                style={{ minHeight: "44px" }}
              />

              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                whileHover={input.trim() && !isThinking ? { scale: 1.05 } : {}}
                whileTap={input.trim() && !isThinking ? { scale: 0.95 } : {}}
                className={`p-3 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  input.trim() && !isThinking 
                    ? "bg-sky-400 text-[#001526] shadow-[0_0_15px_rgba(83,214,251,0.4)]" 
                    : "bg-white/5 text-[#a3cbf2]/30 cursor-not-allowed"
                }`}
              >
                <Send size={18} className="ml-0.5" />
              </motion.button>
            </div>
            
            <p className="text-center text-[10px] text-[#a3cbf2]/40 mt-3 font-medium">
              Fish Guard AI can make mistakes. Consider verifying critical maritime conditions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatbotPage;