"use client";
import { useEffect, useRef } from "react";

const AINodeAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    let time = 0;
    let opacity = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fade in
      if (opacity < 1) {
        opacity = Math.min(opacity + 0.01, 1);
      }

      // Draw subtle animated gradient orbs
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Create 3 subtle glowing orbs that move slowly
      for (let i = 0; i < 3; i++) {
        const angle = time * 0.3 + (i * (Math.PI * 2)) / 3;
        const radius = 80 + Math.sin(time * 0.5 + i) * 20;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Draw soft glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 100);
        gradient.addColorStop(0, `rgba(255, 140, 0, ${0.08 * opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 140, 0, ${0.03 * opacity})`);
        gradient.addColorStop(1, "rgba(255, 140, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation after a delay
    const startTimeout = setTimeout(() => {
      animate();
    }, 400);

    return () => {
      clearTimeout(startTimeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        width: "100%",
        height: "100%",
        opacity: 0.5,
        mixBlendMode: "normal",
      }}
    />
  );
};

export default AINodeAnimation;
