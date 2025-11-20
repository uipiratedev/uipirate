"use client";
import React, { useState } from "react";
import { Button } from "@nextui-org/button";

import {
  getRandomGradient,
  getAllGradients,
  getGradientById,
} from "@/utils/gradientService";

/**
 * Example component demonstrating the gradient service usage
 * This component shows different ways to use the gradient service
 */
const GradientExample = () => {
  const [currentGradient, setCurrentGradient] = useState(getRandomGradient());
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

  const allGradients = getAllGradients();

  const handleRandomGradient = () => {
    setCurrentGradient(getRandomGradient());
    setSelectedId(undefined);
  };

  const handleSelectGradient = (id: number) => {
    const gradient = getGradientById(id);

    if (gradient) {
      setCurrentGradient(gradient);
      setSelectedId(id);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Gradient Service Demo
      </h1>

      {/* Main Display Card */}
      <div
        className="rounded-2xl p-12 mb-8 transition-all duration-500 shadow-lg"
        style={{
          background: currentGradient.value,
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-2">
            {currentGradient.name}
          </h2>
          <p className="text-gray-600 mb-2">ID: {currentGradient.id}</p>
          <code className="text-sm bg-gray-100 p-2 rounded block overflow-x-auto">
            {currentGradient.value}
          </code>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8 justify-center flex-wrap">
        <Button
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          onClick={handleRandomGradient}
        >
          🎲 Random Gradient
        </Button>
      </div>

      {/* Gradient Selector */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Select a Specific Gradient
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allGradients.map((gradient) => (
            <button
              key={gradient.id}
              className={`rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                selectedId === gradient.id
                  ? "ring-4 ring-black shadow-xl"
                  : "shadow-md hover:shadow-lg"
              }`}
              style={{
                background: gradient.value,
              }}
              onClick={() => handleSelectGradient(gradient.id)}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <p className="font-semibold text-sm">{gradient.name}</p>
                <p className="text-xs text-gray-600">ID: {gradient.id}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Usage Examples</h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">1. Get a random gradient:</p>
            <code className="block bg-white p-3 rounded text-sm overflow-x-auto">
              {`import { getRandomGradient } from "@/utils/gradientService";
const gradient = getRandomGradient();`}
            </code>
          </div>

          <div>
            <p className="font-medium mb-2">
              2. Get a specific gradient by ID:
            </p>
            <code className="block bg-white p-3 rounded text-sm overflow-x-auto">
              {`import { getGradientById } from "@/utils/gradientService";
const gradient = getGradientById(3);`}
            </code>
          </div>

          <div>
            <p className="font-medium mb-2">
              3. Get gradient with fallback to random:
            </p>
            <code className="block bg-white p-3 rounded text-sm overflow-x-auto">
              {`import { getGradient } from "@/utils/gradientService";
const gradient = getGradient(5); // Returns gradient #5
const randomGradient = getGradient(); // Returns random`}
            </code>
          </div>

          <div>
            <p className="font-medium mb-2">4. Use in JSX:</p>
            <code className="block bg-white p-3 rounded text-sm overflow-x-auto">
              {`<div style={{ background: getGradient(1).value }}>
  Content here
</div>`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientExample;
