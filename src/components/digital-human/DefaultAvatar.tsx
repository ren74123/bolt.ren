import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { useDigitalHumanStore } from '../../store/digitalHumanStore';
import { HologramAvatar } from '../three/HologramAvatar';
import { ControlPanel } from '../three/ControlPanel';
import { SpaceStation } from '../three/SpaceStation';
import { StarField } from '../three/StarField';

interface DefaultAvatarProps {
  onInteract?: () => void;
}

export function DefaultAvatar({ onInteract }: DefaultAvatarProps) {
  const navigate = useNavigate();
  const hasRealAvatar = useDigitalHumanStore(state => state.type !== null);
  const containerRef = useRef<HTMLDivElement>(null);
  const interactionCount = useRef(0);

  useEffect(() => {
    // Handle tutorial marker visibility
    if (!hasRealAvatar && containerRef.current) {
      const marker = document.createElement('div');
      marker.className = 'absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full';
      marker.textContent = '示例原型';
      containerRef.current.appendChild(marker);
    }
  }, [hasRealAvatar]);

  const handleAvatarClick = () => {
    if (!hasRealAvatar) {
      interactionCount.current += 1;
      
      // Play voice prompt
      const audio = new Audio('/assets/sounds/avatar-prompt.mp3');
      audio.play();

      // Show creation guidance after 3 interactions
      if (interactionCount.current >= 3) {
        navigate('/digital-human/create');
      }

      onInteract?.();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square bg-black rounded-xl overflow-hidden"
      onClick={handleAvatarClick}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* Background Elements */}
        <StarField />
        <SpaceStation />

        {/* Main Avatar */}
        <HologramAvatar
          position={[0, 0, 0]}
          hasRealAvatar={hasRealAvatar}
        />

        {/* Control Interface */}
        <ControlPanel
          position={[0, -2, 0]}
          hasRealAvatar={hasRealAvatar}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
      </Canvas>

      {/* Particle Guide Line */}
      {!hasRealAvatar && (
        <div className="absolute bottom-8 right-8 w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary animate-pulse" 
               style={{
                 clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                 transform: 'rotate(-45deg)'
               }}
          />
        </div>
      )}
    </div>
  );
}
