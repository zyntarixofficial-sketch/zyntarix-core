
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8FAFC",
        surface: "#FFFFFF",
        borderSlate: "#E2E8F0",
        brandIndigo: "#4F46E5",
        verifyEmerald: "#059669",
        graphite: "#0F172A",
        mutedText: "#64748B",
      },
    },
  },
  plugins: [],
};

export default config;
