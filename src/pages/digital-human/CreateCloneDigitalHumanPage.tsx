import React, { useState } from 'react';
import { ArrowLeft, Beaker, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DNAHelix } from '../../components/digital-human/lab/DNAHelix';
import { GenePanel } from '../../components/digital-human/lab/GenePanel';
import { StepProgress } from '../../components/digital-human/StepProgress';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  traits: {
    name: string;
    value: number;
  }[];
  popularity: number;
}

const steps = [
  { id: 'template', label: '选择模板', description: '选择基础基因模板' },
  { id: 'mix', label: '基因融合', description: '调整基因组合比例' },
  { id: 'lab', label: '实验室', description: '深度基因编辑' },
  { id: 'preview', label: '预览', description: '确认最终效果' }
];

export function CreateCloneDigitalHumanPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [geneRatio, setGeneRatio] = useState(50);
  const [selectedGenes, setSelectedGenes] = useState<{[key: string]: number}>({});

  const templates: Template[] = [
    {
      id: 'explorer',
      name: '探索者模板',
      description: '充满好奇心和冒险精神，善于发现新事物',
      preview: 'https://source.unsplash.com/random/400x400?explorer',
      traits: [
        { name: '好奇心', value: 85 },
        { name: '适应力', value: 75 },
        { name: '创造力', value: 70 }
      ],
      popularity: 2345
    },
    {
      id: 'thinker',
      name: '思考者模板',
      description: '理性分析，深度思考，擅长解决复杂问题',
      preview: 'https://source.unsplash.com/random/400x400?thinker',
      traits: [
        { name: '逻辑思维', value: 90 },
        { name: '专注力', value: 80 },
        { name: '分析能力', value: 85 }
      ],
      popularity: 1987
    },
    {
      id: 'creator',
      name: '创造者模板',
      description: '富有想象力和创意，善于艺术表达',
      preview: 'https://source.unsplash.com/random/400x400?creator',
      traits: [
        { name: '创造力', value: 95 },
        { name: '艺术感', value: 85 },
        { name: '表现力', value: 80 }
      ],
      popularity: 2156
    }
  ];

  const genes = [
    { id: 'creativity', name: '创造力', value: 0, color: '#FF6B6B' },
    { id: 'logic', name: '逻辑思维', value: 0, color: '#4ECDC4' },
    { id: 'empathy', name: '共情能力', value: 0, color: '#45B7D1' },
    { id: 'resilience', name: '适应能力', value: 0, color: '#96CEB4' },
    { id: 'leadership', name: '领导力', value: 0, color: '#FFEEAD' }
  ];

  const handleGeneChange = (geneId: string, value: number) => {
    setSelectedGenes(prev => ({
      ...prev,
      [geneId]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate('/digital-human')}
            className="p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">副本创建</h1>
          <button className="p-2">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        <StepProgress
          steps={steps}
          currentStep={currentStep}
          onStepClick={(step) => {
            if (steps.findIndex(s => s.id === step) <= steps.findIndex(s => s.id === currentStep)) {
              setCurrentStep(step);
            }
          }}
        />
      </div>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* Template Library (Left 30%) */}
        <div className="w-[30%] border-r border-gray-200 overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-4">基因模板库</h2>
          <div className="space-y-4">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`w-full rounded-xl overflow-hidden border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                  <div className="space-y-2">
                    {template.traits.map(trait => (
                      <div key={trait.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{trait.name}</span>
                          <span className="text-primary">{trait.value}%</span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${trait.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    {template.popularity.toLocaleString()} 次使用
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Core Operation Area (Middle 50%) */}
        <div className="w-[50%] p-6 flex flex-col">
          <div className="flex-1">
            <div className="aspect-square bg-black rounded-xl mb-6 overflow-hidden">
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
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  基因融合比例
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={geneRatio}
                  onChange={(e) => setGeneRatio(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>模板基因</span>
                  <span>自定义基因</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/digital-human/clone-lab')}
                className="w-full py-3 bg-primary/10 text-primary rounded-xl font-medium flex items-center justify-center space-x-2"
              >
                <Beaker className="w-5 h-5" />
                <span>深度基因编辑</span>
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Control Panel (Right 20%) */}
        <div className="w-[20%] border-l border-gray-200 p-4">
          <GenePanel 
            genes={genes}
            selectedGenes={selectedGenes}
            onChange={handleGeneChange}
          />

          <button
            onClick={() => {
              if (selectedTemplate) {
                navigate('/digital-human/create', {
                  state: {
                    type: 'clone',
                    templateId: selectedTemplate,
                    geneRatio,
                    selectedGenes
                  }
                });
              }
            }}
            disabled={!selectedTemplate}
            className={`w-full py-3 rounded-xl font-medium mt-6 ${
              selectedTemplate
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            开始创建
          </button>
        </div>
      </div>
    </div>
  );
}
