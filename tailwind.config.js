/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080B10",
        surface: "#0F141E",
        surfaceLight: "#18202F",
        surfaceBorder: "#232D42",
        primary: {
          DEFAULT: "#00E599", // DeFi Neon Emerald
          hover: "#00C985",
          glow: "rgba(0, 229, 153, 0.2)",
        },
        accent: {
          DEFAULT: "#38BDF8", // Cyan
          hover: "#0284C7",
        },
        purpleAccent: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
        },
        danger: {
          DEFAULT: "#FF4D6D",
          hover: "#E03151",
        },
        warning: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

