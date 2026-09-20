
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

  // Pure dynamic user state
  const [user, setUser] = useState<UserProfile>({
    name: "Developer",
    email: "user@zyntarix.com",
    credits: 50,
    maxCredits: 50,
    plan: "Free",
  });

  // Pure dynamic projects array
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  const categories = ["Web app", "Mobile app", "Website", "3D Web", "Brainstorm"];

  const handleStartBuild = () => {
    if (!promptInput.trim()) return;

    const newProj: ProjectData = {
      id: Date.now().toString(),
      name: promptInput.slice(0, 20) + (promptInput.length > 20 ? "..." : ""),
      updatedAt: "Just now",
      status: "deploying",
    };

    setProjects([newProj, ...projects]);
    setActiveProject(newProj);
    setActiveTab("workspace");
    setPromptInput("");
  };

  return (
    <div className="min-h-screen bg-canvas text-graphite flex flex-col relative font-sans">
      {/* 3D Startup Animation */}
      {loading && <StartupLoader onFinish={() => setLoading(false)} />}

      {/* Dynamic Top Navbar */}
      <Navbar
        user={user}
        activeProjectName={activeProject?.name}
        activeTab={activeTab}
        onTabSwitch={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 flex flex-col">
        {activeTab === "home" ? (
          /* SCREEN 1: HOME DASHBOARD */
          <div className="flex flex-col items-center justify-center flex-1 space-y-8 mt-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-graphite">
                Where ideas become verified apps.
              </h1>
              <p className="text-xs md:text-sm text-mutedText">
                Describe it once. Nexa builds, tests, and verifies before shipping.
              </p>
            </div>

            {/* Prompt Builder Card */}
            <div className="w-full max-w-2xl bg-surface border border-borderSlate rounded-2xl shadow-sm overflow-hidden">
              {/* Category Pills */}
              <div className="flex items-center space-x-1 border-b border-borderSlate p-2 bg-canvas/50 overflow-x-auto text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-surface shadow-sm text-brandIndigo font-semibold"
                        : "text-mutedText hover:text-graphite"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Text Input */}
              <div className="p-4">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={`Describe your ${selectedCategory.toLowerCase()} idea...`}
                  rows={4}
                  className="w-full text-xs md:text-sm bg-transparent outline-none resize-none placeholder:text-mutedText text-graphite"
                />
              </div>

              {/* Bottom Action Footer */}
              <div className="border-t border-borderSlate px-4 py-2.5 bg-canvas/30 flex items-center justify-between">
                <span className="text-[11px] text-mutedText font-medium">
                  Deterministic Verified Engine
                </span>
                <button
                  onClick={handleStartBuild}
                  disabled={!promptInput.trim()}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    promptInput.trim()
                      ? "bg-brandIndigo text-white hover:opacity-90 shadow-sm"
                      : "bg-slate-200 text-mutedText cursor-not-allowed"
                  }`}
                >
                  <span>Build with Nexa</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Dynamic Projects Grid */}
            <div className="w-full max-w-2xl space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-mutedText">
                Your Projects ({projects.length})
              </h2>

              {projects.length === 0 ? (
                <div className="bg-surface border border-borderSlate border-dashed rounded-xl p-8 text-center text-xs text-mutedText">
                  No projects created yet. Type a prompt above or ask Zyn in the corner.
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
                      className="bg-surface border border-borderSlate hover:border-brandIndigo p-3.5 rounded-xl cursor-pointer transition-all shadow-sm space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-xs text-graphite line-clamp-1">
                          {proj.name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            proj.status === "published"
                              ? "bg-emerald-50 text-verifyEmerald border border-verifyEmerald/20"
                              : "bg-blue-50 text-brandIndigo border border-brandIndigo/20"
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-mutedText">{proj.updatedAt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SCREEN 2: ACTIVE SPLIT WORKSPACE */
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Left Panel: Nexa Execution Log */}
            <div className="bg-surface border border-borderSlate rounded-2xl flex flex-col shadow-sm overflow-hidden">
              <div className="p-3 border-b border-borderSlate bg-canvas flex items-center justify-between">
                <span className="text-xs font-semibold text-graphite">
                  Nexa Engineering Pipeline
                </span>
                <span className="text-[10px] bg-emerald-50 text-verifyEmerald px-2 py-0.5 rounded font-bold border border-verifyEmerald/20">
                  Ready
                </span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs text-graphite">
                <div className="text-mutedText"># Initializing Project Workspace...</div>
                <div className="p-2.5 bg-canvas rounded-lg border border-borderSlate space-y-1">
                  <div className="text-brandIndigo font-semibold">✓ Step 1: Spec Engine Initialized</div>
                  <p className="text-[11px] text-mutedText">Architecture: Next.js + PostgreSQL Schema</p>
                </div>
                <div className="p-2.5 bg-canvas rounded-lg border border-borderSlate space-y-1">
                  <div className="text-verifyEmerald font-semibold">✓ Step 2: Verification Engine Checked</div>
                  <p className="text-[11px] text-mutedText">No unverified code reached sandbox.</p>
                </div>
              </div>
              <div className="p-3 border-t border-borderSlate bg-canvas/30">
                <input
                  type="text"
                  placeholder="Ask Nexa to change or fix..."
                  className="w-full text-xs p-2 rounded-lg border border-borderSlate bg-surface outline-none focus:border-brandIndigo"
                />
              </div>
            </div>

            {/* Right Panel: Deployment & Preview */}
            <div className="bg-surface border border-borderSlate rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="border-b border-borderSlate pb-3 flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-mutedText">
                    Live Status & Release
                  </h3>
                  <span className="text-xs text-mutedText font-mono">v1.0.0</span>
                </div>

                <div className="p-4 rounded-xl border border-verifyEmerald/30 bg-emerald-50/40 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-graphite">Preview Container</h4>
                    <p className="text-[11px] text-mutedText">Connected to isolated sandbox</p>
                  </div>
                  <button className="px-3 py-1.5 bg-verifyEmerald text-white text-xs font-bold rounded-lg hover:opacity-90">
                    Open Live
                  </button>
                </div>
              </div>

              <div className="border-t border-borderSlate pt-3 flex justify-between items-center">
                <span className="text-[11px] text-mutedText font-medium">Ready for deployment</span>
                <button className="px-4 py-2 bg-brandIndigo text-white rounded-xl text-xs font-bold hover:opacity-90">
                  Re-publish changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Zyn Bot */}
      <ZynBot
        onTransferPromptToNexa={(prompt) => {
          setPromptInput(prompt);
          setActiveTab("home");
        }}
      />
    </div>
  );
}
