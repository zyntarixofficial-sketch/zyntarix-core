"use client";

import React, { useState } from "react";
import { Sparkles, FolderGit2, Wrench, ShieldCheck, Rocket, Send } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("nexa");
  const [prompt, setPrompt] = useState("");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              Z
            </div>
            <div>
              <h1 className="font-semibold text-slate-900 leading-tight">Zyntarix</h1>
              <p className="text-xs text-slate-500 font-medium">Software Factory</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: "nexa", label: "Nexa Studio", icon: Sparkles },
              { id: "projects", label: "Projects", icon: FolderGit2 },
              { id: "forge", label: "Forge", icon: Wrench },
              { id: "test", label: "Verification", icon: ShieldCheck },
              { id: "ship", label: "Deploy & Ship", icon: Rocket },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
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

        <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
          <span>v1.0.0</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
          </span>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl">
        <header className="mb-8">
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase bg-blue-50 px-2.5 py-1 rounded-md">
            Interactive Workspace
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
            What do you want to create today?
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Describe your software architecture or product requirements. Nexa will build it step by step.
          </p>
        </header>

        {/* Input Card */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm mb-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Build an AI agent dashboard with Next.js, real-time analytics, and role-based access..."
            rows={4}
            className="w-full resize-none bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <div className="flex flex-wrap gap-2">
              {["Build Spec", "Code Repair", "Optimize", "Deploy"].map((tag) => (
                <span
                  key={tag}
                  className="cursor-pointer text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition">
              <span>Execute with Nexa</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-800">1. Architecture</h3>
            <p className="text-xs text-slate-500 mt-1">Structured spec decomposition and pipeline design.</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-800">2. Autonomous Forge</h3>
            <p className="text-xs text-slate-500 mt-1">Multi-agent source generation and environment tests.</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-800">3. Verification Gate</h3>
            <p className="text-xs text-slate-500 mt-1">Independent security, build, and unit evaluation.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

