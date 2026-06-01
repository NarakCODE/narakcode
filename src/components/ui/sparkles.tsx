"use client";

import React, { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";

interface SparklesProps {
  density?: number;
  speed?: number;
  size?: number;
  color?: string;
  className?: string;
}

export function Sparkles({
  density = 800,
  speed = 1,
  size = 1,
  color = "#FFFFFF",
  className,
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Adjust particle count based on density and canvas area to avoid overcrowding on small screens
    const particleCount = Math.min(
      density,
      Math.floor((width * height) / 1000) * 2
    );
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      opacitySpeed: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: (Math.random() * 0.8 + 0.2) * size,
        speed: (Math.random() * 0.15 + 0.05) * speed,
        opacity: Math.random(),
        opacitySpeed:
          (Math.random() * 0.015 + 0.005) *
          speed *
          (Math.random() > 0.5 ? 1 : -1),
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      particles.forEach((p) => {
        p.opacity += p.opacitySpeed;
        if (p.opacity > 1) {
          p.opacity = 1;
          p.opacitySpeed = -Math.abs(p.opacitySpeed);
        } else if (p.opacity < 0) {
          p.opacity = 0;
          p.opacitySpeed = Math.abs(p.opacitySpeed);
          // Teleport particle to a new spot when it fully fades
          p.x = Math.random() * width;
          p.y = Math.random() * height;
        }

        // Float slightly upwards
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, speed, size, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
    />
  );
}
