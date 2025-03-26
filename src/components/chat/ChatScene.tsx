import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface ChatSceneProps {
  scene: string;
  intensity?: number;
}

export function ChatScene({ scene, intensity = 1 }: ChatSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // 场景配置
  const sceneConfigs = {
    default: {
      color: '#4ECDC4',
      environment: 'sunset',
      hasStars: true,
    },
    coffee: {
      color: '#A0522D',
      environment: 'city',
      hasStars: false,
    },
    beach: {
      color: '#87CEEB',
      environment: 'sunset',
      hasStars: true,
    },
    office: {
      color: '#4682B4',
      environment: 'warehouse',
      hasStars: false,
    },
  };

  const config = sceneConfigs[scene as keyof typeof sceneConfigs] || sceneConfigs.default;

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  const shader = {
    uniforms: {
      time: { value: 0 },
      intensity: { value: intensity },
      color: { value: new THREE.Color(config.color) }
    },
    vertexShader: `
      varying vec2 vUv;
      uniform float time;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.y += sin(time + position.x * 2.0) * 0.1;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float intensity;
      varying vec2 vUv;
      
      void main() {
        float strength = smoothstep(0.0, 0.2, 1.0 - length(vUv - 0.5));
        gl_FragColor = vec4(color, strength * intensity);
      }
    `,
    transparent: true,
  };

  return (
    <group ref={groupRef}>
      {/* 环境光照 */}
      <Environment preset={config.environment as any} />
      
      {/* 星空背景 */}
      {config.hasStars && <Stars radius={100} depth={50} count={5000} factor={4} />}
      
      {/* 主要场景元素 */}
      <mesh>
        <planeGeometry args={[2, 2, 32, 32]} />
        <shaderMaterial ref={materialRef} args={[shader]} />
      </mesh>
    </group>
  );
}
