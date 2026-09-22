"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ZynBot } from "@/components/ZynBot";
import { StartupLoader } from "@/components/StartupLoader";
import { ProjectData, UserProfile } from "@/types/zyntarix";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"home" | "workspace">("home");
  const [selectedCategory, setSelectedCategory] = useState("Web app");
  const [promptInput, setPromptInput] = useState("");
  const [patchInput, setPatchInput] = useState("");

  const [user] = useState<UserProfile>({
    name: "Architect",
    email: "operator@zyntarix.com",
    credits: 50,
    maxCredits: 50,
    plan: "Pro Factory",
  });

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  const categories = ["Web app", "Mobile app", "Website", "3D Web", "Brainstorm"];

  const handleStartBuild = () => {
    if (!promptInput.trim()) return;

    const newProj: ProjectData = {
      id: Date.now().toString(),
      name: promptInput.slice(0, 24) + (promptInput.length > 24 ? "..." : ""),
      updatedAt: "Just now",
      status: "deploying",
    };

    setProjects([newProj, ...projects]);
    setActiveProject(newProj);
    setActiveTab("workspace");
    setPromptInput("");
  };

  const handleSendPatch = () => {
    if (!patchInput.trim()) return;
    setPatchInput("");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {loading && <StartupLoader onFinish={() => setLoading(false)} />}

      <Navbar
        user={user}
        activeProjectName={activeProject?.name}
        activeTab={activeTab}
        onTabSwitch={(tab) => setActiveTab(tab)}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex flex-col">
        {activeTab === "home" ? (
          /* SCREEN 1: CYBER STRATOSPHERE STUDIO */
          <div className="flex flex-col items-center space-y-5 sm:space-y-6 w-full">
            {/* Tagline */}
            <div className="text-center space-y-1.5 pt-1 sm:pt-2">
              <h1 className="text-xl sm:text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                Where ideas become verified apps.
              </h1>
              <p className="text-xs sm:text-sm font-medium text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)] max-w-md mx-auto">
                Describe it once. Nexa plans, builds, and verifies before shipping.
              </p>
            </div>

            {/* Specular Frosted Glass Card */}
            <div className="w-full bg-white/90 backdrop-blur-2xl border border-white/80 rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden">
              {/* Category Segment Tabs */}
              <div className="flex items-center space-x-1.5 border-b border-slate-200/70 p-2 sm:p-2.5 bg-white/50 overflow-x-auto text-xs sm:text-sm scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-white text-indigo-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3.5 sm:p-5">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={`Describe your ${selectedCategory.toLowerCase()} architecture in detail...`}
                  rows={4}
                  className="w-full text-xs sm:text-base bg-transparent outline-none resize-none placeholder:text-slate-400 text-slate-800 font-medium"
                />
              </div>

              {/* Action Bar */}
              <div className="border-t border-slate-200/70 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-white/60 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">
                    Deterministic Engine Ready
                  </span>
                </div>
                <button
                  onClick={handleStartBuild}
                  disabled={!promptInput.trim()}
                  className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 sm:space-x-2 transition-all shrink-0 ${
                    promptInput.trim()
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-98 cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span>Build with Nexa</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Active Projects Grid */}
            <div className="w-full space-y-2.5 pt-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] px-1">
                Active Projects ({projects.length})
              </h2>

              {projects.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl p-5 sm:p-7 text-center text-xs sm:text-sm font-medium text-slate-600 shadow-sm">
                  No applications active. Type a prompt above or ask Zyn in the corner.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        setActiveProject(proj);
                        setActiveTab("workspace");
                      }}
                      className="bg-white/90 backdrop-blur-xl border border-white/80 hover:border-indigo-400 p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-md space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-slate-800 line-clamp-1">
                          {proj.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {proj.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                        <span>{proj.updatedAt}</span>
                        <span className="text-indigo-600 font-bold">Open Engine →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SCREEN 2: ACTIVE WORKSPACE & COMMAND DOCK */
          <div className="flex-1 flex flex-col space-y-3.5 h-full">
            {/* Terminal Card */}
            <div className="bg-white/90 backdrop-blur-2xl border border-white/80 rounded-2xl sm:rounded-3xl flex flex-col shadow-lg overflow-hidden flex-1 min-h-[50vh]">
              <div className="p-3 sm:p-3.5 border-b border-slate-200/70 bg-white/60 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  Nexa Execution Log
                </span>
                <span className="text-[10px] sm:text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Pipeline Verified
                </span>
              </div>
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2 font-mono text-xs">
                <p className="text-slate-400"># Initializing sandbox container...</p>
                <div className="p-2.5 sm:p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-indigo-600 font-bold">✓ Step 1: Spec Engine Initialized</p>
                  <p className="text-slate-500 text-[11px]">Next.js App Router + PostgreSQL Schema</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-emerald-600 font-bold">✓ Step 2: Verification Engine Checked</p>
                  <p className="text-slate-500 text-[11px]">Static assertions verified. Zero unhandled exceptions.</p>
                </div>
              </div>

              {/* Integrated High-Tech Command Dock */}
              <div className="p-2.5 sm:p-3 border-t border-slate-200/70 bg-white/70">
                <div className="flex items-center bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-1 shadow-xs focus-within:border-indigo-500 transition-all">
                  <div className="hidden sm:flex items-center px-2.5 text-[11px] font-bold text-indigo-600 border-r border-slate-200">
                    ⚡ Nexa Core v2
                  </div>
                  <input
                    type="text"
                    value={patchInput}
                    onChange={(e) => setPatchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendPatch()}
                    placeholder="Tell Nexa to modify code or verify changes..."
                    className="flex-1 text-xs sm:text-sm px-2.5 py-1.5 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                  />
                  <button
                    onClick={handleSendPatch}
                    disabled={!patchInput.trim()}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center font-bold transition-all ${
                      patchInput.trim()
                        ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 cursor-pointer active:scale-95"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    ↑
                  </button>
                </div>
              </div>
            </div>

            {/* Live Gateway Card */}
            <div className="bg-white/90 backdrop-blur-2xl border border-white/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-md">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-800">Preview Container</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500">Dedicated micro-sandbox running live</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold rounded-xl shadow-xs transition-colors">
                  Open Live
                </button>
                <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] sm:text-xs font-bold rounded-xl shadow-xs transition-colors">
                  Ship App
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <ZynBot
        onTransferPromptToNexa={(prompt) => {
          setPromptInput(prompt);
          setActiveTab("home");
        }}
      />
    </div>
  );
}

