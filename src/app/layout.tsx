import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zyntarix",
  description: "AI Software Factory — Idea, Build, Verify, Ship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
