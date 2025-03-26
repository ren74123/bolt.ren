import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-6 bottom-24 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-primary/90 transition-colors z-20"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
