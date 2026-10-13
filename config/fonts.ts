import {
  Inter as FontSans,
  Plus_Jakarta_Sans,
} from "next/font/google";
import localFont from "next/font/local";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
  fallback: ["sans-serif"],
});

export const fontGeist = localFont({
  src: [
    {
      path: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-geist",
  display: "swap",
  preload: true,
  fallback: ["sans-serif"],
});

export const fontGeistMono = localFont({
  src: [
    {
      path: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
  fallback: ["monospace"],
});

export const fontJetBrainsMono = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
  fallback: ["monospace"],
});
