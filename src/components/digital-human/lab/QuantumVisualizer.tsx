import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface QuantumVisualizerProps {
  activity: number;
  complexity: number;
}

export function QuantumVisualizer({ activity, complexity }: QuantumVisualizerProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001 * activity;
      particlesRef.current.rotation.x += 0.0005 * activity;
    }
  });

  const particleCount = Math.floor(1000 * complexity);
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = Math.random() * 2;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    colors[i * 3] = Math.random();
    colors[i * 3 + 1] = Math.random();
    colors[i * 3 + 2] = Math.random();
  }

  const shader = {
    uniforms: {
      time: { value: 0 },
      activity: { value: activity }
    },
    vertexShader: `
      uniform float time;
      uniform float activity;
      attribute vec3 color;
      varying vec3 vColor;
      
      void main() {
        vColor = color;
        vec3 pos = position;
        pos.x += sin(time * activity + position.z) * 0.1;
        pos.y += cos(time * activity + position.x) * 0.1;
        pos.z += sin(time * activity + position.y) * 0.1;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = 2.0 * (1.0 - mvPosition.z / 10.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
        float strength = distance(gl_PointCoord, vec2(0.5));
        strength = 1.0 - strength;
        strength = pow(strength, 3.0);
        
        gl_FragColor = vec4(vColor, strength);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  };

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial ref={materialRef} args={[shader]} />
    </points>
  );
}
