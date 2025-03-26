import React from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';

interface PersonalityReportStepProps {
  type: 'real' | 'clone';
  voiceSamples: string[];
  selectedStyles: string[];
  modelConfig: any;
  onComplete: () => void;
  onAdjust: () => void;
}

export function PersonalityReportStep({
  type,
  voiceSamples,
  selectedStyles,
  modelConfig,
  onComplete,
  onAdjust
}: PersonalityReportStepProps) {
  const personalityTraits = [
    { name: '外向性', value: 75 },
    { name: '开放性', value: 85 },
    { name: '尽责性', value: 60 },
    { name: '亲和性', value: 70 },
    { name: '情绪稳定性', value: 80 },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">人格报告</h2>
        <p className="text-gray-500">基于您的选择生成的数字人画像</p>
      </div>

      {/* Avatar Preview */}
      <div className="aspect-square bg-gray-100 rounded-xl mb-6">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          数字人预览
        </div>
      </div>

      {/* Personality Traits */}
      <div className="space-y-4">
        {personalityTraits.map((trait) => (
          <div key={trait.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{trait.name}</span>
              <span className="text-primary">{trait.value}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${trait.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="font-medium mb-2">人格总结</h3>
        <p className="text-gray-600 text-sm">
          这是一个外向开放、富有创造力的数字人格。善于社交互动，具有较强的情绪稳定性，
          能够在各种场景下保持良好的表现。建议在社交和创意场景中发挥其特长。
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onAdjust}
          className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
        >
          重新调整
        </button>
        <button
          onClick={onComplete}
          className="flex-1 py-3 bg-primary text-white rounded-xl font-medium"
        >
          完成创建
        </button>
      </div>

      {/* Share Button */}
      <button className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium">
        <Share2 className="w-5 h-5" />
        <span>分享报告</span>
      </button>
    </div>
  );
}
