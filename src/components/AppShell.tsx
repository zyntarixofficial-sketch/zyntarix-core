import React from "react";

export default function AppShell({ children }: { children?: React.ReactNode }) {
  return <div className="min-h-screen bg-canvas text-graphite">{children}</div>;
}

