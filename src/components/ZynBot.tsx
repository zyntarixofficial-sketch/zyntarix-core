
"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Paperclip, Send, ArrowUpRight } from "lucide-react";

interface Message {
  sender: "user" | "zyn";
  text: string;
}

export interface ZynBotProps {
  userCredits?: number;
  onTransferPromptToNexa?: (prompt: string) => void;
  onTransferToPromptToNexa?: (prompt: string) => void;
  [key: string]: any;
}

export function ZynBot(props: ZynBotProps) {
  const { userCredits = 0 } = props;
  const transferHandler = props.onTransferPromptToNexa || props.onTransferToPromptToNexa;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "zyn",
      text: "Hey there! I am Zyn, the architectural co-pilot of Zyntarix. How can I help you shape your application today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Background queue for silent auto-retries
  const [pendingPayload, setPendingPayload] = useState<{
    message: string;
    image: string | null;
  } | null>(null);
  const retryInterval = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textToSend: string, imageToSend: string | null = null) => {
    if (!textToSend.trim() && !imageToSend) return;

    if (!pendingPayload) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: textToSend || "[Attached screenshot for diagnosis]",
        },
      ]);
    }

    const payload = {
      message: textToSend,
      image: imageToSend,
      credits: userCredits,
    };

    setInput("");
    setSelectedImage(null);

    try {
      const res = await fetch("/api/zyn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => [...prev, { sender: "zyn", text: data.reply }]);
          setIsActive(true);
          setPendingPayload(null);
          if (retryInterval.current) clearInterval(retryInterval.current);
        }
      } else {
        setIsActive(false);
        setPendingPayload({ message: textToSend, image: imageToSend });
      }
    } catch {
      setIsActive(false);
      setPendingPayload({ message: textToSend, image: imageToSend });
    }
  };

  useEffect(() => {
    if (pendingPayload) {
      retryInterval.current = setInterval(() => {
        handleSendMessage(pendingPayload.message, pendingPayload.image);
      }, 5000);
    }

    return () => {
      if (retryInterval.current) clearInterval(retryInterval.current);
    };
  }, [pendingPayload]);

  return (
    /* Shifted up to bottom-20 on mobile and bottom-24 on desktop to avoid blocking the patch send button */
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 flex flex-col items-end pointer-events-auto">
      {isOpen && (
        <div className="mb-3 w-[340px] sm:w-[360px] max-w-[90vw] h-[450px] sm:h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 text-sm">Zyn (Zyntarix)</span>
              {isActive ? (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-emerald-600 font-medium">Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                </div>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition p-1"
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>

                {/* Transfer to Nexa Builder Button */}
                {m.sender === "zyn" && transferHandler && idx > 0 && (
                  <button
                    onClick={() => transferHandler(m.text)}
                    className="mt-1.5 flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium px-2 py-0.5 rounded-md hover:bg-indigo-50 transition"
                  >
                    Transfer to Nexa Builder
                    <ArrowUpRight size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="px-3 py-1.5 bg-gray-100 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
              <span className="truncate">Image attached for diagnosis</span>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-red-500 hover:text-red-700 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input & Action Bar */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
              title="Attach screenshot"
            >
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input, selectedImage)}
              placeholder="Talk to Zyn or ask questions..."
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSendMessage(input, selectedImage)}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition shadow-sm"
              aria-label="Send"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Launcher Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-slate-900 border border-slate-700 text-white shadow-xl hover:scale-105 active:scale-95 transition flex items-center justify-center font-bold"
        aria-label="Toggle Zyn"
      >
        {isOpen ? <X size={18} /> : <MessageSquare size={18} />}
      </button>
    </div>
  );
}

export default ZynBot;
