import React from 'react';
import { Eye, Skull, Brain, BarChart2 } from 'lucide-react';

interface PreviewChamberProps {
  mode: 'normal' | 'skeleton' | 'neural';
  onModeChange: (mode: 'normal' | 'skeleton' | 'neural') => void;
}

export function PreviewChamber({ mode, onModeChange }: PreviewChamberProps) {
  const modes = [
    { id: 'normal', label: '标准视图', icon: Eye },
    { id: 'skeleton', label: '骨骼视图', icon: Skull },
    { id: 'neural', label: '神经网络', icon: Brain }
  ];

  const stats = [
    { label: '基因稳定性', value: 92, color: '#4ECDC4' },
    { label: '突变活性', value: 45, color: '#FF6B6B' },
    { label: '适应指数', value: 78, color: '#FFD93D' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-white">
          <BarChart2 className="w-5 h-5" />
          <h2 className="text-lg font-medium">预览分析</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onModeChange(id as any)}
            className={`p-3 rounded-xl flex flex-col items-center space-y-2 transition-all ${
              mode === id
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {stats.map(stat => (
          <div key={stat.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{stat.label}</span>
              <span style={{ color: stat.color }}>{stat.value}%</span>
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all"
                style={{
                  width: `${stat.value}%`,
                  backgroundColor: stat.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-white/5">
        <h3 className="text-white font-medium mb-3">实时分析</h3>
        <p className="text-sm text-gray-400">
          当前基因组合显示出较高的稳定性，建议可以尝试增加突变因子以提升特殊能力。
        </p>
      </div>
    </div>
  );
}
