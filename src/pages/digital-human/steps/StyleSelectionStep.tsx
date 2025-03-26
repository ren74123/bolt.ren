import React, { useState } from 'react';
import { Tag } from 'lucide-react';

interface StyleSelectionStepProps {
  onComplete: (styles: string[]) => void;
}

export function StyleSelectionStep({ onComplete }: StyleSelectionStepProps) {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const styles = [
    { id: 'casual', label: '休闲', icon: '👕' },
    { id: 'business', label: '商务', icon: '💼' },
    { id: 'creative', label: '创意', icon: '🎨' },
    { id: 'sporty', label: '运动', icon: '⚽' },
    { id: 'elegant', label: '优雅', icon: '👗' },
    { id: 'tech', label: '科技', icon: '💻' },
  ];

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev => {
      if (prev.includes(styleId)) {
        return prev.filter(id => id !== styleId);
      }
      if (prev.length < 3) {
        return [...prev, styleId];
      }
      return prev;
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">选择风格</h2>
        <p className="text-gray-500">选择最多3个标签定义数字人风格</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {styles.map(style => (
          <button
            key={style.id}
            onClick={() => toggleStyle(style.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedStyles.includes(style.id)
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">{style.icon}</div>
            <div className="font-medium">{style.label}</div>
          </button>
        ))}
      </div>

      <button
        onClick={() => onComplete(selectedStyles)}
        disabled={selectedStyles.length === 0}
        className={`w-full py-3 rounded-xl font-medium transition-colors ${
          selectedStyles.length > 0
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        下一步
      </button>
    </div>
  );
}
