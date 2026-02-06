import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        geist: ["var(--font-geist)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        jetbrains: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        brand: {
          orange: "#FF5B04",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
