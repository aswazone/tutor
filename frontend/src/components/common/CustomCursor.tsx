import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const springSettings = {
  stiffness: 150,
  damping: 30,
  mass: 1,
};

export const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ring1X = useSpring(mouseX, springSettings);
  const ring1Y = useSpring(mouseY, springSettings);

  const ring2X = useSpring(ring1X, springSettings);
  const ring2Y = useSpring(ring1Y, springSettings);

  const ring3X = useSpring(ring2X, springSettings);
  const ring3Y = useSpring(ring2Y, springSettings);

  const ring4X = useSpring(ring3X, springSettings);
  const ring4Y = useSpring(ring3Y, springSettings);

  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Resume tracking on movement
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsIdle(false);

      // Clear old timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Set timeout to go idle
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        // Reset cursor to center or a fixed point
        mouseX.set(-100);
        mouseY.set(-100);
        
      }, 2000); // 2 seconds idle timeout
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Main dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          width: 3,
          height: 3,
          // backgroundColor: isIdle ? "white" :"#f43f5e" , // red when idle
          borderRadius: "50%",
          position: "fixed",
          top: -5,
          left: -1,
          pointerEvents: "none",
          zIndex: 9999,
          fontSize: isIdle ? "10px" : "10px",
        }}
      >✧</motion.div>

      {/* Ring 1 */}
      {/* <motion.div
        style={{
          x: ring1X,
          y: ring1Y,
          width: 20,
          height: 20,
          border: "2px solid #ec4899",
          borderRadius: "50%",
          position: "fixed",
          top: -7,
          left: -7,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      /> */}

      {/* Ring 2 */}
      <motion.div
        style={{
          x: ring2X,
          y: ring2Y,
          width: 20,
          height: 20,
          border: "2px solid #d946ef",
          borderRadius: "50%",
          position: "fixed",
          top: -7,
          left: -7,
          pointerEvents: "none",
          zIndex: 9997,
        }}
      />

      {/* Ring 3 */}
      <motion.div
        style={{
          x: ring3X,
          y: ring3Y,
          width: 32,
          height: 32,
          border: "2px solid #5c6ff6",
          borderRadius: "50%",
          position: "fixed",
          top: -14,
          left: -14,
          pointerEvents: "none",
          zIndex: 9996,
        }}
      />

      {/* Ring 4 */}
      <motion.div
        style={{
          x: ring4X,
          y: ring4Y,
          width: 40,
          height: 40,
          border: "4px dotted #59cef3",
          borderRadius: "50%",
          position: "fixed",
          top: -18,
          left: -18,
          pointerEvents: "none",
          zIndex: 9995,
        }}
      />
    </>
  );
};
