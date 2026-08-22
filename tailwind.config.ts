import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          50: "#f2f8f6",
          100: "#dcece6",
          500: "#0f6b4f",
          600: "#0b5540",
          700: "#093f30",
        },
        alert: {
          low: "#2563eb",
          moderate: "#d97706",
          high: "#dc2626",
        },
      },
    },
  },
  plugins: [],
};
export default config;
