"use client";

import { useState } from "react";

export default function Zyn() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[min(560px,calc(100vh-120px))] w-[calc(100vw-32px)] max-w-sm flex-col overflow-hidden rounded-2xl border border-[#292f3c] bg-[#0b0f16] shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between border-b border-[#1d2330] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 font-bold">
                Z
              </div>

              <div>
                <div className="text-sm font-semibold">Zyn</div>
                <div className="text-[11px] text-gray-500">
                  Zyntarix Assistant
                </div>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-gray-500 hover:bg-white/5 hover:text-white"
              aria-label="Close Zyn"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/5 px-4 py-3 text-sm leading-6 text-gray-300">
              Hi. I’m Zyn. I can help you with your Zyntarix account, projects,
              credits, usage and prompts.
            </div>
          </div>

          <div className="border-t border-[#1d2330] p-3">
            <button className="mb-2 w-full rounded-lg border border-dashed border-[#292f3c] py-2 text-xs text-gray-500 hover:text-gray-300">
              + Upload screenshot / photo / file
            </button>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask Zyn..."
                className="min-w-0 flex-1 rounded-xl border border-[#252b38] bg-[#080b10] px-3 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
              />

              <button className="rounded-xl bg-violet-600 px-4 text-sm font-semibold hover:bg-violet-500">
                →
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 font-bold shadow-xl shadow-violet-900/30 transition hover:scale-105"
        aria-label="Open Zyn"
      >
        Z
      </button>
    </>
  );
}
