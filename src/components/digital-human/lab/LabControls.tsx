import React from 'react';
import { Dna, Zap, AlertTriangle, BarChart2 } from 'lucide-react';

interface LabControlsProps {
  onMutationAdd: () => void;
  onStabilityCheck: () => void;
  stability: number;
  mutationCount: number;
}

export function LabControls({
  onMutationAdd,
  onStabilityCheck,
  stability,
  mutationCount
}: LabControlsProps) {
  return (
    <div className="space-y-6 bg-gray-900 p-6 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-white">
          <Dna className="w-5 h-5" />
          <h2 className="font-medium">实验室控制台</h2>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          stability > 80 ? 'bg-green-500/20 text-green-500' :
          stability > 50 ? 'bg-yellow-500/20 text-yellow-500' :
          'bg-red-500/20 text-red-500'
        }`}>
          稳定性 {stability}%
        </span>
      </div>

      <div className="space-y-4">
        <button
          onClick={onMutationAdd}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">注入突变因子</h3>
              <p className="text-gray-400 text-sm">已注入 {mutationCount} 个</p>
            </div>
          </div>
        </button>

        <button
          onClick={onStabilityCheck}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">稳定性检查</h3>
              <p className="text-gray-400 text-sm">检测基因冲突</p>
            </div>
          </div>
        </button>

        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">性能分析</h3>
              <p className="text-gray-400 text-sm">查看详细报告</p>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-white/5">
        <h3 className="text-white font-medium mb-2">实验室状态</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">计算资源</span>
            <span className="text-green-400">正常</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">量子态</span>
            <span className="text-blue-400">稳定</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">突变活性</span>
            <span className="text-yellow-400">中等</span>
          </div>
        </div>
      </div>
    </div>
  );
}
