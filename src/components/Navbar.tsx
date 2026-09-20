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
    <header className="w-full bg-surface border-b border-borderSlate px-4 py-2.5 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Tabs */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-brandIndigo flex items-center justify-center font-bold text-white shadow-sm">
          Z
        </div>

        <nav className="flex items-center bg-canvas rounded-lg p-1 border border-borderSlate text-xs font-medium">
          <button
            onClick={() => onTabSwitch("home")}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === "home"
                ? "bg-surface shadow-sm text-graphite font-semibold"
                : "text-mutedText hover:text-graphite"
            }`}
          >
            🏠 Home
          </button>
          {activeProjectName && (
            <button
              onClick={() => onTabSwitch("workspace")}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === "workspace"
                  ? "bg-surface shadow-sm text-graphite font-semibold"
                  : "text-mutedText hover:text-graphite"
              }`}
            >
              ⚡ {activeProjectName}
            </button>
          )}
        </nav>
      </div>

      {/* Credits & Profile Controls */}
      <div className="flex items-center space-x-3">
        <div className="bg-canvas border border-borderSlate px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5">
          <span className="text-brandIndigo font-bold">Credits:</span>
          <span className="text-graphite">
            {user.credits} / {user.maxCredits}
          </span>
        </div>

        <button
          onClick={() => setShowProfileModal(!showProfileModal)}
          className="w-8 h-8 rounded-full bg-slate-200 border border-borderSlate flex items-center justify-center font-semibold text-xs text-graphite hover:bg-slate-300 transition-colors"
        >
          {user.name.charAt(0).toUpperCase()}
        </button>
      </div>

      {/* Account Modal */}
      {showProfileModal && (
        <div className="absolute right-4 top-12 w-64 bg-surface border border-borderSlate rounded-xl shadow-lg p-4 z-50 text-xs space-y-3">
          <div className="border-b border-borderSlate pb-2">
            <p className="font-semibold text-graphite">{user.name}</p>
            <p className="text-mutedText">{user.email}</p>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-mutedText">Current Plan:</span>
            <span className="font-semibold text-brandIndigo uppercase">{user.plan}</span>
          </div>
          <button className="w-full bg-brandIndigo text-white py-1.5 rounded-lg font-medium hover:opacity-90">
            Account Settings
          </button>
        </div>
      )}
    </header>
  );
};

