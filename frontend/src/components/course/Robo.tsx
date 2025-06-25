import { useEffect, useRef, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { animate, useMotionValue } from "framer-motion";
import { BlurFade } from "../magicui/blur-fade";

const Robot = ({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) => {
  const { scene } = useGLTF("/models/robot.glb");
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Framer Motion values for smooth animation
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);

  useFrame(() => {
    // Animate to mouse or center
    animate(targetX, mouse.current.x, { type: "spring", stiffness: 120, damping: 20 });
    animate(targetY, mouse.current.y, { type: "spring", stiffness: 120, damping: 20 });
    if (ref.current) {
      // Project animated mouse position to 3D
      const vector = new THREE.Vector3(targetX.get(), -targetY.get(), 0.6);
      vector.unproject(camera);
      ref.current.lookAt(vector);
    }
  });

  return (
    <group ref={ref}>
      <primitive object={scene} scale={2} />
      {/* Soft shadow under the robot */}
      <ContactShadows color={"#0a0f1d"} position={[0, -2.2, 0]} opacity={0.8} width={2} height={2} blur={2.5} far={2.5} />
    </group>
  );
};

const RobotViewer = () => {

  const [togglePostion, setTogglePostion] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const lastMove = useRef(Date.now());

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 15 - 20;
      mouse.current.y = (e.clientY / window.innerHeight) * 15 - 15;
      lastMove.current = Date.now();
    };
    const handlePointerLeave = () => {
      mouse.current.x = 0;
      mouse.current.y = 0;
    };
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseleave", handlePointerLeave);
    // Reset to center if idle for 2s
    const interval = setInterval(() => {
      if (Date.now() - lastMove.current > 2000) {
        mouse.current.x = 0;
        mouse.current.y = 0;
      }
    }, 500);
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
      clearInterval(interval);
    };
  }, [mouse, lastMove]);



  const handleTogglePostion = () => {
    setTogglePostion(!togglePostion);
  };


  return (
    <BlurFade className="absolute z-50" delay={3}>
    <div
      onClick={handleTogglePostion}
      className={`fixed grayscale-40 brightness-110 sepia-10 hue-rotate-330  ${togglePostion ? "-bottom-10 -right-5 w-[120px] h-[120px]" : "-bottom-5 -right-7 w-[200px] h-[200px]"} z-50 cursor-pointer`}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} shadows>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
        <Suspense fallback={null}>
          <Robot mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
    </BlurFade>
  );
};

export default RobotViewer;