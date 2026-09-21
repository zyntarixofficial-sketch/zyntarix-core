import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zyntarix | Autonomous AI Software Factory",
  description: "Idea to Verified App with Deterministic Verification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="min-h-screen bg-[#0d3b66] text-slate-900 antialiased relative selection:bg-indigo-500 selection:text-white">
        {/* Cyber Azure Stratosphere Canvas */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Cobalt to Soft Azure Gradient Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#175296] via-[#3a86d8] to-[#90c4f8]" />
          
          {/* Top Horizon Glow Ray */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-white/35 blur-3xl rounded-full" />

          {/* Micro-Dot Matrix Tech Grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }}
          />
        </div>
        {children}
      </body>
    </html>
  );
}

