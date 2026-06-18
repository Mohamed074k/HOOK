// src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  getConversations, 
  getConversationById, 
  starConversation, 
  deleteConversation, 
  sendChatMessageStream 
} from "../../services/chatbot.service"; 

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // Fetch all conversations on mount
  const loadConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  // ✅ التعديل هنا: التأكد من وجود التوكن قبل طلب المحادثات
  useEffect(() => {
    const token = localStorage.getItem("token"); // تأكد من اسم التوكن المستخدم في مشروعك
    if (token) {
      loadConversations();
    }
  }, []);

  // Load a specific conversation
  const loadConversation = async (id) => {
    try {
      setActiveConversationId(id);
      const data = await getConversationById(id);
      
      // Map backend format to UI format
      const formattedMessages = data.map((msg) => ({
        id: msg.id,
        role: msg.role === "User" ? "user" : "ai",
        text: msg.content,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to load conversation details:", error);
    }
  };

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  const toggleStar = async (id) => {
    try {
      await starConversation(id);
      loadConversations(); // Refresh list to reflect star
    } catch (error) {
      console.error("Failed to star conversation:", error);
    }
  };

  const deleteChat = async (id) => {
    try {
      await deleteConversation(id);
      if (activeConversationId === id) startNewChat();
      loadConversations();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  // The Streaming Message Sender
  const sendMessage = async (text) => {
    if (!text.trim() || isStreaming) return;

    // 1. Optimistically add user message
    const userMsg = { id: Date.now().toString(), role: "user", text: text };
    setMessages((prev) => [...prev, userMsg]);
    
    // 2. Add an empty AI message that we will append chunks to
    const tempAiId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: tempAiId, role: "ai", text: "" }]);
    setIsStreaming(true);

    try {
      const response = await sendChatMessageStream(text, activeConversationId);

      if (!response.ok) throw new Error("Network response was not ok");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let currentConversationId = activeConversationId;
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last potentially incomplete line in the buffer
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6).trim();
            
            // Handle end of stream
            if (dataStr === "[DONE]") {
              setIsStreaming(false);
              loadConversations(); 
              continue;
            }
            
            try {
              const parsed = JSON.parse(dataStr);
              
              if (parsed.conversationId && !currentConversationId) {
                currentConversationId = parsed.conversationId;
                setActiveConversationId(parsed.conversationId);
              }
              
              if (parsed.chunk) {
                setMessages((prev) => 
                  prev.map((msg) => 
                    msg.id === tempAiId ? { ...msg, text: msg.text + parsed.chunk } : msg
                  )
                );
              }
            } catch (e) {
              console.error("Error parsing stream chunk:", e, dataStr);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsStreaming(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        messages,
        isStreaming,
        loadConversation,
        startNewChat,
        sendMessage,
        toggleStar,
        deleteChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};