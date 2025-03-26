import React, { useState } from 'react';
import { Sliders, Camera, Download } from 'lucide-react';

interface ModelCustomizationStepProps {
  selectedStyles: string[];
  onComplete: (config: any) => void;
}

export function ModelCustomizationStep({ selectedStyles, onComplete }: ModelCustomizationStepProps) {
  const [activeTab, setActiveTab] = useState<'face' | 'body' | 'style'>('face');
  const [config, setConfig] = useState({
    face: { shape: 50, eyes: 50, nose: 50, mouth: 50 },
    body: { height: 50, build: 50 },
    style: { color: '#000000', pattern: 'none' }
  });

  const tabs = [
    { id: 'face', label: '面部', icon: Camera },
    { id: 'body', label: '体型', icon: Sliders },
    { id: 'style', label: '风格', icon: Download }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">形象定制</h2>
        <p className="text-gray-500">调整数字人的外观和风格</p>
      </div>

      {/* Preview Area */}
      <div className="aspect-square bg-gray-100 rounded-xl mb-6">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          3D预览区域
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {activeTab === 'face' && (
          <>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">面部轮廓</label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.face.shape}
                onChange={(e) => setConfig({
                  ...config,
                  face: { ...config.face, shape: parseInt(e.target.value) }
                })}
                className="w-full"
              />
            </div>
            {/* Add more face controls */}
          </>
        )}
      </div>

      <button
        onClick={() => onComplete(config)}
        className="w-full py-3 bg-primary text-white rounded-xl font-medium"
      >
        下一步
      </button>
    </div>
  );
}
