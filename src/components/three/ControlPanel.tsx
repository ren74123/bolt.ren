import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

interface ControlPanelProps {
  position: [number, number, number];
  hasRealAvatar: boolean;
}

export function ControlPanel({ position, hasRealAvatar }: ControlPanelProps) {
  const panelRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const shader = {
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(hasRealAvatar ? '#00ff88' : '#ff3366') }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      varying vec2 vUv;
      
      void main() {
        float pulse = sin(time * 2.0) * 0.5 + 0.5;
        vec3 finalColor = color * (0.5 + pulse * 0.5);
        float grid = sin(vUv.x * 40.0) * sin(vUv.y * 40.0);
        gl_FragColor = vec4(finalColor, 0.5 + grid * 0.2);
      }
    `,
    transparent: true,
  };

  return (
    <Plane
      ref={panelRef}
      args={[4, 2]}
      position={position}
      rotation={[-Math.PI / 4, 0, 0]}
    >
      <shaderMaterial ref={materialRef} attach="material" args={[shader]} />
    </Plane>
  );
}
