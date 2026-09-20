
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
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <header className="w-full bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      {/* Brand & Tabs */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-sm">
          Z
        </div>

        <nav className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs sm:text-sm font-medium">
          <button
            onClick={() => onTabSwitch("home")}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === "home"
                ? "bg-white shadow-xs text-slate-900 font-bold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            🏠 Home
          </button>
          {activeProjectName && (
            <button
              onClick={() => onTabSwitch("workspace")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === "workspace"
                  ? "bg-white shadow-xs text-indigo-600 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ⚡ {activeProjectName}
            </button>
          )}
        </nav>
      </div>

      {/* Credits & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5">
          <span className="text-indigo-600 font-bold">Credits:</span>
          <span className="text-slate-800">{user.credits}</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileModal(!showProfileModal)}
            className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>

          {showProfileModal && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 text-xs space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                <p className="text-slate-500">{user.email}</p>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Plan:</span>
                <span className="font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">
                  {user.plan}
                </span>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="w-full bg-slate-900 text-white py-2 rounded-xl font-medium hover:bg-slate-800"
              >
                Close Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
