"use client";

import React, { useState, useRef } from "react";

interface ZynBotProps {
  onTransferPromptToNexa: (prompt: string) => void;
  userCredits?: number;
  userPlan?: string;
}

export const ZynBot: React.FC<ZynBotProps> = ({
  onTransferPromptToNexa,
  userCredits = 50,
  userPlan = "Pro Factory",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "zyn"; text: string; image?: string }>>([]);
  const [inputVal, setInputVal] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputVal && !selectedImage) return;

    const userText = inputVal;
    const currentImg = selectedImage;
    const currentBase64 = base64Image;

    const newMsg = { sender: "user" as const, text: userText, image: currentImg || undefined };
    setMessages((prev) => [...prev, newMsg]);

    setInputVal("");
    setSelectedImage(null);
    setBase64Image(null);
    setIsTyping(true);

    try {
      const res = await fetch("/api/zyn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          image: currentBase64,
          userContext: {
            credits: userCredits,
            plan: userPlan,
          },
        }),
      });

      const data = await res.json();
      const zynReply = data.reply || "I am here! How can I assist you with your project today?";

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
          text: "I am ready. Tell me about your app ideas or ask any questions!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-2xl border border-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="font-black text-xs tracking-wider">ZYN</span>
        </button>
      ) : (
        <div className="w-[calc(100vw-32px)] sm:w-96 max-w-sm h-[460px] sm:h-[480px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-xs text-slate-800">Zyn Assistant (0 Credits)</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-800 text-sm font-bold px-1">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.length === 0 ? (
              <div className="text-center mt-10 space-y-2 px-3">
                <p className="font-black text-slate-800 text-sm">Hey there! I'm Zyn ⚡</p>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Your free companion. Ask me questions, discuss your app plan, upload sketches or error screenshots, or ask for a build prompt when you're ready!
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
                  {m.image && <img src={m.image} alt="Upload" className="rounded-lg mb-2 max-h-36 object-cover" />}
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  {m.sender === "zyn" && m.text.toLowerCase().includes("build") && (
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
                Zyn is typing...
              </div>
            )}
          </div>

          {/* Input & Image Attachment */}
          <div className="p-2.5 border-t border-slate-200 bg-slate-50 space-y-2">
            {selectedImage && (
              <div className="relative inline-block">
                <img src={selectedImage} alt="Attachment" className="h-12 w-12 object-cover rounded-lg border border-slate-300" />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setBase64Image(null);
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold"
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
                title="Upload sketch or screenshot"
              >
                📎
              </button>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Talk to Zyn or ask questions..."
                className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-600 text-slate-800"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputVal.trim() && !selectedImage}
                className="bg-indigo-600 disabled:bg-slate-300 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-transform"
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

