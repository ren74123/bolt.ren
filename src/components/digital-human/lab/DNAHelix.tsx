import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GeneData {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface DNAHelixProps {
  genes: GeneData[];
  selectedGenes: {[key: string]: number};
}

export function DNAHelix({ genes, selectedGenes }: DNAHelixProps) {
  const helixRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (helixRef.current) {
      helixRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const dnaShader = {
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color('#4ECDC4') }
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
      varying vec2 vUv;
      
      void main() {
        float strength = smoothstep(0.0, 0.2, 1.0 - length(vUv - 0.5));
        gl_FragColor = vec4(color, strength);
      }
    `,
    transparent: true,
  };

  const createHelix = () => {
    const points = [];
    const segments = 100;
    const radius = 1;
    const height = 4;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 6;
      
      // First strand
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          height * (t - 0.5),
          Math.sin(angle) * radius
        )
      );
      
      // Second strand
      points.push(
        new THREE.Vector3(
          Math.cos(angle + Math.PI) * radius,
          height * (t - 0.5),
          Math.sin(angle + Math.PI) * radius
        )
      );

      // Cross connections
      if (i % 5 === 0) {
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * radius,
            height * (t - 0.5),
            Math.sin(angle) * radius
          ),
          new THREE.Vector3(
            Math.cos(angle + Math.PI) * radius,
            height * (t - 0.5),
            Math.sin(angle + Math.PI) * radius
          )
        );
      }
    }
    
    return points;
  };

  const helixPoints = createHelix();

  return (
    <group ref={helixRef}>
      {/* DNA Strands */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={helixPoints.length}
            array={new Float32Array(helixPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial ref={materialRef} args={[dnaShader]} />
      </line>

      {/* Gene Nodes */}
      {genes.map((gene, index) => {
        const t = index / (genes.length - 1);
        const angle = t * Math.PI * 6;
        const y = 4 * (t - 0.5);
        const scale = selectedGenes[gene.id] ? selectedGenes[gene.id] / 100 + 0.5 : 0.5;

        return (
          <group key={gene.id}>
            <mesh
              position={[
                Math.cos(angle) * 1,
                y,
                Math.sin(angle) * 1
              ]}
              scale={[scale, scale, scale]}
            >
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial
                color={gene.color}
                emissive={gene.color}
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Gene Connection Lines */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    Math.cos(angle) * 1, y, Math.sin(angle) * 1,
                    Math.cos(angle + Math.PI) * 1, y, Math.sin(angle + Math.PI) * 1
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color={gene.color} linewidth={2} />
            </line>
          </group>
        );
      })}

      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      
      {/* Point Lights */}
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#4ECDC4" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#FF6B6B" />
    </group>
  );
}
