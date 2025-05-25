import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export const TextFillLoading = ({
  text = "Loading",
  duration = 3,//9
  fontSize = 100,
}: {
  text?: string;
  duration?: number;
  fontSize?: number;
}) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      clipPath: [
        `path('M0,110 Q60,110 120,120 T240,120 T360,120 T480,120 V200 H0 Z')`,
        `path('M0,80 Q60,70 120,80 T240,80 T360,80 T480,80 V200 H0 Z')`,
        `path('M0,40 Q60,30 120,40 T240,40 T360,40 T480,40 V200 H0 Z')`,
        `path('M0,0 Q60,-10 120,0 T240,0 T360,0 T480,0 V200 H0 Z')`, 
      ],
      transition: {
        duration,
        ease: "easeInOut",
      },
    });
  }, [controls, duration]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 180,
        width: "100%",
        background: 'transparent',
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Background text */}
        <span
            className="hover-target"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundClip: "text",
            color: "transparent",
            textShadow: "1px 1px 2px rgba(1, 0, 2, 0.35), 0 2px 4px rgba(0, 1, 0, 0.45), 0 4px 8px rgba(0, 1, 0, 0.55), 0 8px 16px rgba(0, 0, 0, 0.65), 0 16px 32px rgba(0, 0, 0, 0.75)",
            backgroundImage: "linear-gradient(to right, rgba(75, 85, 99, 1), rgba(101, 121, 182, 1), rgba(156, 163, 175, 1))",
            // color: "#64E9F8",
            opacity: 0.18,
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 900,
            fontSize,
            textTransform: "uppercase",
            letterSpacing: "-0.06em",
            pointerEvents: "none",
            userSelect: "none",
          }}
          aria-hidden="true"
        >
          {text}
        </span>

        {/* Animated water fill */}
        <motion.span
        className="hover-target"
        style={{
            
            backgroundImage: "linear-gradient(to top left, #1e293b, #0284c7, #94a3b8)", // dark red to light red
            backgroundClip: "text",
            color: "#FCA5A5", // soft light red fallback
            fontFamily: "'Unbounded', sans-serif",
            fontWeight: 900,
            fontSize,
            textTransform: "uppercase",
            letterSpacing: "-0.06em",
            position: "relative",
            display: "inline-block",
        }}
        initial={{
            backgroundImage: "linear-gradient(to top left, #1e293b, #0284c7, #94a3b8)",
            backgroundClip: "text",
            color: "transparent",
            fontFamily: "'Unbounded', sans-serif",
            clipPath: `path('M0,200 Q60,190 120,200 T240,200 T360,200 T480,200 V200 H0 Z')`,
        }}
        animate={controls}
        >
        {text}
        </motion.span>

      </div>
    </div>
  );
};
