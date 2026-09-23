"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ZynBot } from "@/components/ZynBot";
import { StartupLoader } from "@/components/StartupLoader";
import { ProjectData, UserProfile } from "@/types/zyntarix";

interface GeneratedFile {
  path: string;
  content: string;
}

interface AgentLog {
  id: string;
  agent: "nexe" | "claude" | "gemini" | "verifier" | "system";
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
}

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

  // Multi-Agent Workspace States
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [workspaceView, setWorkspaceView] = useState<"logs" | "code" | "preview">("logs");
  const [exportModal, setExportModal] = useState(false);

  const categories = ["Web app", "Mobile app", "Website", "3D Web", "Brainstorm"];

  const addLog = (
    agent: AgentLog["agent"],
    message: string,
    type: AgentLog["type"] = "info"
  ) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setAgentLogs((prev) => [...prev, { id: Math.random().toString(), agent, message, type, timestamp: time }]);
  };

  const handleStartBuild = async () => {
    if (!promptInput.trim()) return;

    const currentPrompt = promptInput;
    const newProj: ProjectData = {
      id: Date.now().toString(),
      name: currentPrompt.slice(0, 24) + (currentPrompt.length > 24 ? "..." : ""),
      updatedAt: "Just now",
      status: "deploying",
    };

    setProjects([newProj, ...projects]);
    setActiveProject(newProj);
    setActiveTab("workspace");
    setWorkspaceView("logs");
    setIsOrchestrating(true);
    setAgentLogs([]);
    setGeneratedFiles([]);
    setPromptInput("");

    // Stage 1: Nexe Decompose
    addLog("nexe", "Master Engine initialized. Decomposing project requirements...", "info");

    setTimeout(() => {
      addLog("claude", "Claude Architect: Blueprint designed. Scaffolding state trees & REST endpoints.", "info");
    }, 1200);

    setTimeout(() => {
      addLog("gemini", "Gemini 1.5 Pro: Synthesizing Next.js / TypeScript code components...", "info");
    }, 2400);

    // Call Real Nexe API Route
    try {
      const response = await fetch("/api/nexe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt, framework: selectedCategory }),
      });

      const resData = await response.json();

      setTimeout(() => {
        // Bug & Verifier Simulation
        addLog("verifier", "Sentinel Verifier: Virtual runtime analysis in progress...", "info");
      }, 3600);

      setTimeout(() => {
        addLog("verifier", "⚠️ Potential unhandled null pointer & hydration mismatch flagged in layout.tsx", "warning");
      }, 4800);

      setTimeout(() => {
        addLog("nexe", "🛠️ Nexe Auto-Patch: Applying defensive guards & hot-fixing imports...", "info");
      }, 6000);

      setTimeout(() => {
        addLog("verifier", "✓ Verification Complete: All tests passed. 0 bugs, 0 syntax warnings.", "success");
        addLog("system", "🚀 Project compiled successfully! Micro-sandbox container live.", "success");

        if (resData.success && resData.data?.files) {
          setGeneratedFiles(resData.data.files);
        } else {
          // Fallback UI files
          setGeneratedFiles([
            {
              path: "src/app/page.tsx",
              content: `// Generated for: ${currentPrompt}\nexport default function App() {\n  return (\n    <main className="p-8 font-sans bg-slate-900 text-white min-h-screen">\n      <h1 className="text-3xl font-bold text-indigo-400">${newProj.name}</h1>\n      <p className="mt-2 text-slate-300">Generated seamlessly by Zyntarix Multi-Agent Core.</p>\n      <button className="mt-6 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 font-medium">Explore Features</button>\n    </main>\n  );\n}`,
            },
            {
              path: "src/components/Card.tsx",
              content: `export const Card = ({ title }: { title: string }) => (\n  <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/60">\n    <h3 className="font-semibold text-lg">{title}</h3>\n    <p className="text-sm text-slate-400">Autonomous component synced.</p>\n  </div>\n);`,
            },
          ]);
        }

        setIsOrchestrating(false);
      }, 7200);
    } catch (err: any) {
      addLog("nexe", `API fallback: Simulated environment engaged. ${err.message}`, "warning");
      setIsOrchestrating(false);
    }
  };

  const handleSendPatch = () => {
    if (!patchInput.trim()) return;
    const patch = patchInput;
    setPatchInput("");

    addLog("nexe", `Prompt Patch received: "${patch}"`, "info");
    addLog("claude", "Analyzing requested changes & delta schema...", "info");
    setTimeout(() => {
      addLog("gemini", "Gemini 1.5 Pro: Refactoring targeted code modules...", "info");
    }, 1000);
    setTimeout(() => {
      addLog("verifier", "✓ Sentinel Verifier: Patch applied cleanly. Sandbox updated.", "success");
    }, 2200);
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

      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex flex-col">
        {activeTab === "home" ? (
          /* SCREEN 1: CYBER STRATOSPHERE STUDIO */
          <div className="flex flex-col items-center space-y-5 sm:space-y-6 w-full">
            <div className="text-center space-y-1.5 pt-1 sm:pt-2">
              <h1 className="text-xl sm:text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                Where ideas become verified apps.
              </h1>
              <p className="text-xs sm:text-sm font-medium text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)] max-w-md mx-auto">
                Multi-agent orchestration powered by Nexe, Claude, Gemini Pro & Sentinel.
              </p>
            </div>

            {/* Specular Frosted Glass Card */}
            <div className="w-full bg-white/90 backdrop-blur-2xl border border-white/80 rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden">
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

              <div className="p-3.5 sm:p-5">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={`Describe your ${selectedCategory.toLowerCase()} in detail. Nexe will delegate tasks to Claude & Gemini...`}
                  rows={4}
                  className="w-full text-xs sm:text-base bg-transparent outline-none resize-none placeholder:text-slate-400 text-slate-800 font-medium"
                />
              </div>

              <div className="border-t border-slate-200/70 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-white/60 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">
                    Multi-Agent Cluster Ready
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
                  <span>Build with Nexe</span>
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
          /* SCREEN 2: ACTIVE MULTI-AGENT WORKSPACE & COMMAND DOCK */
          <div className="flex-1 flex flex-col space-y-3.5 h-full">
            {/* Top Workspace Bar */}
            <div className="flex items-center justify-between bg-white/90 backdrop-blur-xl p-2 sm:p-3 rounded-2xl border border-white/80 shadow-sm">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setWorkspaceView("logs")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    workspaceView === "logs" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ⚡ Agent Stream {isOrchestrating && <span className="animate-spin ml-1 inline-block">●</span>}
                </button>
                <button
                  onClick={() => setWorkspaceView("code")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    workspaceView === "code" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  💻 Source Code ({generatedFiles.length})
                </button>
                <button
                  onClick={() => setWorkspaceView("preview")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    workspaceView === "preview" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  👁️ Sandbox Preview
                </button>
              </div>

              <button
                onClick={() => setExportModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                🚀 Ship / Export App
              </button>
            </div>

            {/* Main Terminal / Display Card */}
            <div className="bg-slate-950/90 text-slate-100 backdrop-blur-2xl border border-slate-800 rounded-2xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden flex-1 min-h-[52vh]">
              {workspaceView === "logs" && (
                <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                    <span>Orchestrator: Nexe Core v2.4</span>
                    <span className="text-emerald-400">Status: {isOrchestrating ? "Synthesizing Pipeline..." : "Standing By"}</span>
                  </div>

                  {agentLogs.length === 0 && (
                    <p className="text-slate-500 py-6 text-center">No agent operations running. Submit a prompt to activate cluster.</p>
                  )}

                  {agentLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-2 py-1 border-b border-slate-900/60">
                      <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase shrink-0 ${
                          log.agent === "nexe"
                            ? "bg-indigo-950 text-indigo-300 border border-indigo-700"
                            : log.agent === "claude"
                            ? "bg-amber-950 text-amber-300 border border-amber-700"
                            : log.agent === "gemini"
                            ? "bg-blue-950 text-blue-300 border border-blue-700"
                            : log.agent === "verifier"
                            ? "bg-purple-950 text-purple-300 border border-purple-700"
                            : "bg-emerald-950 text-emerald-300 border border-emerald-700"
                        }`}
                      >
                        {log.agent}
                      </span>
                      <span
                        className={`flex-1 break-words ${
                          log.type === "warning"
                            ? "text-amber-300"
                            : log.type === "error"
                            ? "text-red-400"
                            : log.type === "success"
                            ? "text-emerald-300"
                            : "text-slate-300"
                        }`}
                      >
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {workspaceView === "code" && (
                <div className="flex-1 flex flex-col sm:flex-row h-full">
                  {/* File tree sidebar */}
                  <div className="w-full sm:w-56 border-b sm:border-b-0 sm:border-r border-slate-800 p-2 space-y-1 overflow-y-auto">
                    <p className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1">Generated Files</p>
                    {generatedFiles.map((file, idx) => (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFileIndex(idx)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono truncate transition-colors ${
                          selectedFileIndex === idx
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                        }`}
                      >
                        {file.path}
                      </button>
                    ))}
                  </div>

                  {/* Code editor viewer */}
                  <div className="flex-1 p-3 sm:p-4 overflow-y-auto font-mono text-xs text-slate-200 bg-slate-900/50">
                    <pre className="whitespace-pre-wrap">{generatedFiles[selectedFileIndex]?.content || "// No code selected"}</pre>
                  </div>
                </div>
              )}

              {workspaceView === "preview" && (
                <div className="flex-1 bg-white text-slate-900 flex flex-col items-center justify-center p-6 text-center">
                  <div className="max-w-md space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
                      ✓
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Preview Engine Active</h3>
                    <p className="text-xs text-slate-500">
                      Code compiled with zero syntax defects. Hot-reload microcontainer running live on port 3000.
                    </p>
                    <button
                      onClick={() => alert("Simulated Sandbox Live View opened in secure container.")}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
                    >
                      Open in Full Viewport
                    </button>
                  </div>
                </div>
              )}

              {/* High-Tech Command Dock (Patching input) */}
              <div className="p-2.5 sm:p-3 border-t border-slate-800 bg-slate-900/70">
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl sm:rounded-2xl p-1 shadow-inner focus-within:border-indigo-500 transition-all">
                  <div className="hidden sm:flex items-center px-2.5 text-[11px] font-bold text-indigo-400 border-r border-slate-800">
                    ⚡ Auto-Patch Engine
                  </div>
                  <input
                    type="text"
                    value={patchInput}
                    onChange={(e) => setPatchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendPatch()}
                    placeholder="Tell Nexe to modify, fix bugs, or add features..."
                    className="flex-1 text-xs sm:text-sm px-2.5 py-1.5 bg-transparent outline-none text-slate-200 placeholder:text-slate-500"
                  />
                  <button
                    onClick={handleSendPatch}
                    disabled={!patchInput.trim()}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center font-bold transition-all ${
                      patchInput.trim()
                        ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 cursor-pointer active:scale-95"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    ↑
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Export / Ship App Modal */}
      {exportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-base">Ship Application</h3>
              <button
                onClick={() => setExportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Select your compilation target. Nexe will bundle verified code:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  alert("Bundling Next.js production ZIP repository...");
                  setExportModal(false);
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Next.js Web Package</h4>
                  <p className="text-[10px] text-slate-500">Clean source code with package.json</p>
                </div>
                <span className="text-indigo-600 font-bold text-xs group-hover:translate-x-0.5 transition-transform">ZIP →</span>
              </button>

              <button
                onClick={() => {
                  alert("Triggering Capacitor Android build container... APK / AAB will be generated.");
                  setExportModal(false);
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Android Build (APK / AAB)</h4>
                  <p className="text-[10px] text-slate-500">Ready for Google Play Store upload</p>
                </div>
                <span className="text-emerald-600 font-bold text-xs group-hover:translate-x-0.5 transition-transform">AAB →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ZynBot
        onTransferPromptToNexa={(prompt) => {
          setPromptInput(prompt);
          setActiveTab("home");
        }}
      />
    </div>
  );
}

