import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export function SpaceStation() {
  const stationRef = useRef<THREE.Group>(null);
  const panelRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (stationRef.current) {
      stationRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
    if (panelRef.current) {
      panelRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  return (
    <group ref={stationRef}>
      {/* Main Station Body */}
      <Cylinder args={[3, 3, 8, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
          emissive="#001133"
          emissiveIntensity={0.2}
        />
      </Cylinder>

      {/* Solar Panels */}
      <group ref={panelRef}>
        {[-1, 1].map((x) => (
          <Box
            key={x}
            args={[6, 0.1, 2]}
            position={[x * 5, 0, 0]}
          >
            <meshStandardMaterial
              color="#2266cc"
              metalness={0.5}
              roughness={0.2}
              emissive="#0044aa"
              emissiveIntensity={0.5}
            />
          </Box>
        ))}
      </group>

      {/* Station Lights */}
      {Array.from({ length: 8 }).map((_, i) => (
        <pointLight
          key={i}
          position={[
            Math.cos(i * Math.PI / 4) * 3,
            Math.sin(i * Math.PI / 4) * 3,
            0
          ]}
          intensity={0.3}
          color="#66ccff"
          distance={10}
          decay={2}
        />
      ))}

      {/* Decorative Details */}
      <group>
        {Array.from({ length: 12 }).map((_, i) => (
          <Box
            key={i}
            args={[0.5, 0.5, 0.1]}
            position={[
              Math.cos(i * Math.PI / 6) * 3,
              Math.sin(i * Math.PI / 6) * 3,
              0
            ]}
          >
            <meshStandardMaterial
              color="#444444"
              emissive="#00ffff"
              emissiveIntensity={0.5}
            />
          </Box>
        ))}
      </group>
    </group>
  );
}
