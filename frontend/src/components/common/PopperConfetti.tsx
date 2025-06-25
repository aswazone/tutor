"use client";

import confetti, { Shape } from "canvas-confetti";
import React, { useEffect, useRef } from "react";

interface PopperConfettiProps {
  showConfetti: boolean;
}

function PopperConfetti({ showConfetti }: PopperConfettiProps) {
  const intervalRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const burstTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper for random in range
  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  
  // Sequence: cannons -> bursts -> fireworks
  useEffect(() => {
    // Neon and pastel colors
    const colors = [
      "#00f0ff", "#00bfff", "#1f51ff", "#33ccff", "#00ffe0", // neon blues
      "#ff00c8", "#ff5e62", "#ffe156", "#aaff00", "#ff61a6", // neon pink/yellow/green
      "#fff", "#f3f3f3", "#faffd1", "#f9ea8f", "#f6d365"    // pastel/white
    ];
  
    // Star and heart shapes (canvas-confetti supports emoji shapes)
    const shapes:Shape[] = ["circle", "square", "star"];
  
    // Cannons from both sides
    const handleCannons = () => {
      const end = Date.now() + 2 * 1000;
      const frame = () => {
        if (Date.now() > end) return;
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 70,
          startVelocity: 70,
          origin: { x: 0, y: 0.6 },
          colors,
          shapes,
          scalar: randomInRange(0.8, 1.2),
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 70,
          startVelocity: 70,
          origin: { x: 1, y: 0.6 },
          colors,
          shapes,
          scalar: randomInRange(0.8, 1.2),
        });
        animationFrameRef.current = requestAnimationFrame(frame);
      };
      frame();
    };
  
    // Bursts from center
    const handleBursts = () => {
      let burstCount = 0;
      const burst = () => {
        if (burstCount >= 5) return;
        confetti({
          particleCount: 30,
          spread: 360,
          startVelocity: randomInRange(40, 70),
          origin: { x: 0.5, y: 0.5 },
          colors,
          shapes,
          scalar: randomInRange(0.7, 1.3),
        });
        burstCount++;
        burstTimeoutRef.current = setTimeout(burst, 350);
      };
      burst();
    };
  
    // Fireworks from random sides
    const handleFireworks = () => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  
      intervalRef.current = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }
        const particleCount = Math.floor(40 * (timeLeft / duration));
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.5) },
          colors,
          shapes,
          scalar: randomInRange(0.7, 1.2),
        });
      }, 250);
    };
    if (showConfetti) {
      handleCannons();
      const burstTimeout = setTimeout(() => {
        handleBursts();
        const fireworksTimeout = setTimeout(() => {
          handleFireworks();
        }, 1800);
        burstTimeoutRef.current = fireworksTimeout as unknown as NodeJS.Timeout;
      }, 3600);

      burstTimeoutRef.current = burstTimeout;

      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
      };
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
    }
  }, [showConfetti]);

  return <span className="hidden"></span>;
}

export default React.memo(PopperConfetti);