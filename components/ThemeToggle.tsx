"use client";

import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="px-3 py-1.5 rounded-md text-sm font-medium text-campus-100 hover:bg-campus-600 dark:hover:bg-slate-700 shrink-0"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
