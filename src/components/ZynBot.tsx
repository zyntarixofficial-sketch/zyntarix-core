
"use client";

import React, { useState, useRef } from "react";

interface ZynBotProps {
  onTransferPromptToNexa: (prompt: string) => void;
}

export const ZynBot: React.FC<ZynBotProps> = ({ onTransferPromptToNexa }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "zyn"; text: string; image?: string }>>([]);
  const [inputVal, setInputVal] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  const handleSendMessage = async () => {
    if (!inputVal && !selectedImage) return;

    const userText = inputVal;
    const newMsg = { sender: "user" as const, text: userText, image: selectedImage || undefined };
    setMessages((prev) => [...prev, newMsg]);
    setInputVal("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      const res = await fetch("/api/zyn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      const zynReply = data.reply || "I am ready to architect your application logic. What features should we plan?";

      setMessages((prev) => [
        ...prev,
        {
          sender: "zyn",
          text: zynReply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "zyn",
          text: "Let's structure your application components and transfer directly to Nexa Engine.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-2xl border border-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="font-black text-xs tracking-wider">ZYN</span>
        </button>
      ) : (
        <div className="w-[calc(100vw-32px)] sm:w-96 max-w-sm h-[440px] sm:h-[460px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header without 3rd party names */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-xs text-slate-800">Zyn Co-Pilot (0 Credits)</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-800 text-sm font-bold px-1">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.length === 0 ? (
              <div className="text-center mt-8 space-y-1.5 px-2">
                <p className="font-bold text-slate-800">Zyntarix Global Assistant</p>
                <p className="text-slate-500 text-[11px]">
                  Free architectural brainstorming without consuming credits. Chat in any language, then transfer to Nexa.
                </p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl max-w-[85%] ${
                    m.sender === "user"
                      ? "ml-auto bg-indigo-600 text-white"
                      : "mr-auto bg-slate-100 border border-slate-200 text-slate-800"
                  }`}
                >
                  {m.image && <img src={m.image} alt="Upload" className="rounded-lg mb-2 max-h-32 object-cover" />}
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  {m.sender === "zyn" && (
                    <button
                      onClick={() => onTransferPromptToNexa(m.text)}
                      className="mt-2.5 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg font-bold block w-full text-center shadow-xs transition-colors"
                    >
                      🚀 Transfer to Nexa Builder
                    </button>
                  )}
                </div>
              ))
            )}
            {isTyping && (
              <div className="mr-auto bg-slate-100 border border-slate-200 text-slate-500 text-[11px] px-3 py-1.5 rounded-xl animate-pulse">
                Zyn is thinking...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-2.5 border-t border-slate-200 bg-slate-50 space-y-2">
            {selectedImage && (
              <div className="relative inline-block">
                <img src={selectedImage} alt="Attachment" className="h-10 w-10 object-cover rounded border" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-1 -right-1 bg-slate-900 text-white rounded-full text-[10px] w-4 h-4"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 bg-white"
              >
                📎
              </button>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask Zyn anything for free..."
                className="flex-1 text-xs p-1.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-600 text-slate-800"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputVal.trim() && !selectedImage}
                className="bg-indigo-600 disabled:bg-slate-300 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-transform"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
