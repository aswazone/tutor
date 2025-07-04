import { cn } from "@/lib/utils";
import  {useCallback, useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: unknown;
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const wRef = useRef<number>(0);
  const hRef = useRef<number>(0);
  const ntRef = useRef<number>(0);
  const animationIdRef = useRef<number | undefined>(undefined);

  const drawWave = useCallback((n: number) => {
    const getSpeed = () => {
      switch (speed) {
        case "slow":
          return 0.001;
        case "fast":
          return 0.002;
        default:
          return 0.001;
      }
    };
  
    const waveColors = colors ?? [
      "#1e293b", // deep blue
      "#2563eb", // blue
      "#06b6d4", // teal
      "#818cf8", // soft indigo
      "#a21caf", // purple accent
    ];
    ntRef.current += getSpeed();
    for (let i = 0; i < n; i++) {
      ctxRef.current?.beginPath();
      if (!ctxRef.current) return;
      ctxRef.current.lineWidth = waveWidth || 50;
      ctxRef.current.strokeStyle = waveColors[i % waveColors.length];
      for (let x = 0; x < wRef.current; x += 5) {
        const y = noise(x / 800, 0.3 * i, ntRef.current) * 100;
        ctxRef.current.lineTo(x, y + hRef.current * 0.5);
      }
      ctxRef.current.stroke();
      ctxRef.current.closePath();
    }
  }, [ waveWidth,noise , colors, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    ctxRef.current = context;
    wRef.current = ctxRef.current.canvas.width = window.innerWidth;
    hRef.current = ctxRef.current.canvas.height = window.innerHeight;
    ctxRef.current.filter = `blur(${blur}px)`;
    ntRef.current = 0;
    window.onresize = function () {
      wRef.current = ctxRef.current!.canvas.width = window.innerWidth;
      hRef.current = ctxRef.current!.canvas.height = window.innerHeight;
      ctxRef.current!.filter = `blur(${blur}px)`;
    };
    const render = () => {
      if (!ctxRef.current) return;
      ctxRef.current.globalAlpha = waveOpacity || 0.5;
      ctxRef.current.fillRect(0, 0, wRef.current, hRef.current);
      drawWave(5);
      animationIdRef.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [blur, backgroundFill, waveOpacity, waveWidth, colors, speed, drawWave]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but i have got to support it on safari.
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
