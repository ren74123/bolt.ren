import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface Conflict {
  id: string;
  type: 'minor' | 'major';
  description: string;
  suggestion: string;
}

interface ConflictResolverProps {
  conflicts: Conflict[];
  onResolve: (conflictId: string, accept: boolean) => void;
}

export function ConflictResolver({ conflicts, onResolve }: ConflictResolverProps) {
  if (conflicts.length === 0) {
    return (
      <div className="p-4 bg-green-50 rounded-xl">
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">无基因冲突</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-yellow-600">
        <AlertTriangle className="w-5 h-5" />
        <h3 className="font-medium">检测到基因冲突</h3>
      </div>

      <div className="space-y-3">
        {conflicts.map((conflict) => (
          <div
            key={conflict.id}
            className={`p-4 rounded-xl ${
              conflict.type === 'major'
                ? 'bg-red-50'
                : 'bg-yellow-50'
            }`}
          >
            <p className="text-sm mb-2">{conflict.description}</p>
            <p className="text-sm text-gray-600 mb-3">{conflict.suggestion}</p>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onResolve(conflict.id, true)}
                className="flex-1 py-2 bg-white rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                接受建议
              </button>
              <button
                onClick={() => onResolve(conflict.id, false)}
                className="flex items-center justify-center w-10 bg-white rounded-lg hover:bg-gray-50"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
