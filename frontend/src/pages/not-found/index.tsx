import * as THREE from 'three'
import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Text, Center, Environment, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/landing/Navbar'

function Letter({ children, position, isDarkMode }) {
  const [hovered, setHovered] = useState(false)
  const textRef = useRef()

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.scale.x = THREE.MathUtils.lerp(
        textRef.current.scale.x,
        hovered ? 1.5 : 1,
        0.1
      )
      textRef.current.scale.y = THREE.MathUtils.lerp(
        textRef.current.scale.y,
        hovered ? 1.5 : 1,
        0.1
      )
      textRef.current.scale.z = THREE.MathUtils.lerp(
        textRef.current.scale.z,
        hovered ? 2 : 1,
        0.1
      )
      textRef.current.rotation.x = THREE.MathUtils.lerp(
        textRef.current.rotation.x,
        hovered ? 0.2 : 0,
        0.1
      )
    }
  })

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={4}
      color={isDarkMode ? '#ffffff' : '#000000'}
      anchorX="center"
      anchorY="middle"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {children}
    </Text>
  )
}

export default function NotFound() {
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  
  return (
    
    <div className="relative h-screen w-screen">
      <Navbar />
      <Canvas camera={{ position: [0, 1, 15] }}>
        <color attach="background" args={['#050816']} />
        <fog attach="fog" args={['#050816', 5, 30]} />
        <Suspense fallback={null}>
          <Astronaut />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />
          
          {/* 3D Text */}
          <group position={[0, 2, 0]}>
            <group position={[0, 3, 0]}>
              <Letter position={[-3, 0, 0]} isDarkMode={isDarkMode}>4</Letter>
              <Letter position={[0, 0, 0]} isDarkMode={isDarkMode}>0</Letter>
              <Letter position={[3, 0, 0]} isDarkMode={isDarkMode}>4</Letter>
            </group>
            <Text
              position={[0, -8, 0]}
              fontSize={0.5}
              color={isDarkMode ? '#aaaaaa' : '#555555'}
              anchorX="center"
              anchorY="middle"
            >
              You have reached the edge of the universe...
            </Text>
          </group>

          {/* 3D Buttons */}
          <group position={[0, -3, 0]}>
            <Html transform position={[-2, -1, 0]} center>
              <motion.button
                className="px-6 py-2 rounded-lg backdrop-blur-sm bg-background bg-opacity-10 border border-white/30 border-opacity-20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </motion.button>
            </Html>
            <Html transform position={[2, -1, 0]} center>
              <motion.button
                className="px-6 py-2 rounded-lg backdrop-blur-sm bg-background bg-opacity-10 border border-white/30 border-opacity-20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
              >
                Go Back
              </motion.button>
            </Html>
          </group>

          <OrbitControls 
            enableZoom={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

function Astronaut() {
  const ref = useRef(THREE.Group)
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.005
      ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5
    }
  })

  return (
    <group ref={ref}>
      <Center>
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="#ffffff" wireframe />
        </mesh>
      </Center>
    </group>
  )
}
