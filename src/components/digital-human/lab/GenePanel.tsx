import React from 'react';
import { Dna } from 'lucide-react';

interface GeneData {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface GenePanelProps {
  genes: GeneData[];
  selectedGenes: {[key: string]: number};
  onChange: (geneId: string, value: number) => void;
}

export function GenePanel({ genes, selectedGenes, onChange }: GenePanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-white">
        <Dna className="w-5 h-5" />
        <h2 className="text-lg font-medium">基因特征</h2>
      </div>

      <div className="space-y-6">
        {genes.map(gene => (
          <div key={gene.id} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">{gene.name}</span>
              <span 
                className="text-sm px-2 py-1 rounded-full"
                style={{ backgroundColor: gene.color + '20', color: gene.color }}
              >
                {selectedGenes[gene.id] || 0}%
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={selectedGenes[gene.id] || 0}
                onChange={(e) => onChange(gene.id, parseInt(e.target.value))}
                className="w-full appearance-none h-2 rounded-full outline-none"
                style={{
                  background: `linear-gradient(to right, ${gene.color} ${selectedGenes[gene.id] || 0}%, rgba(255,255,255,0.1) ${selectedGenes[gene.id] || 0}%)`
                }}
              />
              <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-xs text-gray-400">
                <span>基础</span>
                <span>增强</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-white/5">
        <h3 className="text-white font-medium mb-2">基因组合分析</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">稳定性</span>
            <span className="text-green-400">92%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">突变概率</span>
            <span className="text-yellow-400">8%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
