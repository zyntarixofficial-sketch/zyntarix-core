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
      name: promptInput.slice(0, 26) + (promptInput.length > 26 ? "..." : ""),
      updatedAt: "Just now",
      status: "deploying",
    };

    setProjects([newProj, ...projects]);
    setActiveProject(newProj);
    setActiveTab("workspace");
    setPromptInput("");
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

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 md:py-12 flex flex-col justify-start">
        {activeTab === "home" ? (
          /* SCREEN 1: HIGH-TECH SKY PROMPT STUDIO */
          <div className="flex flex-col items-center space-y-6 w-full">
            {/* Title Section with High-Tech Drop Shadow */}
            <div className="text-center space-y-2 pt-2 sm:pt-4">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
                Where ideas become verified apps.
              </h1>
              <p className="text-sm sm:text-base font-medium text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)] max-w-lg mx-auto">
                Describe it once. Nexa plans, builds, and verifies before shipping.
              </p>
            </div>

            {/* Frosted Glassmorphism Prompt Card */}
            <div className="w-full bg-white/85 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden focus-within:ring-2 focus-within:ring-white/80 transition-all">
              {/* Category Segment Tabs */}
              <div className="flex items-center space-x-1.5 border-b border-slate-200/60 p-2.5 bg-white/40 overflow-x-auto text-xs sm:text-sm">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 sm:p-5">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={`Describe your ${selectedCategory.toLowerCase()} idea in detail...`}
                  rows={4}
                  className="w-full text-base sm:text-lg bg-transparent outline-none resize-none placeholder:text-slate-400 text-slate-800 font-medium"
                />
              </div>

              {/* Action Bar */}
              <div className="border-t border-slate-200/60 px-5 py-3.5 bg-white/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-600">
                    Deterministic Engine Ready
                  </span>
                </div>
                <button
                  onClick={handleStartBuild}
                  disabled={!promptInput.trim()}
                  className={`px-6 py-2.5 rounded-2xl text-sm font-bold flex items-center space-x-2 transition-all ${
                    promptInput.trim()
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:opacity-95 shadow-lg shadow-indigo-500/25 active:scale-98 cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span>Build with Nexa</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Dynamic Active Projects Section */}
            <div className="w-full space-y-3 pt-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] px-1">
                Active Projects ({projects.length})
              </h2>

              {projects.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 text-center text-sm font-medium text-slate-500 shadow-sm">
                  No applications active. Type a requirement above or tap Zyn at the bottom right.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        setActiveProject(proj);
                        setActiveTab("workspace");
                      }}
                      className="bg-white/90 backdrop-blur-lg border border-white/70 hover:border-indigo-400 p-5 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-md space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-base text-slate-800 line-clamp-1">
                          {proj.name}
                        </span>
                        <span className="text-[11px] px-3 py-1 rounded-full font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {proj.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                        <span>{proj.updatedAt}</span>
                        <span className="text-indigo-600 font-bold">Open Workspace →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SCREEN 2: ACTIVE SPLIT WORKSPACE */
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-[500px]">
            {/* Terminal Card */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/70 rounded-3xl flex flex-col shadow-lg overflow-hidden">
              <div className="p-4 border-b border-slate-200/70 bg-white/50 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  Nexa Execution Log
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  Pipeline Verified
                </span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-mono">
                <p className="text-slate-400"># Initializing cloud micro-sandbox...</p>
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-1">
                  <p className="text-indigo-600 font-bold">✓ Step 1: Spec Engine Initialized</p>
                  <p className="text-slate-500">Architecture: Next.js App Router + PostgreSQL</p>
                </div>
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-1">
                  <p className="text-emerald-600 font-bold">✓ Step 2: Verification Engine Checked</p>
                  <p className="text-slate-500">Static assertions and security passed.</p>
                </div>
              </div>
              <div className="p-3.5 border-t border-slate-200/70 bg-white/40">
                <input
                  type="text"
                  placeholder="Ask Nexa to refine code..."
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Deployment & Live Card */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/70 rounded-3xl p-6 flex flex-col justify-between shadow-lg">
              <div className="space-y-4">
                <div className="border-b border-slate-200/70 pb-3 flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Deployment Pipeline
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-500">v1.0.0</span>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Preview Container</h4>
                    <p className="text-xs text-slate-500">Dedicated sandbox active</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700">
                    Open Live
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200/70 pt-4 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Ready to ship</span>
                <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs sm:text-sm font-bold hover:bg-indigo-700 shadow-md">
                  Publish to Production
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

