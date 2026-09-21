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
      <body className="min-h-screen bg-slate-900 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white relative">
        {/* High-Tech Stratosphere Sky Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#2b7fff] via-[#8ec5fc] to-[#f0f7ff]" />
          {/* Subtle Cyber Light Rays */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-white/25 blur-3xl rounded-full" />
        </div>
        {children}
      </body>
    </html>
  );
}

