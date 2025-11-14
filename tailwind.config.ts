import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f14",
        surface: "#1a1a24",
        surfaceHover: "#252532",
        border: "#2d2d3d",
        text: "#e4e4e7",
        textMuted: "#a1a1aa",
        primary: "#8b5cf6",
        primaryHover: "#7c3aed",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        accent: "#06b6d4",
      },
    },
  },
  plugins: [],
};
export default config;
