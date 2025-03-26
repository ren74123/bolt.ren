import React from 'react';
import { Sparkles, AlertTriangle, Check } from 'lucide-react';

interface Mutation {
  id: string;
  name: string;
  description: string;
}

interface MutationInjectorProps {
  mutations: Mutation[];
  activeMutation: string | null;
  onSelect: (mutationId: string) => void;
}

export function MutationInjector({ mutations, activeMutation, onSelect }: MutationInjectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-white">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-lg font-medium">突变因子</h2>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500">
          实验性功能
        </span>
      </div>

      <div className="space-y-4">
        {mutations.map(mutation => (
          <button
            key={mutation.id}
            onClick={() => onSelect(mutation.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              activeMutation === mutation.id
                ? 'border-primary bg-primary/10'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">{mutation.name}</h3>
                <p className="text-gray-400 text-sm">{mutation.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                activeMutation === mutation.id
                  ? 'bg-primary'
                  : 'bg-gray-700'
              }`}>
                {activeMutation === mutation.id ? (
                  <Check className="w-4 h-4 text-white" />
                ) : null}
              </div>
            </div>

            {activeMutation === mutation.id && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <p className="text-sm text-yellow-500">
                  警告：该突变因子可能导致基因不稳定，建议在使用前进行全面评估。
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium">突变进度</span>
          <span className="text-primary">45%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: '45%' }}
          />
        </div>
      </div>
    </div>
  );
}
