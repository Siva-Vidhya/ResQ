import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Group } from 'three';

const FloatingHeroScene: React.FC = () => {
  const rootGroupRef = useRef<Group | null>(null);
  const dropGroupRef = useRef<Group | null>(null);
  const shieldGroupRef = useRef<Group | null>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (rootGroupRef.current) {
      rootGroupRef.current.position.y = Math.sin(t * 1.5) * 0.09;
      rootGroupRef.current.rotation.y = Math.sin(t * 0.8) * 0.18;
    }
    if (dropGroupRef.current) {
      dropGroupRef.current.position.y = 0.52 + Math.sin(t * 2.1 + 1.0) * 0.06;
    }
    if (shieldGroupRef.current) {
      shieldGroupRef.current.rotation.z = Math.sin(t * 1.2) * 0.04;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, -0.05, 0]}>
      {/* Soft Pastel Base Halo Disc (Low-Poly) */}
      <mesh position={[0, -0.92, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.45, 20]} />
        <meshStandardMaterial
          color="#E0F2FE"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* 1. 3D Map Pin (Ocean Blue #2563EB + White Center) */}
      <group position={[-0.42, 0.08, 0]} rotation={[0, 0.15, 0.06]}>
        {/* Pin Top Sphere */}
        <mesh position={[0, 0.34, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial
            color="#2563EB"
            roughness={0.32}
            metalness={0.08}
          />
        </mesh>

        {/* Pin Bottom Cone Tip */}
        <mesh position={[0, -0.22, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.42, 0.74, 16]} />
          <meshStandardMaterial
            color="#2563EB"
            roughness={0.32}
            metalness={0.08}
          />
        </mesh>

        {/* White Inner Pin Hollow */}
        <mesh position={[0, 0.34, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.14, 14]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.25}
            metalness={0.05}
          />
        </mesh>
      </group>

      {/* 2. 3D Water Drop (Sky Blue #0EA5E9, Low-Poly) */}
      <group ref={dropGroupRef} position={[-1.08, 0.52, 0.18]} rotation={[0, 0, -0.1]}>
        {/* Droplet Base */}
        <mesh position={[0, -0.08, 0]}>
          <sphereGeometry args={[0.28, 14, 14]} />
          <meshStandardMaterial
            color="#0EA5E9"
            roughness={0.22}
            metalness={0.12}
          />
        </mesh>
        {/* Droplet Tip */}
        <mesh position={[0, 0.18, 0]}>
          <coneGeometry args={[0.24, 0.42, 14]} />
          <meshStandardMaterial
            color="#38BDF8"
            roughness={0.22}
            metalness={0.12}
          />
        </mesh>
      </group>

      {/* 3. 3D Protective Shield (Teal #14B8A6 with White Checkmark, Low-Poly) */}
      <group
        ref={shieldGroupRef}
        position={[0.55, -0.04, 0.24]}
        rotation={[0, -0.2, 0]}
      >
        {/* White Shield Rim */}
        <mesh rotation={[Math.PI / 2, Math.PI / 6, 0]} position={[0, 0, -0.03]}>
          <cylinderGeometry args={[0.64, 0.52, 0.12, 6]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.3}
            metalness={0.05}
          />
        </mesh>

        {/* Main Teal Shield Face */}
        <mesh rotation={[Math.PI / 2, Math.PI / 6, 0]}>
          <cylinderGeometry args={[0.56, 0.45, 0.16, 6]} />
          <meshStandardMaterial
            color="#14B8A6"
            roughness={0.28}
            metalness={0.1}
          />
        </mesh>

        {/* Checkmark Short Bar */}
        <mesh position={[-0.11, -0.05, 0.1]} rotation={[0, 0, -0.75]}>
          <boxGeometry args={[0.1, 0.24, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>

        {/* Checkmark Long Bar */}
        <mesh position={[0.09, 0.03, 0.1]} rotation={[0, 0, 0.68]}>
          <boxGeometry args={[0.1, 0.42, 0.08]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

export const HeroPin3DCanvas: React.FC = () => {
  return (
    <div
      className="w-64 sm:w-72 h-44 sm:h-48 mx-auto relative pointer-events-none select-none"
      role="img"
      aria-label="3D illustration of a floating map pin, water drop, and protective shield"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.15, 3.3], fov: 38 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        {/* Soft Daylight Lighting in Light Blue & Teal */}
        <ambientLight intensity={1.35} color="#F0F9FF" />
        <hemisphereLight args={['#E0F2FE', '#CCFBF1', 0.9]} />
        <directionalLight position={[3, 4, 4]} intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[-3, -2, 3]} intensity={0.65} color="#38BDF8" />

        <FloatingHeroScene />
      </Canvas>
    </div>
  );
};

export default HeroPin3DCanvas;
