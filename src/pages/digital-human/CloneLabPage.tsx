import React, { useState, useRef } from 'react';
import { ArrowLeft, Dna, Sparkles, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DNAHelix } from '../../components/digital-human/lab/DNAHelix';
import { GenePanel } from '../../components/digital-human/lab/GenePanel';
import { MutationInjector } from '../../components/digital-human/lab/MutationInjector';
import { PreviewChamber } from '../../components/digital-human/lab/PreviewChamber';

interface GeneData {
  id: string;
  name: string;
  value: number;
  color: string;
}

export function CloneLabPage() {
  const navigate = useNavigate();
  const [selectedGenes, setSelectedGenes] = useState<{[key: string]: number}>({});
  const [activeMutation, setActiveMutation] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'normal' | 'skeleton' | 'neural'>('normal');
  
  const genes: GeneData[] = [
    { id: 'creativity', name: '创造力', value: 0, color: '#FF6B6B' },
    { id: 'logic', name: '逻辑思维', value: 0, color: '#4ECDC4' },
    { id: 'empathy', name: '共情能力', value: 0, color: '#45B7D1' },
    { id: 'resilience', name: '适应能力', value: 0, color: '#96CEB4' },
    { id: 'leadership', name: '领导力', value: 0, color: '#FFEEAD' }
  ];

  const mutations = [
    { id: 'quantum_mind', name: '量子思维', description: '提升多维度思考能力' },
    { id: 'time_sense', name: '时间感知', description: '增强时间管理效率' },
    { id: 'sync_learning', name: '同步学习', description: '加快知识吸收速度' }
  ];

  const handleGeneChange = (geneId: string, value: number) => {
    setSelectedGenes(prev => ({
      ...prev,
      [geneId]: value
    }));
  };

  const handleMutationSelect = (mutationId: string) => {
    setActiveMutation(mutationId);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm z-20">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 text-white hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-white">基因融合实验室</h1>
          <button className="p-2 text-white hover:bg-white/10 rounded-full">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 flex h-[calc(100vh-4rem)]">
        {/* Left Panel - DNA Visualization */}
        <div className="w-2/3 h-full relative">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <DNAHelix genes={genes} selectedGenes={selectedGenes} />
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>

        {/* Right Panel - Controls */}
        <div className="w-1/3 bg-gray-900 p-6 overflow-y-auto">
          <div className="space-y-6">
            <GenePanel 
              genes={genes}
              selectedGenes={selectedGenes}
              onChange={handleGeneChange}
            />
            
            <MutationInjector
              mutations={mutations}
              activeMutation={activeMutation}
              onSelect={handleMutationSelect}
            />

            <PreviewChamber
              mode={previewMode}
              onModeChange={setPreviewMode}
            />

            <button
              onClick={() => {
                // 处理基因融合完成
                navigate('/digital-human/create', {
                  state: { 
                    type: 'clone',
                    genes: selectedGenes,
                    mutation: activeMutation
                  }
                });
              }}
              className="w-full py-3 bg-primary text-white rounded-xl font-medium"
            >
              完成融合
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
