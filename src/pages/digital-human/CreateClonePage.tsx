import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { StepProgress } from '../../components/digital-human/StepProgress';

const steps = [
  { id: 'template', label: '选择模板', description: '选择基础基因模板' },
  { id: 'params', label: '参数调节', description: '调整基因组合比例' },
  { id: 'behavior', label: '行为设置', description: '设置常用动作' },
  { id: 'confirm', label: '最终确认', description: '确认生成配置' }
];

const templates = [
  {
    id: 'explorer',
    name: '探索者模板',
    description: '充满好奇心和冒险精神，善于发现新事物',
    preview: 'https://source.unsplash.com/random/400x400?explorer',
    traits: [
      { name: '好奇心', value: 85 },
      { name: '适应力', value: 75 },
      { name: '创造力', value: 70 }
    ]
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
    ]
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
    ]
  }
];

const behaviors = [
  {
    id: 'greeting',
    name: '问候',
    preview: 'https://source.unsplash.com/random/200x200?greeting',
    description: '日常问候语和手势'
  },
  {
    id: 'work',
    name: '工作',
    preview: 'https://source.unsplash.com/random/200x200?work',
    description: '专业工作场景表现'
  },
  {
    id: 'social',
    name: '社交',
    preview: 'https://source.unsplash.com/random/200x200?social',
    description: '社交场合的行为举止'
  }
];

export function CreateClonePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'template' | 'params' | 'behavior' | 'confirm'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [parameters, setParameters] = useState({
    personality: 50,
    intelligence: 50,
    creativity: 50,
    sociability: 50
  });

  const handleNext = () => {
    switch (currentStep) {
      case 'template':
        setCurrentStep('params');
        break;
      case 'params':
        setCurrentStep('behavior');
        break;
      case 'behavior':
        setCurrentStep('confirm');
        break;
      case 'confirm':
        navigate('/digital-human');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/digital-human')} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">创建副本数字人</h1>
          <div className="w-10" />
        </div>
        <StepProgress
          steps={steps}
          currentStep={currentStep}
          onStepClick={(step) => {
            if (steps.findIndex(s => s.id === step) <= steps.findIndex(s => s.id === currentStep)) {
              setCurrentStep(step as any);
            }
          }}
        />
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {currentStep === 'template' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-6">选择基础模板</h2>
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`w-full bg-white rounded-xl overflow-hidden border-2 transition-all ${
                  selectedTemplate === template.id ? 'border-primary' : 'border-transparent'
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
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${trait.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 'params' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">调整参数</h2>
            
            <div className="aspect-square bg-black rounded-xl overflow-hidden mb-6">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls 
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 3}
                  maxPolarAngle={Math.PI / 2}
                />
              </Canvas>
            </div>

            {Object.entries(parameters).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{key}</span>
                  <span className="text-primary">{value}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setParameters(prev => ({
                    ...prev,
                    [key]: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        )}

        {currentStep === 'behavior' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">行为设置</h2>
            <div className="grid grid-cols-2 gap-4">
              {behaviors.map(behavior => (
                <button
                  key={behavior.id}
                  onClick={() => setSelectedBehaviors(prev => 
                    prev.includes(behavior.id)
                      ? prev.filter(id => id !== behavior.id)
                      : [...prev, behavior.id]
                  )}
                  className={`bg-white rounded-xl overflow-hidden border-2 transition-all ${
                    selectedBehaviors.includes(behavior.id) ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={behavior.preview}
                    alt={behavior.name}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium">{behavior.name}</h3>
                    <p className="text-sm text-gray-500">{behavior.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'confirm' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">最终确认</h2>
            
            <div className="aspect-square bg-black rounded-xl overflow-hidden mb-6">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls 
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 3}
                  maxPolarAngle={Math.PI / 2}
                />
              </Canvas>
            </div>

            <div className="bg-white rounded-xl p-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2">选择模板</h3>
                <p className="text-gray-600">
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">参数设置</h3>
                <div className="space-y-2">
                  {Object.entries(parameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{key}</span>
                      <span className="text-primary">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">已选行为</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBehaviors.map(id => (
                    <span
                      key={id}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {behaviors.find(b => b.id === id)?.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={currentStep === 'template' && !selectedTemplate}
            className={`w-full py-3 rounded-xl font-medium ${
              currentStep === 'template' && !selectedTemplate
                ? 'bg-gray-200 text-gray-500'
                : 'bg-primary text-white'
            }`}
          >
            {currentStep === 'confirm' ? '完成创建' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  );
}
