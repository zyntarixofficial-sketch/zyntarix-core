"use client";

import React, { useEffect, useState } from "react";

interface StartupLoaderProps {
  onFinish: () => void;
}

export const StartupLoader: React.FC<StartupLoaderProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFading(true), 1200);
    const endTimer = setTimeout(() => onFinish(), 1600);
    return () => {
      clearTimeout(timer);
      clearTimeout(endTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 bg-canvas z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative w-20 h-20 flex items-center justify-center animate-bounce">
        <div className="w-16 h-16 rounded-2xl bg-brandIndigo shadow-2xl flex items-center justify-center text-white text-3xl font-black transform rotate-6 border border-white/20">
          Z
        </div>
      </div>
      <p className="mt-4 text-xs tracking-widest text-mutedText font-semibold uppercase">
        Initializing Zyntarix Engine...
      </p>
    </div>
  );
};

