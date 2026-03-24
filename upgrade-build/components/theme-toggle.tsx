"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== "light";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-xl border transition-all duration-300 p-2 hover:scale-105"
      style={{
        borderColor: isDark ? "rgba(0, 245, 255, 0.4)" : "rgba(126, 198, 232, 0.5)",
        backgroundColor: isDark ? "rgba(0, 245, 255, 0.1)" : "rgba(126, 198, 232, 0.08)",
        boxShadow: isDark ? "0 0 20px rgba(0, 245, 255, 0.1)" : "0 0 15px rgba(126, 198, 232, 0.08)",
      }}
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-colors" style={{ color: "#7ec6e8" }} />
      ) : (
        <Moon className="h-5 w-5 transition-colors" style={{ color: "#b589c8" }} />
      )}
    </button>
  );
}
