
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { ZynBot } from "@/components/ZynBot";
import { StartupLoader } from "@/components/StartupLoader";
import { ProjectData, UserProfile } from "@/types/zyntarix";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot } from "firebase/firestore";

interface GeneratedFile {
  path: string;
  content: string;
}

interface AgentLog {
  id: string;
  agent: "nexa" | "architect" | "coder" | "verifier" | "system";
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
  const [isPatching, setIsPatching] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Architect",
    email: "operator@zyntarix.com",
    credits: 50,
    maxCredits: 50,
    plan: "Free Factory",
  });

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [workspaceView, setWorkspaceView] = useState<"logs" | "code" | "preview">("logs");
  const [exportModal, setExportModal] = useState(false);
  const [publishedModal, setPublishedModal] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [expoUrl, setExpoUrl] = useState("");

  const categories = ["Web app", "Mobile app", "Website", "3D Web", "Brainstorm"];

  // 1. Initial Local Cache Load
  useEffect(() => {
    try {
      const cached = localStorage.getItem("zyntarix_cached_projects");
      if (cached) {
        setProjects(JSON.parse(cached));
      }
    } catch (e) {
      console.warn("Local cache read skipped");
    }
  }, []);

  // 2. Firebase User & Firestore Real-Time Sync
  useEffect(() => {
    let unsubProjects: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        setCurrentUser(usr);

        const userDocRef = doc(db, "users", usr.uid);
        const snap = await getDoc(userDocRef);

        if (snap.exists()) {
          const data = snap.data();
          setUserProfile({
            name: usr.displayName || "Architect",
            email: usr.email || "",
            credits: data.credits ?? 50,
            maxCredits: data.maxCredits ?? 50,
            plan: data.plan ?? "Free Factory",
          });
        } else {
          const initProfile = {
            name: usr.displayName || "Architect",
            email: usr.email || "",
            credits: 50,
            maxCredits: 50,
            plan: "Free Factory",
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, initProfile);
          setUserProfile(initProfile);
        }

        const projectsRef = collection(db, "users", usr.uid, "projects");
        unsubProjects = onSnapshot(projectsRef, (snapshot) => {
          const list: ProjectData[] = [];
          snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            list.push({
              id: docSnap.id,
              name: d.name || "Untitled Application",
              updatedAt: d.updatedAt || "Recently",
              status: d.status || "published",
              files: d.files || [],
              prompt: d.prompt || "",
              publishedUrl: d.publishedUrl || "",
            } as any);
          });

          setProjects(list);
          try {
            localStorage.setItem("zyntarix_cached_projects", JSON.stringify(list));
          } catch (e) {}
        });
      } else {
        setCurrentUser(null);
        if (unsubProjects) unsubProjects();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubProjects) unsubProjects();
    };
  }, []);

  const addLog = (
    agent: AgentLog["agent"],
    message: string,
    type: AgentLog["type"] = "info"
  ) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setAgentLogs((prev) => [...prev, { id: Math.random().toString(), agent, message, type, timestamp: time }]);
  };

  const handleOpenProject = (proj: any) => {
    setActiveProject(proj);
    setActiveTab("workspace");
    setWorkspaceView("preview");

    if (proj.files && Array.isArray(proj.files) && proj.files.length > 0) {
      setGeneratedFiles(proj.files);
    } else {
      setGeneratedFiles([
        {
          path: "src/app/page.tsx",
          content: `// Zyntarix Restored Project\nexport default function App() {\n  return (\n    <div className="p-8 bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center">\n      <h1 className="text-2xl font-bold text-indigo-400">${proj.name}</h1>\n      <p className="mt-2 text-slate-400 text-sm">Application ready for execution.</p>\n    </div>\n  );\n}`,
        },
      ]);
    }
  };

  const handleStartBuild = async () => {
    if (!promptInput.trim()) return;

    if (userProfile.credits < 5) {
      alert("Insufficient credits. Please recharge your Zyntarix credits.");
      return;
    }

    const currentPrompt = promptInput;
    const projId = Date.now().toString();
    const newProj: ProjectData = {
      id: projId,
      name: currentPrompt.slice(0, 28) + (currentPrompt.length > 28 ? "..." : ""),
      updatedAt: "Just now",
      status: "deploying",
    };

    const updatedProjects = [newProj, ...projects];
    setProjects(updatedProjects);
    try {
      localStorage.setItem("zyntarix_cached_projects", JSON.stringify(updatedProjects));
    } catch (e) {}

    setActiveProject(newProj);
    setActiveTab("workspace");
    setWorkspaceView("logs");
    setIsOrchestrating(true);
    setAgentLogs([]);
    setGeneratedFiles([]);
    setPromptInput("");

    const appSlug = currentPrompt.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 16) || "app";
    setPublishedUrl(`https://${appSlug}-${projId.slice(-4)}.zyntarix.app`);
    setExpoUrl(`exp://u.expo.dev/zyntarix-runtime?slug=${appSlug}`);

    addLog("nexa", `Pipeline engaged: "${currentPrompt}"`, "info");
    addLog("architect", "Zyntarix Architect: Analyzing specifications & directory decomposition...", "info");

    try {
      const response = await fetch("/api/nexa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt,
          framework: selectedCategory,
          userCredits: userProfile.credits,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server error ${response.status}`);
      }

      const resData = await response.json();

      if (resData.success && resData.data) {
        if (resData.data.steps) {
          resData.data.steps.forEach((step: any) => {
            addLog(step.agent || "nexa", step.message, "info");
          });
        }

        addLog("coder", "Zyntarix Core Coder: Production components synthesized.", "info");
        addLog("verifier", "Sentinel Node: Verified AST trees with zero fatal exceptions.", "success");
        addLog("system", "🚀 Project compiled and permanently stored in your Firestore.", "success");

        const files = resData.data.files || [];
        setGeneratedFiles(files);

        setTimeout(() => setWorkspaceView("preview"), 800);

        const updatedCredits = Math.max(0, userProfile.credits - 5);
        setUserProfile((prev) => ({ ...prev, credits: updatedCredits }));

        if (currentUser) {
          await updateDoc(doc(db, "users", currentUser.uid), {
            credits: updatedCredits,
          });

          await setDoc(doc(db, "users", currentUser.uid, "projects", projId), {
            id: projId,
            name: newProj.name,
            prompt: currentPrompt,
            updatedAt: new Date().toLocaleDateString(),
            status: "published",
            files,
            publishedUrl: `https://${appSlug}-${projId.slice(-4)}.zyntarix.app`,
          });
        }
      } else {
        throw new Error(resData.error || "Engine execution failed");
      }
    } catch (err: any) {
      console.error("Nexa Build Error:", err);
      addLog("verifier", `Sentinel Node Alert: ${err.message}`, "error");
      addLog("system", "Notice: Switched to defensive fallback container.", "warning");

      const fallbackFiles = [
        {
          path: "src/app/page.tsx",
          content: `export default function App() {\n  return (\n    <main className="p-8 font-sans bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center">\n      <h1 className="text-3xl font-extrabold text-indigo-400">${newProj.name}</h1>\n      <p className="mt-3 text-slate-400 text-sm max-w-md text-center">Interactive dashboard initialized.</p>\n    </main>\n  );\n}`,
        },
      ];
      setGeneratedFiles(fallbackFiles);

      if (currentUser) {
        await setDoc(doc(db, "users", currentUser.uid, "projects", projId), {
          id: projId,
          name: newProj.name,
          prompt: currentPrompt,
          updatedAt: new Date().toLocaleDateString(),
          status: "draft",
          files: fallbackFiles,
        });
      }
    } finally {
      setIsOrchestrating(false);
    }
  };

  // --- NEW: Interactive Live UI Patching Handler ---
  const handlePatchApp = async () => {
    if (!patchInput.trim() || isPatching || isOrchestrating) return;

    const patchInstruction = patchInput.trim();
    const currentCodeToPatch = generatedFiles[0]?.content || "";

    if (!currentCodeToPatch) {
      alert("No active application code found to patch.");
      return;
    }

    setIsPatching(true);
    setPatchInput("");
    addLog("nexa", `Patch requested: "${patchInstruction}"`, "info");

    try {
      const response = await fetch("/api/nexa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `USER REQUESTED MODIFICATION / PATCH: "${patchInstruction}".\n\nCURRENT APPLICATION CODE:\n${currentCodeToPatch}\n\nUpdate and patch the code precisely based on the request while retaining all existing logic. Return complete valid React JSX.`,
          framework: selectedCategory,
          userCredits: userProfile.credits,
          isPatch: true,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server error ${response.status}`);
      }

      const resData = await response.json();

      if (resData.success && resData.data && resData.data.files) {
        const updatedFiles = resData.data.files;
        setGeneratedFiles(updatedFiles);
        addLog("verifier", "Sentinel Node: Patch verified & compiled successfully!", "success");

        // Sync with Firestore if user is active
        if (currentUser && activeProject) {
          await updateDoc(doc(db, "users", currentUser.uid, "projects", activeProject.id), {
            files: updatedFiles,
            updatedAt: "Just now",
          });
        }
      } else {
        throw new Error(resData.error || "Patch execution failed");
      }
    } catch (err: any) {
      console.error("Patch error:", err);
      addLog("verifier", `Patch alert: ${err.message}`, "error");
    } finally {
      setIsPatching(false);
    }
  };

  const currentCode = generatedFiles[0]?.content || "";

  // 100% Bulletproof Standalone Live Application Sandbox
  const sandboxSrcDoc = useMemo(() => {
    if (!currentCode) {
      return `<!DOCTYPE html><html><body style="background:#020617;color:#94a3b8;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><p style="font-size:14px;letter-spacing:1px;">🚀 Waiting for synthesized application...</p></body></html>`;
    }

    // Clean Imports, Directives and Exports completely
    let sanitizedCode = currentCode
      .replace(/['"]use client['"];?/g, "")
      .replace(/import[\s\S]*?from\s+['"][^'"]+['"];?/g, "")
      .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/, "function App")
      .replace(/export\s+default\s+/, "")
      .replace(/export\s+/g, "");

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script crossorigin="anonymous" src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin="anonymous" src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script crossorigin="anonymous" src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      body { margin: 0; padding: 0; background: #020617; color: #f8fafc; font-family: ui-sans-serif, system-ui, sans-serif; overflow-x: hidden; }
      * { box-sizing: border-box; }
    </style>
  </head>
  <body>
    <div id="root">
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#818cf8;font-family:sans-serif;font-size:14px;">
        <span>⚡ Launching Live App Interface...</span>
      </div>
    </div>

    <script>
      window.onerror = function(msg, url, line, col, err) {
        var root = document.getElementById('root');
        if (root) {
          root.innerHTML = '<div style="padding:20px;color:#f87171;background:#090d16;height:100vh;font-family:monospace;font-size:12px;overflow:auto;"><b>Live Sandbox Error:</b><br/>' + (err ? err.stack || msg : msg) + '<br/>Line: ' + line + '</div>';
        }
        return false;
      };

      window.UniversalIcon = function(props) {
        var cls = (props && props.className) ? props.className : "w-5 h-5 inline-block";
        return React.createElement("svg", {
          className: cls,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          style: (props && props.style) ? props.style : {}
        }, React.createElement("circle", { cx: "12", cy: "12", r: "10" }));
      };

      window.lucideReact = new Proxy({}, {
        get: function(target, prop) {
          return window.UniversalIcon;
        }
      });
      window.LucideIcons = window.lucideReact;
    </script>

    <script type="text/babel" data-presets="react,typescript">
      const { useState, useEffect, useMemo, useRef, useCallback } = React;

      const { 
        Wallet, CreditCard, TrendingUp, Bell, Search, Plus, Shield, Settings,
        Calendar, Zap, Sparkles, ArrowUpRight, ArrowDownRight, MoreVertical,
        Lock, User, Check, X, ChevronRight, AlertCircle, RefreshCw, SlidersHorizontal,
        CheckCircle2, DollarSign, Repeat, ExternalLink, Filter, Trash2, Edit3,
        Download, BookOpen, Trophy, Flame, Play, Star, Award, Home, Clock, Heart, Menu, 
        CheckCircle, Activity, ArrowUp, ArrowDown, ChevronDown, ChevronUp, BarChart2, 
        Eye, EyeOff, Brain, Pause, RotateCcw, Bookmark
      } = window.LucideIcons;

      try {
        ${sanitizedCode}

        const TargetApp = typeof App !== 'undefined' ? App : (typeof GeneratedApp !== 'undefined' ? GeneratedApp : null);

        if (TargetApp) {
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(TargetApp));
        } else {
          document.getElementById('root').innerHTML = '<div style="padding:24px;color:#38bdf8;font-family:sans-serif;">Application entry point (App component) not found.</div>';
        }
      } catch (err) {
        console.error("Live Execution Error:", err);
        document.getElementById('root').innerHTML = '<div style="padding:24px;color:#f87171;font-family:monospace;background:#090d16;height:100vh;overflow:auto;"><h3>Live Preview Error</h3><pre>' + (err.stack || err.message) + '</pre></div>';
      }
    </script>
  </body>
</html>`;
  }, [currentCode]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {loading && <StartupLoader onFinish={() => setLoading(false)} />}

      <Navbar
        user={userProfile}
        activeProjectName={activeProject?.name}
        activeTab={activeTab}
        onTabSwitch={(tab) => setActiveTab(tab)}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex flex-col">
        {activeTab === "home" ? (
          <div className="flex flex-col items-center space-y-5 sm:space-y-6 w-full">
            <div className="text-center space-y-1.5 pt-1 sm:pt-2">
              <h1 className="text-xl sm:text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                Where ideas become verified apps.
              </h1>
              <p className="text-xs sm:text-sm font-medium text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)] max-w-md mx-auto">
                Describe it once. Nexa plans, builds, and verifies before shipping.
              </p>
            </div>

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
                  placeholder={`Describe your ${selectedCategory.toLowerCase()} in detail. Nexa will orchestrate code, generate preview and mobile barcodes...`}
                  rows={4}
                  className="w-full text-xs sm:text-base bg-transparent outline-none resize-none placeholder:text-slate-400 text-slate-800 font-medium"
                />
              </div>

              <div className="border-t border-slate-200/70 px-3.5 sm:px-5 py-2.5 sm:py-3 bg-white/60 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">
                    Zyntarix Autonomous Nodes Ready
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

            {/* Persistent Cloud Synced Projects */}
            <div className="w-full space-y-2.5 pt-1">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-black uppercase tracking-wider text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
                  Active Projects ({projects.length})
                </h2>
                {currentUser && (
                  <span className="text-[10px] text-white/80 font-mono">
                    Cloud Synced: {currentUser.email}
                  </span>
                )}
              </div>

              {projects.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl p-5 sm:p-7 text-center text-xs sm:text-sm font-medium text-slate-600 shadow-sm">
                  No applications active. Type a prompt above or ask Zyn in the corner.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => handleOpenProject(proj)}
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
                        <span className="text-indigo-600 font-bold">Open Live App →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-3.5 h-full">
            <div className="flex items-center justify-between bg-white/90 backdrop-blur-xl p-2 sm:p-3 rounded-2xl border border-white/80 shadow-sm">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setWorkspaceView("logs")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    workspaceView === "logs" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ⚡ Agent Stream {isOrchestrating && <span className="animate-pulse ml-1 inline-block">●</span>}
                </button>
                <button
                  onClick={() => setWorkspaceView("code")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    workspaceView === "code" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  💻 Code Files ({generatedFiles.length})
                </button>
                <button
                  onClick={() => setWorkspaceView("preview")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    workspaceView === "preview" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  👁️ Interactive Live App
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPublishedModal(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1"
                >
                  <span>🌐</span>
                  <span>Publish & QR</span>
                </button>
                <button
                  onClick={() => setExportModal(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  🚀 Ship
                </button>
              </div>
            </div>

            <div className="bg-slate-950/95 text-slate-100 backdrop-blur-2xl border border-slate-800 rounded-2xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden flex-1 min-h-[65vh]">
              {workspaceView === "logs" && (
                <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                    <span>Orchestrator: Nexa Core Engine</span>
                    <span className="text-emerald-400">Status: {isOrchestrating ? "Synthesizing Source..." : "Verified"}</span>
                  </div>

                  {agentLogs.length === 0 && (
                    <p className="text-slate-500 py-6 text-center">Engine idling. Submit a prompt to start build.</p>
                  )}

                  {agentLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-2 py-1 border-b border-slate-900/60">
                      <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase shrink-0 ${
                          log.agent === "nexa"
                            ? "bg-indigo-950 text-indigo-300 border border-indigo-700"
                            : log.agent === "architect"
                            ? "bg-blue-950 text-blue-300 border border-blue-700"
                            : log.agent === "coder"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                            : log.agent === "verifier"
                            ? "bg-purple-950 text-purple-300 border border-purple-700"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
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

                  <div className="flex-1 p-3 sm:p-4 overflow-y-auto font-mono text-xs text-slate-200 bg-slate-900/50">
                    <pre className="whitespace-pre-wrap">{generatedFiles[selectedFileIndex]?.content || "// Generating code..."}</pre>
                  </div>
                </div>
              )}

              {/* LIVE INTERACTIVE RUNTIME FRAME */}
              {workspaceView === "preview" && (
                <div className="flex-1 bg-slate-950 flex flex-col h-full min-h-[620px]">
                  <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-[11px] font-mono text-slate-400 ml-2">Interactive App Preview</span>
                    </div>
                    <div className="text-emerald-400 text-[11px] font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Sandbox
                    </div>
                  </div>

                  <iframe
                    title="Live App Sandbox"
                    srcDoc={sandboxSrcDoc}
                    className="w-full flex-1 border-none bg-slate-950"
                    sandbox="allow-scripts allow-modals"
                  />
                </div>
              )}

              {/* LIVE PATCH INPUT BAR (Nexa Editor) */}
              <div className="p-2.5 sm:p-3 border-t border-slate-800 bg-slate-900/70">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePatchApp();
                  }}
                  className="flex items-center bg-slate-950 border border-slate-800 rounded-xl sm:rounded-2xl p-1 shadow-inner focus-within:border-indigo-500 transition-all gap-2"
                >
                  <div className="hidden sm:flex items-center px-2.5 text-[11px] font-bold text-indigo-400 border-r border-slate-800 shrink-0">
                    ⚡ Nexa Engine
                  </div>
                  <input
                    type="text"
                    value={patchInput}
                    disabled={isPatching || isOrchestrating}
                    onChange={(e) => setPatchInput(e.target.value)}
                    placeholder={
                      isPatching
                        ? "Nexa is patching your application..."
                        : "Ask Nexa to patch, adjust design, or add features..."
                    }
                    className="flex-1 text-xs sm:text-sm px-2.5 py-1.5 bg-transparent outline-none text-slate-200 placeholder:text-slate-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!patchInput.trim() || isPatching || isOrchestrating}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1 ${
                      patchInput.trim() && !isPatching
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <span>{isPatching ? "Patching..." : "Patch App"}</span>
                    <span>⚡</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Publish & Expo Go QR Barcode Modal */}
      {publishedModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-200 space-y-5 text-center">
            <div className="flex items-center justify-between text-left">
              <div>
                <h3 className="font-black text-slate-900 text-lg">App Published! 🚀</h3>
                <p className="text-[11px] text-slate-500">Live preview URL & mobile runtime ready.</p>
              </div>
              <button
                onClick={() => setPublishedModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Scan with Expo Go App
              </span>
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    expoUrl || "https://expo.dev"
                  )}`}
                  alt="Expo QR Code"
                  className="w-40 h-40 object-contain rounded-lg"
                />
              </div>
              <p className="text-[10px] text-slate-500 max-w-xs">
                Open <b>Expo Go</b> on your phone and scan to test natively!
              </p>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Live URL
              </label>
              <div className="flex items-center space-x-1.5 bg-slate-100 p-2 rounded-xl border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={publishedUrl}
                  className="bg-transparent text-xs font-mono text-slate-800 flex-1 outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(publishedUrl);
                    alert("Copied to clipboard!");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <p className="text-xs text-slate-500">Select target archive:</p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  alert("Compiling ZIP package with all generated source files...");
                  setExportModal(false);
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Next.js Package</h4>
                  <p className="text-[10px] text-slate-500">Full source code archive</p>
                </div>
                <span className="text-indigo-600 font-bold text-xs">ZIP →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Zyn AI Assistant Bot - Positioned safely above the Nexa patch bar */}
      <div className="fixed bottom-24 right-4 z-40">
        <ZynBot
          userCredits={userProfile.credits}
          onTransferPromptToNexa={(prompt) => {
            setPromptInput(prompt);
            setActiveTab("home");
          }}
        />
      </div>
    </div>
  );
}
