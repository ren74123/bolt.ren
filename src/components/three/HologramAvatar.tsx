import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface HologramAvatarProps {
  position: [number, number, number];
  hasRealAvatar: boolean;
}

export function HologramAvatar({ position, hasRealAvatar }: HologramAvatarProps) {
  const avatarRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (avatarRef.current) {
      avatarRef.current.rotation.y += 0.01;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const hologramShader = {
    uniforms: {
      time: { value: 0 },
      isActive: { value: hasRealAvatar ? 1.0 : 0.5 }
    },
    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      void main() {
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float isActive;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        float scanLine = sin(vPosition.y * 10.0 + time * 2.0) * 0.5 + 0.5;
        float hologram = sin(vUv.y * 50.0) * 0.25 + 0.75;
        vec3 color = vec3(0.0, 0.8, 1.0) * isActive;
        gl_FragColor = vec4(color * hologram * scanLine, 0.6);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  };

  return (
    <Sphere
      ref={avatarRef}
      args={[1, 32, 32]}
      position={position}
    >
      <shaderMaterial ref={materialRef} attach="material" args={[hologramShader]} />
    </Sphere>
  );
}
