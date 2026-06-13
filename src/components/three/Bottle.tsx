"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

/** Bottle silhouette: [radius, height] pairs from base to mouth. */
const PROFILE: [number, number][] = [
  [0.0, 0.0],
  [1.12, 0.0],
  [1.2, 0.12],
  [1.2, 3.0],
  [1.05, 3.55],
  [0.55, 4.15],
  [0.42, 4.45],
  [0.42, 5.1],
  [0.5, 5.16],
  [0.5, 5.45],
  [0.0, 5.45],
];

interface BottleProps {
  /** 0..1 scroll progress, written by the hero section. */
  scrollProgress: RefObject<number>;
}

export function Bottle({ scrollProgress }: BottleProps) {
  const group = useRef<THREE.Group>(null);

  const glassPoints = useMemo(
    () => PROFILE.map(([x, y]) => new THREE.Vector2(x, y)),
    []
  );
  const liquidPoints = useMemo(
    () => PROFILE.map(([x, y]) => new THREE.Vector2(x * 0.9, y)),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    const p = scrollProgress.current ?? 0;
    // Full turn across the scroll story + slow idle spin
    group.current.rotation.y =
      p * Math.PI * 2 + state.clock.elapsedTime * 0.1;
    // Gentle tilt as the user scrolls in
    group.current.rotation.z = THREE.MathUtils.lerp(
      0,
      -0.3,
      Math.min(p * 2, 1)
    );
  });

  return (
    <group ref={group} position={[0, -2.7, 0]}>
      {/* Glass shell */}
      <mesh castShadow>
        <latheGeometry args={[glassPoints, 64]} />
        <meshPhysicalMaterial
          color="#23421f"
          roughness={0.06}
          transmission={0.92}
          thickness={1.1}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* Liquid (lower 55% of the bottle) */}
      <mesh scale={[1, 0.55, 1]} position={[0, 0.03, 0]}>
        <latheGeometry args={[liquidPoints, 64]} />
        <meshPhysicalMaterial
          color="#a85c12"
          roughness={0.25}
          transmission={0.55}
          thickness={2}
        />
      </mesh>

      {/* Label band */}
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[1.215, 1.215, 1.15, 64, 1, true]} />
        <meshStandardMaterial
          color="#ece5da"
          roughness={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Gold capsule */}
      <mesh position={[0, 5.25, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.65, 32]} />
        <meshStandardMaterial
          color="#e9c176"
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}
