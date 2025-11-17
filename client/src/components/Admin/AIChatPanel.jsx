import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Loader2 } from "lucide-react";
import { useAIChatStore } from "../../store/useAIChatStore";
import API from "../../utils/api";

const AIChatPanel = () => {
  const { isOpen, closeChat } = useAIChatStore();
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Salut! 👋 Sunt asistentul tău BillForge AI. Cu ce te pot ajuta?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((p) => [...p, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await API.post(
        "/ai/chat",
        { messages: [...messages, userMessage] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((p) => [...p, { sender: "ai", text: data.reply }]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          sender: "ai",
          text: "❌ Eroare la procesarea cererii. Încearcă din nou!",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background blur */}
          <motion.div
            onClick={closeChat}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Slide-in panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-[380px] bg-[#111]/95 border-l border-white/10 z-50 shadow-xl flex flex-col"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 22 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-[#80FFF9]" />
                <h2 className="font-semibold">AI Assistant</h2>
              </div>
              <button onClick={closeChat}>
                <X className="text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                    msg.sender === "user"
                      ? "ml-auto bg-[#80FFF9]/20 text-[#80FFF9] border border-[#80FFF9]/40"
                      : "bg-white/5 text-gray-200 border border-white/10"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Loader2 className="animate-spin" size={16} /> AI typing…
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-xl">
                <input
                  className="flex-1 bg-transparent px-3 py-2 outline-none text-sm text-gray-200"
                  placeholder="Ask something…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  className="px-4 py-2 text-[#80FFF9] hover:text-white"
                  onClick={sendMessage}
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatPanel;
