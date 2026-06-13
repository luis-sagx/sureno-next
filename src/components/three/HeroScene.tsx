"use client";

import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { RefObject } from "react";
import { Bottle } from "./Bottle";

interface HeroSceneProps {
  scrollProgress: RefObject<number>;
}

export function HeroScene({ scrollProgress }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 9], fov: 35 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      aria-hidden
    >
      <ambientLight intensity={0.35} />
      <spotLight
        position={[6, 8, 4]}
        intensity={120}
        angle={0.45}
        penumbra={1}
        color="#ffd9a0"
      />
      <pointLight position={[-6, 2, -4]} intensity={30} color="#e9c176" />

      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.5}>
        <Bottle scrollProgress={scrollProgress} />
      </Float>

      <ContactShadows
        position={[0, -2.8, 0]}
        opacity={0.5}
        blur={2.5}
        scale={12}
      />

      {/* Offline studio lighting — no network HDR fetch */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer
            intensity={4}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={[10, 10, 1]}
          />
          <Lightformer
            intensity={1.5}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={[20, 0.5, 1]}
            color="#e9c176"
          />
          <Lightformer
            intensity={1.2}
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={[20, 1, 1]}
          />
        </group>
      </Environment>
    </Canvas>
  );
}
