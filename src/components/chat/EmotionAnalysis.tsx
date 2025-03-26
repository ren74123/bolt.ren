import React from 'react';
import { Brain } from 'lucide-react';

interface EmotionAnalysisProps {
  emotion: {
    type: 'happy' | 'sad' | 'neutral' | 'excited';
    intensity: number;
    confidence: number;
  };
}

export function EmotionAnalysis({ emotion }: EmotionAnalysisProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <Brain className="w-5 h-5 text-primary" />
        <span className="text-white font-medium capitalize">{emotion.type}</span>
      </div>
      
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">情感强度</span>
            <span className="text-primary">{emotion.intensity}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${emotion.intensity}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">置信度</span>
            <span className="text-green-400">{emotion.confidence}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-400 transition-all"
              style={{ width: `${emotion.confidence}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
