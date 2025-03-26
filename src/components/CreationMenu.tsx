import React from 'react';
import { PenTool, Box, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreationMenuProps {
  onClose: () => void;
}

export function CreationMenu({ onClose }: CreationMenuProps) {
  const navigate = useNavigate();
  
  const options = [
    {
      id: 'text-to-image',
      icon: PenTool,
      label: '文生图',
      description: '用文字描述生成图像',
      path: '/create/text-to-image'
    },
    {
      id: '3d-scene',
      icon: Box,
      label: '3D场景',
      description: '创建3D模型和场景',
      path: '/create/3d-scene'
    }
  ];

  const handleOptionClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">创建新作品</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => handleOptionClick(option.path)}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium">{option.label}</h4>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
