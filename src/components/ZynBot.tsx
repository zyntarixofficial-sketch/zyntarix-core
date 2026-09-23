"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  sender: "user" | "zyn";
  text: string;
}

export default function ZynChatModal({ userCredits = 0 }: { userCredits?: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  // Pending message queue for silent auto-retry
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const retryInterval = useRef<NodeJS.Timeout | null>(null);

  // Send function
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Direct UI add for WhatsApp feel
    if (!pendingMessage) {
      setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    }
    
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/zyn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          credits: userCredits
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => [...prev, { sender: "zyn", text: data.reply }]);
          setIsActive(true);
          setPendingMessage(null); // Clear queue on success
          if (retryInterval.current) clearInterval(retryInterval.current);
        }
      } else {
        // Backend temporarily down/busy: fail silently, turn off green dot
        setIsActive(false);
        setPendingMessage(textToSend); // Save to background retry
      }
    } catch (err) {
      // Network drop: fail silently
      setIsActive(false);
      setPendingMessage(textToSend);
    } finally {
      setIsTyping(false);
    }
  };

  // Background Auto-Retry Timer: checks every 5 seconds silently
  useEffect(() => {
    if (pendingMessage) {
      retryInterval.current = setInterval(() => {
        handleSendMessage(pendingMessage);
      }, 5000);
    }

    return () => {
      if (retryInterval.current) clearInterval(retryInterval.current);
    };
  }, [pendingMessage]);

  return (
    <div className="w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
      {/* Header: Pure WhatsApp Style */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-sm">Zyn (Zyntarix)</span>
          {isActive ? (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] text-emerald-600 font-medium">Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-300"></span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="p-4 h-[350px] overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                m.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
          placeholder="Ask Zyn anything..."
          className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-indigo-500"
        />
        <button
          onClick={() => handleSendMessage(input)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}

