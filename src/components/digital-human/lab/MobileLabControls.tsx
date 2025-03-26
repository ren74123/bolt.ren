import React from 'react';
import { Dna, Zap, AlertTriangle, BarChart2 } from 'lucide-react';

interface MobileLabControlsProps {
  onMutationAdd: () => void;
  onStabilityCheck: () => void;
  stability: number;
  mutationCount: number;
}

export function MobileLabControls({
  onMutationAdd,
  onStabilityCheck,
  stability,
  mutationCount
}: MobileLabControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-medium">实验室控制台</h2>
        <span className={`px-2 py-1 rounded-full text-xs ${
          stability > 80 ? 'bg-green-500/20 text-green-500' :
          stability > 50 ? 'bg-yellow-500/20 text-yellow-500' :
          'bg-red-500/20 text-red-500'
        }`}>
          稳定性 {stability}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onMutationAdd}
          className="aspect-square bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center space-y-2"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <span className="text-white text-sm">注入突变因子</span>
          <span className="text-gray-400 text-xs">已注入 {mutationCount}</span>
        </button>

        <button
          onClick={onStabilityCheck}
          className="aspect-square bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center space-y-2"
        >
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
          <span className="text-white text-sm">稳定性检查</span>
          <span className="text-gray-400 text-xs">检测基因冲突</span>
        </button>

        <button className="aspect-square bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-white text-sm">性能分析</span>
          <span className="text-gray-400 text-xs">查看详细报告</span>
        </button>

        <button className="aspect-square bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Dna className="w-6 h-6 text-purple-500" />
          </div>
          <span className="text-white text-sm">基因编辑</span>
          <span className="text-gray-400 text-xs">调整基因序列</span>
        </button>
      </div>
    </div>
  );
}
