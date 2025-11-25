import {
  Fira_Code as FontMono,
  Inter as FontSans,
  Plus_Jakarta_Sans,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
  fallback: ["sans-serif"],
});
