import React from 'react';
import { User, Users } from 'lucide-react';

interface TypeSelectionStepProps {
  onSelect: (type: 'real' | 'clone') => void;
}

export function TypeSelectionStep({ onSelect }: TypeSelectionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">选择创建类型</h2>
        <p className="text-gray-500">选择您想要创建的数字人类型</p>
      </div>

      <button
        onClick={() => onSelect('real')}
        className="w-full bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-lg font-semibold mb-1">真实数字人</h3>
            <p className="text-gray-500 text-sm">基于您的声音和形象创建专属数字分身</p>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelect('clone')}
        className="w-full bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-lg font-semibold mb-1">副本数字人</h3>
            <p className="text-gray-500 text-sm">通过人格融合实验创建独特的虚拟身份</p>
          </div>
        </div>
      </button>
    </div>
  );
}
