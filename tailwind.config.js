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
          "orange-dark": "#E54F00",
          "orange-light": "#FF7B34",
        },
        surface: {
          primary: "#FAFAFA",
          secondary: "#F5F5F5",
          card: "#FFFFFF",
          dark: "#151514",
          "dark-card": "#212121",
        },
      },
      backdropBlur: {
        glass: "16px",
      },
      boxShadow: {
        "glass": "0 8px 32px -4px rgba(0, 0, 0, 0.12), 0 20px 60px -12px rgba(0, 0, 0, 0.08)",
        "glass-sm": "0 4px 16px -2px rgba(0, 0, 0, 0.08)",
        "card": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
