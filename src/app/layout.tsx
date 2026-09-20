import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zyntarix | AI Software Factory",
  description: "Idea to Verified App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-canvas antialiased">{children}</body>
    </html>
  );
}

