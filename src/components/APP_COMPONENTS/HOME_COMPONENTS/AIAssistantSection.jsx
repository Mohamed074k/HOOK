import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Zap, Fish, Shield, Award, Bot, Send } from "lucide-react";
import gsap from "gsap";

const AIAssistantSection = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your smart fishing assistant. Ask me anything — ideal trip conditions, best lures, or help planning your next expedition!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const sectionRef = useRef(null);
  const chatEndRef = useRef(null);

  const suggestions = [
    "Best time to fish in Gulf of Mexico?",
    "What gear do I need?",
    "Recommend a trip for beginners",
  ];

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1200));
    const responses = {
      default: "Great question! Based on current conditions, I'd recommend our Gulf of Mexico Deep Sea Adventure. The water temperature is ideal for Marlin and Tuna this season. Would you like to know more about booking options?",
    };
    setMessages(prev => [...prev, { role: "ai", text: responses.default }]);
    setIsTyping(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.from(".ai-section-content", {
            opacity: 0, y: 40, duration: 0.8, ease: "back.out(0.4)"
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="ai-section-content relative rounded-3xl overflow-hidden border border-sky-400/15 bg-[#002238]"
        style={{ background: "linear-gradient(135deg, #002238 0%, #001526 100%)" }}>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(83,214,251,0.3) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(0,138,167,0.3) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-sky-500/10 rounded-full px-3 py-1 mb-5 border border-sky-400/20 w-fit">
              <Zap size={12} className="text-sky-400" />
              <span className="text-xs text-sky-300 font-semibold tracking-widest uppercase">AI-Powered</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#cee5ff] mb-4">
              Smart Fishing with <span className="bg-gradient-to-r from-sky-300 to-cyan-400 bg-clip-text text-transparent">AI</span>
            </h2>
            <p className="text-[#a3cbf2]/60 text-sm leading-relaxed mb-8 max-w-sm">
              Ask our AI assistant anything. From finding the most relevant fishing charters to trip logistics, weather insights, and gear recommendations.
            </p>
            <div className="space-y-3">
              {[
                { icon: Fish, text: "Trip & catch recommendations" },
                { icon: Shield, text: "Safety & weather insights" },
                { icon: Award, text: "Expert gear advice" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-[#a3cbf2]/70">
                  <div className="w-7 h-7 rounded-lg bg-sky-400/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-sky-400" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="border-l border-white/5 p-6 flex flex-col" style={{ minHeight: 400 }}>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h4 className="text-[#cee5ff] font-bold text-sm">FishAI Assistant</h4>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[#a3cbf2]/50 text-xs">Online</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-48">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot size={14} className="text-sky-400" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2.5 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-sky-500/20 text-sky-100 border border-sky-400/20"
                      : "bg-[#001526] text-[#a3cbf2] border border-white/5"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-sky-400" />
                  </div>
                  <div className="bg-[#001526] border border-white/5 px-3 py-2.5 rounded-xl flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400/60"
                        animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map((s) => (
                <button key={s} onClick={() => handleSend(s)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-[#001526] border border-white/5 text-[#a3cbf2]/60 hover:text-sky-400 hover:border-sky-400/30 transition-all">
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything about fishing..."
                className="flex-1 bg-[#001526] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-[#cee5ff] placeholder:text-[#64748B]/50 focus:outline-none focus:border-sky-400/40 transition-all"
              />
              <motion.button
                onClick={() => handleSend()}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(83,214,251,0.3)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantSection;