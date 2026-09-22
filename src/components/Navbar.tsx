"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/zyntarix";

interface NavbarProps {
  user: UserProfile;
  activeProjectName?: string;
  activeTab: "home" | "workspace";
  onTabSwitch: (tab: "home" | "workspace") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeProjectName,
  activeTab,
  onTabSwitch,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40">
        {/* Left Brand & Tabs */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-sm sm:text-base shadow-sm shrink-0">
            Z
          </div>

          <nav className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => onTabSwitch("home")}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "home"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              🏠 Home
            </button>
            {activeProjectName && (
              <button
                onClick={() => onTabSwitch("workspace")}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all truncate max-w-[120px] sm:max-w-[200px] ${
                  activeTab === "workspace"
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                ⚡ {activeProjectName}
              </button>
            )}
          </nav>
        </div>

        {/* Right CEU Balance & User Trigger */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-indigo-600 font-bold hidden xs:inline">Credits:</span>
            <span className="text-slate-800 font-mono">{user.credits}</span>
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity shrink-0"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
        </div>
      </header>

      {/* Sliding Drawer Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel: w-full on mobile, fixed width on desktop */}
          <div className="relative w-full sm:w-80 md:w-96 bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between p-5 overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
            <div className="space-y-5">
              {/* Header Profile Info */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-black text-sm flex items-center justify-center shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
                    <p className="text-xs text-slate-400 truncate max-w-[160px]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* CEU / Compute Unit Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Compute Units (CEU)</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{user.credits}.00</span>
                </div>
                <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5">
                  <span>⚡</span>
                  <span>Top Up Compute Engine</span>
                </button>
              </div>

              {/* Menu Links */}
              <div className="space-y-1 text-xs font-semibold text-slate-700">
                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <span>⚙️ Factory Tier</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded border border-indigo-100 uppercase">
                    {user.plan}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <span>🏆 Verified Arena</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Open</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <span>⚡ Build Velocity</span>
                  <span className="text-slate-400 font-mono">99.8%</span>
                </div>
                <div className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <span>🔑 Git Sync & Keys</span>
                </div>
                <div className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <span>🌐 Network & Custom Domains</span>
                </div>
                <div className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <span>💬 Engineering Support</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button className="text-rose-500 font-bold hover:underline">
                Log Out
              </button>
              <span className="text-[11px] text-slate-400 font-mono">v1.0.4-verified</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

