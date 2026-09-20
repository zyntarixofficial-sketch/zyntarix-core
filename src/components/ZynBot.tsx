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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  const handleSendMessage = () => {
    if (!inputVal && !selectedImage) return;

    const newMsg = { sender: "user" as const, text: inputVal, image: selectedImage || undefined };
    setMessages((prev) => [...prev, newMsg]);

    // Structured requirement translation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "zyn",
          text: `Analysis complete. Architectural requirement generated for: "${inputVal || "Uploaded Image"}". Ready to run on Nexa.`,
        },
      ]);
    }, 600);

    setInputVal("");
    setSelectedImage(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-graphite text-white flex items-center justify-center shadow-xl border border-borderSlate hover:scale-105 transition-transform"
        >
          <span className="font-bold text-sm tracking-wider">ZYN</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 h-[460px] bg-surface border border-borderSlate rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-3 bg-canvas border-b border-borderSlate flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-verifyEmerald animate-pulse"></span>
              <span className="font-semibold text-xs text-graphite">Zyn Brainstormer (Free Tier)</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-mutedText hover:text-graphite text-sm">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.length === 0 ? (
              <p className="text-mutedText text-center mt-10">
                Upload a sketch or describe your thoughts without burning build credits.
              </p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl max-w-[85%] ${
                    m.sender === "user"
                      ? "ml-auto bg-brandIndigo text-white"
                      : "mr-auto bg-canvas border border-borderSlate text-graphite"
                  }`}
                >
                  {m.image && <img src={m.image} alt="Upload" className="rounded-lg mb-2 max-h-32 object-cover" />}
                  <p>{m.text}</p>
                  {m.sender === "zyn" && (
                    <button
                      onClick={() => onTransferPromptToNexa(m.text)}
                      className="mt-2 text-[11px] bg-verifyEmerald text-white px-2 py-1 rounded font-medium block w-full text-center hover:opacity-90"
                    >
                      🚀 Transfer to Nexa
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Input & Image Attachment */}
          <div className="p-2.5 border-t border-borderSlate bg-canvas space-y-2">
            {selectedImage && (
              <div className="relative inline-block">
                <img src={selectedImage} alt="Attachment" className="h-10 w-10 object-cover rounded border" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-1 -right-1 bg-graphite text-white rounded-full text-[10px] w-4 h-4"
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
                className="p-1.5 text-mutedText hover:text-graphite rounded-lg border border-borderSlate bg-surface"
              >
                📎
              </button>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type an idea..."
                className="flex-1 text-xs p-1.5 bg-surface border border-borderSlate rounded-lg outline-none focus:border-brandIndigo"
              />
              <button
                onClick={handleSendMessage}
                className="bg-graphite text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90"
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

