import React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  position: { x: number; y: number };
  onSelect: (emoji: any) => void;
  onClose: () => void;
}

export function EmojiPicker({ position, onSelect, onClose }: EmojiPickerProps) {
  return (
    <div
      className="fixed z-50"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <div className="absolute inset-0" onClick={onClose} />
      <Picker
        data={data}
        onEmojiSelect={onSelect}
        theme="dark"
        previewPosition="none"
        skinTonePosition="none"
      />
    </div>
  );
}
