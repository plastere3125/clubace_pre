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
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8CC7A",
          dark: "#A07830",
          muted: "#8B6914",
        },
        obsidian: {
          DEFAULT: "#0A0A0A",
          light: "#141414",
          card: "#1A1A1A",
          border: "#2A2A2A",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "glow": "glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px #C9A84C40" },
          "50%": { boxShadow: "0 0 20px #C9A84C80, 0 0 40px #C9A84C40" },
        },
      },
      gridTemplateColumns: {
        "5": "repeat(5, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
export default config;
