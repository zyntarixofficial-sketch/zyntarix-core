
"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  BrainCircuit, 
  Layers, 
  Code2, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

export type AgentStep = "idle" | "nexa" | "architect" | "coder" | "verifier" | "success";

interface SynthesisOverlayProps {
  currentStep: AgentStep;
  logs: { timestamp: string; agent: string; message: string; type: string }[];
  isSynthesizing: boolean;
}

export const SynthesisOverlay: React.FC<SynthesisOverlayProps> = ({
  currentStep,
  logs,
  isSynthesizing,
}) => {
  const [showTerminal, setShowTerminal] = useState(false);

  if (!isSynthesizing && currentStep === "idle") return null;

  const steps = [
    {
      id: "nexa",
      label: "Nexa Core Engine",
      desc: "Analyzing prompt & orchestrating build pipeline...",
      icon: BrainCircuit,
      color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    },
    {
      id: "architect",
      label: "System Architect",
      desc: "Decomposing specifications & UI component hierarchy...",
      icon: Layers,
      color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    },
    {
      id: "coder",
      label: "Autonomous Coder",
      desc: "Synthesizing production React 19 & Tailwind JSX...",
      icon: Code2,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      id: "verifier",
      label: "Sentinel Verifier",
      desc: "AST safety verification & auto bug-fixing...",
      icon: ShieldCheck,
      color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    },
  ];

  const getStepIndex = (step: AgentStep) => {
    switch (step) {
      case "nexa": return 0;
      case "architect": return 1;
      case "coder": return 2;
      case "verifier": return 3;
      case "success": return 4;
      default: return -1;
    }
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/95 shadow-2xl backdrop-blur-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-5 sm:px-6 py-4 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white tracking-wide text-xs sm:text-sm flex items-center gap-2">
                Zyntarix Autonomous Synthesizer
              </h3>
              <p className="text-[11px] text-slate-400">Synthesizing code in isolated sandbox...</p>
            </div>
          </div>
          {currentStep === "success" ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" /> Ready
            </span>
          ) : (
            <span className="flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
              Synthesizing
            </span>
          )}
        </div>

        {/* Step Progress Indicators */}
        <div className="p-5 sm:p-6 space-y-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentIndex === idx;
            const isFinished = currentIndex > idx || currentStep === "success";

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 sm:gap-4 p-3 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? "border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                    : isFinished
                    ? "border-emerald-500/30 bg-emerald-500/5 opacity-85"
                    : "border-slate-800/80 bg-slate-900/30 opacity-40"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                    isFinished
                      ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400"
                      : isActive
                      ? step.color
                      : "border-slate-800 bg-slate-800 text-slate-500"
                  }`}
                >
                  {isFinished ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className={`h-4 w-4 ${isActive ? "animate-spin" : ""}`} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs sm:text-sm font-semibold ${isActive ? "text-white" : isFinished ? "text-slate-200" : "text-slate-400"}`}>
                      {step.label}
                    </p>
                    {isActive && (
                      <span className="text-[10px] font-mono font-bold text-indigo-400 animate-pulse">Running...</span>
                    )}
                    {isFinished && (
                      <span className="text-[10px] font-mono font-bold text-emerald-400">Completed</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Collapsible Mini Terminal */}
        <div className="border-t border-slate-800/80 bg-slate-950/70 px-5 sm:px-6 py-3">
          <button
            type="button"
            onClick={() => setShowTerminal(!showTerminal)}
            className="flex w-full items-center justify-between text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-indigo-400" />
              {showTerminal ? "Hide Diagnostic Logs" : "View Agent Logs & Output"}
            </span>
            {showTerminal ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showTerminal && (
            <div className="mt-3 max-h-36 overflow-y-auto rounded-xl border border-slate-800 bg-black/90 p-3 font-mono text-[10px] text-slate-300 space-y-1.5 select-text">
              {logs.length === 0 ? (
                <p className="text-slate-500 italic">No output yet...</p>
              ) : (
                logs.map((log, index) => (
                  <p key={index} className="leading-relaxed">
                    <span className="text-emerald-400 mr-2">›</span>
                    <span className="text-slate-500 mr-1">[{log.timestamp}]</span>
                    <span className="text-indigo-400 font-bold mr-1.5">[{log.agent}]</span>
                    {log.message}
                  </p>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
