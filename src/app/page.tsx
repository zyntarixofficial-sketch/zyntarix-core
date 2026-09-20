"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  FolderGit2,
  Wrench,
  ShieldCheck,
  Rocket,
  Send,
  Menu,
  X,
  Bot,
  User,
  CheckCircle2,
  Loader2,
  MessageSquare
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  steps?: string[];
  timestamp: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("nexa");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputCommand, setInputCommand] = useState("");
  const [isAgentWorking, setIsAgentWorking] = useState(false);

  // Main Workspace Messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "agent",
      text: "Zyntarix Agent Workspace ready. Give instructions below to build, fix, or plan software.",
      timestamp: "Just now"
    }
  ]);

  // Zyn Floating Pop-up Assistant State
  const [isZynOpen, setIsZynOpen] = useState(false);
  const [zynInput, setZynInput] = useState("");
  const [zynChat, setZynChat] = useState<{ sender: "user" | "zyn"; text: string }[]>([
    {
      sender: "zyn",
      text: "Hello! I am Zyn. How can I help you with your project?"
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const zynEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAgentWorking]);

  useEffect(() => {
    zynEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [zynChat]);

  // Main Agent Command Execution
  const handleSendCommand = () => {
    if (!inputCommand.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputCommand,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentPrompt = inputCommand;
    setInputCommand("");
    setIsAgentWorking(true);

    setTimeout(() => {
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: `Executing instruction: "${currentPrompt}"`,
        steps: [
          "Parsing architecture spec & project requirements",
          "Generating code structures & API contracts",
          "Executing integrity checks & tests",
          "Task successfully completed and ready to review"
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsAgentWorking(false);
    }, 1500);
  };

  // Zyn Corner Chat Send
  const handleSendZyn = () => {
    if (!zynInput.trim()) return;

    const userText = zynInput;
    setZynChat((prev) => [...prev, { sender: "user", text: userText }]);
    setZynInput("");

    setTimeout(() => {
      setZynChat((prev) => [
        ...prev,
        {
          sender: "zyn",
          text: `Understood! I'm monitoring this task and keeping your workspace synced.`
        }
      ]);
    }, 1000);
  };

  const navItems = [
    { id: "nexa", label: "Nexa Studio", icon: Sparkles },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "forge", label: "Forge Workspace", icon: Wrench },
    { id: "test", label: "Verification Gate", icon: ShieldCheck },
    { id: "ship", label: "Deploy & Ship", icon: Rocket }
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden relative">
      {/* Overlay for Left Pop-up Sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Left Pop-up Sidebar (Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 p-5 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                Z
              </div>
              <div>
                <h1 className="font-semibold text-slate-900 leading-tight">Zyntarix</h1>
                <p className="text-xs text-slate-500 font-medium">Software Factory</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
          <span>v1.0.0</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Agent Ready
          </span>
        </div>
      </aside>

      {/* Center Main Workspace */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              title="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-800">
                {navItems.find((n) => n.id === activeTab)?.label}
              </span>
              <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
          </div>
        </header>

        {/* Output & Execution Flow Area (Agent work shown here) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl w-full mx-auto pb-24">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "agent" && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-xs"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs"
                }`}
              >
                <div className="font-medium whitespace-pre-wrap">{msg.text}</div>

                {msg.steps && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Agent Operations:
                    </p>
                    {msg.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-2 ${
                    msg.sender === "user" ? "text-blue-200 text-right" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isAgentWorking && (
            <div className="flex gap-3 items-center text-slate-500 text-xs bg-white border border-slate-200 w-fit px-4 py-2.5 rounded-xl shadow-xs animate-pulse">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Agent is running your instructions...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Bottom Fixed Command Box */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="max-w-4xl mx-auto flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all shadow-xs">
            <textarea
              rows={1}
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendCommand();
                }
              }}
              placeholder="Give instructions to the agent..."
              className="flex-1 bg-transparent border-0 resize-none px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={handleSendCommand}
              disabled={!inputCommand.trim() || isAgentWorking}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-xs flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Zyn Pop-up in Right Corner */}
      <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end">
        {isZynOpen && (
          <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 mb-3 overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-3">
            {/* Pop-up Header */}
            <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-tight">Zyn</h4>
                  <p className="text-[11px] text-blue-100">AI Project Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsZynOpen(false)}
                className="text-blue-100 hover:text-white transition p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pop-up Chat Stream */}
            <div className="p-4 h-64 overflow-y-auto bg-slate-50 text-xs space-y-2.5">
              {zynChat.map((chat, idx) => (
                <div
                  key={idx}
                  className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-2.5 ${
                      chat.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-slate-200 text-slate-700 shadow-xs"
                    }`}
                  >
                    {chat.text}
                  </div>
                </div>
              ))}
              <div ref={zynEndRef} />
            </div>

            {/* Pop-up Input */}
            <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={zynInput}
                onChange={(e) => setZynInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendZyn();
                }}
                placeholder="Ask Zyn anything..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSendZyn}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Corner Floating Circular Button */}
        <button
          onClick={() => setIsZynOpen(!isZynOpen)}
          className="w-13 h-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          title="Chat with Zyn"
        >
          {isZynOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}

