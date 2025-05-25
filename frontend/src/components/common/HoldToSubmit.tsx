import React, { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface HoldToConfirmButtonProps {
  onConfirm: () => void;
  holdDuration?: number;
  children: React.JSX.Element;
}

const HoldToConfirmButton: React.FC<HoldToConfirmButtonProps> = ({
  onConfirm,
  holdDuration = 2000,
  children
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const controls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHolding(true);
    controls.start({ strokeDashoffset: 0, transition: { duration: holdDuration / 1000 } });

    timerRef.current = setTimeout(() => {
      onConfirm();
      resetHold();
    }, holdDuration);
  };

  const resetHold = () => {
    setIsHolding(false);
    controls.stop();
    controls.set({ strokeDashoffset: 125.67 }); // Full offset
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center">
      <button
        onMouseDown={startHold}
        onTouchStart={startHold}
        onMouseUp={resetHold}
        onMouseLeave={resetHold}
        onTouchEnd={resetHold}
        className="relative text-xs z-10 p-1.5 rounded-full  bg-red-900/30 border-1 border-red-900/50 text-black shadow-lg select-none"
      >
        {children}
      </button>

      {/* Circular progress */}
      {<svg
        className="absolute w-28 h-28"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-90deg)" }}
      >
        <motion.circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="red"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={controls}
        />
      </svg>}
    </div>
  );
};

export default HoldToConfirmButton;
