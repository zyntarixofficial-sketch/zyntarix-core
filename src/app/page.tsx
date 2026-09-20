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
    name: "Developer",
    email: "user@zyntarix.com",
    credits: 50,
    maxCredits: 50,
    plan: "Free",
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {loading && <StartupLoader onFinish={() => setLoading(false)} />}

      <Navbar
        user={user}
        activeProjectName={activeProject?.name}
        activeTab={activeTab}
        onTabSwitch={(tab) => setActiveTab(tab)}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 md:py-10 flex flex-col">
        {activeTab === "home" ? (
          /* SCREEN 1: HOME DASHBOARD */
          <div className="flex flex-col items-center space-y-6 w-full max-w-2xl mx-auto">
            {/* Hero Title */}
            <div className="text-center space-y-2 pt-2 md:pt-4">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Where ideas become verified apps.
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Describe it once. Nexa plans, builds, and verifies before shipping.
              </p>
            </div>

            {/* Prompt Builder Box */}
            <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              {/* Category Segment Tabs */}
              <div className="flex items-center space-x-1 border-b border-slate-100 p-2 bg-slate-50/70 overflow-x-auto text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl transition-all font-semibold whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-white shadow-xs text-indigo-600"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={`Describe your ${selectedCategory.toLowerCase()} idea in detail...`}
                  rows={4}
                  className="w-full text-sm sm:text-base bg-transparent outline-none resize-none placeholder:text-slate-400 text-slate-800"
                />
              </div>

              {/* Action Footer */}
              <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Deterministic Verification Active
                </span>
                <button
                  onClick={handleStartBuild}
                  disabled={!promptInput.trim()}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
                    promptInput.trim()
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-98 cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span>Build with Nexa</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Projects Section */}
            <div className="w-full space-y-3 pt-2">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Your Projects ({projects.length})
                </h2>
              </div>

              {projects.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 text-center text-xs sm:text-sm text-slate-400">
                  No projects yet. Type your idea above or tap Zyn at the bottom right.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        setActiveProject(proj);
                        setActiveTab("workspace");
                      }}
                      className="bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md p-4 rounded-2xl cursor-pointer transition-all space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-slate-800 line-clamp-1">
                          {proj.name}
                        </span>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                            proj.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>{proj.updatedAt}</span>
                        <span className="text-indigo-600 font-semibold">Open Workspace →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SCREEN 2: ACTIVE SPLIT WORKSPACE */
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-[550px]">
            {/* Left: Terminal Log */}
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col shadow-xs overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  Nexa Execution Log
                </span>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  Verified Active
                </span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-mono">
                <p className="text-slate-400"># Building sandbox environment...</p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-indigo-600 font-bold">✓ Step 1: Spec Engine Initialized</p>
                  <p className="text-slate-500 text-[11px]">Schema: Next.js + PostgreSQL Contract</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-emerald-600 font-bold">✓ Step 2: Verification Engine Checked</p>
                  <p className="text-slate-500 text-[11px]">No unverified changes detected.</p>
                </div>
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50/40">
                <input
                  type="text"
                  placeholder="Tell Nexa to modify or patch..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Right: Live Preview & Ship */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Deployment Pipeline
                  </h3>
                  <span className="text-xs font-mono text-slate-500">v1.0.0</span>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800">Preview Container</h4>
                    <p className="text-xs text-slate-500">Isolated cloud sandbox connected</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700">
                    Open Live
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Checks passed: Ready to ship</span>
                <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100">
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

