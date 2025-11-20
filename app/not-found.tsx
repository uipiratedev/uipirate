"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const gifs = {
  pet: "https://res.cloudinary.com/damm9iwho/image/upload/v1762942852/d0f4828a8cca3e138cd9afbd94dce8d982b1c853_vcarjb.png",
  feed: "https://res.cloudinary.com/damm9iwho/image/upload/v1762942851/eeb18156001dd2fe08e78ce5b45ec37c73405ad1_rasxld.png",
  slap: "https://res.cloudinary.com/damm9iwho/image/upload/v1762942850/ffc6beb91e8b62b58b4791e7474ad71ba7f0ee99_pwbpzi.gif",
  goodboy:
    "https://res.cloudinary.com/damm9iwho/image/upload/v1762942860/e1ef929e25eef7a9b8eb055a19b0c188d3d8119a_yidejd.gif",
};

// Floating icons per tab
const iconSets: Record<string, string[]> = {
  pet: ["🐾", "🦴", "🐕", "🐶", "💚", "🦮", "🐕‍🦺", "🐾", "🐶", "❤️"],
  feed: ["🍖", "🍗", "🥩", "🦴", "🍪", "🍼", "🍰", "🍩", "🍔", "🥕"],
  slap: ["💥", "😡", "🤜", "🔥", "🤯", "💢", "⚡", "💀", "👊", "😤"],
  goodboy: ["🌟", "💚", "🐾", "❤️", "🐶", "🎉", "✨", "🦴", "💖", "🐕"],
  default: ["🦴", "🐾", "🍖", "🐕", "🐶", "💨", "🌟", "🍪", "❤️", "💚"],
};

export default function NotFound() {
  const [currentGif, setCurrentGif] = useState(gifs.pet);
  const [activeTab, setActiveTab] = useState<keyof typeof iconSets>("default");
  const [floatingPositions, setFloatingPositions] = useState(
    Array(10)
      .fill(0)
      .map(() => ({
        x:
          Math.random() *
          (typeof window !== "undefined" ? window.innerWidth : 0),
        y:
          Math.random() *
          (typeof window !== "undefined" ? window.innerHeight : 0),
      })),
  );

  // Floating icons move around randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingPositions((prev) =>
        prev.map(() => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Change GIF + active icon set when user clicks tab
  const handleTabClick = (tab: keyof typeof gifs) => {
    setCurrentGif(gifs[tab]);
    setActiveTab(tab);
  };

  const iconsToShow = iconSets[activeTab] || iconSets.default;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center relative overflow-hidden">
      <h1 className="text-5xl font-bold mb-4 z-10">404!</h1>
      <p className="text-lg font-medium mb-6 z-10">
        This page was not found, but you can stay and pet our dog
      </p>

      <div className="flex flex-row gap-4 max-md:flex-col z-10">
        <Image
          alt="Dog"
          className="rounded-xl mb-6 min-h-[200px] max-h-[200px]"
          height={200}
          src={currentGif}
          width={200}
        />

        <div className="flex flex-col gap-3 mb-8">
          <button
            className={`border px-4 py-2 rounded-xl hover:bg-gray-100 transition ${
              activeTab === "pet" ? "bg-green-100" : ""
            }`}
            onClick={() => handleTabClick("pet")}
          >
            Pet Him
          </button>
          <button
            className={`border px-4 py-2 rounded-xl hover:bg-gray-100 transition ${
              activeTab === "feed" ? "bg-green-100" : ""
            }`}
            onClick={() => handleTabClick("feed")}
          >
            Feed Him
          </button>
          <button
            className={`border px-4 py-2 rounded-xl hover:bg-gray-100 transition ${
              activeTab === "slap" ? "bg-green-100" : ""
            }`}
            onClick={() => handleTabClick("slap")}
          >
            Slap Him
          </button>
          <button
            className={`border px-4 py-2 rounded-xl hover:bg-gray-100 transition ${
              activeTab === "goodboy" ? "bg-green-100" : ""
            }`}
            onClick={() => handleTabClick("goodboy")}
          >
            Call Him a Good Boy
          </button>
        </div>
      </div>

      <Link className="z-10" href="/">
        <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition">
          Back to Homepage
        </button>
      </Link>

      {/* Floating icons */}
      {iconsToShow.map((icon, i) => (
        <motion.div
          key={i}
          animate={{
            x: floatingPositions[i]?.x || 0,
            y: floatingPositions[i]?.y || 0,
            rotate: Math.random() * 360,
          }}
          className="absolute text-3xl opacity-80 pointer-events-none select-none"
          style={{
            top: floatingPositions[i]?.y || 0,
            left: floatingPositions[i]?.x || 0,
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
}
