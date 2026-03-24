import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        luxury: {
          dark: "#0a0e27",
          darker: "#050812",
          blue: "#00f5ff",
          purple: "#d400ff",
          gold: "#ffd700",
          silver: "#e8e8e8",
          cyan: "#00d4ff",
          pink: "#ff006e",
        },
        auristra: {
          bg: "#050816",
          panel: "#0b1226",
          neon: "#06b6d4",
          violet: "#7c3aed",
          lime: "#84cc16",
        },
      },
      boxShadow: {
        "luxury-glow": "0 0 40px rgba(212, 0, 255, 0.5), 0 0 80px rgba(0, 245, 255, 0.3)",
        "luxury-gold": "0 0 30px rgba(255, 215, 0, 0.4)",
        "neon-pulse": "0 0 20px rgba(6, 182, 212, 0.35), inset 0 0 20px rgba(6, 182, 212, 0.1)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "ripple": "ripple 0.6s cubic-bezier(0, 0, 0.2, 1)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
      },
      backgroundImage: {
        "neon-grid":
          "radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.18) 1px, transparent 0)",
        "luxury-gradient": "linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(212, 0, 255, 0.1) 50%, rgba(255, 215, 0, 0.05) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
